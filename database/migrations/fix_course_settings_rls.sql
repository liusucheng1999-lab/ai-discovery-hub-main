-- 修复 course_settings 表的 RLS 权限问题
-- 允许已登录用户更新课程信息

-- 启用 RLS
ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;

-- 删除已存在的策略（避免冲突）
DROP POLICY IF EXISTS "Allow authenticated users to update course_settings" ON course_settings;
DROP POLICY IF EXISTS "Allow all users to read course_settings" ON course_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert course_settings" ON course_settings;

-- 创建读取策略（所有人可读）
CREATE POLICY "Allow all users to read course_settings"
  ON course_settings
  FOR SELECT
  USING (true);

-- 创建更新策略（登录用户可更新）
CREATE POLICY "Allow authenticated users to update course_settings"
  ON course_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 创建插入策略（登录用户可插入）
CREATE POLICY "Allow authenticated users to insert course_settings"
  ON course_settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 创建删除策略（登录用户可删除）
CREATE POLICY "Allow authenticated users to delete course_settings"
  ON course_settings
  FOR DELETE
  USING (auth.role() = 'authenticated');
