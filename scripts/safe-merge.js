/**
 * 安全的表合并脚本
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function safeMerge() {
  try {
    console.log('=== 安全表合并操作 ===');
    
    // 1. 检查当前状态
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
    
    // 2. 检查tools表字段
    console.log('\n2. 检查tools表字段:');
    const { data: sampleTool, error: sampleError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('获取tools表结构失败:', sampleError);
      return;
    }
    
    const fields = sampleTool && sampleTool.length > 0 ? Object.keys(sampleTool[0]) : [];
    console.log('tools表现有字段:', fields);
    
    const requiredFields = ['status', 'ai_review_result', 'note'];
    const missingFields = requiredFields.filter(field => !fields.includes(field));
    
    if (missingFields.length > 0) {
      console.log('❌ 缺失字段:', missingFields);
      console.log('\n请先在Supabase SQL编辑器中执行以下SQL:');
      console.log('-- 添加缺失字段');
      missingFields.forEach(field => {
        switch (field) {
          case 'status':
            console.log('ALTER TABLE tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT \'active\';');
            break;
          case 'ai_review_result':
            console.log('ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;');
            break;
          case 'note':
            console.log('ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;');
            break;
        }
      });
      return;
    }
    
    console.log('✅ 所有必需字段都存在');
    
    // 3. 获取待迁移的数据
    console.log('\n3. 获取待迁移数据:');
    const { data: submissions, error: fetchError } = await supabase
      .from('tool_submissions')
      .select('*');
    
    if (fetchError) {
      console.error('获取tool_submissions数据失败:', fetchError);
      return;
    }
    
    if (!submissions || submissions.length === 0) {
      console.log('没有需要迁移的数据');
      return;
    }
    
    console.log(`找到 ${submissions.length} 条待迁移数据`);
    
    // 4. 逐条迁移数据
    console.log('\n4. 开始迁移数据:');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const submission of submissions) {
      try {
        // 检查是否已存在
        const { data: existing, error: existingError } = await supabase
          .from('tools')
          .select('id')
          .eq('website_url', submission.website_url)
          .eq('name', submission.name)
          .single();
        
        if (existingError && existingError.code !== 'PGRST116') {
          console.error(`检查重复失败: ${submission.name}`, existingError);
          errorCount++;
          continue;
        }
        
        if (existing) {
          console.log(`⏭️ 跳过重复: ${submission.name}`);
          skipCount++;
          continue;
        }
        
        // 准备插入数据
        const toolData = {
          name: submission.name,
          tagline: submission.tagline,
          description: submission.tagline, // 使用tagline作为description
          website_url: submission.website_url,
          category: submission.category,
          tags: submission.tags && submission.tags.length > 0 ? submission.tags : [submission.category],
          pricing_type: submission.pricing_type || 'free',
          is_china_available: submission.is_china_available,
          is_chinese_supported: false,
          rating: 0,
          rating_count: 0,
          view_count: 0,
          screenshots: [],
          status: submission.status || 'pending',
          created_at: submission.created_at,
          updated_at: submission.created_at,
          note: submission.note,
          ai_review_result: submission.ai_review_result,
          ai_review_date: submission.ai_review_date
        };
        
        // 插入数据
        const { error: insertError } = await supabase
          .from('tools')
          .insert(toolData);
        
        if (insertError) {
          console.error(`❌ 插入失败: ${submission.name}`, insertError.message);
          errorCount++;
        } else {
          console.log(`✅ 迁移成功: ${submission.name}`);
          successCount++;
        }
        
      } catch (error) {
        console.error(`❌ 迁移异常: ${submission.name}`, error);
        errorCount++;
      }
    }
    
    console.log('\n=== 迁移完成 ===');
    console.log(`✅ 成功: ${successCount} 个`);
    console.log(`⏭️ 跳过: ${skipCount} 个`);
    console.log(`❌ 失败: ${errorCount} 个`);
    console.log(`📊 总计: ${submissions.length} 个`);
    
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
    
    console.log('\n6. 后续建议:');
    if (successCount > 0 && errorCount === 0) {
      console.log('✅ 迁移完全成功！');
      console.log('建议：');
      console.log('1. 测试前端功能是否正常');
      console.log('2. 确认无误后可以删除tool_submissions表');
      console.log('3. 更新前端代码使用统一的tools表');
    } else if (errorCount > 0) {
      console.log('⚠️ 部分迁移失败，请检查错误日志');
      console.log('建议：');
      console.log('1. 修复失败的记录');
      console.log('2. 重新运行迁移脚本');
    }
    
  } catch (error) {
    console.error('迁移失败:', error);
  }
}

safeMerge();
