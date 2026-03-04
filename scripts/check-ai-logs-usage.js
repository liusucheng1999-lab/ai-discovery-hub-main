/**
 * 检查AI审核日志功能的使用情况
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkAiLogsUsage() {
  try {
    console.log('=== 检查AI审核日志功能使用情况 ===');
    
    // 1. 检查ai_review_logs表
    console.log('1. 检查ai_review_logs表:');
    const { data: logsData, error: logsError } = await supabase
      .from('ai_review_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (logsError) {
      if (logsError.code === 'PGRST205') {
        console.log('❌ ai_review_logs表不存在');
      } else {
        console.error('查询ai_review_logs失败:', logsError);
      }
    } else {
      console.log(`✅ ai_review_logs表存在，有 ${logsData?.length || 0} 条记录`);
      if (logsData && logsData.length > 0) {
        logsData.forEach((log, index) => {
          console.log(`${index + 1}. ${log.id} - ${log.status} - ${log.created_at}`);
        });
      }
    }
    
    // 2. 检查batch_review_tasks表（新的批量审核系统）
    console.log('\n2. 检查batch_review_tasks表:');
    const { data: batchData, error: batchError } = await supabase
      .from('batch_review_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (batchError) {
      console.error('查询batch_review_tasks失败:', batchError);
    } else {
      console.log(`✅ batch_review_tasks表存在，有 ${batchData?.length || 0} 条记录`);
      if (batchData && batchData.length > 0) {
        batchData.forEach((task, index) => {
          console.log(`${index + 1}. ${task.id} - ${task.status} - ${task.created_at}`);
        });
      }
    }
    
    // 3. 检查ai_review_results表
    console.log('\n3. 检查ai_review_results表:');
    const { data: resultsData, error: resultsError } = await supabase
      .from('ai_review_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (resultsError) {
      console.error('查询ai_review_results失败:', resultsError);
    } else {
      console.log(`✅ ai_review_results表存在，有 ${resultsData?.length || 0} 条记录`);
      if (resultsData && resultsData.length > 0) {
        resultsData.forEach((result, index) => {
          console.log(`${index + 1}. ${result.tool_id} - ${result.status || 'undefined'} - ${result.created_at}`);
        });
      }
    }
    
    // 4. 分析功能重叠
    console.log('\n4. 功能重叠分析:');
    console.log('旧系统: ai_review_logs表 + auto_ai_review_service');
    console.log('新系统: batch_review_tasks表 + batch_review_service');
    
    if (logsData && logsData.length > 0) {
      console.log('⚠️ 发现旧系统数据，可能需要迁移');
    }
    
    if (batchData && batchData.length > 0) {
      console.log('✅ 新系统正在使用');
    }
    
    // 5. 建议删除方案
    console.log('\n5. 建议删除方案:');
    console.log('可以安全删除的功能:');
    console.log('- AI审核日志标签页（activeTab === "logs"）');
    console.log('- ai_review_logs表相关代码');
    console.log('- auto_ai_review服务相关代码');
    console.log('- 审核日志相关的状态管理和UI');
    
    console.log('\n需要保留的功能:');
    console.log('- 批量审核任务管理（batch_review_tasks）');
    console.log('- AI审核结果记录（ai_review_results）');
    console.log('- 批量审核服务（batch_review_service）');
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('检查AI审核日志使用情况失败:', error);
  }
}

checkAiLogsUsage();
