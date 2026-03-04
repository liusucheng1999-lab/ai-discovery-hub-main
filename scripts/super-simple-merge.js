/**
 * 超简单表合并方案
 * 完全避免复杂SQL，只使用基础API
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function superSimpleMerge() {
  try {
    console.log('=== 超简单表合并方案 ===');
    
    // 1. 检查字段是否存在
    console.log('1. 检查字段...');
    const { data: sampleTool, error: checkError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('无法检查tools表:', checkError);
      return;
    }
    
    const fields = sampleTool && sampleTool.length > 0 ? Object.keys(sampleTool[0]) : [];
    console.log('tools表现有字段:', fields);
    
    const requiredFields = ['ai_review_result', 'note', 'status'];
    const missingFields = requiredFields.filter(field => !fields.includes(field));
    
    if (missingFields.length > 0) {
      console.log('❌ 缺失字段:', missingFields);
      console.log('\n请先在Supabase SQL编辑器中执行:');
      missingFields.forEach(field => {
        const sql = field === 'ai_review_result' 
          ? 'ALTER TABLE tools ADD COLUMN ai_review_result JSONB;'
          : field === 'note'
          ? 'ALTER TABLE tools ADD COLUMN note TEXT;'
          : 'ALTER TABLE tools ADD COLUMN status TEXT DEFAULT \'active\';';
        console.log(sql);
      });
      console.log('\n执行完成后重新运行此脚本');
      return;
    }
    
    console.log('✅ 所有字段都存在');
    
    // 2. 获取待迁移数据
    console.log('\n2. 获取待迁移数据...');
    const { data: submissions, error: fetchError } = await supabase
      .from('tool_submissions')
      .select('*');
    
    if (fetchError) {
      console.error('获取tool_submissions失败:', fetchError);
      return;
    }
    
    if (!submissions || submissions.length === 0) {
      console.log('没有需要迁移的数据');
      return;
    }
    
    console.log(`找到 ${submissions.length} 条待迁移数据`);
    
    // 3. 逐条迁移，最简单的方式
    console.log('\n3. 开始逐条迁移...');
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      
      try {
        // 检查是否已存在
        const { data: existing } = await supabase
          .from('tools')
          .select('id')
          .eq('website_url', submission.website_url)
          .eq('name', submission.name)
          .limit(1);
        
        if (existing && existing.length > 0) {
          console.log(`⏭️ 跳过重复: ${submission.name}`);
          continue;
        }
        
        // 构造最简单的数据对象
        const newTool = {
          name: submission.name,
          tagline: submission.tagline || '',
          description: submission.tagline || '',
          website_url: submission.website_url,
          category: submission.category || 'other',
          // 简化tags处理
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
        
        // 插入数据
        const { error: insertError } = await supabase
          .from('tools')
          .insert(newTool);
        
        if (insertError) {
          console.error(`❌ [${i+1}/${submissions.length}] ${submission.name}: ${insertError.message}`);
          errorCount++;
        } else {
          successCount++;
          if (successCount % 10 === 0) {
            console.log(`✅ 进度: ${successCount}/${submissions.length} (${Math.round(successCount/submissions.length*100)}%)`);
          }
        }
        
      } catch (error) {
        console.error(`❌ 异常: ${submission.name}: ${error.message}`);
        errorCount++;
      }
    }
    
    // 4. 显示结果
    console.log('\n' + '='.repeat(60));
    console.log('🎉 迁移完成');
    console.log('='.repeat(60));
    console.log(`✅ 成功: ${successCount} 条`);
    console.log(`❌ 失败: ${errorCount} 条`);
    console.log(`📊 总计: ${submissions.length} 条`);
    console.log(`📈 成功率: ${Math.round(successCount / submissions.length * 100)}%`);
    
    // 5. 验证最终状态
    console.log('\n4. 验证最终状态...');
    const { data: finalCount } = await supabase
      .from('tools')
      .select('status', { count: 'exact' });
    
    if (finalCount) {
      const statusCount = {};
      finalCount.forEach(tool => {
        statusCount[tool.status] = (statusCount[tool.status] || 0) + 1;
      });
      
      console.log('tools表状态分布:');
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} 个`);
      });
    }
    
    // 6. 建议
    if (errorCount === 0) {
      console.log('\n🎉 迁移完全成功！');
      console.log('后续步骤:');
      console.log('1. 测试前端功能');
      console.log('2. 确认无误后删除tool_submissions表');
      console.log('3. 更新前端代码使用统一tools表');
    } else {
      console.log('\n⚠️ 部分失败，请检查错误信息');
    }
    
  } catch (error) {
    console.error('超简单合并失败:', error);
  }
}

// 执行超简单合并
superSimpleMerge();
