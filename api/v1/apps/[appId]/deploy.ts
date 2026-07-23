import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  appUrl,
  authenticatedUser,
  clients,
  extractArchive,
  uploadFiles,
} from '../../../_lib/aimaker-upload.js';

export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = await authenticatedUser(req.headers.authorization);
    const appId = String(req.query.appId || '');
    const archiveBase64 = req.body?.archive_base64;
    if (!appId || typeof archiveBase64 !== 'string') {
      return res.status(400).json({ error: '缺少应用 ID 或发布包' });
    }

    const { admin } = clients();
    const { data: app, error: appError } = await admin
      .from('hosted_apps')
      .select('id, user_id, name, is_private')
      .eq('id', appId)
      .eq('user_id', user.id)
      .single();
    if (appError || !app) return res.status(404).json({ error: '没有找到属于当前用户的应用' });

    const files = await extractArchive(archiveBase64);
    await uploadFiles(user.id, app.id, files);
    const { error: updateError } = await admin
      .from('hosted_apps')
      .update({
        app_file_path: `${user.id}/${app.id}/index.html`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', app.id)
      .eq('user_id', user.id);
    if (updateError) throw new Error(updateError.message);

    return res.json({
      success: true,
      app_id: app.id,
      name: app.name,
      app_url: appUrl(app.id),
      is_private: app.is_private,
    });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : '更新失败' });
  }
}
