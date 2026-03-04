/**
 * 测试停止任务功能
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function testStopTask() {
  try {
    console.log('=== 测试停止任务功能 ===');
    
    // 1. 查看当前任务状态
    console.log('1. 查看当前任务状态:');
    const { data: tasks, error: tasksError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (tasksError) {
      console.error('获取任务失败:', tasksError);
      return;
    }
    
    console.log(`找到 ${tasks?.length || 0} 个任务:`);
    tasks?.forEach(task => {
      console.log(`- ${task.id}: ${task.status} (${task.total_tools} 个工具)`);
      console.log(`  进度: ${task.completed_tools}/${task.total_tools}`);
      console.log(`  创建时间: ${task.created_at}`);
      console.log('');
    });
    
    // 2. 找到运行中的任务
    const runningTask = tasks?.find(t => t.status === 'running');
    
    if (runningTask) {
      console.log('2. 发现运行中的任务:');
      console.log(`任务ID: ${runningTask.id}`);
      console.log(`当前进度: ${runningTask.completed_tools}/${runningTask.total_tools}`);
      
      // 模拟停止任务
      console.log('\n3. 停止任务...');
      const { error: stopError } = await supabase
        .from('batch_review_tasks')
        .update({
          status: 'stopped',
          completed_at: new Date().toISOString(),
          error_message: '用户手动停止任务'
        })
        .eq('id', runningTask.id);
      
      if (stopError) {
        console.error('停止任务失败:', stopError);
      } else {
        console.log('✅ 任务已停止');
        
        // 验证停止状态
        const { data: stoppedTask, error: verifyError } = await supabase
          .from('batch_review_tasks')
          .select('*')
          .eq('id', runningTask.id)
          .single();
        
        if (verifyError) {
          console.error('验证失败:', verifyError);
        } else {
          console.log('验证停止状态:');
          console.log(`- 状态: ${stoppedTask.status}`);
          console.log(`- 完成时间: ${stoppedTask.completed_at}`);
          console.log(`- 错误信息: ${stoppedTask.error_message}`);
          console.log(`- 进度: ${stoppedTask.completed_tools}/${stoppedTask.total_tools}`);
        }
      }
    } else {
      console.log('2. 没有运行中的任务');
      
      // 查看停止的任务
      const stoppedTask = tasks?.find(t => t.status === 'stopped');
      if (stoppedTask) {
        console.log('3. 发现已停止的任务:');
        console.log(`任务ID: ${stoppedTask.id}`);
        console.log(`进度: ${stoppedTask.completed_tools}/${stoppedTask.total_tools}`);
        console.log(`停止时间: ${stoppedTask.completed_at}`);
        
        // 模拟重新开始任务
        console.log('\n4. 重新开始任务...');
        const { error: restartError } = await supabase
          .from('batch_review_tasks')
          .update({
            status: 'running',
            started_at: new Date().toISOString(),
            completed_at: null,
            error_message: null
          })
          .eq('id', stoppedTask.id);
        
        if (restartError) {
          console.error('重新开始任务失败:', restartError);
        } else {
          console.log('✅ 任务已重新开始');
        }
      } else {
        console.log('3. 没有已停止的任务');
      }
    }
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testStopTask();
