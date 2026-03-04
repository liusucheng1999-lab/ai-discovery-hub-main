/**
 * 简单的表合并方案 - 逐条迁移避免复杂SQL
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function simpleMerge() {
  try {
    console.log('=== 简单表合并方案 ===');
    
    // 1. 检查字段
    console.log('1. 检查tools表字段...');
    const { data: sampleTool, error: toolError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (toolError) {
      console.error('无法访问tools表:', toolError);
      return;
    }
    
    const fields = sampleTool && sampleTool.length > 0 ? Object.keys(sampleTool[0]) : [];
    console.log('tools表现有字段:', fields);
    
    const requiredFields = ['ai_review_result', 'note', 'status'];
    const missingFields = requiredFields.filter(field => !fields.includes(field));
    
    if (missingFields.length > 0) {
      console.log('❌ 缺失字段:', missingFields);
      console.log('\n请先在Supabase SQL编辑器中执行以下简单SQL:');
      console.log('-- 逐个添加字段，避免复杂语法');
      missingFields.forEach(field => {
        switch (field) {
          case 'ai_review_result':
            console.log('ALTER TABLE tools ADD COLUMN ai_review_result JSONB;');
            break;
          case 'note':
            console.log('ALTER TABLE tools ADD COLUMN note TEXT;');
            break;
          case 'status':
            console.log('ALTER TABLE tools ADD COLUMN status TEXT DEFAULT \'active\';');
            break;
        }
      });
      console.log('\n执行完成后重新运行此脚本');
      return;
    }
    
    console.log('✅ 所有必需字段都存在');
    
    // 2. 获取待迁移数据
    console.log('\n2. 获取待迁移数据...');
    const { data: submissions, error: fetchError } = await supabase
      .from('tool_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('获取tool_submissions失败:', fetchError);
      return;
    }
    
    if (!submissions || submissions.length === 0) {
      console.log('没有需要迁移的数据');
      return;
    }
    
    console.log(`找到 ${submissions.length} 条待迁移数据`);
    
    // 3. 逐条迁移
    console.log('\n3. 开始逐条迁移...');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      
      try {
        // 检查重复
        const { data: existing, error: existingError } = await supabase
          .from('tools')
          .select('id')
          .eq('website_url', submission.website_url)
          .eq('name', submission.name)
          .single();
        
        if (existingError && existingError.code !== 'PGRST116') {
          console.error(`检查重复失败: ${submission.name}`, existingError.message);
          errorCount++;
          continue;
        }
        
        if (existing) {
          console.log(`⏭️ 跳过重复: ${submission.name}`);
          skipCount++;
          continue;
        }
        
        // 准备数据 - 简化处理
        const toolData = {
          name: submission.name || '',
          tagline: submission.tagline || '',
          description: submission.tagline || '', // 使用tagline作为description
          website_url: submission.website_url || '',
          category: submission.category || 'other',
          tags: (submission.tags && submission.tags.length > 0) ? submission.tags : [submission.category || 'other'],
          pricing_type: submission.pricing_type || 'free',
          is_china_available: submission.is_china_available || false,
          is_chinese_supported: false,
          rating: 0,
          rating_count: 0,
          view_count: 0,
          screenshots: [],
          status: submission.status || 'pending',
          created_at: submission.created_at || new Date().toISOString(),
          updated_at: submission.created_at || new Date().toISOString(),
          note: submission.note || null,
          ai_review_result: submission.ai_review_result || null,
          ai_review_date: submission.ai_review_date || null
        };
        
        // 插入数据
        const { error: insertError } = await supabase
          .from('tools')
          .insert(toolData);
        
        if (insertError) {
          console.error(`❌ 插入失败 [${i+1}/${submissions.length}]: ${submission.name}`, insertError.message);
          
          // 如果是字段错误，显示详细信息
          if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
            console.error('字段错误详情:', insertError.message);
            console.log('可能需要添加缺失字段，请检查SQL执行结果');
          }
          
          errorCount++;
        } else {
          successCount++;
          if (successCount % 10 === 0) {
            console.log(`✅ 进度: ${successCount}/${submissions.length} (${Math.round(successCount/submissions.length*100)}%)`);
          }
        }
        
      } catch (error) {
        console.error(`❌ 迁移异常: ${submission.name}`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n=== 迁移完成 ===');
    console.log(`✅ 成功: ${successCount} 条`);
    console.log(`⏭️ 跳过: ${skipCount} 条`);
    console.log(`❌ 失败: ${errorCount} 条`);
    console.log(`📊 总计: ${submissions.length} 条`);
    
    // 4. 验证结果
    console.log('\n4. 验证迁移结果...');
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
    
    // 5. 建议
    console.log('\n5. 后续建议:');
    if (errorCount === 0) {
      console.log('🎉 迁移完全成功！');
      console.log('建议步骤:');
      console.log('1. 测试前端功能是否正常');
      console.log('2. 确认无误后可删除tool_submissions表');
      console.log('3. 更新前端代码使用统一tools表');
    } else {
      console.log('⚠️ 部分迁移失败');
      console.log('建议:');
      console.log('1. 检查失败原因');
      console.log('2. 修复问题后重新运行');
      console.log('3. 成功的工具已正常迁移');
    }
    
  } catch (error) {
    console.error('简单迁移失败:', error);
  }
}

// 执行简单迁移
simpleMerge();
