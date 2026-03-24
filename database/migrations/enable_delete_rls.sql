-- 创建RLS策略允许已登录管理员删除工具
-- 这个脚本需要在Supabase SQL编辑器中执行

-- 1. 确保RLS已启用
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 2. 删除现有的删除策略（如果存在）
DROP POLICY IF EXISTS "Users can delete tools" ON tools;

-- 3. 创建新的删除策略 - 允许已登录用户删除
CREATE POLICY "Users can delete tools" ON tools
FOR DELETE
USING (
  auth.role() = 'authenticated'
);

-- 4. 创建更严格的策略 - 只允许特定的管理员删除
-- 首先创建一个函数来检查管理员权限
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- 检查当前用户是否在admin_secure表中
  SELECT COUNT(*) INTO admin_count
  FROM admin_secure
  WHERE username = auth.jwt() ->> 'email'
  AND is_admin = true;
  
  RETURN admin_count > 0;
END;
$$;

-- 5. 创建基于管理员权限的删除策略
DROP POLICY IF EXISTS "Admins can delete tools" ON tools;

CREATE POLICY "Admins can delete tools" ON tools
FOR DELETE
USING (
  is_admin_user()
);

-- 6. 查看当前策略
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
WHERE tablename = 'tools';
