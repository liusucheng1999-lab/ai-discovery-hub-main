/**
 * 调试插入问题
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function debugInsert() {
  try {
    console.log('=== 检查已通过但未在tools表中的工具 ===');
    
    // 获取已通过的工具提交
    const { data: approvedSubmissions, error: subError } = await supabase
      .from('tool_submissions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (subError) {
      console.error('查询已通过工具失败:', subError);
      return;
    }
    
    console.log(`已通过的工具数量: ${approvedSubmissions?.length || 0}`);
    
    // 获取tools表中的工具
    const { data: existingTools, error: toolError } = await supabase
      .from('tools')
      .select('name, created_at')
      .order('created_at', { ascending: false });
    
    if (toolError) {
      console.error('查询tools表失败:', toolError);
      return;
    }
    
    const existingToolNames = new Set(existingTools?.map(t => t.name) || []);
    
    // 找出已通过但不在tools表中的工具
    const missingTools = approvedSubmissions?.filter(sub => !existingToolNames.has(sub.name)) || [];
    
    console.log(`\n缺失的工具数量: ${missingTools.length}`);
    missingTools.forEach(tool => {
      console.log(`- ${tool.name} (${tool.id})`);
      console.log(`  网址: ${tool.website_url}`);
      console.log(`  分类: ${tool.category}`);
      console.log(`  通过时间: ${tool.updated_at || tool.created_at}`);
      console.log('');
    });
    
    // 尝试手动插入一个工具测试
    if (missingTools.length > 0) {
      console.log('=== 尝试手动插入第一个工具 ===');
      const testTool = missingTools[0];
      
      const testData = {
        name: testTool.name,
        tagline: testTool.tagline,
        description: testTool.tagline,
        website_url: testTool.website_url,
        category: testTool.category,
        tags: [testTool.category],
        pricing_type: testTool.pricing_type,
        is_china_available: testTool.is_china_available,
        is_chinese_supported: testTool.note?.includes('支持中文: true') || false,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        screenshots: [],
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      console.log('插入数据:', testData);
      
      const { data, error } = await supabase
        .from('tools')
        .insert(testData)
        .select();
      
      if (error) {
        console.error('插入失败:', error);
        console.error('错误详情:', error.details);
        console.error('错误代码:', error.code);
      } else {
        console.log('插入成功:', data);
      }
    }
    
  } catch (error) {
    console.error('调试失败:', error);
  }
}

debugInsert();
