-- 修正后的表合并SQL

-- 1. 添加status字段（如果不存在）
ALTER TABLE tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 添加约束（PostgreSQL语法）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'tools_status_check'
    ) THEN
        ALTER TABLE tools ADD CONSTRAINT tools_status_check 
        CHECK (status IN ('pending', 'approved', 'rejected', 'active'));
    END IF;
END $$;

-- 2. 添加其他缺失字段（如果不存在）
ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;

-- 3. 迁移数据（指定具体字段）
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
    tagline as description, -- 使用tagline作为description
    website_url, 
    category, 
    COALESCE(tags, ARRAY[category]) as tags, -- 确保tags不为空
    COALESCE(pricing_type, 'free') as pricing_type, -- 确保pricing_type不为空
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
WHERE NOT EXISTS (
    SELECT 1 FROM tools t 
    WHERE t.website_url = tool_submissions.website_url
    AND t.name = tool_submissions.name
);

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);

-- 5. 验证迁移结果
SELECT 
    status,
    COUNT(*) as count,
    MIN(created_at) as earliest,
    MAX(created_at) as latest
FROM tools 
GROUP BY status
ORDER BY status;

-- 6. 检查是否有重复数据
SELECT 
    name,
    website_url,
    COUNT(*) as duplicate_count
FROM tools 
GROUP BY name, website_url 
HAVING COUNT(*) > 1;
