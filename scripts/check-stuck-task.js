/**
 * 检查卡住的批量审核任务
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkStuckTask() {
  try {
    console.log('=== 检查卡住的批量审核任务 ===');
    
    // 1. 检查batch_review_tasks表
    console.log('1. 检查batch_review_tasks表:');
    const { data: tasks, error: taskError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (taskError) {
      console.error('查询batch_review_tasks失败:', taskError);
      return;
    }
    
    console.log(`找到 ${tasks?.length || 0} 个批量任务:`);
    
    if (!tasks || tasks.length === 0) {
      console.log('没有批量任务');
      return;
    }
    
    tasks.forEach((task, index) => {
      console.log(`\n${index + 1}. 任务详情:`);
      console.log(`   ID: ${task.id}`);
      console.log(`   状态: ${task.status}`);
      console.log(`   总工具数: ${task.total_tools}`);
      console.log(`   已完成: ${task.completed_tools}`);
      console.log(`   当前工具: ${task.current_tool_name || 'N/A'}`);
      console.log(`   创建时间: ${task.created_at}`);
      console.log(`   更新时间: ${task.updated_at}`);
      console.log(`   错误信息: ${task.error_message || '无'}`);
      
      // 检查是否卡住
      if (task.status === 'running') {
        const now = new Date();
        const updatedAt = new Date(task.updated_at || task.created_at);
        const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
        
        console.log(`   运行时长: ${diffMinutes.toFixed(1)} 分钟`);
        
        if (diffMinutes > 10) {
          console.log(`   ⚠️ 任务可能卡住！超过10分钟未更新`);
          
          // 提供解决方案
          console.log('\n   解决方案:');
          console.log('   1. 手动停止任务');
          console.log(`   2. 检查AI服务是否正常`);
          console.log('   3. 重启任务');
          
          // 提供停止SQL
          console.log('\n   停止任务SQL:');
          console.log('   ```sql');
          console.log(`   UPDATE batch_review_tasks SET status = 'stopped', updated_at = NOW() WHERE id = '${task.id}';`);
          console.log('   ```');
        } else {
          console.log(`   ✅ 任务运行正常`);
        }
      }
    });
    
    // 2. 检查相关的ai_review_results
    console.log('\n2. 检查相关的AI审核结果:');
    const runningTask = tasks.find(t => t.status === 'running');
    
    if (runningTask) {
      const { data: results, error: resultError } = await supabase
        .from('ai_review_results')
        .select('*')
        .eq('task_id', runningTask.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (resultError) {
        console.error('查询AI审核结果失败:', resultError);
      } else {
        console.log(`任务 ${runningTask.id} 的审核结果:`);
        if (results && results.length > 0) {
          results.forEach((result, index) => {
            console.log(`   ${index + 1}. 工具: ${result.tool_name}, 状态: ${result.status}, 时间: ${result.created_at}`);
          });
        } else {
          console.log('   没有找到审核结果');
        }
      }
    }
    
    // 3. 提供修复建议
    console.log('\n3. 修复建议:');
    const stuckTasks = tasks.filter(task => {
      if (task.status !== 'running') return false;
      const now = new Date();
      const updatedAt = new Date(task.updated_at || task.created_at);
      const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
      return diffMinutes > 10;
    });
    
    if (stuckTasks.length > 0) {
      console.log('发现卡住的任务，建议执行以下操作:');
      
      stuckTasks.forEach(task => {
        console.log(`\n任务 ${task.id}:`);
        console.log('1. 停止卡住的任务');
        console.log('2. 检查是否有未完成的审核');
        console.log('3. 手动完成或重启任务');
        
        // 提供具体的停止命令
        console.log('\n停止命令:');
        console.log('```sql');
        console.log(`UPDATE batch_review_tasks SET status = 'stopped', error_message = '手动停止 - 任务卡住', updated_at = NOW() WHERE id = '${task.id}';`);
        console.log('```');
      });
      
      // 创建停止脚本
      console.log('\n或者运行以下脚本停止所有卡住的任务:');
      console.log('node scripts/stop-stuck-tasks.js');
      
    } else {
      console.log('没有发现卡住的任务');
    }
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('检查卡住任务失败:', error);
  }
}

checkStuckTask();
