/**
 * 最终验证AI备注格式
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function finalVerifyNotes() {
  try {
    console.log('=== 最终验证AI备注格式 ===');
    
    // 1. 检查所有备注格式
    console.log('1. 检查所有备注格式:');
    const { data: allNotes, error: allError } = await supabase
      .from('tools')
      .select('name, ai_review_notes')
      .not('ai_review_notes', 'is', null)
      .order('ai_review_date', { ascending: false })
      .limit(10);
    
    if (allError) {
      console.error('查询所有备注失败:', allError);
      return;
    }
    
    console.log(`找到 ${allNotes?.length || 0} 个有备注的工具:`);
    
    let correctFormat = 0;
    let oldFormat = 0;
    
    allNotes?.forEach((tool, index) => {
      console.log(`\n${index + 1}. ${tool.name}`);
      console.log(`   备注预览: ${tool.ai_review_notes?.substring(0, 100)}...`);
      
      // 检查格式
      const hasOldFormat = tool.ai_review_notes?.includes('AI审核建议:') || 
                         tool.ai_review_notes?.includes('优化建议:') ||
                         tool.ai_review_notes?.includes('质量评估:');
      
      if (hasOldFormat) {
        console.log(`   格式: ❌ 旧格式（包含标签）`);
        oldFormat++;
      } else {
        console.log(`   格式: ✅ 新格式（纯质量评估）`);
        correctFormat++;
      }
    });
    
    console.log('\n格式统计:');
    console.log(`新格式备注: ${correctFormat} 个`);
    console.log(`旧格式备注: ${oldFormat} 个`);
    
    // 2. 检查备注内容质量
    console.log('\n2. 检查备注内容质量:');
    const { data: qualityCheck, error: qualityError } = await supabase
      .from('tools')
      .select('name, ai_review_notes')
      .not('ai_review_notes', 'is', null)
      .limit(5);
    
    if (qualityError) {
      console.error('查询质量检查失败:', qualityError);
    } else {
      console.log('备注内容质量检查:');
      qualityCheck?.forEach((tool, index) => {
        const note = tool.ai_review_notes || '';
        const length = note.length;
        const hasContent = length > 50; // 至少50个字符
        
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   长度: ${length} 字符`);
        console.log(`   内容质量: ${hasContent ? '✅ 充实' : '❌ 过短'}`);
        console.log(`   示例: ${note.substring(0, 80)}...`);
      });
    }
    
    // 3. 模拟前端显示
    console.log('\n3. 模拟前端显示效果:');
    const { data: displayTest, error: displayError } = await supabase
      .from('tools')
      .select('name, ai_review_notes')
      .not('ai_review_notes', 'is', null)
      .limit(3);
    
    if (displayError) {
      console.error('查询显示测试失败:', displayError);
    } else {
      console.log('前端显示效果:');
      displayTest?.forEach((tool, index) => {
        console.log(`\n${index + 1}. ${tool.name}`);
        console.log('   前端显示:');
        console.log('   ┌─────────────────────────────────');
        console.log('   │ AI备注');
        console.log(`   │ ${tool.ai_review_notes?.substring(0, 60)}...`);
        console.log('   └─────────────────────────────────');
      });
    }
    
    // 4. 总结
    console.log('\n4. 总结:');
    
    const { data: summaryData, error: summaryError } = await supabase
      .from('tools')
      .select('ai_review_result, ai_review_notes');
    
    if (summaryError) {
      console.error('查询总结数据失败:', summaryError);
    } else {
      let totalWithAi = 0;
      let withNotes = 0;
      let withCorrectFormat = 0;
      
      summaryData?.forEach(tool => {
        if (tool.ai_review_result) {
          totalWithAi++;
          if (tool.ai_review_notes) {
            withNotes++;
            
            if (!tool.ai_review_notes.includes('AI审核建议:') && 
                !tool.ai_review_notes.includes('优化建议:')) {
              withCorrectFormat++;
            }
          }
        }
      });
      
      console.log(`有AI审核结果的工具: ${totalWithAi} 个`);
      console.log(`有AI审核备注的工具: ${withNotes} 个`);
      console.log(`格式正确的备注: ${withCorrectFormat} 个`);
      
      const noteRate = totalWithAi > 0 ? ((withNotes / totalWithAi) * 100).toFixed(1) : 0;
      const formatRate = withNotes > 0 ? ((withCorrectFormat / withNotes) * 100).toFixed(1) : 0;
      
      console.log(`备注覆盖率: ${noteRate}%`);
      console.log(`格式正确率: ${formatRate}%`);
      
      if (withCorrectFormat === withNotes && withNotes === totalWithAi) {
        console.log('🎉 完美！所有AI审核备注都已正确格式化！');
      } else {
        console.log('⚠️ 还有一些问题需要解决');
      }
    }
    
    console.log('\n=== 最终验证完成 ===');
    
  } catch (error) {
    console.error('最终验证失败:', error);
  }
}

finalVerifyNotes();
