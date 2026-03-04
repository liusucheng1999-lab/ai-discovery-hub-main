/**
 * 找出缺失的工具
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function findMissing() {
  try {
    // 获取已通过的工具提交
    const { data: approvedSubmissions, error: subError } = await supabase
      .from('tool_submissions')
      .select('name, id, website_url, category, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (subError) {
      console.error('查询已通过工具失败:', subError);
      return;
    }
    
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
    
    // 找出缺失的工具
    const missingTools = approvedSubmissions?.filter(sub => !existingToolNames.has(sub.name)) || [];
    
    console.log(`=== 缺失的工具 (${missingTools.length}个) ===`);
    missingTools.forEach(tool => {
      console.log(`❌ ${tool.name} (${tool.id})`);
      console.log(`   网址: ${tool.website_url}`);
      console.log(`   分类: ${tool.category}`);
      console.log(`   创建时间: ${tool.created_at}`);
      console.log('');
    });
    
    // 如果有缺失的工具，尝试插入
    if (missingTools.length > 0) {
      console.log('=== 尝试插入缺失的工具 ===');
      
      for (const tool of missingTools) {
        console.log(`正在插入: ${tool.name}`);
        
        const toolToInsert = {
          name: tool.name,
          tagline: tool.tagline,
          description: tool.tagline,
          website_url: tool.website_url,
          category: tool.category,
          tags: [tool.category],
          pricing_type: tool.pricing_type,
          is_china_available: tool.is_china_available,
          is_chinese_supported: tool.note?.includes('支持中文: true') || false,
          rating: 0,
          rating_count: 0,
          view_count: 0,
          screenshots: [],
          status: 'active',
          created_at: new Date().toISOString()
        };
        
        try {
          const { data, error } = await supabase
            .from('tools')
            .insert(toolToInsert)
            .select();
          
          if (error) {
            console.error(`❌ 插入 ${tool.name} 失败:`, error);
          } else {
            console.log(`✅ 插入 ${tool.name} 成功`);
          }
        } catch (err) {
          console.error(`❌ 插入 ${tool.name} 异常:`, err);
        }
      }
    }
    
  } catch (error) {
    console.error('查找失败:', error);
  }
}

findMissing();
