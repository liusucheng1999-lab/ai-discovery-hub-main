-- 为 tools 表添加 logo_url 字段
-- 用于存储 Supabase Storage 中的工具图标 URL
-- 请在 Supabase SQL 编辑器中执行

ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 添加注释
COMMENT ON COLUMN tools.logo_url IS '工具图标 URL，指向 Supabase Storage CDN';
