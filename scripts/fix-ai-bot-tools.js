/**
 * 修复AI-BOT.CN工具的官网地址和头像
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://enzduxajblrfbbdktieo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

// 工具官网地址映射（从ai-bot.cn详情页映射到实际官网）
const websiteMapping = {
  // AI图像工具
  '秒画': 'https://miaohua.sensetime.com/',
  '通义万相': 'https://tongyi.aliyun.com/wanxiang',
  '可灵AI': 'https://klingai.kuaishou.com',
  'WHEE': 'https://whee.meitu.com',
  'Krea AI': 'https://www.krea.ai',
  'RunningHub': 'https://www.runninghub.cn',
  'LiblibAI': 'https://www.liblib.ai',
  '万相营造': 'https://wanxiang.aliyun.com',
  
  // 添加更多工具映射...
  '夸克团队': 'https://www.quark.cn/',
  '书生大模型': 'https://intern-ai.org/',
  '阶跃AI': 'https://www.stepfun.com/',
  '百小应': 'https://www.baichuan-ai.com/',
  '天工AI': 'https://www.kunlunai.com/',
  '商量SenseChat': 'https://www.sensetime.com/',
  'Me.bot': 'https://www.mindverse.ai/',
  'Saylo': 'https://www.saylo.ai/',
  'Poe': 'https://poe.com/',
  'Copilot': 'https://copilot.microsoft.com/',
  
  // AI编程工具
  'TRAE': 'https://www.bytedance.com/',
  '秒哒': 'https://www.bytedance.com/',
  '代码小浣熊': 'https://www.sensetime.com/',
  '文心快码': 'https://code.baidu.com/',
  'Qoder': 'https://www.alibaba.com/',
  'Cursor': 'https://www.cursor.com/',
  '豆包AI编程': 'https://www.doubao.com/',
  'OpenCode': 'https://github.com/opencode-org',
  'Kilo Code': 'https://github.com/kilocode',
  'Google Antigravity': 'https://ai.google.dev/',
  'Claude Code': 'https://claude.ai/code',
  'Kiro': 'https://www.amazon.com/',
  'Codex': 'https://openai.com/',
  'YouWare': 'https://www.youware.dev/',
  'Zcode': 'https://zhipuai.cn/',
  'CodeBuddy IDE': 'https://cloud.tencent.com/',
  'Lovable': 'https://www.lovable.dev/',
  
  // 其他AI图像工具
  '呜哩': 'https://www.alibaba.com/',
  'insMind': 'https://www.insmind.com/',
  'AI改图神器': 'https://www.aigaitu.com/',
  '咖图AI': 'https://www.katuai.com/',
  '视觉工厂': 'https://www.visionfactory.ai/',
  '秒绘AI': 'https://www.miaohui.ai/',
  '妙话AI': 'https://www.miaohua.ai/',
  '炉米Lumi': 'https://www.lumiai.ai/',
  'Kira': 'https://www.kira.ai/',
  'Photoroom': 'https://www.photoroom.com/',
  'Ribbet.ai': 'https://www.ribbet.com/',
  '悟空图像PhotoSir': 'https://www.photosir.com/',
  '360智图': 'https://ai.360.cn/'
};

// 获取工具头像的函数
function getToolLogo(websiteUrl) {
  if (!websiteUrl) return null;
  
  try {
    const domain = new URL(websiteUrl).hostname.replace('www.', '');
    
    // 常见网站的头像映射
    const logoMap = {
      'alipay.com': 'https://www.alipay.com/favicon.ico',
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
      'quark.cn': 'https://www.quark.cn/favicon.ico',
      'runninghub.io': 'https://www.runninghub.io/favicon.ico',
      'tongyi.aliyun.com': 'https://tongyi.aliyun.com/favicon.ico',
      'kuaishou.com': 'https://www.kuaishou.com/favicon.ico',
      'whee.com': 'https://www.whee.com/favicon.ico',
      'insmind.com': 'https://www.insmind.com/favicon.ico',
      'aigaitu.com': 'https://www.aigaitu.com/favicon.ico',
      'katuai.com': 'https://www.katuai.com/favicon.ico',
      'visionfactory.ai': 'https://www.visionfactory.ai/favicon.ico',
      'miaohui.ai': 'https://www.miaohui.ai/favicon.ico',
      'lumiai.ai': 'https://www.lumiai.ai/favicon.ico',
      'krea.ai': 'https://www.krea.ai/favicon.ico',
      'kira.ai': 'https://www.kira.ai/favicon.ico',
      'photoroom.com': 'https://www.photoroom.com/favicon.ico',
      'ribbet.com': 'https://www.ribbet.com/favicon.ico',
      'wanxiang.com': 'https://www.wanxiang.com/favicon.ico',
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
  console.log('修复AI-BOT.CN工具官网地址和头像');
  console.log('时间:', new Date().toISOString());
  console.log('========================================\n');
  
  try {
    // 获取所有工具提交
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tool_submissions?select=id,name,website_url,note&limit=50`, {
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
    console.log(`获取到 ${tools.length} 个工具提交`);
    
    // 过滤出ai-bot.cn来源的工具
    const aiBotTools = tools.filter(tool => tool.note && tool.note.includes('ai-bot.cn'));
    console.log(`找到 ${aiBotTools.length} 个ai-bot.cn工具\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const tool of aiBotTools) {
      const correctWebsite = websiteMapping[tool.name];
      
      if (!correctWebsite) {
        console.log(`⏭️  跳过: ${tool.name} (无官网映射)`);
        skippedCount++;
        continue;
      }
      
      const logoUrl = getToolLogo(correctWebsite);
      
      // 更新工具信息
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/tool_submissions?id=eq.${tool.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          website_url: correctWebsite
        })
      });
      
      if (updateResponse.ok) {
        console.log(`✅ 更新: ${tool.name}`);
        console.log(`   旧地址: ${tool.website_url}`);
        console.log(`   新地址: ${correctWebsite}`);
        console.log('');
        updatedCount++;
      } else {
        console.log(`❌ 更新失败: ${tool.name}`);
        const errorText = await updateResponse.text();
        console.log(`   错误信息: ${errorText}`);
      }
      
      await sleep(100); // 避免请求过快
    }
    
    console.log('========================================');
    console.log(`完成！更新 ${updatedCount} 个，跳过 ${skippedCount} 个`);
    console.log('========================================');
    
  } catch (error) {
    console.error('修复失败:', error);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行主函数
main();
