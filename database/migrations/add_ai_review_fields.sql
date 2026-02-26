-- 添加AI审核结果字段到tool_submissions表
ALTER TABLE tool_submissions 
ADD COLUMN IF NOT EXISTS ai_review_result JSONB,
ADD COLUMN IF NOT EXISTS ai_review_date TIMESTAMP WITH TIME ZONE;

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_tool_submissions_ai_review_date ON tool_submissions(ai_review_date);
