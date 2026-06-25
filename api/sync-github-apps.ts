/**
 * Vercel Serverless Function / Cron Job
 * 路径：/api/sync-github-apps
 *
 * 作用：定时从 GitHub 拉取最新 HTML 文件，更新到 Supabase Storage。
 *   - 运行在 Vercel 服务器（国外），不受国内对 GitHub 的封锁影响。
 *   - 用户端仍从 Supabase Storage 加载应用，访问不受影响。
 *
 * 触发方式：
 *   1. Vercel Cron（见 vercel.json）—— 定时自动触发
 *   2. 手动 POST /api/sync-github-apps?secret=<CRON_SECRET>（调试用）
 *
 * 所需环境变量（在 Vercel Dashboard → Settings → Environment Variables 中设置）：
 *   VITE_SUPABASE_URL          Supabase 项目 URL（已有）
 *   SUPABASE_SERVICE_ROLE_KEY  Supabase 服务端密钥（需新增，在 Supabase → Settings → API 中查看）
 *   CRON_SECRET                自定义随机字符串，用于保护此端点（如 openssl rand -hex 32 生成）
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase 客户端（使用服务端密钥，可绕过 RLS 访问所有记录）────────────────
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ─── GitHub URL 解析（与前端保持一致）──────────────────────────────────────────
function parseGithubToRawUrl(url: string): string | null {
  try {
    const u = url.trim();
    if (u.startsWith('https://raw.githubusercontent.com/')) return u;
    const blobMatch = u.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)/);
    if (blobMatch) {
      return `https://raw.githubusercontent.com/${blobMatch[1]}/${blobMatch[2]}`;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── 同步单个应用 ───────────────────────────────────────────────────────────────
async function syncApp(
  supabase: ReturnType<typeof createClient>,
  app: { id: string; github_url: string; app_file_path: string }
): Promise<{ id: string; status: 'synced' | 'skipped' | 'error'; reason?: string }> {
  const rawUrl = parseGithubToRawUrl(app.github_url);
  if (!rawUrl) {
    return { id: app.id, status: 'skipped', reason: 'invalid github_url' };
  }

  // 从 GitHub 拉取文件内容（Vercel 运行在境外，可正常访问）
  let content: ArrayBuffer;
  try {
    const response = await fetch(rawUrl, {
      headers: { 'User-Agent': 'aimakerbox-sync/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000), // 15 秒超时
    });
    if (!response.ok) {
      return {
        id: app.id,
        status: 'error',
        reason: `GitHub returned ${response.status} for ${rawUrl}`,
      };
    }
    content = await response.arrayBuffer();
  } catch (err) {
    return { id: app.id, status: 'error', reason: String(err) };
  }

  // 上传到 Supabase Storage（覆盖原文件）
  const { error: uploadError } = await supabase.storage
    .from('hosted-apps')
    .upload(app.app_file_path, content, {
      upsert: true,
      contentType: 'text/html; charset=utf-8',
      cacheControl: '0',
    });

  if (uploadError) {
    return { id: app.id, status: 'error', reason: uploadError.message };
  }

  // 更新同步时间
  const now = new Date().toISOString();
  await supabase
    .from('hosted_apps')
    .update({ updated_at: now, github_synced_at: now })
    .eq('id', app.id);

  return { id: app.id, status: 'synced' };
}

// ─── 主处理函数 ─────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ① 鉴权：Vercel Cron 会自动带上 Authorization: Bearer <CRON_SECRET>
  //         手动调用时在 query string 带 secret=<CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers['authorization'];
    const querySecret = req.query['secret'];
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret;

    if (!isAuthorized) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // ② 验证环境变量
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({
      error: 'Server misconfiguration: missing Supabase credentials',
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // ③ 查询所有配置了 github_url 的应用
  const { data: apps, error: queryError } = await supabase
    .from('hosted_apps')
    .select('id, github_url, app_file_path')
    .not('github_url', 'is', null);

  if (queryError) {
    console.error('Query error:', queryError);
    return res.status(500).json({ error: queryError.message });
  }

  if (!apps || apps.length === 0) {
    return res.json({ message: 'No apps with github_url found', synced: 0, failed: 0, total: 0 });
  }

  // ④ 逐个同步（串行避免 GitHub rate limit）
  const results = [];
  for (const app of apps) {
    if (!app.github_url) continue;
    const result = await syncApp(supabase, app as { id: string; github_url: string; app_file_path: string });
    results.push(result);
    console.log(`[sync] app ${result.id}: ${result.status}${result.reason ? ` — ${result.reason}` : ''}`);
  }

  const synced = results.filter((r) => r.status === 'synced').length;
  const failed = results.filter((r) => r.status === 'error').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  return res.json({
    total: apps.length,
    synced,
    failed,
    skipped,
    results,
    timestamp: new Date().toISOString(),
  });
}
