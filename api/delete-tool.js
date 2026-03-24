// 删除API端点 - 用于处理前端删除请求
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { toolId, username } = req.body;

    // 验证必需参数
    if (!toolId) {
      return res.status(400).json({ error: 'Tool ID is required' });
    }

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    console.log(`删除请求: 用户 ${username} 要删除工具 ${toolId}`);

    // 验证用户权限
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_secure')
      .select('*')
      .eq('username', username)
      .eq('is_admin', true)
      .single();

    if (adminError || !adminUser) {
      console.log('用户权限验证失败:', adminError);
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    console.log('用户权限验证成功');

    // 检查工具是否存在
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .select('*')
      .eq('id', toolId)
      .single();

    if (toolError) {
      if (toolError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Tool not found' });
      }
      throw toolError;
    }

    console.log(`找到工具: ${tool.name}`);

    // 删除工具
    const { error: deleteError, data: deleteData } = await supabase
      .from('tools')
      .delete()
      .eq('id', toolId)
      .select();

    if (deleteError) {
      console.error('删除失败:', deleteError);
      throw deleteError;
    }

    console.log('删除成功:', deleteData);

    // 返回成功响应
    res.status(200).json({
      success: true,
      message: 'Tool deleted successfully',
      deletedTool: deleteData
    });

  } catch (error) {
    console.error('删除API错误:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
