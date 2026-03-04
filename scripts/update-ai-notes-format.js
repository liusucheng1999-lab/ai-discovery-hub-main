/**
 * 更新AI备注格式，只保留质量评估字段
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function updateAiNotesFormat() {
  try {
    console.log('=== 更新AI备注格式，只保留质量评估字段 ===');
    
    // 1. 查找有AI审核备注的工具
    console.log('1. 查找需要更新的工具:');
    const { data: toolsWithNotes, error: notesError } = await supabase
      .from('tools')
      .select('id, name, ai_review_result, ai_review_notes')
      .not('ai_review_notes', 'is', null)
      .limit(50);
    
    if (notesError) {
      console.error('查询有备注的工具失败:', notesError);
      return;
    }
    
    console.log(`找到 ${toolsWithNotes?.length || 0} 个需要更新的工具:`);
    
    if (!toolsWithNotes || toolsWithNotes.length === 0) {
      console.log('没有需要更新的工具');
      return;
    }
    
    // 2. 逐个更新工具
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < toolsWithNotes.length; i++) {
      const tool = toolsWithNotes[i];
      
      try {
        console.log(`\n${i + 1}/${toolsWithNotes.length}. 更新 ${tool.name}...`);
        
        // 解析AI审核结果
        let aiResult = null;
        try {
          aiResult = typeof tool.ai_review_result === 'string' 
            ? JSON.parse(tool.ai_review_result) 
            : tool.ai_review_result;
        } catch (e) {
          console.log(`   ❌ AI审核结果解析失败，跳过`);
          skippedCount++;
          continue;
        }
        
        if (!aiResult) {
          console.log(`   ❌ AI审核结果为空，跳过`);
          skippedCount++;
          continue;
        }
        
        // 获取质量评估字段
        const qualityAssessment = aiResult.quality_assessment || '';
        
        if (!qualityAssessment) {
          console.log(`   ❌ 质量评估字段为空，跳过`);
          skippedCount++;
          continue;
        }
        
        console.log(`   原备注: ${tool.ai_review_notes?.substring(0, 100)}...`);
        console.log(`   新备注: ${qualityAssessment.substring(0, 100)}...`);
        
        // 检查是否需要更新
        if (tool.ai_review_notes === qualityAssessment) {
          console.log(`   ✅ 已经是正确格式，跳过`);
          skippedCount++;
          continue;
        }
        
        // 更新工具
        const { error: updateError } = await supabase
          .from('tools')
          .update({
            ai_review_notes: qualityAssessment
          })
          .eq('id', tool.id);
        
        if (updateError) {
          console.log(`   ❌ 更新失败: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ 更新成功`);
          successCount++;
        }
        
        // 添加延迟避免API限制
        if (i < toolsWithNotes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.log(`   ❌ 处理异常: ${error.message}`);
        errorCount++;
      }
    }
    
    // 3. 验证更新结果
    console.log('\n3. 验证更新结果:');
    console.log(`更新完成: 成功 ${successCount} 个，失败 ${errorCount} 个，跳过 ${skippedCount} 个`);
    
    // 检查更新后的备注格式
    const { data: sampleTools, error: sampleError } = await supabase
      .from('tools')
      .select('name, ai_review_notes')
      .not('ai_review_notes', 'is', null)
      .limit(5);
    
    if (sampleError) {
      console.error('查询示例工具失败:', sampleError);
    } else {
      console.log('\n更新后的备注示例:');
      sampleTools?.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   备注: ${tool.ai_review_notes?.substring(0, 150)}...`);
        
        // 检查格式
        const hasOldFormat = tool.ai_review_notes?.includes('AI审核建议:') || 
                           tool.ai_review_notes?.includes('优化建议:');
        
        console.log(`   格式: ${hasOldFormat ? '❌ 旧格式' : '✅ 新格式'}`);
      });
    }
    
    // 4. 统计格式正确性
    console.log('\n4. 统计格式正确性:');
    const { data: allTools, error: allError } = await supabase
      .from('tools')
      .select('ai_review_notes')
      .not('ai_review_notes', 'is', null);
    
    if (allError) {
      console.error('查询所有工具失败:', allError);
    } else {
      let correctFormat = 0;
      let oldFormat = 0;
      
      allTools?.forEach(tool => {
        if (tool.ai_review_notes) {
          if (tool.ai_review_notes.includes('AI审核建议:') || 
              tool.ai_review_notes.includes('优化建议:')) {
            oldFormat++;
          } else {
            correctFormat++;
          }
        }
      });
      
      console.log(`新格式备注: ${correctFormat} 个`);
      console.log(`旧格式备注: ${oldFormat} 个`);
      
      if (oldFormat === 0) {
        console.log('✅ 所有备注都已更新为新格式！');
      } else {
        console.log(`⚠️ 还有 ${oldFormat} 个备注需要更新`);
      }
    }
    
    console.log('\n=== 更新完成 ===');
    
  } catch (error) {
    console.error('更新AI备注格式失败:', error);
  }
}

updateAiNotesFormat();
