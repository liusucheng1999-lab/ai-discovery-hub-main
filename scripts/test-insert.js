
/**
 * 测试插入功能
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function testInsert() {
  try {
    console.log('=== 测试插入功能 ===');
    
    // 测试各种状态值
    const testStatuses = ['pending', 'approved', 'rejected', 'active'];
    
    for (const status of testStatuses) {
      console.log(`测试状态: ${status}`);
      
      const testData = {
        name: `测试工具-${status}`,
        tagline: '测试简介',
        description: '测试描述',
        website_url: `https://example.com/${status}`,
        category: 'test',
        tags: ['test'],
        pricing_type: 'free',
        is_china_available: false,
        is_chinese_supported: false,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        screenshots: [],
        status: status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        note: null,
        ai_review_result: null,
        ai_review_date: null
      };
      
      const { error } = await supabase
        .from('tools')
        .insert(testData);
      
      if (error) {
        console.error(`  ❌ 状态 ${status} 插入失败: ${error.message}`);
      } else {
        console.log(`  ✅ 状态 ${status} 插入成功`);
        
        // 删除测试数据
        await supabase
          .from('tools')
          .delete()
          .eq('name', `测试工具-${status}`);
      }
    }
    
    console.log('\n测试完成');
    
  } catch (error) {
    console.error('测试插入失败:', error);
  }
}

testInsert();
