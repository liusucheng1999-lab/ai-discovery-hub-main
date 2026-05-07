-- 启用安全的 RLS 配置
-- 需要配合前端使用 supabaseWithAuth 客户端

-- 先禁用 RLS 清除所有策略
ALTER TABLE course_settings DISABLE ROW LEVEL SECURITY;

-- 重新启用 RLS
ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取
CREATE POLICY "course_select" 
ON course_settings 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 创建策略：允许已认证用户插入
CREATE POLICY "course_insert_auth" 
ON course_settings 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 创建策略：允许已认证用户更新
CREATE POLICY "course_update_auth" 
ON course_settings 
FOR UPDATE 
TO authenticated 
USING (true);

-- 创建策略：允许已认证用户删除
CREATE POLICY "course_delete_auth" 
ON course_settings 
FOR DELETE 
TO authenticated 
USING (true);

-- 验证
SELECT policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'course_settings';
