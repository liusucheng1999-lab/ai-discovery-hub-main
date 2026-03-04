/**
 * 修复现有工具的AI审核备注
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function fixAiReviewNotes() {
  try {
    console.log('=== 修复现有工具的AI审核备注 ===');
    
    // 1. 查找有AI审核结果但没有备注的工具
    console.log('1. 查找需要修复的工具:');
    const { data: toolsToFix, error: fixError } = await supabase
      .from('tools')
      .select('id, name, ai_review_result, ai_review_notes')
      .not('ai_review_result', 'is', null)
      .is('ai_review_notes', null)
      .limit(50);
    
    if (fixError) {
      console.error('查询需要修复的工具失败:', fixError);
      return;
    }
    
    console.log(`找到 ${toolsToFix?.length || 0} 个需要修复的工具:`);
    
    if (!toolsToFix || toolsToFix.length === 0) {
      console.log('没有需要修复的工具');
      return;
    }
    
    // 2. 逐个修复工具
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < toolsToFix.length; i++) {
      const tool = toolsToFix[i];
      
      try {
        console.log(`\n${i + 1}/${toolsToFix.length}. 修复 ${tool.name}...`);
        
        // 解析AI审核结果
        let aiResult = null;
        try {
          aiResult = typeof tool.ai_review_result === 'string' 
            ? JSON.parse(tool.ai_review_result) 
            : tool.ai_review_result;
        } catch (e) {
          console.log(`   ❌ AI审核结果解析失败，跳过`);
          errorCount++;
          continue;
        }
        
        if (!aiResult) {
          console.log(`   ❌ AI审核结果为空，跳过`);
          errorCount++;
          continue;
        }
        
        // 生成AI审核备注
        const notes = `AI审核建议: ${aiResult.recommendation || 'unknown'}。${aiResult.quality_assessment ? ' 质量评估: ' + aiResult.quality_assessment : ''}${aiResult.optimized_name || aiResult.optimized_tagline || aiResult.optimized_description || aiResult.suggested_tags ? '\n优化建议: 名称、简介、标签等已优化' : ''}`;
        
        console.log(`   生成备注: ${notes.substring(0, 100)}...`);
        
        // 更新工具
        const { error: updateError } = await supabase
          .from('tools')
          .update({
            ai_review_notes: notes
          })
          .eq('id', tool.id);
        
        if (updateError) {
          console.log(`   ❌ 更新失败: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ 修复成功`);
          successCount++;
        }
        
        // 添加延迟避免API限制
        if (i < toolsToFix.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.log(`   ❌ 处理异常: ${error.message}`);
        errorCount++;
      }
    }
    
    // 3. 验证修复结果
    console.log('\n3. 验证修复结果:');
    console.log(`修复完成: 成功 ${successCount} 个，失败 ${errorCount} 个`);
    
    // 检查还有多少工具没有备注
    const { data: remainingTools, error: remainingError } = await supabase
      .from('tools')
      .select('id, name')
      .not('ai_review_result', 'is', null)
      .is('ai_review_notes', null)
      .limit(10);
    
    if (remainingError) {
      console.error('查询剩余工具失败:', remainingError);
    } else {
      console.log(`剩余未修复的工具: ${remainingTools?.length || 0} 个`);
      
      if (remainingTools && remainingTools.length > 0) {
        console.log('剩余工具示例:');
        remainingTools.slice(0, 5).forEach((tool, index) => {
          console.log(`${index + 1}. ${tool.name}`);
        });
        
        if (remainingTools.length >= 10) {
          console.log('... 还有更多');
        }
      }
    }
    
    // 4. 测试几个工具的备注显示
    console.log('\n4. 测试工具备注显示:');
    const { data: testTools, error: testError } = await supabase
      .from('tools')
      .select('name, ai_review_notes')
      .not('ai_review_notes', 'is', null)
      .limit(3);
    
    if (testError) {
      console.error('查询测试工具失败:', testError);
    } else {
      console.log('测试工具备注:');
      testTools?.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   备注: ${tool.ai_review_notes?.substring(0, 100)}...`);
      });
    }
    
    console.log('\n=== 修复完成 ===');
    
  } catch (error) {
    console.error('修复AI审核备注失败:', error);
  }
}

fixAiReviewNotes();
