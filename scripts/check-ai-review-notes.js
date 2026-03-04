/**
 * 检查AI审核备注的显示问题
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkAiReviewNotes() {
  try {
    console.log('=== 检查AI审核备注显示问题 ===');
    
    // 1. 检查有AI审核结果但可能没有备注的工具
    console.log('1. 检查有AI审核结果但可能没有备注的工具:');
    const { data: toolsWithAi, error: aiError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result, ai_review_notes, ai_review_date')
      .not('ai_review_result', 'is', null)
      .in('status', ['approved', 'active'])
      .limit(10);
    
    if (aiError) {
      console.error('查询有AI审核的工具失败:', aiError);
      return;
    }
    
    console.log(`找到 ${toolsWithAi?.length || 0} 个有AI审核结果的工具:`);
    
    if (toolsWithAi && toolsWithAi.length > 0) {
      toolsWithAi.forEach((tool, index) => {
        console.log(`\n${index + 1}. ${tool.name}`);
        console.log(`   状态: ${tool.status}`);
        console.log(`   AI审核结果: ${tool.ai_review_result ? '有' : '无'}`);
        console.log(`   AI审核备注: ${tool.ai_review_notes ? '有' : '无'}`);
        console.log(`   AI审核日期: ${tool.ai_review_date || '无'}`);
        
        if (tool.ai_review_result) {
          try {
            const aiResult = typeof tool.ai_review_result === 'string' 
              ? JSON.parse(tool.ai_review_result) 
              : tool.ai_review_result;
            
            console.log(`   AI建议: ${aiResult?.recommendation || '未知'}`);
            console.log(`   质量评估: ${aiResult?.quality_assessment || '无'}`);
            console.log(`   优化建议: ${aiResult?.optimized_name ? '有' : '无'}`);
            
            // 检查备注是否应该存在但实际不存在
            const shouldHaveNotes = aiResult?.recommendation || aiResult?.quality_assessment || aiResult?.optimized_name;
            if (shouldHaveNotes && !tool.ai_review_notes) {
              console.log(`   ⚠️ 应该有备注但实际没有！`);
            } else if (tool.ai_review_notes) {
              console.log(`   ✅ 备注内容: ${tool.ai_review_notes.substring(0, 100)}...`);
            }
          } catch (e) {
            console.log(`   ❌ AI审核结果解析失败`);
          }
        }
      });
    }
    
    // 2. 检查最近审核通过的工具
    console.log('\n2. 检查最近审核通过的工具:');
    const { data: recentApproved, error: recentError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result, ai_review_notes, ai_review_date')
      .eq('status', 'approved')
      .order('ai_review_date', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('查询最近审核通过的工具失败:', recentError);
    } else {
      console.log(`最近审核通过的工具: ${recentApproved?.length || 0} 个`);
      
      recentApproved?.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   AI审核备注: ${tool.ai_review_notes ? '有' : '无'}`);
        console.log(`   审核日期: ${tool.ai_review_date || '无'}`);
        
        if (!tool.ai_review_notes && tool.ai_review_result) {
          console.log(`   ⚠️ 有AI审核结果但没有备注！`);
        }
      });
    }
    
    // 3. 检查批量审核结果表
    console.log('\n3. 检查批量审核结果表:');
    const { data: batchResults, error: batchError } = await supabase
      .from('ai_review_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (batchError) {
      console.error('查询批量审核结果失败:', batchError);
    } else {
      console.log(`批量审核结果: ${batchResults?.length || 0} 条`);
      
      batchResults?.forEach((result, index) => {
        console.log(`${index + 1}. ${result.tool_name}`);
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
    }
    
    // 4. 分析问题原因
    console.log('\n4. 分析问题原因:');
    
    let missingNotesCount = 0;
    let hasNotesCount = 0;
    
    if (toolsWithAi) {
      toolsWithAi.forEach(tool => {
        if (tool.ai_review_result && !tool.ai_review_notes) {
          missingNotesCount++;
        } else if (tool.ai_review_notes) {
          hasNotesCount++;
        }
      });
    }
    
    console.log(`有AI审核结果但无备注的工具: ${missingNotesCount} 个`);
    console.log(`有AI审核备注的工具: ${hasNotesCount} 个`);
    
    if (missingNotesCount > 0) {
      console.log('\n⚠️ 发现问题：有AI审核结果但没有备注的工具');
      console.log('\n可能的原因:');
      console.log('1. 批量审核时没有生成备注');
      console.log('2. 备注字段没有正确保存');
      console.log('3. 前端显示逻辑有问题');
      
      console.log('\n修复建议:');
      console.log('1. 检查批量审核服务是否正确生成备注');
      console.log('2. 更新现有工具的备注字段');
      console.log('3. 验证前端显示逻辑');
    } else {
      console.log('✅ 所有工具都有AI审核备注');
    }
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('检查AI审核备注失败:', error);
  }
}

checkAiReviewNotes();
