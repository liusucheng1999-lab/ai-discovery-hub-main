// 简单的删除API - 使用服务端权限
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = '';
    
    // 收集请求体
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { toolId } = JSON.parse(body);

        if (!toolId) {
          return res.status(400).json({ error: 'Tool ID is required' });
        }

        console.log(`删除请求: 工具ID ${toolId}`);

        // 直接删除，无需权限验证（使用服务密钥）
        const { error, data } = await supabase
          .from('tools')
          .delete()
          .eq('id', toolId)
          .select();

        if (error) {
          console.error('删除失败:', error);
          return res.status(500).json({ error: error.message });
        }

        console.log('删除成功:', data);

        res.status(200).json({
          success: true,
          message: 'Tool deleted successfully',
          deletedTool: data
        });

      } catch (parseError) {
        console.error('JSON解析错误:', parseError);
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });

  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
