-- 为tools表添加缺失的字段

-- 添加AI审核结果字段
ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;

-- 添加备注字段
ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;

-- 验证字段添加成功
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tools' 
AND column_name IN ('ai_review_result', 'note')
ORDER BY column_name;
