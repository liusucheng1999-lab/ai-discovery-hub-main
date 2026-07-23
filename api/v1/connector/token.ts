import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomBytes } from 'node:crypto';
import { clients } from '../../_lib/aimaker-upload.js';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const deviceCode = String(req.body?.device_code || '');
    if (!deviceCode) return res.status(400).json({ error: '缺少设备码' });
    const { admin } = clients();
    const { data: request, error } = await admin
      .from('ai_connector_device_codes')
      .select('id, user_id, status, expires_at')
      .eq('device_code_hash', hash(deviceCode))
      .maybeSingle();
    if (error || !request || new Date(request.expires_at) <= new Date()) {
      return res.status(400).json({ error: '连接请求已过期' });
    }
    if (request.status === 'pending') return res.status(202).json({ status: 'authorization_pending' });
    if (request.status !== 'approved' || !request.user_id) {
      return res.status(400).json({ error: '连接请求已使用' });
    }

    const rawToken = `amk_${randomBytes(32).toString('base64url')}`;
    const { error: tokenError } = await admin.from('ai_connector_tokens').insert({
      user_id: request.user_id,
      token_hash: hash(rawToken),
      name: 'Codex',
    });
    if (tokenError) throw tokenError;
    await admin
      .from('ai_connector_device_codes')
      .update({ status: 'consumed', consumed_at: new Date().toISOString() })
      .eq('id', request.id)
      .eq('status', 'approved');
    return res.json({ access_token: rawToken, token_type: 'Bearer' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : '连接失败' });
  }
}
