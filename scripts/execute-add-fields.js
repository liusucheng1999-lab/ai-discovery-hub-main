/**
 * 执行添加缺失字段的SQL
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function executeAddFields() {
  try {
    console.log('=== 为tools表添加缺失字段 ===');
    
    // 1. 尝试通过RPC执行SQL（如果支持）
    console.log('1. 尝试添加ai_review_result字段...');
    
    try {
      const { error: aiReviewError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;'
      });
      
      if (aiReviewError) {
        console.log('RPC执行失败，需要手动执行SQL');
        console.log('请在Supabase SQL编辑器中执行以下SQL:');
      } else {
        console.log('✅ ai_review_result字段添加成功');
      }
    } catch (err) {
      console.log('RPC不可用，需要手动执行SQL');
    }
    
    try {
      const { error: noteError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;'
      });
      
      if (noteError) {
        console.log('note字段添加失败，需要手动执行SQL');
      } else {
        console.log('✅ note字段添加成功');
      }
    } catch (err) {
      console.log('note字段添加失败，需要手动执行SQL');
    }
    
    // 2. 验证字段是否添加成功
    console.log('\n2. 验证字段添加结果:');
    const { data: toolsData, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (toolsError) {
      console.error('验证失败:', toolsError);
    } else if (toolsData && toolsData.length > 0) {
      const fields = Object.keys(toolsData[0]);
      console.log('tools表现有字段:', fields);
      
      const hasAiReviewResult = fields.includes('ai_review_result');
      const hasNote = fields.includes('note');
      
      console.log(`ai_review_result字段: ${hasAiReviewResult ? '✅ 存在' : '❌ 缺失'}`);
      console.log(`note字段: ${hasNote ? '✅ 存在' : '❌ 缺失'}`);
      
      if (hasAiReviewResult && hasNote) {
        console.log('\n✅ 所有字段都已添加成功！');
        
        // 3. 测试插入带AI审核数据的工具
        console.log('\n3. 测试插入带AI审核数据的工具:');
        const testTool = {
          name: '测试工具',
          tagline: '这是一个测试工具',
          description: '测试描述',
          website_url: 'https://example.com',
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
            reasoning: '这是一个有用的测试工具'
          },
          ai_review_date: new Date().toISOString(),
          note: '测试备注'
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('tools')
          .insert(testTool)
          .select();
        
        if (insertError) {
          console.error('测试插入失败:', insertError);
        } else {
          console.log('✅ 测试插入成功:', insertData[0].name);
          
          // 删除测试数据
          await supabase
            .from('tools')
            .delete()
            .eq('id', insertData[0].id);
          console.log('🗑️ 已删除测试数据');
        }
      } else {
        console.log('\n❌ 字段添加不完整，请手动执行以下SQL:');
        console.log('ALTER TABLE tools ADD COLUMN IF NOT EXISTS ai_review_result JSONB;');
        console.log('ALTER TABLE tools ADD COLUMN IF NOT EXISTS note TEXT;');
      }
    } else {
      console.log('tools表为空，无法验证');
    }
    
  } catch (error) {
    console.error('执行失败:', error);
  }
}

executeAddFields();
