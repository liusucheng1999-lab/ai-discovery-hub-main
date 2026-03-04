/**
 * 检查pending任务
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkPendingTask() {
  try {
    console.log('=== 检查pending任务 ===');
    
    // 获取pending任务
    const { data: tasks, error: tasksError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .eq('status', 'pending');
    
    if (tasksError) {
      console.error('获取pending任务失败:', tasksError);
      return;
    }
    
    if (!tasks || tasks.length === 0) {
      console.log('没有pending任务');
      return;
    }
    
    console.log(`找到 ${tasks.length} 个pending任务:`);
    
    for (const task of tasks) {
      console.log(`\n任务ID: ${task.id}`);
      console.log(`工具数量: ${task.total_tools}`);
      console.log(`创建时间: ${task.created_at}`);
      console.log(`工具ID: ${JSON.stringify(task.tool_ids)}`);
      
      // 检查工具是否存在
      const { data: tools, error: toolsError } = await supabase
        .from('tool_submissions')
        .select('id, name')
        .in('id', task.tool_ids);
      
      if (toolsError) {
        console.error('获取工具失败:', toolsError);
      } else {
        console.log(`找到 ${tools?.length || 0} 个工具:`);
        tools?.forEach(tool => {
          console.log(`- ${tool.name} (${tool.id})`);
        });
      }
      
      // 手动启动这个任务
      console.log('\n尝试手动启动任务...');
      
      // 更新状态为running
      const { error: updateError } = await supabase
        .from('batch_review_tasks')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', task.id);
      
      if (updateError) {
        console.error('启动任务失败:', updateError);
      } else {
        console.log('✅ 任务已启动');
        
        // 模拟执行任务（这里只是演示，实际执行需要完整的审核逻辑）
        console.log('注意: 任务已启动，但需要完整的审核逻辑来执行AI审核');
        console.log('建议在前端界面中重新提交批量审核任务');
      }
    }
    
  } catch (error) {
    console.error('检查失败:', error);
  }
}

checkPendingTask();
