import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const STATIC_PAGES = [
  { loc: 'https://aimakerbox.com/', changefreq: 'daily', priority: '1.0' },
  { loc: 'https://aimakerbox.com/tools', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://aimakerbox.com/knowledge', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://aimakerbox.com/resources', changefreq: 'weekly', priority: '0.7' },
  { loc: 'https://aimakerbox.com/publish', changefreq: 'monthly', priority: '0.6' },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: apps } = await supabase
    .from('hosted_apps')
    .select('id, name, updated_at')
    .eq('status', 'approved')
    .eq('is_private', false)
    .order('updated_at', { ascending: false });

  const staticUrls = STATIC_PAGES.map(p => `
  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const appUrls = (apps || []).map(app => `
  <url>
    <loc>https://aimakerbox.com/run/${app.id}</loc>
    <lastmod>${new Date(app.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${appUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}
