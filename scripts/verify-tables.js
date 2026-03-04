/**
 * 验证批量审核表是否创建成功
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function verifyTables() {
  try {
    console.log('=== 验证批量审核表 ===');
    
    // 检查batch_review_tasks表
    console.log('检查 batch_review_tasks 表...');
    const { data: taskData, error: taskError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .limit(1);
    
    if (taskError) {
      console.log('❌ batch_review_tasks 表不存在或无法访问');
      console.log('错误:', taskError.message);
    } else {
      console.log('✅ batch_review_tasks 表已存在');
      if (taskData && taskData.length > 0) {
        console.log('字段:', Object.keys(taskData[0]));
      } else {
        console.log('表为空，但结构正确');
      }
    }
    
    // 检查ai_review_results表
    console.log('\n检查 ai_review_results 表...');
    const { data: resultData, error: resultError } = await supabase
      .from('ai_review_results')
      .select('*')
      .limit(1);
    
    if (resultError) {
      console.log('❌ ai_review_results 表不存在或无法访问');
      console.log('错误:', resultError.message);
    } else {
      console.log('✅ ai_review_results 表已存在');
      if (resultData && resultData.length > 0) {
        console.log('字段:', Object.keys(resultData[0]));
      } else {
        console.log('表为空，但结构正确');
      }
    }
    
    // 测试创建一个任务
    console.log('\n测试创建任务...');
    const testTask = {
      status: 'pending',
      total_tools: 1,
      completed_tools: 0,
      created_by: 'test',
      tool_ids: ['test-tool-id']
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('batch_review_tasks')
      .insert(testTask)
      .select();
    
    if (insertError) {
      console.log('❌ 创建测试任务失败');
      console.log('错误:', insertError.message);
    } else {
      console.log('✅ 创建测试任务成功');
      console.log('任务ID:', insertData[0].id);
      
      // 删除测试任务
      await supabase
        .from('batch_review_tasks')
        .delete()
        .eq('id', insertData[0].id);
      console.log('🗑️  已删除测试任务');
    }
    
    console.log('\n=== 验证完成 ===');
    
  } catch (error) {
    console.error('验证失败:', error);
  }
}

verifyTables();
