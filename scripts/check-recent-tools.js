/**
 * 检查最近提交的工具
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://enzduxajblrfbbdktieo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

async function checkRecentTools() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tool_submissions?select=id,name,website_url,note,created_at&limit=10`, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}` 
      }
    });
    
    if (!response.ok) {
      console.log('请求失败:', response.status);
      return;
    }
    
    const tools = await response.json();
    console.log(`最近10个工具提交:`);
    console.log('================================');
    
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   ID: ${tool.id}`);
      console.log(`   网站: ${tool.website_url}`);
      console.log(`   备注: ${tool.note}`);
      console.log(`   创建时间: ${tool.created_at}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('检查失败:', error.message);
  }
}

checkRecentTools();
