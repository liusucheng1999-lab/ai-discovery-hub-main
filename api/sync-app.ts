/**
 * Vercel Serverless Function
 * POST /api/sync-app?app_id=<UUID>
 *
 * 触发单个应用从 GitHub 同步最新内容到 Supabase Storage。
 * 由用户仓库里的 GitHub Actions workflow 在每次 push 时调用。
 *
 * 为什么不需要鉴权 secret：
 *   - 只能同步应用自身已存储的 github_url（攻击者无法修改同步源）
 *   - 内容来自公开 GitHub 仓库，本身不敏感
 *   - 最坏情况：有人恶意触发，只是重复拉取同一份公开文件，无实质危害
 *
 * 所需环境变量（Vercel Dashboard → Settings → Environment Variables）：
 *   VITE_SUPABASE_URL         已有
 *   SUPABASE_SERVICE_ROLE_KEY 需新增（Supabase → Settings → API → service_role）
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function parseGithubToRawUrl(url: string): string | null {
  try {
    const u = url.trim();
    if (u.startsWith('https://raw.githubusercontent.com/')) return u;
    const m = u.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)/);
    if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}`;
    return null;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只接受 POST（防止搜索引擎爬虫误触发）
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const appId = req.query['app_id'] as string | undefined;
  if (!appId) {
    return res.status(400).json({ error: 'Missing app_id parameter' });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server misconfiguration: missing Supabase credentials' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // 查询应用
  const { data: app, error: queryError } = await supabase
    .from('hosted_apps')
    .select('id, github_url, app_file_path')
    .eq('id', appId)
    .single();

  if (queryError || !app) {
    return res.status(404).json({ error: 'App not found' });
  }

  if (!app.github_url) {
    return res.status(400).json({ error: 'This app has no github_url configured' });
  }

  const rawUrl = parseGithubToRawUrl(app.github_url);
  if (!rawUrl) {
    return res.status(400).json({ error: 'Invalid github_url format' });
  }

  // 从 GitHub 拉取内容（Vercel 在境外，国内用户不受影响）
  let content: ArrayBuffer;
  try {
    const response = await fetch(rawUrl, {
      headers: { 'User-Agent': 'aimakerbox-sync/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      return res.status(502).json({
        error: `GitHub returned ${response.status}`,
        url: rawUrl,
      });
    }
    content = await response.arrayBuffer();
  } catch (err) {
    return res.status(502).json({ error: `Failed to fetch from GitHub: ${String(err)}` });
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
    return res.status(500).json({ error: uploadError.message });
  }

  // 更新同步时间戳
  const now = new Date().toISOString();
  await supabase
    .from('hosted_apps')
    .update({ updated_at: now, github_synced_at: now })
    .eq('id', app.id);

  return res.json({
    success: true,
    app_id: app.id,
    synced_at: now,
    source: rawUrl,
  });
}
