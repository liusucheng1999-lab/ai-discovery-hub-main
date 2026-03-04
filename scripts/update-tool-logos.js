/**
 * 更新tools表中的头像信息
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://enzduxajblrfbbdktieo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

// 获取工具头像的函数
function getToolLogo(websiteUrl) {
  if (!websiteUrl) return null;
  
  try {
    const domain = new URL(websiteUrl).hostname.replace('www.', '');
    
    // 常见网站的头像映射
    const logoMap = {
      'miaohua.sensetime.com': 'https://miaohua.sensetime.com/favicon.ico',
      'tongyi.aliyun.com': 'https://tongyi.aliyun.com/favicon.ico',
      'klingai.kuaishou.com': 'https://klingai.kuaishou.com/favicon.ico',
      'whee.meitu.com': 'https://whee.meitu.com/favicon.ico',
      'krea.ai': 'https://www.krea.ai/favicon.ico',
      'runninghub.cn': 'https://www.runninghub.cn/favicon.ico',
      'liblib.ai': 'https://www.liblib.ai/favicon.ico',
      'wanxiang.aliyun.com': 'https://wanxiang.aliyun.com/favicon.ico',
      
      // 其他工具
      'quark.cn': 'https://www.quark.cn/favicon.ico',
      'intern-ai.org': 'https://intern-ai.org/favicon.ico',
      'stepfun.com': 'https://www.stepfun.com/favicon.ico',
      'baichuan-ai.com': 'https://www.baichuan-ai.com/favicon.ico',
      'kunlunai.com': 'https://www.kunlunai.com/favicon.ico',
      'sensetime.com': 'https://www.sensetime.com/favicon.ico',
      'mindverse.ai': 'https://www.mindverse.ai/favicon.ico',
      'saylo.ai': 'https://www.saylo.ai/favicon.ico',
      'poe.com': 'https://poe.com/favicon.ico',
      'copilot.microsoft.com': 'https://copilot.microsoft.com/favicon.ico',
      'bytedance.com': 'https://www.bytedance.com/favicon.ico',
      'code.baidu.com': 'https://code.baidu.com/favicon.ico',
      'alibaba.com': 'https://www.alibaba.com/favicon.ico',
      'cursor.com': 'https://www.cursor.com/favicon.ico',
      'doubao.com': 'https://www.doubao.com/favicon.ico',
      'github.com': 'https://github.com/favicon.ico',
      'kilocode': 'https://github.com/kilocode/favicon.ico',
      'ai.google.dev': 'https://ai.google.dev/favicon.ico',
      'claude.ai': 'https://claude.ai/favicon.ico',
      'amazon.com': 'https://www.amazon.com/favicon.ico',
      'openai.com': 'https://openai.com/favicon.ico',
      'youware.dev': 'https://www.youware.dev/favicon.ico',
      'zhipuai.cn': 'https://zhipuai.cn/favicon.ico',
      'cloud.tencent.com': 'https://cloud.tencent.com/favicon.ico',
      'lovable.dev': 'https://www.lovable.dev/favicon.ico',
      'aigaitu.com': 'https://www.aigaitu.com/favicon.ico',
      'katuai.com': 'https://www.katuai.com/favicon.ico',
      'visionfactory.ai': 'https://www.visionfactory.ai/favicon.ico',
      'miaohui.ai': 'https://www.miaohui.ai/favicon.ico',
      'lumiai.ai': 'https://www.lumiai.ai/favicon.ico',
      'kira.ai': 'https://www.kira.ai/favicon.ico',
      'photoroom.com': 'https://www.photoroom.com/favicon.ico',
      'ribbet.com': 'https://www.ribbet.com/favicon.ico',
      'photosir.com': 'https://www.photosir.com/favicon.ico',
      'ai.360.cn': 'https://ai.360.cn/favicon.ico'
    };
    
    return logoMap[domain] || `https://${domain}/favicon.ico`;
  } catch (error) {
    console.log(`获取头像失败: ${websiteUrl}`, error.message);
    return null;
  }
}

// 主函数
async function main() {
  console.log('========================================');
  console.log('更新tools表中的头像信息');
  console.log('时间:', new Date().toISOString());
  console.log('========================================\n');
  
  try {
    // 获取所有工具
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=id,name,website_url`, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}` 
      }
    });
    
    if (!response.ok) {
      console.log('获取工具失败:', response.status);
      return;
    }
    
    const tools = await response.json();
    console.log(`获取到 ${tools.length} 个工具\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const tool of tools) {
      const logoUrl = getToolLogo(tool.website_url);
      
      if (!logoUrl) {
        console.log(`⏭️  跳过: ${tool.name} (无法获取头像)`);
        skippedCount++;
        continue;
      }
      
      // 更新工具头像
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/tools?id=eq.${tool.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          logo_url: logoUrl
        })
      });
      
      if (updateResponse.ok) {
        console.log(`✅ 更新头像: ${tool.name}`);
        console.log(`   头像: ${logoUrl}`);
        console.log('');
        updatedCount++;
      } else {
        console.log(`❌ 更新头像失败: ${tool.name}`);
        const errorText = await updateResponse.text();
        console.log(`   错误信息: ${errorText}`);
      }
      
      await sleep(100); // 避免请求过快
    }
    
    console.log('========================================');
    console.log(`完成！更新 ${updatedCount} 个，跳过 ${skippedCount} 个`);
    console.log('========================================');
    
  } catch (error) {
    console.error('更新失败:', error);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行主函数
main();
