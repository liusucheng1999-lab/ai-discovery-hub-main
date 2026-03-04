-- 修正后的表合并SQL - 解决字段引用错误

-- 1. 添加缺失字段（如果不存在）
ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. 添加状态约束（如果不存在）
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

-- 3. 数据迁移 - 修正字段引用问题
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
    ts.name, 
    ts.tagline, 
    ts.tagline as description, 
    ts.website_url, 
    ts.category, 
    CASE 
        WHEN ts.tags IS NOT NULL AND array_length(ts.tags, 1) > 0 THEN ts.tags
        ELSE ARRAY[ts.category]
    END as tags, 
    COALESCE(ts.pricing_type, 'free') as pricing_type, 
    ts.is_china_available, 
    false as is_chinese_supported, 
    0 as rating, 
    0 as rating_count, 
    0 as view_count, 
    '[]'::jsonb as screenshots, 
    COALESCE(ts.status, 'pending') as status, 
    ts.created_at, 
    ts.created_at as updated_at, 
    ts.note, 
    ts.ai_review_result, 
    ts.ai_review_date
FROM tool_submissions ts
WHERE NOT EXISTS (
    SELECT 1 FROM tools t 
    WHERE t.website_url = ts.website_url
    AND t.name = ts.name
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

-- 6. 检查重复数据
SELECT 
    name,
    website_url,
    COUNT(*) as duplicate_count
FROM tools 
GROUP BY name, website_url 
HAVING COUNT(*) > 1;
