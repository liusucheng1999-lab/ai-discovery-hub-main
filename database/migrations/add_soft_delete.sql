-- 添加软删除字段
-- 在Supabase SQL编辑器中执行

-- 1. 添加is_deleted字段
ALTER TABLE tools ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- 2. 为is_deleted字段创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_tools_is_deleted ON tools(is_deleted);

-- 3. 更新现有查询，只显示未删除的工具
-- 修改前端查询条件：
-- .in('status', ['approved', 'active'])
-- 改为：
-- .in('status', ['approved', 'active']).eq('is_deleted', false)

-- 4. 验证字段添加成功
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tools' AND column_name = 'is_deleted';
