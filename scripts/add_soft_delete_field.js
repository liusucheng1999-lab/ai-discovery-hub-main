// 执行软删除字段添加
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function addSoftDeleteField() {
  console.log('添加软删除字段...');
  
  try {
    // 使用RPC执行SQL（如果支持）或者直接使用SQL
    // 由于Supabase客户端可能不支持直接ALTER TABLE，
    // 我们需要在Supabase Dashboard中手动执行SQL
    
    console.log('请在Supabase Dashboard的SQL编辑器中执行以下SQL:');
    console.log(`
-- 添加软删除字段
ALTER TABLE tools ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tools_is_deleted ON tools(is_deleted);

-- 验证字段
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tools' AND column_name = 'is_deleted';
    `);
    
    console.log('✅ 软删除字段添加脚本准备完成');
    
  } catch (error) {
    console.error('❌ 添加字段失败:', error);
  }
}

addSoftDeleteField().catch(console.error);
