-- 分步执行的表合并SQL
-- 每次只执行一个操作，避免语法错误

-- 步骤1: 添加缺失字段
-- 请逐个执行以下语句

-- 1.1 添加ai_review_result字段
ALTER TABLE tools ADD COLUMN ai_review_result JSONB;

-- 1.2 添加note字段  
ALTER TABLE tools ADD COLUMN note TEXT;

-- 1.3 添加status字段
ALTER TABLE tools ADD COLUMN status TEXT DEFAULT 'active';

-- 步骤2: 验证字段添加成功
-- 执行完上面的语句后，执行这个查询验证
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tools' 
AND column_name IN ('ai_review_result', 'note', 'status')
ORDER BY column_name;

-- 步骤3: 数据迁移（简化版本）
-- 使用最简单的INSERT语法
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
    tagline, 
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
    status, 
    created_at, 
    created_at, 
    note, 
    ai_review_result, 
    ai_review_date
FROM tool_submissions
WHERE id NOT IN (
    SELECT id FROM tools WHERE id IS NOT NULL LIMIT 1
)
LIMIT 1;

-- 步骤4: 检查结果
SELECT COUNT(*) as total_tools FROM tools;
SELECT COUNT(*) as total_submissions FROM tool_submissions;
