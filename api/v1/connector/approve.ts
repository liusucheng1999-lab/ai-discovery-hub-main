import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticatedUser, clients } from '../../_lib/aimaker-upload.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await authenticatedUser(req.headers.authorization);
    const userCode = String(req.body?.user_code || '').trim().toUpperCase();
    if (!userCode) return res.status(400).json({ error: '缺少连接码' });
    const { admin } = clients();
    const { data, error } = await admin
      .from('ai_connector_device_codes')
      .update({
        user_id: user.id,
        status: 'approved',
        approved_at: new Date().toISOString(),
      })
      .eq('user_code', userCode)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .select('id')
      .maybeSingle();
    if (error || !data) return res.status(400).json({ error: '连接码无效或已过期' });
    return res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : '授权失败' });
  }
}
