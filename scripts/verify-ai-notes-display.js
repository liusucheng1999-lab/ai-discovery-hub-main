/**
 * 验证AI审核备注显示
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function verifyAiNotesDisplay() {
  try {
    console.log('=== 验证AI审核备注显示 ===');
    
    // 1. 检查有AI审核备注的工具
    console.log('1. 检查有AI审核备注的工具:');
    const { data: toolsWithNotes, error: notesError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_notes, ai_review_date')
      .not('ai_review_notes', 'is', null)
      .in('status', ['approved', 'active'])
      .order('ai_review_date', { ascending: false })
      .limit(10);
    
    if (notesError) {
      console.error('查询有备注的工具失败:', notesError);
      return;
    }
    
    console.log(`找到 ${toolsWithNotes?.length || 0} 个有AI审核备注的工具:`);
    
    if (toolsWithNotes && toolsWithNotes.length > 0) {
      toolsWithNotes.forEach((tool, index) => {
        console.log(`\n${index + 1}. ${tool.name}`);
        console.log(`   状态: ${tool.status}`);
        console.log(`   审核日期: ${tool.ai_review_date || '无'}`);
        console.log(`   备注长度: ${tool.ai_review_notes?.length || 0} 字符`);
        console.log(`   备注预览: ${tool.ai_review_notes?.substring(0, 100)}...`);
        
        // 检查备注格式
        if (tool.ai_review_notes) {
          const hasRecommendation = tool.ai_review_notes.includes('AI审核建议:');
          const hasQualityAssessment = tool.ai_review_notes.includes('质量评估:');
          const hasOptimization = tool.ai_review_notes.includes('优化建议:');
          
          console.log(`   格式检查:`);
          console.log(`     - AI审核建议: ${hasRecommendation ? '✅' : '❌'}`);
          console.log(`     - 质量评估: ${hasQualityAssessment ? '✅' : '❌'}`);
          console.log(`     - 优化建议: ${hasOptimization ? '✅' : '❌'}`);
        }
      });
    }
    
    // 2. 模拟前端数据转换
    console.log('\n2. 模拟前端数据转换（Index.tsx逻辑）:');
    const { data: homepageTools, error: homepageError } = await supabase
      .from('tools')
      .select('id, name, ai_review_notes')
      .in('status', ['approved', 'active'])
      .limit(3);
    
    if (homepageError) {
      console.error('查询首页工具失败:', homepageError);
    } else {
      console.log('首页工具数据转换:');
      homepageTools?.forEach((tool, index) => {
        // 模拟Index.tsx中的转换逻辑
        const transformedTool = {
          id: tool.id,
          name: tool.name,
          aiReviewNotes: tool.ai_review_notes
        };
        
        console.log(`${index + 1}. ${transformedTool.name}`);
        console.log(`   aiReviewNotes: ${transformedTool.aiReviewNotes ? '有' : '无'}`);
        if (transformedTool.aiReviewNotes) {
          console.log(`   内容: ${transformedTool.aiReviewNotes.substring(0, 80)}...`);
        }
      });
    }
    
    // 3. 模拟工具详情页面数据转换
    console.log('\n3. 模拟工具详情页面数据转换（ToolDetail.tsx逻辑）:');
    const { data: detailTool, error: detailError } = await supabase
      .from('tools')
      .select('id, name, ai_review_notes')
      .not('ai_review_notes', 'is', null)
      .limit(1);
    
    if (detailError) {
      console.error('查询详情工具失败:', detailError);
    } else if (detailTool && detailTool.length > 0) {
      const tool = detailTool[0];
      
      // 模拟ToolDetail.tsx中的转换逻辑
      const formattedTool = {
        id: tool.id,
        name: tool.name,
        aiReviewNotes: tool.ai_review_notes
      };
      
      console.log('详情页面工具数据:');
      console.log(`工具: ${formattedTool.name}`);
      console.log(`aiReviewNotes: ${formattedTool.aiReviewNotes ? '有' : '无'}`);
      
      if (formattedTool.aiReviewNotes) {
        console.log(`备注内容: ${formattedTool.aiReviewNotes}`);
        
        // 模拟前端显示逻辑
        const shouldDisplay = formattedTool.aiReviewNotes && formattedTool.aiReviewNotes.trim().length > 0;
        console.log(`应该显示: ${shouldDisplay ? '✅' : '❌'}`);
        
        if (shouldDisplay) {
          console.log('前端显示内容:');
          console.log('  <div className="text-muted-foreground">AI备注</div>');
          console.log(`  <div className="text-muted-foreground italic">${formattedTool.aiReviewNotes}</div>`);
        }
      }
    }
    
    // 4. 检查备注完整性统计
    console.log('\n4. 备注完整性统计:');
    
    const { data: allTools, error: allError } = await supabase
      .from('tools')
      .select('status, ai_review_result, ai_review_notes');
    
    if (allError) {
      console.error('查询所有工具失败:', allError);
    } else {
      let totalWithAi = 0;
      let withNotes = 0;
      let withoutNotes = 0;
      
      allTools?.forEach(tool => {
        if (tool.ai_review_result) {
          totalWithAi++;
          if (tool.ai_review_notes) {
            withNotes++;
          } else {
            withoutNotes++;
          }
        }
      });
      
      console.log(`有AI审核结果的工具: ${totalWithAi} 个`);
      console.log(`有AI审核备注的工具: ${withNotes} 个`);
      console.log(`没有AI审核备注的工具: ${withoutNotes} 个`);
      
      const completionRate = totalWithAi > 0 ? ((withNotes / totalWithAi) * 100).toFixed(1) : 0;
      console.log(`备注完整率: ${completionRate}%`);
      
      if (withoutNotes === 0) {
        console.log('✅ 所有AI审核工具都有备注！');
      } else {
        console.log(`⚠️ 还有 ${withoutNotes} 个工具需要补充备注`);
      }
    }
    
    // 5. 提供测试建议
    console.log('\n5. 测试建议:');
    console.log('现在可以在以下页面测试AI审核备注显示:');
    console.log('1. 首页 - 查看工具卡片中的AI质量评估');
    console.log('2. 工具详情页 - 查看AI备注部分');
    console.log('3. 管理后台 - 查看AI审核结果');
    
    console.log('\n测试步骤:');
    console.log('1. 访问首页，点击有AI审核的工具');
    console.log('2. 在工具详情页查看"AI备注"部分');
    console.log('3. 确认备注内容完整且格式正确');
    
    console.log('\n=== 验证完成 ===');
    
  } catch (error) {
    console.error('验证AI审核备注显示失败:', error);
  }
}

verifyAiNotesDisplay();
