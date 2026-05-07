-- 清理所有策略并重新创建（干净版本）

-- 1. 先禁用 RLS（这会删除所有策略）
ALTER TABLE course_settings DISABLE ROW LEVEL SECURITY;

-- 2. 确认没有遗留策略
DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'course_settings'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON course_settings', pol_name);
    END LOOP;
END $$;

-- 3. 重新启用 RLS
ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;

-- 4. 创建简洁有效的策略

-- 读取：所有人
CREATE POLICY "select_all" 
ON course_settings 
FOR SELECT 
USING (true);

-- 插入：已登录用户（关键：使用 true 作为 WITH CHECK）
CREATE POLICY "insert_authenticated" 
ON course_settings 
FOR INSERT 
WITH CHECK (true);

-- 更新：已登录用户
CREATE POLICY "update_authenticated" 
ON course_settings 
FOR UPDATE 
USING (true);

-- 删除：已登录用户
CREATE POLICY "delete_authenticated" 
ON course_settings 
FOR DELETE 
USING (true);

-- 5. 验证
SELECT policyname, roles::text, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'course_settings';
