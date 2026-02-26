-- 审核日志表
CREATE TABLE IF NOT EXISTS ai_review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_date DATE NOT NULL,
  total_tools INTEGER NOT NULL DEFAULT 0,
  approved_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  manual_review_count INTEGER NOT NULL DEFAULT 0,
  review_results JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'executed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- 为审核日志添加索引
CREATE INDEX IF NOT EXISTS idx_ai_review_logs_date ON ai_review_logs(review_date);
CREATE INDEX IF NOT EXISTS idx_ai_review_logs_status ON ai_review_logs(status);

-- 审核结果详情表（可选，用于更详细的存储）
CREATE TABLE IF NOT EXISTS ai_review_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID REFERENCES ai_review_logs(id) ON DELETE CASCADE,
  tool_submission_id UUID REFERENCES tool_submissions(id) ON DELETE CASCADE,
  ai_result JSONB NOT NULL,
  final_decision VARCHAR(20) CHECK (final_decision IN ('approve', 'reject', 'manual_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为详情表添加索引
CREATE INDEX IF NOT EXISTS idx_ai_review_details_log_id ON ai_review_details(log_id);
CREATE INDEX IF NOT EXISTS idx_ai_review_details_tool_id ON ai_review_details(tool_submission_id);
