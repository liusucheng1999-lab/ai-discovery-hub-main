-- 完全工作的表合并SQL
-- 避免在SELECT中引用目标表字段

-- 步骤1: 添加缺失字段（如果还没有添加）
ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 步骤2: 使用CTE (Common Table Expression)避免字段引用冲突
WITH submission_data AS (
    SELECT 
        id,
        name,
        tagline,
        website_url,
        category,
        COALESCE(pricing_type, 'free') as pricing_type,
        is_china_available,
        status,
        created_at,
        note,
        ai_review_result,
        ai_review_date,
        -- 在CTE内部处理tags字段
        CASE 
            WHEN tags IS NOT NULL AND array_length(tags, 1) > 0 THEN tags
            ELSE ARRAY[category]
        END as tags
    FROM tool_submissions
    WHERE id NOT IN (
        -- 排除已存在的记录
        SELECT ts.id FROM tool_submissions ts
        INNER JOIN tools t ON t.website_url = ts.website_url AND t.name = ts.name
    )
)
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
    tagline as description, 
    website_url, 
    category, 
    tags, 
    pricing_type, 
    is_china_available, 
    false, 
    0, 
    0, 
    0, 
    '[]'::jsonb, 
    COALESCE(status, 'pending'), 
    created_at, 
    created_at, 
    note, 
    ai_review_result, 
    ai_review_date
FROM submission_data;

-- 步骤3: 验证结果
SELECT 
    status,
    COUNT(*) as count
FROM tools 
GROUP BY status
ORDER BY status;

-- 步骤4: 检查是否有重复
SELECT 
    name,
    website_url,
    COUNT(*) as duplicate_count
FROM tools 
GROUP BY name, website_url 
HAVING COUNT(*) > 1;
