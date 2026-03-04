/**
 * 合并 tools 和 tool_submissions 表
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function mergeTables() {
  try {
    console.log('=== 开始合并 tools 和 tool_submissions 表 ===');
    
    // 1. 检查当前表状态
    console.log('1. 检查当前表状态:');
    
    const { data: toolsCount, error: toolsError } = await supabase
      .from('tools')
      .select('id', { count: 'exact' });
    
    const { data: submissionsCount, error: submissionsError } = await supabase
      .from('tool_submissions')
      .select('id', { count: 'exact' });
    
    if (toolsError) {
      console.error('查询tools表失败:', toolsError);
      return;
    }
    
    if (submissionsError) {
      console.error('查询tool_submissions表失败:', submissionsError);
      return;
    }
    
    console.log(`tools表: ${toolsCount?.length || 0} 条记录`);
    console.log(`tool_submissions表: ${submissionsCount?.length || 0} 条记录`);
    
    // 2. 检查tools表是否已有status字段
    console.log('\n2. 检查tools表结构:');
    const { data: sampleTool, error: sampleError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('获取tools表结构失败:', sampleError);
      return;
    }
    
    const hasStatusField = sampleTool && sampleTool.length > 0 && 'status' in sampleTool[0];
    console.log(`tools表已有status字段: ${hasStatusField}`);
    
    if (!hasStatusField) {
      console.log('需要添加status字段，请在Supabase SQL编辑器中执行merge-tables.sql');
      return;
    }
    
    // 3. 检查需要迁移的数据
    console.log('\n3. 检查tool_submissions数据:');
    const { data: submissions, error: fetchError } = await supabase
      .from('tool_submissions')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.error('获取tool_submissions数据失败:', fetchError);
      return;
    }
    
    console.log('tool_submissions示例数据:');
    submissions?.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name} - ${sub.status}`);
    });
    
    // 4. 执行数据迁移
    console.log('\n4. 开始数据迁移...');
    
    // 获取所有待审核的工具
    const { data: allSubmissions, error: allError } = await supabase
      .from('tool_submissions')
      .select('*');
    
    if (allError) {
      console.error('获取所有tool_submissions失败:', allError);
      return;
    }
    
    if (!allSubmissions || allSubmissions.length === 0) {
      console.log('没有需要迁移的数据');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const submission of allSubmissions) {
      try {
        // 检查是否已存在
        const { data: existing, error: existingError } = await supabase
          .from('tools')
          .select('id')
          .eq('website_url', submission.website_url)
          .single();
        
        if (existingError && existingError.code !== 'PGRST116') {
          console.error(`检查重复失败: ${submission.name}`, existingError);
          errorCount++;
          continue;
        }
        
        if (existing) {
          console.log(`跳过重复工具: ${submission.name}`);
          continue;
        }
        
        // 插入到tools表
        const toolData = {
          name: submission.name,
          tagline: submission.tagline,
          description: submission.tagline, // 使用tagline作为description
          website_url: submission.website_url,
          category: submission.category,
          tags: submission.tags || [submission.category],
          pricing_type: submission.pricing_type || 'free',
          is_china_available: submission.is_china_available,
          is_chinese_supported: submission.note?.includes('支持中文: true') || false,
          rating: 0,
          rating_count: 0,
          view_count: 0,
          screenshots: [],
          status: submission.status, // 保持原有状态
          created_at: submission.created_at,
          updated_at: submission.created_at,
          note: submission.note,
          ai_review_result: submission.ai_review_result,
          ai_review_date: submission.ai_review_date
        };
        
        const { error: insertError } = await supabase
          .from('tools')
          .insert(toolData);
        
        if (insertError) {
          console.error(`插入失败: ${submission.name}`, insertError);
          errorCount++;
        } else {
          console.log(`✅ 迁移成功: ${submission.name}`);
          successCount++;
        }
        
      } catch (error) {
        console.error(`迁移异常: ${submission.name}`, error);
        errorCount++;
      }
    }
    
    console.log('\n=== 迁移完成 ===');
    console.log(`✅ 成功: ${successCount} 个`);
    console.log(`❌ 失败: ${errorCount} 个`);
    console.log(`📊 总计: ${allSubmissions.length} 个`);
    
    // 5. 验证迁移结果
    console.log('\n5. 验证迁移结果:');
    const { data: finalTools, error: finalError } = await supabase
      .from('tools')
      .select('status', { count: 'exact' });
    
    if (finalError) {
      console.error('验证失败:', finalError);
    } else {
      const statusCount = {};
      finalTools?.forEach(tool => {
        statusCount[tool.status] = (statusCount[tool.status] || 0) + 1;
      });
      
      console.log('tools表状态分布:');
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`- ${status}: ${count} 个`);
      });
    }
    
    console.log('\n6. 后续步骤:');
    console.log('1. 确认迁移成功后，可以删除tool_submissions表');
    console.log('2. 更新前端代码，使用tools表替代tool_submissions');
    console.log('3. 更新首页查询，只显示status为approved或active的工具');
    
  } catch (error) {
    console.error('合并失败:', error);
  }
}

mergeTables();
