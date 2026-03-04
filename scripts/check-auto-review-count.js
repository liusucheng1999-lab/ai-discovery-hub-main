/**
 * 检查自动AI审核计数问题
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkAutoReviewCount() {
  try {
    console.log('=== 检查自动AI审核计数问题 ===');
    
    // 1. 检查当前待审核工具数量
    console.log('1. 检查当前待审核工具:');
    const { data: pendingTools, error: pendingError } = await supabase
      .from('tools')
      .select('id, name, status, created_at')
      .eq('status', 'pending');
    
    if (pendingError) {
      console.error('查询待审核工具失败:', pendingError);
      return;
    }
    
    console.log(`当前待审核工具数量: ${pendingTools?.length || 0} 个`);
    
    if (pendingTools && pendingTools.length > 0) {
      console.log('\n待审核工具列表:');
      pendingTools.slice(0, 10).forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} (创建时间: ${tool.created_at})`);
      });
      
      if (pendingTools.length > 10) {
        console.log(`... 还有 ${pendingTools.length - 10} 个`);
      }
    }
    
    // 2. 检查最近的批量审核任务
    console.log('\n2. 检查最近的批量审核任务:');
    const { data: recentTasks, error: taskError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (taskError) {
      console.error('查询批量任务失败:', taskError);
    } else {
      console.log(`找到 ${recentTasks?.length || 0} 个最近的批量任务:`);
      
      recentTasks?.forEach((task, index) => {
        console.log(`\n${index + 1}. 任务 ${task.id}`);
        console.log(`   状态: ${task.status}`);
        console.log(`   总工具数: ${task.total_tools}`);
        console.log(`   已完成: ${task.completed_tools}`);
        console.log(`   创建时间: ${task.created_at}`);
        console.log(`   开始时间: ${task.started_at || '未开始'}`);
        console.log(`   完成时间: ${task.completed_at || '未完成'}`);
        console.log(`   工具IDs: ${task.tool_ids ? task.tool_ids.length : 0} 个`);
        
        if (task.error_message) {
          console.log(`   错误信息: ${task.error_message}`);
        }
        
        // 检查任务结果
        if (task.results) {
          const resultCount = Object.keys(task.results).length;
          console.log(`   结果数量: ${resultCount} 个`);
        }
      });
    }
    
    // 3. 检查AI审核结果表
    console.log('\n3. 检查AI审核结果表:');
    const { data: reviewResults, error: reviewError } = await supabase
      .from('ai_review_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (reviewError) {
      console.error('查询AI审核结果失败:', reviewError);
    } else {
      console.log(`最近10条AI审核结果:`);
      
      reviewResults?.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.tool_name}`);
        console.log(`   状态: ${result.status || 'undefined'}`);
        console.log(`   创建时间: ${result.created_at}`);
        
        if (result.review_result) {
          try {
            const review = typeof result.review_result === 'string' 
              ? JSON.parse(result.review_result) 
              : result.review_result;
            
            console.log(`   AI建议: ${review?.recommendation || '未知'}`);
          } catch (e) {
            console.log(`   审核结果解析失败`);
          }
        }
      });
      
      // 统计总数
      const { count: totalResults, error: countError } = await supabase
        .from('ai_review_results')
        .select('*', { count: 'exact', head: true });
      
      if (!countError) {
        console.log(`\nAI审核结果总数: ${totalResults} 条`);
      }
    }
    
    // 4. 检查工具状态分布
    console.log('\n4. 检查工具状态分布:');
    const { data: allTools, error: statusError } = await supabase
      .from('tools')
      .select('status');
    
    if (statusError) {
      console.error('查询状态分布失败:', statusError);
    } else {
      const stats = {};
      allTools?.forEach(tool => {
        stats[tool.status] = (stats[tool.status] || 0) + 1;
      });
      
      console.log('工具状态分布:');
      Object.entries(stats).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} 个`);
      });
    }
    
    // 5. 分析计数差异原因
    console.log('\n5. 分析计数差异原因:');
    
    const pendingCount = pendingTools?.length || 0;
    const totalResults = await supabase
      .from('ai_review_results')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => count || 0);
    
    console.log(`待审核工具: ${pendingCount} 个`);
    console.log(`AI审核结果: ${totalResults} 条`);
    console.log(`差异: ${totalResults - pendingCount} 条`);
    
    if (totalResults > pendingCount) {
      console.log('\n可能的原因:');
      console.log('1. 重复审核: 同一个工具被多次审核');
      console.log('2. 状态未更新: 审核后工具状态没有正确更新');
      console.log('3. 历史数据: 包含了之前审核的结果');
      console.log('4. 错误重试: 审核失败后重新审核');
      
      // 检查重复审核
      console.log('\n检查重复审核:');
      const { data: duplicateCheck, error: duplicateError } = await supabase
        .from('ai_review_results')
        .select('tool_id, tool_name, created_at')
        .order('tool_id, created_at');
      
      if (!duplicateError && duplicateCheck) {
        const toolGroups = {};
        duplicateCheck.forEach(result => {
          if (!toolGroups[result.tool_id]) {
            toolGroups[result.tool_id] = [];
          }
          toolGroups[result.tool_id].push(result);
        });
        
        let duplicateCount = 0;
        Object.entries(toolGroups).forEach(([toolId, results]) => {
          if (results.length > 1) {
            duplicateCount++;
            console.log(`工具 ${results[0].tool_name} (${toolId}) 被审核 ${results.length} 次`);
          }
        });
        
        if (duplicateCount > 0) {
          console.log(`发现 ${duplicateCount} 个工具被重复审核`);
        } else {
          console.log('没有发现重复审核');
        }
      }
      
      // 检查状态未更新的工具
      console.log('\n检查状态未更新的工具:');
      const { data: statusCheck, error: statusCheckError } = await supabase
        .from('tools')
        .select('id, name, status')
        .in('id', 
          duplicateCheck?.map(r => r.tool_id).filter((id, index, arr) => arr.indexOf(id) === index) || []
        );
      
      if (!statusCheckError && statusCheck) {
        const pendingWithReview = statusCheck.filter(tool => 
          tool.status === 'pending' && 
          duplicateCheck?.some(r => r.tool_id === tool.id)
        );
        
        if (pendingWithReview.length > 0) {
          console.log(`${pendingWithReview.length} 个工具有审核结果但状态仍为pending:`);
          pendingWithReview.forEach(tool => {
            console.log(`- ${tool.name}`);
          });
        }
      }
    }
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('检查自动AI审核计数失败:', error);
  }
}

checkAutoReviewCount();
