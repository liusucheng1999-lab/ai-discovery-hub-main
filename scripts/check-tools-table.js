/**
 * 检查tools表数据
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkTables() {
  try {
    console.log('=== 检查tool_submissions表 ===');
    const { data: submissions, error: subError } = await supabase
      .from('tool_submissions')
      .select('id, name, status, created_at')
      .eq('status', 'approved')
      .limit(5);
    
    if (subError) {
      console.error('查询tool_submissions失败:', subError);
    } else {
      console.log('已通过的工具提交:', submissions?.length || 0);
      submissions?.forEach(s => console.log(`- ${s.name} (${s.id}) - ${s.status}`));
    }
    
    console.log('\n=== 检查tools表 ===');
    const { data: tools, error: toolError } = await supabase
      .from('tools')
      .select('id, name, created_at')
      .limit(10);
    
    if (toolError) {
      console.error('查询tools失败:', toolError);
    } else {
      console.log('tools表记录数:', tools?.length || 0);
      tools?.forEach(t => console.log(`- ${t.name} (${t.id}) - ${t.created_at}`));
    }
    
    console.log('\n=== 检查最近的tools记录 ===');
    const { data: recentTools, error: recentError } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (recentError) {
      console.error('查询最近tools失败:', recentError);
    } else {
      console.log('最近的tools记录:');
      recentTools?.forEach(t => {
        console.log(`- ${t.name}`);
        console.log(`  创建时间: ${t.created_at}`);
        console.log(`  分类: ${t.category}`);
        console.log(`  状态: ${t.status}`);
        console.log('');
      });
    }
    
    console.log('\n=== 检查tools表结构 ===');
    const { data: structure, error: structError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (structError) {
      console.error('查询tools表结构失败:', structError);
    } else if (structure && structure.length > 0) {
      console.log('tools表字段:', Object.keys(structure[0]));
    } else {
      console.log('tools表为空');
    }
    
  } catch (error) {
    console.error('检查失败:', error);
  }
}

checkTables();
