/**
 * 调试工具插入问题
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function debugToolsInsert() {
  try {
    console.log('=== 调试工具插入问题 ===');
    
    // 1. 检查tools表结构
    console.log('1. 检查tools表结构:');
    const { data: columns, error: columnsError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (columnsError) {
      console.error('查询tools表失败:', columnsError);
      return;
    }
    
    if (columns && columns.length > 0) {
      console.log('tools表字段:', Object.keys(columns[0]));
    } else {
      console.log('tools表为空，无法获取字段信息');
    }
    
    // 2. 检查待审核工具
    console.log('\n2. 检查待审核工具:');
    const { data: submissions, error: submissionsError } = await supabase
      .from('tool_submissions')
      .select('*')
      .eq('status', 'pending')
      .limit(3);
    
    if (submissionsError) {
      console.error('查询待审核工具失败:', submissionsError);
      return;
    }
    
    console.log(`找到 ${submissions?.length || 0} 个待审核工具:`);
    submissions?.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name} (${sub.id})`);
      console.log(`   网站: ${sub.website_url}`);
      console.log(`   分类: ${sub.category}`);
      console.log(`   标签: ${JSON.stringify(sub.tags)}`);
      console.log('');
    });
    
    // 3. 尝试插入一个测试工具
    if (submissions && submissions.length > 0) {
      console.log('3. 尝试插入测试工具:');
      const testTool = submissions[0];
      
      const toolToInsert = {
        name: testTool.name,
        tagline: testTool.tagline,
        description: testTool.tagline,
        website_url: testTool.website_url,
        // logo_url: 'https://example.com/logo.png', // tools表没有这个字段
        category: testTool.category,
        tags: [testTool.category],
        pricing_type: testTool.pricing_type || 'free', // 确保不为空
        is_china_available: testTool.is_china_available,
        is_chinese_supported: false,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        screenshots: [],
        status: 'active',
        created_at: new Date().toISOString(),
        ai_quality_score: 5,
        ai_quality_review: JSON.stringify({
          maturity_score: 5,
          interest_score: 5,
          quality_assessment: '测试审核',
          reasoning: '测试原因',
          confidence: 0.8,
          recommendation: 'approve'
        }),
        ai_review_date: new Date().toISOString(),
        ai_review_notes: '测试审核备注'
      };
      
      console.log('插入数据:', JSON.stringify(toolToInsert, null, 2));
      
      const { data, error } = await supabase
        .from('tools')
        .insert(toolToInsert)
        .select();
      
      if (error) {
        console.error('插入失败:', error);
        console.error('错误详情:', error.details);
        console.error('错误代码:', error.code);
        
        // 尝试简化插入
        console.log('\n尝试简化插入（仅必需字段）:');
        const simpleTool = {
          name: testTool.name,
          tagline: testTool.tagline,
          website_url: testTool.website_url,
          category: testTool.category,
          pricing_type: testTool.pricing_type || 'free', // 添加pricing_type
          status: 'active',
          created_at: new Date().toISOString()
        };
        
        const { data: simpleData, error: simpleError } = await supabase
          .from('tools')
          .insert(simpleTool)
          .select();
        
        if (simpleError) {
          console.error('简化插入也失败:', simpleError);
        } else {
          console.log('简化插入成功:', simpleData);
          
          // 删除测试数据
          await supabase
            .from('tools')
            .delete()
            .eq('id', simpleData[0].id);
          console.log('已删除测试数据');
        }
      } else {
        console.log('插入成功:', data);
        
        // 删除测试数据
        await supabase
          .from('tools')
          .delete()
          .eq('id', data[0].id);
        console.log('已删除测试数据');
      }
    }
    
    // 4. 检查是否有重复的工具
    console.log('\n4. 检查重复工具:');
    const { data: existingTools, error: existingError } = await supabase
      .from('tools')
      .select('name, website_url')
      .limit(5);
    
    if (existingError) {
      console.error('查询现有工具失败:', existingError);
    } else {
      console.log('现有工具:');
      existingTools?.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} - ${tool.website_url}`);
      });
    }
    
  } catch (error) {
    console.error('调试失败:', error);
  }
}

debugToolsInsert();
