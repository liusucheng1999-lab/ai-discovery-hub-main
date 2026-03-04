-- 手动创建批量审核任务表
-- 请在Supabase SQL编辑器中逐个执行以下SQL语句

-- 1. 创建批量审核任务表
CREATE TABLE IF NOT EXISTS batch_review_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  total_tools INTEGER NOT NULL,
  completed_tools INTEGER DEFAULT 0,
  current_tool_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT,
  created_by TEXT,
  tool_ids TEXT[] NOT NULL,
  results JSONB DEFAULT '{}'
);

-- 2. 创建审核结果表
CREATE TABLE IF NOT EXISTS ai_review_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES batch_review_tasks(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  review_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  saved_to_tool_submission BOOLEAN DEFAULT FALSE
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_batch_review_tasks_status ON batch_review_tasks(status);
CREATE INDEX IF NOT EXISTS idx_batch_review_tasks_created_at ON batch_review_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batch_review_tasks_created_by ON batch_review_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_review_results_task_id ON ai_review_results(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_review_results_tool_id ON ai_review_results(tool_id);

-- 4. 创建更新任务进度的函数
CREATE OR REPLACE FUNCTION update_task_progress(
  task_id UUID,
  completed_tools INTEGER,
  current_tool_name TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE batch_review_tasks 
  SET 
    completed_tools = completed_tools,
    current_tool_name = current_tool_name,
    updated_at = NOW()
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- 5. 创建完成任务的函数
CREATE OR REPLACE FUNCTION complete_task(
  task_id UUID,
  status TEXT DEFAULT 'completed',
  error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE batch_review_tasks 
  SET 
    status = status,
    completed_at = NOW(),
    error_message = error_message,
    updated_at = NOW()
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;
