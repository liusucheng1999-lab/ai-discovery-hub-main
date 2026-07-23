import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import JSZip from 'jszip';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const MAX_ARCHIVE_BYTES = 18 * 1024 * 1024;
const MAX_EXPANDED_BYTES = 40 * 1024 * 1024;
const MAX_FILES = 300;

export function clients() {
  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    throw new Error('AI 创客上传服务尚未配置完整');
  }
  return {
    admin: createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } }),
    auth: createClient(supabaseUrl, anonKey, { auth: { persistSession: false } }),
  };
}

export async function authenticatedUser(authorization?: string) {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new Error('请先连接 AI 创客账号');
  const { auth, admin } = clients();

  if (token.startsWith('amk_')) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const { data: connectorToken, error: connectorError } = await admin
      .from('ai_connector_tokens')
      .select('id, user_id, expires_at, revoked_at')
      .eq('token_hash', tokenHash)
      .maybeSingle();
    if (
      connectorError ||
      !connectorToken ||
      connectorToken.revoked_at ||
      (connectorToken.expires_at && new Date(connectorToken.expires_at) <= new Date())
    ) {
      throw new Error('AI 创客连接已失效，请重新连接账号');
    }
    const { data: userData, error: userError } = await admin.auth.admin.getUserById(connectorToken.user_id);
    if (userError || !userData.user) throw new Error('AI 创客用户不存在');
    await admin
      .from('ai_connector_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', connectorToken.id);
    return userData.user;
  }

  const { data, error } = await auth.auth.getUser(token);
  if (error || !data.user) throw new Error('AI 创客登录已失效，请重新连接账号');
  return data.user;
}

function safePath(path: string) {
  const normalized = path.replaceAll('\\', '/').replace(/^\/+/, '');
  if (!normalized || normalized.includes('../') || normalized.startsWith('.git/')) {
    throw new Error(`发布包包含不安全路径：${path}`);
  }
  return normalized;
}

export async function extractArchive(archiveBase64: string) {
  const archive = Buffer.from(archiveBase64, 'base64');
  if (!archive.length || archive.length > MAX_ARCHIVE_BYTES) {
    throw new Error('发布包为空或超过 18 MB 限制');
  }

  const zip = await JSZip.loadAsync(archive);
  const entries = Object.values(zip.files).filter((entry) => !entry.dir);
  if (entries.length === 0 || entries.length > MAX_FILES) {
    throw new Error(`发布包文件数量必须在 1–${MAX_FILES} 之间`);
  }

  const files: Array<{ path: string; content: Buffer; contentType: string }> = [];
  let expandedBytes = 0;
  for (const entry of entries) {
    const path = safePath(entry.name);
    const content = await entry.async('nodebuffer');
    expandedBytes += content.length;
    if (expandedBytes > MAX_EXPANDED_BYTES) throw new Error('发布包解压后超过 40 MB 限制');
    files.push({ path, content, contentType: contentType(path) });
  }

  if (!files.some((file) => file.path === 'index.html')) {
    throw new Error('发布包根目录缺少 index.html');
  }
  return files;
}

function contentType(path: string) {
  const ext = path.split('.').pop()?.toLowerCase();
  return ({
    html: 'text/html; charset=utf-8',
    css: 'text/css; charset=utf-8',
    js: 'text/javascript; charset=utf-8',
    mjs: 'text/javascript; charset=utf-8',
    json: 'application/json; charset=utf-8',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    txt: 'text/plain; charset=utf-8',
  } as Record<string, string>)[ext || ''] || 'application/octet-stream';
}

export async function uploadFiles(userId: string, appId: string, files: Awaited<ReturnType<typeof extractArchive>>) {
  const { admin } = clients();
  const uploaded: string[] = [];
  for (const file of files) {
    const storagePath = `${userId}/${appId}/${file.path}`;
    const { error } = await admin.storage.from('hosted-apps').upload(storagePath, file.content, {
      upsert: true,
      contentType: file.contentType,
      cacheControl: '0',
    });
    if (error) throw new Error(`上传 ${file.path} 失败：${error.message}`);
    uploaded.push(storagePath);
  }
  return uploaded;
}

export function appUrl(appId: string) {
  return `https://aimakerbox.com/run/${appId}`;
}
