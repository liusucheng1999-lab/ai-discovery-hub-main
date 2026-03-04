/**
 * 检查批量审核任务状态
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkBatchTasks() {
  try {
    console.log('=== 检查批量审核任务状态 ===');
    
    // 1. 检查batch_tasks表
    console.log('1. 检查batch_tasks表:');
    const { data: batchTasks, error: batchError } = await supabase
      .from('batch_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (batchError) {
      console.error('查询batch_tasks失败:', batchError);
    } else {
      console.log(`找到 ${batchTasks?.length || 0} 个批量任务:`);
      batchTasks?.forEach((task, index) => {
        console.log(`\n${index + 1}. 任务ID: ${task.id}`);
        console.log(`   状态: ${task.status}`);
        console.log(`   进度: ${task.progress || 'N/A'}`);
        console.log(`   总数: ${task.total_count || 'N/A'}`);
        console.log(`   当前: ${task.current_index || 'N/A'}`);
        console.log(`   创建时间: ${task.created_at}`);
        console.log(`   更新时间: ${task.updated_at}`);
        console.log(`   错误: ${task.error_message || '无'}`);
        
        // 检查是否卡住
        if (task.status === 'running') {
          const now = new Date();
          const updatedAt = new Date(task.updated_at);
          const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
          
          if (diffMinutes > 10) { // 超过10分钟没有更新
            console.log(`   ⚠️ 可能卡住: ${diffMinutes.toFixed(1)} 分钟未更新`);
          } else {
            console.log(`   ✅ 正常运行: ${diffMinutes.toFixed(1)} 分钟前更新`);
          }
        }
      });
    }
    
    // 2. 检查ai_review_results表
    console.log('\n2. 检查ai_review_results表:');
    const { data: reviewResults, error: reviewError } = await supabase
      .from('ai_review_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (reviewError) {
      console.error('查询ai_review_results失败:', reviewError);
    } else {
      console.log(`最近10条审核结果:`);
      reviewResults?.forEach((result, index) => {
        console.log(`${index + 1}. 工具ID: ${result.tool_id}, 状态: ${result.status}, 时间: ${result.created_at}`);
      });
    }
    
    // 3. 检查是否有运行中的任务需要停止
    console.log('\n3. 检查需要处理的任务:');
    const runningTasks = batchTasks?.filter(task => task.status === 'running') || [];
    
    if (runningTasks.length > 0) {
      console.log(`发现 ${runningTasks.length} 个运行中的任务:`);
      
      for (const task of runningTasks) {
        const now = new Date();
        const updatedAt = new Date(task.updated_at);
        const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
        
        if (diffMinutes > 15) { // 超过15分钟
          console.log(`\n⚠️ 任务可能卡住，建议停止:`);
          console.log(`任务ID: ${task.id}`);
          console.log(`卡住时间: ${diffMinutes.toFixed(1)} 分钟`);
          
          // 提供停止命令
          console.log('\n停止命令:');
          console.log('```sql');
          console.log(`UPDATE batch_tasks SET status = 'stopped', updated_at = NOW() WHERE id = '${task.id}';`);
          console.log('```');
          
          // 或者提供JavaScript停止脚本
          console.log('\n或者运行停止脚本:');
          console.log(`node scripts/stop-batch-task.js ${task.id}`);
        } else {
          console.log(`✅ 任务 ${task.id} 运行正常`);
        }
      }
    } else {
      console.log('没有运行中的批量任务');
    }
    
    // 4. 检查数据库连接
    console.log('\n4. 检查数据库连接:');
    const { data: connectionTest, error: connError } = await supabase
      .from('tools')
      .select('count', { count: 'exact', head: true });
    
    if (connError) {
      console.error('数据库连接异常:', connError);
    } else {
      console.log('✅ 数据库连接正常');
    }
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('检查批量任务失败:', error);
  }
}

checkBatchTasks();
