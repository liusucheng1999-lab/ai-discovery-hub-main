import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomBytes } from 'node:crypto';
import { clients } from '../../_lib/aimaker-upload.js';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const deviceCode = randomBytes(32).toString('base64url');
    const userCode = randomBytes(4).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const { admin } = clients();
    const { error } = await admin.from('ai_connector_device_codes').insert({
      device_code_hash: hash(deviceCode),
      user_code: userCode,
      expires_at: expiresAt.toISOString(),
    });
    if (error) throw error;
    return res.status(201).json({
      connector_version: 1,
      device_code: deviceCode,
      user_code: userCode,
      verification_url: `https://aimakerbox.com/connector/authorize?code=${encodeURIComponent(userCode)}`,
      expires_in: 600,
      interval: 2,
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : '无法创建连接请求' });
  }
}
