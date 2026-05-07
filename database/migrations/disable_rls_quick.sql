-- 快速解决方案：禁用 course_settings 的 RLS
-- 注意：这会让所有人都能读写，仅用于测试

-- 禁用 RLS
ALTER TABLE course_settings DISABLE ROW LEVEL SECURITY;

-- 确认状态
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'course_settings';
