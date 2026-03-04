/**
 * 检查tools表的字段结构
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkToolsColumns() {
  try {
    console.log('=== 检查tools表字段结构 ===');
    
    // 1. 检查tools表字段
    console.log('1. 检查tools表字段:');
    const { data: toolsData, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (toolsError) {
      console.error('查询tools表失败:', toolsError);
      return;
    }
    
    if (toolsData && toolsData.length > 0) {
      console.log('tools表现有字段:', Object.keys(toolsData[0]));
    } else {
      console.log('tools表为空，无法获取字段信息');
    }
    
    // 2. 检查tool_submissions表字段作为参考
    console.log('\n2. 检查tool_submissions表字段:');
    const { data: submissionsData, error: submissionsError } = await supabase
      .from('tool_submissions')
      .select('*')
      .limit(1);
    
    if (submissionsError) {
      console.error('查询tool_submissions表失败:', submissionsError);
    } else if (submissionsData && submissionsData.length > 0) {
      console.log('tool_submissions表字段:', Object.keys(submissionsData[0]));
    } else {
      console.log('tool_submissions表为空');
    }
    
    // 3. 检查缺失的字段
    console.log('\n3. 检查tools表缺失的字段:');
    const requiredFields = [
      'ai_review_result',
      'ai_review_date', 
      'ai_quality_score',
      'ai_quality_review',
      'ai_review_notes',
      'note',
      'status'
    ];
    
    const existingFields = toolsData && toolsData.length > 0 ? Object.keys(toolsData[0]) : [];
    const missingFields = requiredFields.filter(field => !existingFields.includes(field));
    
    if (missingFields.length > 0) {
      console.log('缺失的字段:', missingFields);
      console.log('\n需要执行的SQL:');
      
      missingFields.forEach(field => {
        let sql = '';
        switch (field) {
          case 'ai_review_result':
            sql = `ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;`;
            break;
          case 'ai_review_date':
            sql = `ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_date TIMESTAMP WITH TIME ZONE;`;
            break;
          case 'ai_quality_score':
            sql = `ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_quality_score NUMERIC;`;
            break;
          case 'ai_quality_review':
            sql = `ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_quality_review TEXT;`;
            break;
          case 'ai_review_notes':
            sql = `ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_notes TEXT;`;
            break;
          case 'note':
            sql = `ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;`;
            break;
          case 'status':
            sql = `ALTER TABLE tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'approved', 'rejected', 'active'));`;
            break;
        }
        console.log(sql);
      });
    } else {
      console.log('✅ 所有必需字段都存在');
    }
    
    // 4. 测试插入
    console.log('\n4. 测试插入带AI审核数据的工具:');
    if (toolsData && toolsData.length > 0) {
      const sampleTool = toolsData[0];
      console.log('现有工具示例:', sampleTool.name);
      
      // 检查是否有AI审核字段
      const hasAiFields = ['ai_review_result', 'ai_review_date'].some(field => 
        existingFields.includes(field)
      );
      
      if (hasAiFields) {
        console.log('✅ tools表已支持AI审核字段');
      } else {
        console.log('❌ tools表缺少AI审核字段，需要添加');
      }
    }
    
  } catch (error) {
    console.error('检查失败:', error);
  }
}

checkToolsColumns();
