/**
 * 修复tool_submissions表中所有ai-bot.cn的website_url
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://enzduxajblrfbbdktieo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

// 完整的官网地址映射
const websiteMapping = {
  // AI聊天助手
  'Ling-1T': 'https://www.alipay.com/',
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
  
  // AI图像工具
  '夸克团队': 'https://www.quark.cn/',
  'RunningHub': 'https://www.runninghub.cn/',
  '通义万相': 'https://tongyi.aliyun.com/wanxiang',
  '可灵AI': 'https://klingai.kuaishou.com',
  '秒画': 'https://miaohua.sensetime.com/',
  'WHEE': 'https://whee.meitu.com',
  '呜哩': 'https://www.alibaba.com/',
  'insMind': 'https://www.insmind.com/',
  'AI改图神器': 'https://www.aigaitu.com/',
  '咖图AI': 'https://www.katuai.com/',
  '视觉工厂': 'https://www.visionfactory.ai/',
  '秒绘AI': 'https://www.miaohui.ai/',
  '妙话AI': 'https://www.miaohua.ai/',
  '炉米Lumi': 'https://www.lumiai.ai/',
  'Krea AI': 'https://www.krea.ai',
  'Kira': 'https://www.kira.ai/',
  'Photoroom': 'https://www.photoroom.com/',
  'Ribbet.ai': 'https://www.ribbet.com/',
  '万相营造': 'https://wanxiang.aliyun.com',
  '悟空图像PhotoSir': 'https://www.photosir.com/',
  '360智图': 'https://ai.360.cn/',
  'LiblibAI': 'https://www.liblib.ai'
};

// 主函数
async function main() {
  console.log('========================================');
  console.log('修复所有ai-bot.cn的website_url');
  console.log('时间:', new Date().toISOString());
  console.log('========================================\n');
  
  try {
    // 获取所有工具提交
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tool_submissions?select=id,name,website_url&limit=500`, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}` 
      }
    });
    
    if (!response.ok) {
      console.log('获取工具失败:', response.status);
      return;
    }
    
    const allTools = await response.json();
    console.log(`获取到 ${allTools.length} 个工具提交`);
    
    // 过滤出包含ai-bot.cn的工具
    const tools = allTools.filter(tool => tool.website_url && tool.website_url.includes('ai-bot.cn'));
    console.log(`找到 ${tools.length} 个包含ai-bot.cn的工具\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const tool of tools) {
      const correctWebsite = websiteMapping[tool.name];
      
      if (!correctWebsite) {
        console.log(`⏭️  跳过: ${tool.name} (无官网映射)`);
        console.log(`   当前地址: ${tool.website_url}`);
        skippedCount++;
        continue;
      }
      
      // 检查是否需要更新
      if (tool.website_url === correctWebsite) {
        console.log(`⏭️  跳过: ${tool.name} (地址已正确)`);
        skippedCount++;
        continue;
      }
      
      // 更新工具信息
      try {
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
          errorCount++;
        }
      } catch (error) {
        console.log(`❌ 更新异常: ${tool.name} - ${error.message}`);
        errorCount++;
      }
      
      await sleep(100); // 避免请求过快
    }
    
    console.log('========================================');
    console.log(`完成！更新 ${updatedCount} 个，跳过 ${skippedCount} 个，错误 ${errorCount} 个`);
    console.log('========================================');
    
    // 显示未映射的工具
    if (skippedCount > 0) {
      console.log('\n需要手动添加映射的工具:');
      const unmappedTools = tools.filter(tool => !websiteMapping[tool.name]);
      unmappedTools.forEach(tool => {
        console.log(`- ${tool.name}: ${tool.website_url}`);
      });
    }
    
  } catch (error) {
    console.error('修复失败:', error);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行主函数
main();
