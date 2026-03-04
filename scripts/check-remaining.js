/**
 * 检查剩余的缺失工具
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkRemaining() {
  try {
    // 获取已通过的工具提交
    const { data: approvedSubmissions, error: subError } = await supabase
      .from('tool_submissions')
      .select('name, id, website_url, category, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (subError) {
      console.error('查询已通过工具失败:', subError);
      return;
    }
    
    // 获取tools表中的工具
    const { data: existingTools, error: toolError } = await supabase
      .from('tools')
      .select('name, created_at')
      .order('created_at', { ascending: false });
    
    if (toolError) {
      console.error('查询tools表失败:', toolError);
      return;
    }
    
    const existingToolNames = new Set(existingTools?.map(t => t.name) || []);
    
    console.log('=== 已通过的工具提交 ===');
    approvedSubmissions?.forEach(sub => {
      const exists = existingToolNames.has(sub.name);
      console.log(`${exists ? '✅' : '❌'} ${sub.name} (${sub.id})`);
      if (!exists) {
        console.log(`   网址: ${sub.website_url}`);
        console.log(`   分类: ${sub.category}`);
      }
    });
    
    console.log('\n=== 统计 ===');
    console.log(`已通过总数: ${approvedSubmissions?.length || 0}`);
    console.log(`已在tools表: ${existingTools?.length || 0}`);
    console.log(`仍缺失: ${(approvedSubmissions?.length || 0) - (existingTools?.filter(t => approvedSubmissions?.some(s => s.name === t.name))?.length || 0)}`);
    
  } catch (error) {
    console.error('检查失败:', error);
  }
}

checkRemaining();
