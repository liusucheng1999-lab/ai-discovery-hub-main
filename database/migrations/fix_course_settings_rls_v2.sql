-- 修复 course_settings 表的 RLS 权限问题（完整版）
-- 使用 USING (true) 允许所有操作，或更严格的 auth.uid() IS NOT NULL

-- 先禁用 RLS，确保能操作
ALTER TABLE course_settings DISABLE ROW LEVEL SECURITY;

-- 删除所有已存在的策略
DROP POLICY IF EXISTS "course_settings_select" ON course_settings;
DROP POLICY IF EXISTS "course_settings_insert" ON course_settings;
DROP POLICY IF EXISTS "course_settings_update" ON course_settings;
DROP POLICY IF EXISTS "course_settings_delete" ON course_settings;
DROP POLICY IF EXISTS "Allow all users to read course_settings" ON course_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update course_settings" ON course_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert course_settings" ON course_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete course_settings" ON course_settings;

-- 重新启用 RLS
ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;

-- 策略1：所有人可以读取
CREATE POLICY "course_settings_select"
  ON course_settings
  FOR SELECT
  USING (true);

-- 策略2：已登录用户可以插入（修复 new row violates 错误）
-- 使用两种写法，兼容不同版本的 Supabase
CREATE POLICY "course_settings_insert"
  ON course_settings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 策略3：已登录用户可以更新
CREATE POLICY "course_settings_update"
  ON course_settings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- 策略4：已登录用户可以删除
CREATE POLICY "course_settings_delete"
  ON course_settings
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 验证策略是否创建成功
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'course_settings';
