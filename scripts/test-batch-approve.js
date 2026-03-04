/**
 * 测试批量通过功能
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function testBatchApprove() {
  try {
    console.log('=== 测试批量通过功能 ===');
    
    // 1. 查找待审核的工具
    console.log('1. 查找待审核工具:');
    const { data: pendingTools, error: pendingError } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'pending')
      .limit(3);
    
    if (pendingError) {
      console.error('查找待审核工具失败:', pendingError);
      return;
    }
    
    if (!pendingTools || pendingTools.length === 0) {
      console.log('没有待审核的工具，创建一个测试工具...');
      
      // 创建一个测试工具
      const testTool = {
        name: '批量审核测试工具',
        tagline: '这是一个用于测试批量审核的工具',
        description: '测试描述',
        website_url: 'https://example.com/test',
        category: 'test',
        tags: ['test'],
        pricing_type: 'free',
        is_china_available: false,
        is_chinese_supported: false,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        screenshots: [],
        status: 'pending',
        created_at: new Date().toISOString(),
        note: '批量审核测试',
        ai_review_result: {
          is_mature: false,
          is_interesting: true,
          maturity_score: 8,
          interest_score: 7,
          quality_assessment: '质量良好',
          is_duplicate: false,
          duplicate_tools: [],
          recommendation: 'approve',
          confidence: 0.85,
          reasoning: '这是一个有用的测试工具',
          optimized_name: '优化后的测试工具',
          optimized_tagline: '优化后的简介',
          optimized_description: '优化后的描述',
          suggested_tags: ['test', 'ai', 'tool']
        },
        ai_review_date: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('tools')
        .insert(testTool)
        .select();
      
      if (insertError) {
        console.error('创建测试工具失败:', insertError);
        return;
      }
      
      console.log('✅ 创建测试工具成功:', insertData[0].name);
      pendingTools.push(insertData[0]);
    }
    
    console.log(`找到 ${pendingTools.length} 个待审核工具:`);
    pendingTools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (${tool.id})`);
    });
    
    // 2. 模拟批量通过
    if (pendingTools.length > 0) {
      console.log('\n2. 模拟批量通过操作:');
      
      const selectedTool = pendingTools[0];
      console.log(`选择工具: ${selectedTool.name}`);
      
      // 模拟批量通过逻辑
      const aiReview = selectedTool.ai_review_result;
      
      // 应用AI优化建议
      const optimizedName = aiReview?.optimized_name && aiReview.optimized_name !== selectedTool.name 
        ? aiReview.optimized_name 
        : selectedTool.name;
      const optimizedTagline = aiReview?.optimized_tagline || selectedTool.tagline;
      const optimizedDescription = aiReview?.optimized_description || selectedTool.tagline;
      const suggestedTags = aiReview?.suggested_tags || [selectedTool.category];
      
      const toolToUpdate = {
        name: optimizedName,
        tagline: optimizedTagline,
        description: optimizedDescription,
        category: selectedTool.category,
        tags: suggestedTags,
        pricing_type: selectedTool.pricing_type || 'free',
        is_china_available: selectedTool.is_china_available,
        is_chinese_supported: selectedTool.note?.includes('支持中文: true') || false,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        screenshots: [],
        status: 'approved', // 更新为已通过
        updated_at: new Date().toISOString(),
        ai_quality_score: aiReview ? ((aiReview.maturity_score || 5) + (aiReview.interest_score || 5)) / 2 : null,
        ai_quality_review: aiReview ? JSON.stringify({
          maturity_score: aiReview.maturity_score || 5,
          interest_score: aiReview.interest_score || 5,
          quality_assessment: aiReview.quality_assessment || 'AI审核中未提供质量评估',
          reasoning: aiReview.reasoning || '',
          confidence: aiReview.confidence || 0,
          recommendation: aiReview.recommendation || 'manual_review',
          original_name: selectedTool.name,
          original_tagline: selectedTool.tagline,
          optimized_name: aiReview?.optimized_name,
          optimized_tagline: aiReview?.optimized_tagline,
          optimized_description: aiReview?.optimized_description,
          suggested_tags: aiReview?.suggested_tags
        }) : null,
        ai_review_date: aiReview ? new Date().toISOString() : null,
        ai_review_notes: aiReview ? `AI审核建议: ${aiReview.recommendation}。${aiReview.quality_assessment ? ' 质量评估: ' + aiReview.quality_assessment : ''}${aiReview.optimized_name ? '\n优化建议: 名称、简介、标签等已优化' : ''}` : null
      };
      
      console.log('更新数据:', {
        name: toolToUpdate.name,
        status: toolToUpdate.status,
        has_ai_review: !!toolToUpdate.ai_quality_review
      });
      
      // 执行更新
      const { data: updateData, error: updateError } = await supabase
        .from('tools')
        .update(toolToUpdate)
        .eq('id', selectedTool.id)
        .select();
      
      if (updateError) {
        console.error('批量通过失败:', updateError);
        console.error('错误详情:', updateError.details);
        console.error('错误代码:', updateError.code);
      } else {
        console.log('✅ 批量通过成功!');
        console.log('更新后的工具:', updateData[0].name);
        console.log('状态:', updateData[0].status);
        console.log('AI审核:', updateData[0].ai_quality_review ? '✅' : '❌');
      }
      
      // 3. 验证结果
      console.log('\n3. 验证批量通过结果:');
      const { data: verifyData, error: verifyError } = await supabase
        .from('tools')
        .select('*')
        .eq('id', selectedTool.id)
        .single();
      
      if (verifyError) {
        console.error('验证失败:', verifyError);
      } else {
        console.log('验证结果:');
        console.log(`- 名称: ${verifyData.name}`);
        console.log(`- 状态: ${verifyData.status}`);
        console.log(`- AI审核分数: ${verifyData.ai_quality_score}`);
        console.log(`- AI审核日期: ${verifyData.ai_review_date}`);
        console.log(`- 标签: ${JSON.stringify(verifyData.tags)}`);
      }
    }
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testBatchApprove();
