-- 应用审核工作流：普通用户提交的应用需管理员审核后才公开
-- 已通过 Supabase MCP 应用到生产库（migration: add_app_review_workflow）

-- 1a. hosted_apps 增加审核字段
ALTER TABLE hosted_apps
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  ADD COLUMN IF NOT EXISTS review_note text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_hosted_apps_status ON hosted_apps(status);

-- 回填：已发布的存量应用置为 approved
UPDATE hosted_apps SET status = 'approved' WHERE is_published = true;

-- 1b. 管理员判定函数（SECURITY DEFINER，供 RLS 复用）
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM admin_roles
                WHERE user_id = auth.uid() AND is_admin = true);
$$;

-- 1c. 重建 hosted_apps RLS（关闭普通用户自助发布漏洞）
DROP POLICY IF EXISTS "Users can view their own apps" ON hosted_apps;
DROP POLICY IF EXISTS "Users can insert their own apps" ON hosted_apps;
DROP POLICY IF EXISTS "Users can update their own apps" ON hosted_apps;
DROP POLICY IF EXISTS "Users can delete their own apps" ON hosted_apps;

CREATE POLICY "view approved or own or admin"
  ON hosted_apps FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "insert own pending"
  ON hosted_apps FOR INSERT
  WITH CHECK (auth.uid() = user_id AND (public.is_admin() OR status = 'pending'));

CREATE POLICY "update own pending or admin"
  ON hosted_apps FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (public.is_admin() OR (auth.uid() = user_id AND status = 'pending'));

CREATE POLICY "delete own or admin"
  ON hosted_apps FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());
