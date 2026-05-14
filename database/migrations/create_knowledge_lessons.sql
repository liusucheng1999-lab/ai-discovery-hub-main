-- AI课程课节表：支持单课程《超级个体：AI工具掌控与产品设计指南》，预留多课程扩展
-- 在 Supabase SQL 编辑器中执行

-- 0) 创建管理员权限检查函数（如果不存在）
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

-- 1) 创建表
CREATE TABLE IF NOT EXISTS knowledge_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_embed_url TEXT,
  doc_embed_url TEXT,
  week_title TEXT,
  section_label TEXT,
  lesson_code TEXT, -- 例如 L1, L2（UI展示用，非主键）
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | published
  is_free BOOLEAN NOT NULL DEFAULT true,
  slug TEXT UNIQUE, -- 用于友好 URL /knowledge/lesson/:slug
  cover TEXT, -- 封面图 URL（可选）
  video_provider TEXT, -- bilibili | feishu | external
  doc_provider TEXT, -- feishu | external
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID, -- 可空，记录管理员
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) 更新时间自动更新
CREATE OR REPLACE FUNCTION set_updated_at_knowledge_lessons()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at_knowledge_lessons ON knowledge_lessons;
CREATE TRIGGER trg_set_updated_at_knowledge_lessons
BEFORE UPDATE ON knowledge_lessons
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_knowledge_lessons();

-- 3) 启用 RLS
ALTER TABLE knowledge_lessons ENABLE ROW LEVEL SECURITY;

-- 4) 读取：所有人可读 published
DROP POLICY IF EXISTS "Public can read published knowledge lessons" ON knowledge_lessons;
CREATE POLICY "Public can read published knowledge lessons" ON knowledge_lessons
FOR SELECT
USING (status = 'published');

-- 5) 读取：管理员可读所有（含 draft）
DROP POLICY IF EXISTS "Admins can read all knowledge lessons" ON knowledge_lessons;
CREATE POLICY "Admins can read all knowledge lessons" ON knowledge_lessons
FOR SELECT
USING (is_admin_user());

-- 6) 写入：允许所有写入（依赖前端登录验证）
-- 注意：这是临时方案，生产环境应使用后端 API 或 Supabase Auth
DROP POLICY IF EXISTS "Admins can write knowledge lessons" ON knowledge_lessons;
CREATE POLICY "Admins can write knowledge lessons" ON knowledge_lessons
FOR ALL
USING (true)
WITH CHECK (true);

-- 7) 索引优化
CREATE INDEX IF NOT EXISTS idx_knowledge_lessons_sort_order ON knowledge_lessons(sort_order);
CREATE INDEX IF NOT EXISTS idx_knowledge_lessons_status ON knowledge_lessons(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_lessons_slug ON knowledge_lessons(slug) WHERE slug IS NOT NULL;
