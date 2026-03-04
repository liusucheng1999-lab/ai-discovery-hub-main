/**
 * 无SQL复杂度的表合并方案
 * 完全使用JavaScript API，避免SQL语法错误
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function noSqlMerge() {
  try {
    console.log('=== 无SQL复杂度表合并 ===');
    
    // 1. 检查当前状态
    console.log('1. 检查表状态...');
    
    const { data: toolsCount, error: toolsError } = await supabase
      .from('tools')
      .select('id', { count: 'exact' });
    
    const { data: submissionsCount, error: submissionsError } = await supabase
      .from('tool_submissions')
      .select('id', { count: 'exact' });
    
    if (toolsError || submissionsError) {
      console.error('无法访问表:', { toolsError, submissionsError });
      return;
    }
    
    console.log(`tools表: ${toolsCount?.length || 0} 条记录`);
    console.log(`tool_submissions表: ${submissionsCount?.length || 0} 条记录`);
    
    // 2. 检查字段
    console.log('\n2. 检查tools表字段...');
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
    
    // 3. 检查缺失字段并提示
    const requiredFields = ['ai_review_result', 'note', 'status'];
    const missingFields = requiredFields.filter(field => !fields.includes(field));
    
    if (missingFields.length > 0) {
      console.log('❌ 缺失字段:', missingFields);
      console.log('\n请在Supabase SQL编辑器中逐个执行以下SQL:');
      console.log('-- 每次只执行一个语句，避免语法错误');
      
      missingFields.forEach((field, index) => {
        console.log(`\n${index + 1}. 添加${field}字段:`);
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
        console.log('-- 执行后请检查是否成功，然后再执行下一个');
      });
      
      console.log('\n所有字段添加完成后，重新运行此脚本');
      return;
    }
    
    console.log('✅ 所有必需字段都存在');
    
    // 4. 获取待迁移数据
    console.log('\n3. 获取待迁移数据...');
    const { data: submissions, error: fetchError } = await supabase
      .from('tool_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('获取tool_submissions数据失败:', fetchError);
      return;
    }
    
    if (!submissions || submissions.length === 0) {
      console.log('没有需要迁移的数据');
      return;
    }
    
    console.log(`找到 ${submissions.length} 条待迁移数据`);
    
    // 5. 逐条安全迁移
    console.log('\n4. 开始安全迁移...');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      
      try {
        console.log(`\n处理 [${i + 1}/${submissions.length}]: ${submission.name}`);
        
        // 检查重复
        console.log('  检查重复...');
        const { data: existing, error: existingError } = await supabase
          .from('tools')
          .select('id, name')
          .eq('website_url', submission.website_url)
          .limit(1);
        
        if (existingError) {
          console.error('  检查重复失败:', existingError.message);
          errorCount++;
          continue;
        }
        
        if (existing && existing.length > 0) {
          console.log(`  ⏭️ 跳过重复: ${existing[0].name}`);
          skipCount++;
          continue;
        }
        
        // 准备最简单的数据结构
        const toolData = {
          name: submission.name,
          tagline: submission.tagline || '',
          description: submission.tagline || '',
          website_url: submission.website_url,
          category: submission.category || 'other',
          tags: Array.isArray(submission.tags) && submission.tags.length > 0 
            ? submission.tags 
            : [submission.category || 'other'],
          pricing_type: submission.pricing_type || 'free',
          is_china_available: submission.is_china_available || false,
          is_chinese_supported: false,
          rating: 0,
          rating_count: 0,
          view_count: 0,
          screenshots: [],
          status: submission.status || 'pending',
          created_at: submission.created_at,
          updated_at: submission.created_at,
          note: submission.note || null,
          ai_review_result: submission.ai_review_result || null,
          ai_review_date: submission.ai_review_date || null
        };
        
        console.log('  准备数据完成，开始插入...');
        
        // 插入数据
        const { data: insertData, error: insertError } = await supabase
          .from('tools')
          .insert(toolData)
          .select('id, name')
          .single();
        
        if (insertError) {
          console.error(`  ❌ 插入失败: ${insertError.message}`);
          console.error('  错误代码:', insertError.code);
          
          // 如果是字段错误，提供具体建议
          if (insertError.code === 'PGRST204') {
            console.error('  这表示字段不存在，请检查SQL执行结果');
          }
          
          errorCount++;
        } else {
          console.log(`  ✅ 插入成功: ${insertData.name} (ID: ${insertData.id})`);
          successCount++;
        }
        
      } catch (error) {
        console.error(`  ❌ 处理异常: ${error.message}`);
        errorCount++;
      }
      
      // 显示进度
      if ((i + 1) % 5 === 0) {
        const progress = Math.round((i + 1) / submissions.length * 100);
        console.log(`\n📊 进度: ${i + 1}/${submissions.length} (${progress}%)`);
        console.log(`✅ 成功: ${successCount} | ⏭️ 跳过: ${skipCount} | ❌ 失败: ${errorCount}`);
      }
    }
    
    // 6. 最终报告
    console.log('\n' + '='.repeat(50));
    console.log('🎉 迁移完成报告');
    console.log('='.repeat(50));
    console.log(`✅ 成功迁移: ${successCount} 条`);
    console.log(`⏭️ 跳过重复: ${skipCount} 条`);
    console.log(`❌ 失败: ${errorCount} 条`);
    console.log(`📊 总计: ${submissions.length} 条`);
    console.log(`📈 成功率: ${Math.round(successCount / submissions.length * 100)}%`);
    
    // 7. 验证最终状态
    console.log('\n5. 验证最终状态...');
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
      
      console.log('tools表最终状态分布:');
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} 个`);
      });
    }
    
    // 8. 后续建议
    console.log('\n6. 后续建议:');
    if (errorCount === 0) {
      console.log('🎉 迁移完全成功！');
      console.log('建议后续步骤:');
      console.log('  1. 测试前端功能是否正常');
      console.log('  2. 确认无误后可删除tool_submissions表');
      console.log('  3. 更新前端代码使用统一tools表');
    } else {
      console.log('⚠️ 部分迁移失败');
      console.log('建议:');
      console.log('  1. 检查失败原因');
      console.log('  2. 修复问题后重新运行');
      console.log(`  3. ${successCount} 条工具已成功迁移`);
    }
    
  } catch (error) {
    console.error('无SQL合并失败:', error);
  }
}

// 执行无SQL合并
noSqlMerge();
