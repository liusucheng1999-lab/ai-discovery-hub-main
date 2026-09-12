import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';
import { authenticatedUser, clients } from '../_lib/aimaker-upload.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = await authenticatedUser(req.headers.authorization);
    const archivePath = `${user.id}/_uploads/${randomUUID()}.zip`;
    const { admin } = clients();
    const { data, error } = await admin.storage
      .from('hosted-apps')
      .createSignedUploadUrl(archivePath);
    if (error || !data) throw new Error(error?.message || '无法创建上传地址');

    return res.status(201).json({
      archive_path: archivePath,
      upload_url: data.signedUrl,
    });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : '无法创建上传地址' });
  }
}
