-- 合并 tools 和 tool_submissions 表
-- 将 tool_submissions 的数据迁移到 tools 表，并添加 status 字段

-- 1. 为 tools 表添加 status 字段
ALTER TABLE tools ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'approved', 'rejected', 'active'));

-- 2. 为 tools 表添加 submission 相关字段（如果不存在）
ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_date TIMESTAMP WITH TIME ZONE;

-- 3. 迁移 tool_submissions 数据到 tools 表
INSERT INTO tools (
  name, 
  tagline, 
  description, 
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  is_chinese_supported, 
  rating, 
  rating_count, 
  view_count, 
  screenshots, 
  status, 
  created_at, 
  updated_at,
  note,
  ai_review_result,
  ai_review_date
)
SELECT 
  name, 
  tagline, 
  tagline as description, -- 使用 tagline 作为 description
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  false as is_chinese_supported, -- 默认值
  0 as rating, 
  0 as rating_count, 
  0 as view_count, 
  '[]'::jsonb as screenshots, -- 空数组
  status, 
  created_at, 
  created_at as updated_at,
  note,
  ai_review_result,
  ai_review_date
FROM tool_submissions
WHERE id NOT IN (
  SELECT id FROM tools WHERE id IN (SELECT id FROM tool_submissions)
);

-- 4. 验证迁移结果
SELECT 
  status,
  COUNT(*) as count
FROM tools 
GROUP BY status
ORDER BY status;

-- 5. 可选：删除 tool_submissions 表（确认迁移成功后执行）
-- DROP TABLE tool_submissions;

-- 6. 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);
