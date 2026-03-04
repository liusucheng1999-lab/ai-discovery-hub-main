/**
 * 分析任务卡住的原因
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function analyzeStuckTask() {
  try {
    console.log('=== 分析任务卡住原因 ===');
    
    // 1. 获取卡住的任务详情
    console.log('1. 获取卡住的任务详情:');
    const { data: stuckTask, error: taskError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .eq('id', '38e1b1ff-185b-461f-9571-4f2b3c6192ab')
      .single();
    
    if (taskError) {
      console.error('获取任务详情失败:', taskError);
      return;
    }
    
    if (!stuckTask) {
      console.log('任务不存在或已完成');
      return;
    }
    
    console.log('卡住的任务详情:');
    console.log(`- ID: ${stuckTask.id}`);
    console.log(`- 状态: ${stuckTask.status}`);
    console.log(`- 总工具数: ${stuckTask.total_tools}`);
    console.log(`- 已完成: ${stuckTask.completed_tools}`);
    console.log(`- 当前工具: ${stuckTask.current_tool_name || 'N/A'}`);
    console.log(`- 创建时间: ${stuckTask.created_at}`);
    console.log(`- 更新时间: ${stuckTask.updated_at}`);
    console.log(`- 错误信息: ${stuckTask.error_message || '无'}`);
    
    // 2. 检查相关的AI审核结果
    console.log('\n2. 检查相关的AI审核结果:');
    const { data: reviewResults, error: reviewError } = await supabase
      .from('ai_review_results')
      .select('*')
      .eq('task_id', stuckTask.id)
      .order('created_at', { ascending: false });
    
    if (reviewError) {
      console.error('查询审核结果失败:', reviewError);
    } else {
      console.log(`找到 ${reviewResults?.length || 0} 条审核结果:`);
      
      if (reviewResults && reviewResults.length > 0) {
        reviewResults.forEach((result, index) => {
          console.log(`${index + 1}. 工具: ${result.tool_name}`);
          console.log(`   状态: ${result.status || 'undefined'}`);
          console.log(`   创建时间: ${result.created_at}`);
          console.log(`   结果: ${result.review_result ? '有' : '无'}`);
          
          // 检查是否有异常状态
          if (!result.status) {
            console.log('   ⚠️ 状态为undefined，可能是数据问题');
          }
        });
        
        // 检查最后一条记录的时间
        const lastResult = reviewResults[0];
        if (lastResult) {
          const now = new Date();
          const lastTime = new Date(lastResult.created_at);
          const diffMinutes = (now.getTime() - lastTime.getTime()) / (1000 * 60);
          console.log(`最后审核结果时间: ${diffMinutes.toFixed(1)} 分钟前`);
          
          if (diffMinutes > 30) {
            console.log('⚠️ 超过30分钟没有新审核结果，可能卡住');
          }
        }
      } else {
        console.log('没有找到审核结果');
      }
    }
    
    // 3. 检查任务进度
    console.log('\n3. 分析任务进度:');
    const progress = stuckTask.completed_tools || 0;
    const total = stuckTask.total_tools || 0;
    const percentage = total > 0 ? (progress / total * 100).toFixed(1) : 0;
    
    console.log(`进度: ${progress}/${total} (${percentage}%)`);
    
    if (progress === 0 && total > 0) {
      console.log('⚠️ 进度为0，可能刚开始就卡住了');
    }
    
    if (progress < total) {
      console.log(`还有 ${total - progress} 个工具未审核`);
    }
    
    // 4. 分析可能的原因
    console.log('\n4. 分析卡住的可能原因:');
    
    const reasons = [];
    
    // 检查时间
    const now = new Date();
    const createdAt = new Date(stuckTask.created_at);
    const updatedAt = new Date(stuckTask.updated_at);
    const totalMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    const stuckMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
    
    console.log(`总运行时间: ${totalMinutes.toFixed(1)} 分钟`);
    console.log(`卡住时间: ${stuckMinutes.toFixed(1)} 分钟`);
    
    if (stuckMinutes > 60) {
      reasons.push('长时间未更新，可能进程崩溃');
    }
    
    if (progress === 0 && totalMinutes > 10) {
      reasons.push('开始就卡住，可能是初始化问题');
    }
    
    if (reviewResults && reviewResults.length > 0) {
      const lastResult = reviewResults[0];
      if (!lastResult.status) {
        reasons.push('审核结果状态异常，数据结构问题');
      }
      
      if (lastResult.review_result && typeof lastResult.review_result === 'string') {
        try {
          JSON.parse(lastResult.review_result);
        } catch (e) {
          reasons.push('审核结果JSON格式错误');
        }
      }
    }
    
    // 检查AI服务
    console.log('\n5. 检查AI服务状态:');
    try {
      // 测试AI服务连接
      const response = await fetch('https://api.deepseek.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-key'
        },
        signal: AbortSignal.timeout(5000) // 5秒超时
      });
      
      if (response.ok) {
        console.log('✅ AI服务连接正常');
      } else {
        console.log('❌ AI服务连接异常');
        reasons.push('AI服务连接问题');
      }
    } catch (error) {
      console.log('❌ AI服务测试失败:', error.message);
      reasons.push('AI服务不可达');
    }
    
    // 6. 输出分析结果
    console.log('\n6. 分析结果:');
    if (reasons.length > 0) {
      console.log('可能的原因:');
      reasons.forEach((reason, index) => {
        console.log(`${index + 1}. ${reason}`);
      });
    } else {
      console.log('未发现明显问题，可能需要检查日志');
    }
    
    // 7. 提供解决方案
    console.log('\n7. 建议的解决方案:');
    console.log('方案1: 停止卡住的任务');
    console.log('```sql');
    console.log(`UPDATE batch_review_tasks SET status = 'stopped', error_message = '分析后手动停止 - 卡住${stuckMinutes.toFixed(1)}分钟' WHERE id = '${stuckTask.id}';`);
    console.log('```');
    
    console.log('\n方案2: 清理异常的审核结果');
    console.log('```sql');
    console.log(`UPDATE ai_review_results SET status = 'failed' WHERE task_id = '${stuckTask.id}' AND status IS NULL;`);
    console.log('```');
    
    console.log('\n方案3: 重启任务');
    console.log('1. 停止当前任务');
    console.log('2. 修复数据问题');
    console.log('3. 重新启动批量审核');
    
    console.log('\n=== 分析完成 ===');
    
  } catch (error) {
    console.error('分析任务卡住失败:', error);
  }
}

analyzeStuckTask();
