/**
 * 微信分享卡片专用接口
 * 路由：/share/:id  →  此 Serverless Function
 *
 * 工作原理：
 * - 微信爬虫访问 /share/:id 时，返回含 Open Graph meta 标签的 HTML，爬虫读取后生成富卡片
 * - 真实用户访问时，页面通过 <meta refresh> + JS 立即跳转到 /run/:id
 *
 * 微信分享卡片要求：
 * - og:title    ← 卡片标题
 * - og:description ← 卡片摘要
 * - og:image    ← 缩略图（最小 300×300px，建议 16:9，必须 HTTPS）
 * - og:url      ← 点击卡片后跳转地址
 */

import { createClient } from '@supabase/supabase-js';

// 使用匿名密钥查询已发布应用（公开数据）
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.redirect(302, '/published-apps');
  }

  try {
    const { data: app, error } = await supabase
      .from('hosted_apps')
      .select('id, name, description, cover_image_url, is_published')
      .eq('id', id)
      .single();

    if (error || !app || !app.is_published) {
      return res.redirect(302, '/published-apps');
    }

    // 推断站点域名：优先用环境变量，其次从请求头读取
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host =
      req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const siteUrl = process.env.VITE_SITE_URL || `${proto}://${host}`;

    const appUrl = `${siteUrl}/run/${app.id}`;
    // 封面图必须 HTTPS，无封面时用站点默认 OG 图（可在 public/ 目录放一张 og-default.png）
    const ogImage = app.cover_image_url || `${siteUrl}/og-default.png`;

    const title = escapeHtml(app.name);
    const description = escapeHtml(
      app.description || '在 AI 创作社区发现更多精彩应用'
    );
    const siteName = 'AI 创作社区';

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>${title} - ${siteName}</title>
  <meta name="description" content="${description}">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- ===== Open Graph（微信、QQ、钉钉等均使用此标准）===== -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:url" content="${appUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImage}">

  <!-- ===== Twitter Card（可选，供其他平台使用）===== -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- ===== 真实用户自动跳转 ===== -->
  <meta http-equiv="refresh" content="0;url=${appUrl}">
  <script>window.location.replace("${appUrl}");</script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:40px;color:#333">
  <h2>${title}</h2>
  <p>${description}</p>
  <p>正在跳转...如未自动跳转，<a href="${appUrl}" style="color:#6366f1">点击这里打开应用</a></p>
</body>
</html>`;

    // 缓存 1 小时，减少重复查询
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[share] handler error:', err);
    return res.redirect(302, '/published-apps');
  }
}
