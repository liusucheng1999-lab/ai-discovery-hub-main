/**
 * 调试批量审核任务
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function debugBatchTask() {
  try {
    console.log('=== 调试批量审核任务 ===');
    
    // 1. 检查任务表
    console.log('\n1. 检查batch_review_tasks表:');
    const { data: tasks, error: tasksError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (tasksError) {
      console.error('查询任务失败:', tasksError);
    } else {
      console.log(`找到 ${tasks?.length || 0} 个任务:`);
      tasks?.forEach(task => {
        console.log(`- ${task.id}: ${task.status} (${task.total_tools} 个工具)`);
        console.log(`  创建时间: ${task.created_at}`);
        console.log(`  开始时间: ${task.started_at || '未开始'}`);
        console.log(`  完成时间: ${task.completed_at || '未完成'}`);
        console.log(`  错误信息: ${task.error_message || '无'}`);
        console.log('');
      });
    }
    
    // 2. 检查审核结果表
    console.log('2. 检查ai_review_results表:');
    const { data: results, error: resultsError } = await supabase
      .from('ai_review_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (resultsError) {
      console.error('查询审核结果失败:', resultsError);
    } else {
      console.log(`找到 ${results?.length || 0} 个审核结果:`);
      results?.forEach(result => {
        console.log(`- 任务 ${result.task_id}: ${result.tool_name}`);
        console.log(`  工具ID: ${result.tool_id}`);
        console.log(`  审核时间: ${result.created_at}`);
        console.log(`  是否已保存: ${result.saved_to_tool_submission}`);
        
        // 检查审核结果内容
        if (result.review_result) {
          const review = result.review_result;
          console.log(`  审核结果: ${review.recommendation} (置信度: ${(review.confidence || 0).toFixed(2)})`);
        }
        console.log('');
      });
    }
    
    // 3. 检查tool_submissions表是否有AI审核数据
    console.log('3. 检查tool_submissions表的AI审核数据:');
    const { data: submissions, error: submissionsError } = await supabase
      .from('tool_submissions')
      .select('id, name, ai_review_result, ai_review_date')
      .not('ai_review_result', 'is', null)
      .limit(5);
    
    if (submissionsError) {
      console.error('查询提交数据失败:', submissionsError);
    } else {
      console.log(`找到 ${submissions?.length || 0} 个有AI审核数据的提交:`);
      submissions?.forEach(sub => {
        console.log(`- ${sub.name} (${sub.id})`);
        console.log(`  审核时间: ${sub.ai_review_date}`);
        console.log('');
      });
    }
    
    // 4. 检查是否有运行中的任务卡住了
    console.log('4. 检查运行中的任务:');
    const runningTasks = tasks?.filter(t => t.status === 'running') || [];
    if (runningTasks.length > 0) {
      console.log(`发现 ${runningTasks.length} 个运行中的任务:`);
      runningTasks.forEach(task => {
        const runningTime = Date.now() - new Date(task.started_at || task.created_at).getTime();
        const runningMinutes = Math.floor(runningTime / 60000);
        console.log(`- ${task.id}: 已运行 ${runningMinutes} 分钟`);
        console.log(`  进度: ${task.completed_tools}/${task.total_tools}`);
        console.log(`  当前工具: ${task.current_tool_name || '未知'}`);
        
        if (runningMinutes > 10) {
          console.log(`  ⚠️ 任务可能卡住了，建议检查`);
        }
        console.log('');
      });
    } else {
      console.log('没有运行中的任务');
    }
    
    // 5. 检查失败的任务
    console.log('5. 检查失败的任务:');
    const failedTasks = tasks?.filter(t => t.status === 'failed') || [];
    if (failedTasks.length > 0) {
      console.log(`发现 ${failedTasks.length} 个失败的任务:`);
      failedTasks.forEach(task => {
        console.log(`- ${task.id}: ${task.error_message}`);
        console.log('');
      });
    } else {
      console.log('没有失败的任务');
    }
    
  } catch (error) {
    console.error('调试失败:', error);
  }
}

debugBatchTask();
