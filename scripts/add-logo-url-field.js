/**
 * 为tools表添加logo_url字段
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function addLogoUrlField() {
  try {
    console.log('=== 为tools表添加logo_url字段 ===');
    
    // 添加logo_url字段
    const { data, error } = await supabase.rpc('add_column_if_not_exists', {
      table_name: 'tools',
      column_name: 'logo_url',
      column_definition: 'text'
    });
    
    if (error) {
      console.error('添加字段失败:', error);
      
      // 如果RPC不存在，尝试直接SQL
      console.log('尝试使用SQL添加字段...');
      
      const { data: sqlData, error: sqlError } = await supabase
        .from('tools')
        .select('id')
        .limit(1);
      
      if (sqlError) {
        console.error('SQL查询也失败:', sqlError);
        return;
      }
      
      console.log('需要手动添加logo_url字段，请运行以下SQL:');
      console.log('ALTER TABLE tools ADD COLUMN logo_url text;');
      
    } else {
      console.log('✅ logo_url字段添加成功');
    }
    
    // 检查字段是否存在
    console.log('\n=== 检查tools表结构 ===');
    const { data: testData, error: testError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('检查表结构失败:', testError);
    } else if (testData && testData.length > 0) {
      const fields = Object.keys(testData[0]);
      console.log('当前字段:', fields);
      
      if (fields.includes('logo_url')) {
        console.log('✅ logo_url字段已存在');
      } else {
        console.log('❌ logo_url字段不存在');
      }
    }
    
  } catch (error) {
    console.error('操作失败:', error);
  }
}

addLogoUrlField();
