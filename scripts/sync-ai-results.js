/**
 * 同步AI审核结果到tool_submissions表
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function syncAiResults() {
  try {
    console.log('=== 同步AI审核结果 ===');
    
    // 1. 获取所有未同步的审核结果
    console.log('1. 获取未同步的审核结果...');
    const { data: results, error: resultsError } = await supabase
      .from('ai_review_results')
      .select('*')
      .eq('saved_to_tool_submission', false);
    
    if (resultsError) {
      console.error('获取审核结果失败:', resultsError);
      return;
    }
    
    console.log(`找到 ${results?.length || 0} 个未同步的审核结果`);
    
    if (!results || results.length === 0) {
      console.log('没有需要同步的审核结果');
      return;
    }
    
    // 2. 逐个同步到tool_submissions表
    let successCount = 0;
    let errorCount = 0;
    
    for (const result of results) {
      try {
        console.log(`同步: ${result.tool_name} (${result.tool_id})`);
        
        // 保存到tool_submissions表
        const { error: updateError } = await supabase
          .from('tool_submissions')
          .update({
            ai_review_result: result.review_result,
            ai_review_date: result.created_at
          })
          .eq('id', result.tool_id);
        
        if (updateError) {
          console.error(`同步失败: ${result.tool_name}`, updateError);
          errorCount++;
        } else {
          console.log(`✅ 同步成功: ${result.tool_name}`);
          
          // 标记为已同步
          await supabase
            .from('ai_review_results')
            .update({ saved_to_tool_submission: true })
            .eq('id', result.id);
          
          successCount++;
        }
        
      } catch (error) {
        console.error(`同步异常: ${result.tool_name}`, error);
        errorCount++;
      }
    }
    
    console.log('\n=== 同步完成 ===');
    console.log(`✅ 成功: ${successCount} 个`);
    console.log(`❌ 失败: ${errorCount} 个`);
    console.log(`📊 总计: ${results.length} 个`);
    
    // 3. 验证同步结果
    console.log('\n3. 验证同步结果...');
    const { data: submissions, error: verifyError } = await supabase
      .from('tool_submissions')
      .select('id, name, ai_review_result, ai_review_date')
      .in('id', results.map(r => r.tool_id));
    
    if (verifyError) {
      console.error('验证失败:', verifyError);
    } else {
      console.log(`验证: ${submissions?.length || 0} 个工具现在有AI审核数据`);
      submissions?.forEach(sub => {
        const hasReview = sub.ai_review_result && Object.keys(sub.ai_review_result).length > 0;
        console.log(`- ${sub.name}: ${hasReview ? '✅' : '❌'}`);
      });
    }
    
  } catch (error) {
    console.error('同步失败:', error);
  }
}

syncAiResults();
