-- 安全的 course_settings RLS 配置
-- 允许匿名用户读取，仅认证用户可写

-- 先禁用
ALTER TABLE course_settings DISABLE ROW LEVEL SECURITY;

-- 删除旧策略
DROP POLICY IF EXISTS "course_select_anon" ON course_settings;
DROP POLICY IF EXISTS "course_insert_auth" ON course_settings;
DROP POLICY IF EXISTS "course_update_auth" ON course_settings;
DROP POLICY IF EXISTS "course_delete_auth" ON course_settings;

-- 重新启用
ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;

-- 策略1: 允许匿名用户和认证用户读取 (FOR SELECT)
CREATE POLICY "course_select_anon" 
ON course_settings 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 策略2: 允许认证用户插入 (FOR INSERT) - 关键修复
-- 使用 (true) 配合 TO authenticated，只对已登录用户生效
CREATE POLICY "course_insert_auth" 
ON course_settings 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 策略3: 允许认证用户更新 (FOR UPDATE)
CREATE POLICY "course_update_auth" 
ON course_settings 
FOR UPDATE 
TO authenticated 
USING (true);

-- 策略4: 允许认证用户删除 (FOR DELETE)
CREATE POLICY "course_delete_auth" 
ON course_settings 
FOR DELETE 
TO authenticated 
USING (true);

-- 验证
SELECT policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'course_settings';
