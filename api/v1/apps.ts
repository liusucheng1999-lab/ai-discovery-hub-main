import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  appUrl,
  authenticatedUser,
  clients,
  extractArchive,
  uploadFiles,
} from '../_lib/aimaker-upload.js';

export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = await authenticatedUser(req.headers.authorization);
    const { name, description = '', is_private = true, archive_base64 } = req.body || {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: '缺少应用名称' });
    }
    if (typeof archive_base64 !== 'string') {
      return res.status(400).json({ error: '缺少发布包' });
    }

    const files = await extractArchive(archive_base64);
    const { admin } = clients();
    const { data: app, error: createError } = await admin
      .from('hosted_apps')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: String(description).trim(),
        app_file_path: '',
        is_published: false,
        status: is_private ? 'approved' : 'pending',
        is_private: Boolean(is_private),
        github_url: null,
      })
      .select()
      .single();
    if (createError || !app) throw new Error(createError?.message || '创建应用失败');

    try {
      await uploadFiles(user.id, app.id, files);
      const entryPath = `${user.id}/${app.id}/index.html`;
      const { error: updateError } = await admin
        .from('hosted_apps')
        .update({ app_file_path: entryPath, updated_at: new Date().toISOString() })
        .eq('id', app.id);
      if (updateError) throw new Error(updateError.message);
    } catch (error) {
      await admin.from('hosted_apps').delete().eq('id', app.id);
      throw error;
    }

    return res.status(201).json({
      success: true,
      app_id: app.id,
      name: app.name,
      app_url: appUrl(app.id),
      is_private: Boolean(is_private),
    });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : '发布失败' });
  }
}
