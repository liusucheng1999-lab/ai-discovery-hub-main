-- 诊断 RLS 问题

-- 1. 查看当前策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'course_settings';

-- 2. 查看 RLS 是否启用
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'course_settings';

-- 3. 删除所有策略重新创建（如果上面的有问题）
-- 先禁用再启用会自动清除策略
-- ALTER TABLE course_settings DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;
