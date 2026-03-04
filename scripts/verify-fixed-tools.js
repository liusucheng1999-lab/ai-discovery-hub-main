/**
 * 验证修复后的工具
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://enzduxajblrfbbdktieo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

async function verifyFixedTools() {
  try {
    // 检查一些已修复的工具
    const toolNames = ['Ling-1T', '书生大模型', '阶跃AI', '秒画', '通义万相', 'Krea AI', 'Cursor'];
    
    console.log('验证修复后的工具:');
    console.log('================================');
    
    for (const name of toolNames) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tool_submissions?select=name,website_url&name=eq.${encodeURIComponent(name)}`, {
        headers: { 
          'apikey': SUPABASE_KEY, 
          'Authorization': `Bearer ${SUPABASE_KEY}` 
        }
      });
      
      if (response.ok) {
        const tools = await response.json();
        if (tools.length > 0) {
          const tool = tools[0];
          console.log(`✅ ${tool.name}`);
          console.log(`   官网: ${tool.website_url}`);
          console.log(`   是否包含ai-bot.cn: ${tool.website_url.includes('ai-bot.cn') ? '是' : '否'}`);
          console.log('');
        } else {
          console.log(`❌ 未找到: ${name}`);
        }
      } else {
        console.log(`❌ 查询失败: ${name}`);
      }
    }
    
  } catch (error) {
    console.error('验证失败:', error.message);
  }
}

verifyFixedTools();
