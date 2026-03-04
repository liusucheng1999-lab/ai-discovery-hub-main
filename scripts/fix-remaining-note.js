/**
 * 修复剩余的旧格式备注
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function fixRemainingNote() {
  try {
    console.log('=== 修复剩余的旧格式备注 ===');
    
    // 查找旧格式的备注
    const { data: oldFormatTools, error: oldError } = await supabase
      .from('tools')
      .select('id, name, ai_review_notes')
      .like('ai_review_notes', '%AI审核建议:%')
      .limit(10);
    
    if (oldError) {
      console.error('查询旧格式备注失败:', oldError);
      return;
    }
    
    console.log(`找到 ${oldFormatTools?.length || 0} 个旧格式备注:`);
    
    if (oldFormatTools && oldFormatTools.length > 0) {
      for (const tool of oldFormatTools) {
        console.log(`\n处理: ${tool.name}`);
        console.log(`原备注: ${tool.ai_review_notes?.substring(0, 100)}...`);
        
        // 提取质量评估部分
        const qualityMatch = tool.ai_review_notes?.match(/质量评估: (.+?)(?:\n|$)/);
        const qualityAssessment = qualityMatch ? qualityMatch[1].trim() : '';
        
        if (qualityAssessment) {
          console.log(`提取的质量评估: ${qualityAssessment.substring(0, 100)}...`);
          
          // 更新为纯质量评估
          const { error: updateError } = await supabase
            .from('tools')
            .update({
              ai_review_notes: qualityAssessment
            })
            .eq('id', tool.id);
          
          if (updateError) {
            console.error(`更新失败: ${updateError.message}`);
          } else {
            console.log(`✅ 更新成功`);
          }
        } else {
          console.log('❌ 无法提取质量评估部分');
        }
      }
    }
    
    // 验证结果
    console.log('\n验证修复结果:');
    const { data: remainingOld, error: remainingError } = await supabase
      .from('tools')
      .select('name')
      .like('ai_review_notes', '%AI审核建议:%');
    
    if (remainingError) {
      console.error('查询剩余旧格式失败:', remainingError);
    } else {
      console.log(`剩余旧格式备注: ${remainingOld?.length || 0} 个`);
      
      if ((remainingOld?.length || 0) === 0) {
        console.log('✅ 所有备注都已更新为新格式！');
      } else {
        remainingOld?.forEach(tool => {
          console.log(`- ${tool.name}`);
        });
      }
    }
    
    console.log('\n=== 修复完成 ===');
    
  } catch (error) {
    console.error('修复剩余备注失败:', error);
  }
}

fixRemainingNote();
