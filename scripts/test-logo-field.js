/**
 * 测试logo_url字段
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function testLogoField() {
  try {
    console.log('=== 测试logo_url字段 ===');
    
    // 尝试插入一个带logo_url的测试记录
    const testData = {
      name: 'test-tool-' + Date.now(),
      tagline: 'Test tool',
      description: 'Test description',
      website_url: 'https://example.com',
      category: 'test',
      tags: ['test'],
      pricing_type: 'free',
      is_china_available: true,
      is_chinese_supported: false,
      rating: 0,
      rating_count: 0,
      view_count: 0,
      screenshots: [],
      status: 'active',
      created_at: new Date().toISOString(),
      logo_url: 'https://example.com/favicon.ico'
    };
    
    console.log('尝试插入带logo_url的记录...');
    const { data, error } = await supabase
      .from('tools')
      .insert(testData)
      .select();
    
    if (error) {
      console.log('❌ 插入失败:', error.message);
      
      if (error.message.includes('column "logo_url" does not exist')) {
        console.log('✅ 确认logo_url字段不存在');
        console.log('\n请按以下步骤添加logo_url字段:');
        console.log('1. 登录Supabase控制台');
        console.log('2. 进入SQL编辑器');
        console.log('3. 运行以下SQL:');
        console.log('   ALTER TABLE tools ADD COLUMN logo_url text;');
        console.log('4. 点击执行');
      }
    } else {
      console.log('✅ 插入成功，logo_url字段已存在');
      console.log('插入的数据:', data);
      
      // 删除测试记录
      if (data && data[0]) {
        await supabase
          .from('tools')
          .delete()
          .eq('id', data[0].id);
        console.log('🗑️  已删除测试记录');
      }
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testLogoField();
