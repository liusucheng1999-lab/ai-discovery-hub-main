import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  try {
    console.log('开始创建AI审核日志表...')
    
    // 执行SQL创建表
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (error) {
      console.error('创建表失败:', error)
      console.log('尝试使用直接SQL...')
      
      // 如果RPC失败，尝试直接SQL
      const { data, error: directError } = await supabase
        .from('ai_review_logs')
        .select('*')
        .limit(1)
      
      if (directError && directError.code === 'PGRST116') {
        console.log('表确实不存在，需要在Supabase控制台手动创建')
        console.log('请访问 https://supabase.com/dashboard/project/enzduxajblrfbbdktieo/sql')
      } else {
        console.log('表可能已存在')
      }
    } else {
      console.log('✅ AI审核日志表创建成功')
    }
    
  } catch (error) {
    console.error('执行失败:', error)
  }
}

createTables()
