/**
 * 手动从AI-BOT.CN提取工具数据
 * 基于之前查看的网站内容手动提取
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://enzduxajblrfbbdktieo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

// 基于之前查看的网站内容手动提取的工具数据
const manualTools = [
  // AI聊天助手
  {
    name: 'Ling-1T',
    tagline: '蚂蚁集团推出的 Ling-1T 大模型对话体验平台',
    websiteUrl: 'https://ai-bot.cn/sites/64622.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '书生大模型',
    tagline: '上海人工智能实验室推出的系列AI模型',
    websiteUrl: 'https://ai-bot.cn/sites/53308.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '阶跃AI',
    tagline: '阶跃星辰推出的支持多模态的AI聊天机器人',
    websiteUrl: 'https://ai-bot.cn/sites/9802.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '百小应',
    tagline: '百川智能推出的免费AI助手',
    websiteUrl: 'https://ai-bot.cn/sites/12663.html',
    category: 'chat',
    pricingType: 'free',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '天工AI',
    tagline: '昆仑万维推出的AI智能助手',
    websiteUrl: 'https://ai-bot.cn/sites/1784.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '商量SenseChat',
    tagline: '商汤科技推出的免费AI聊天助手',
    websiteUrl: 'https://ai-bot.cn/sites/11529.html',
    category: 'chat',
    pricingType: 'free',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Me.bot',
    tagline: '心识宇宙推出的个性化AI伴侣产品',
    websiteUrl: 'https://ai-bot.cn/sites/16356.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Saylo',
    tagline: 'AI驱动的故事角色扮演游戏应用，沉浸式的剧本互动体验',
    websiteUrl: 'https://ai-bot.cn/sites/21956.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Poe',
    tagline: '问答社区Quora推出的问答机器人工具',
    websiteUrl: 'https://ai-bot.cn/sites/459.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Copilot',
    tagline: '微软推出的网页版Copilot助手',
    websiteUrl: 'https://ai-bot.cn/sites/6019.html',
    category: 'chat',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  
  // AI编程工具
  {
    name: 'TRAE',
    tagline: '字节跳动推出的 AI IDE 编程工具',
    websiteUrl: 'https://ai-bot.cn/sites/65814.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '秒哒',
    tagline: '无代码AI应用开发平台，一句话做应用',
    websiteUrl: 'https://ai-bot.cn/sites/65909.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '代码小浣熊',
    tagline: '商汤科技推出的免费AI编程助手',
    websiteUrl: 'https://ai-bot.cn/sites/6519.html',
    category: 'coding',
    pricingType: 'free',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '文心快码',
    tagline: '百度推出的AI编程助手，基于文心大模型',
    websiteUrl: 'https://ai-bot.cn/sites/4099.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Qoder',
    tagline: '阿里巴巴推出的 AI Agentic 编程工具',
    websiteUrl: 'https://ai-bot.cn/sites/60584.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Cursor',
    tagline: 'AI代码编辑器，快速进行编程和软件开发',
    websiteUrl: 'https://ai-bot.cn/sites/906.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: '豆包AI编程',
    tagline: '豆包推出的AI编程新功能',
    websiteUrl: 'https://ai-bot.cn/doubao-aicoding/',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'OpenCode',
    tagline: '开源 AI 编程工具 ， Claude Code 最佳平替',
    websiteUrl: 'https://ai-bot.cn/sites/69806.html',
    category: 'coding',
    pricingType: 'opensource',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Kilo Code',
    tagline: '开源的 AI 编程扩展插件',
    websiteUrl: 'https://ai-bot.cn/sites/69903.html',
    category: 'coding',
    pricingType: 'opensource',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Google Antigravity',
    tagline: '谷歌推出的 AI IDE 编程智能体',
    websiteUrl: 'https://ai-bot.cn/sites/66843.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Claude Code',
    tagline: 'Anthropic 推出的AI编程工具',
    websiteUrl: 'https://ai-bot.cn/sites/56948.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Kiro',
    tagline: '亚马逊公司推出的 AI IDE',
    websiteUrl: 'https://ai-bot.cn/sites/57086.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Codex',
    tagline: 'OpenAI推出的AI编程模型和工具',
    websiteUrl: 'https://ai-bot.cn/sites/53.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'YouWare',
    tagline: '一站式 AI 编程社区与开发平台',
    websiteUrl: 'https://ai-bot.cn/sites/70432.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Zcode',
    tagline: '智谱推出的轻量级AI IDE编程工具',
    websiteUrl: 'https://ai-bot.cn/sites/69134.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'CodeBuddy IDE',
    tagline: '腾讯推出的全栈开发AI IDE',
    websiteUrl: 'https://ai-bot.cn/sites/57753.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Lovable',
    tagline: '全栈AI编程工具，一句话构建网站应用',
    websiteUrl: 'https://ai-bot.cn/sites/60798.html',
    category: 'coding',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },

  // AI图像工具
  {
    name: '夸克团队',
    tagline: '夸克团队推出的AI图像与视频创作平台',
    websiteUrl: 'https://ai-bot.cn/sites/63437.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'RunningHub',
    tagline: '基于云端ComfyUI的AI图像与视频创作平台',
    websiteUrl: 'https://ai-bot.cn/sites/56061.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '通义万相',
    tagline: '阿里推出的AI创意内容生成平台',
    websiteUrl: 'https://ai-bot.cn/sites/3400.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '可灵AI',
    tagline: '快手推出的AI图像和视频创作平台',
    websiteUrl: 'https://ai-bot.cn/sites/13002.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '秒画',
    tagline: '商汤科技推出的免费AI作画和图片生成平台',
    websiteUrl: 'https://ai-bot.cn/sites/4749.html',
    category: 'image',
    pricingType: 'free',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'WHEE',
    tagline: '美图推出的AI图片和绘画创作生成平台',
    websiteUrl: 'https://ai-bot.cn/sites/2976.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '呜哩',
    tagline: '阿里推出的AIGC创意生产力平台',
    websiteUrl: 'https://ai-bot.cn/sites/70059.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'insMind',
    tagline: '稿定面向全球市场推出的AI图片编辑工具',
    websiteUrl: 'https://ai-bot.cn/sites/60138.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'AI改图神器',
    tagline: 'AI在线图像编辑工具',
    websiteUrl: 'https://ai-bot.cn/sites/1412.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '咖图AI',
    tagline: 'AI图像设计平台，搭载NanoBanana Pro模型',
    websiteUrl: 'https://ai-bot.cn/sites/71738.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '视觉工厂',
    tagline: 'AI创作工具，支持AI生图和视频生成服务',
    websiteUrl: 'https://ai-bot.cn/sites/70659.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '秒绘AI',
    tagline: '一键生成爆款图文，免费发布小红书',
    websiteUrl: 'https://ai-bot.cn/sites/70073.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '妙话AI',
    tagline: '专为内容创作者设计的创意图片生成工具',
    websiteUrl: 'https://ai-bot.cn/sites/68984.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '炉米Lumi',
    tagline: '字节跳动推出的AIGC图像创作平台',
    websiteUrl: 'https://ai-bot.cn/lumi/',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Krea AI',
    tagline: '实时AI图像、视频生成和编辑平台',
    websiteUrl: 'https://ai-bot.cn/sites/7050.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Kira',
    tagline: 'AI 图像生成与编辑工具',
    websiteUrl: 'https://ai-bot.cn/sites/56504.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Photoroom',
    tagline: '在线AI图片编辑工具',
    websiteUrl: 'https://ai-bot.cn/sites/18077.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: 'Ribbet.ai',
    tagline: '免费的多功能AI图片处理工具箱',
    websiteUrl: 'https://ai-bot.cn/sites/693.html',
    category: 'image',
    pricingType: 'free',
    isChinaAvailable: false,
    source: 'AI-BOT.CN'
  },
  {
    name: '万相营造',
    tagline: '阿里旗下推出的多模态AI创意生成平台',
    websiteUrl: 'https://ai-bot.cn/sites/29264.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '悟空图像PhotoSir',
    tagline: '新一代专业图像处理软件，更智能、更高效、更好用',
    websiteUrl: 'https://ai-bot.cn/sites/1418.html',
    category: 'image',
    pricingType: 'freemium',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  },
  {
    name: '360智图',
    tagline: '360推出的AI作图平台，支持智能抠图、智能消除、智能放大、智能配图',
    websiteUrl: 'https://ai-bot.cn/sites/4177.html',
    category: 'image',
    pricingType: 'free',
    isChinaAvailable: true,
    source: 'AI-BOT.CN'
  }
];

// 主函数
async function main() {
  console.log('========================================');
  console.log('手动提取AI-BOT.CN工具数据');
  console.log('时间:', new Date().toISOString());
  console.log('========================================\n');
  
  console.log(`准备处理 ${manualTools.length} 个工具\n`);
  
  let newCount = 0;
  let existsCount = 0;
  
  for (const tool of manualTools) {
    const exists = await checkExists(tool.name, tool.websiteUrl);
    
    if (exists) {
      existsCount++;
      console.log(`⏭️  已存在: ${tool.name}`);
      continue;
    }
    
    const saved = await saveToSubmissions(tool);
    if (saved) {
      newCount++;
      console.log(`✅ 新增: ${tool.name}`);
    } else {
      console.log(`❌ 失败: ${tool.name}`);
    }
    
    await sleep(200); // 避免请求过快
  }
  
  console.log('\n========================================');
  console.log(`完成！新增 ${newCount} 个，已存在 ${existsCount} 个`);
  console.log('========================================');
}

// 检查是否存在
async function checkExists(name, websiteUrl) {
  try {
    const toolsUrl = `${SUPABASE_URL}/rest/v1/tools?or=(name.ilike.${encodeURIComponent(name)},website_url.ilike.${encodeURIComponent(websiteUrl)})`;
    const toolsRes = await fetch(toolsUrl, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const toolsData = await toolsRes.json();
    if (Array.isArray(toolsData) && toolsData.length > 0) return true;
    
    const subUrl = `${SUPABASE_URL}/rest/v1/tool_submissions?or=(name.ilike.${encodeURIComponent(name)},website_url.ilike.${encodeURIComponent(websiteUrl)})`;
    const subRes = await fetch(subUrl, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const subData = await subRes.json();
    return Array.isArray(subData) && subData.length > 0;
  } catch (error) {
    console.log('检查存在性失败:', error.message);
    return false;
  }
}

// 保存到待审核表
async function saveToSubmissions(tool) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tool_submissions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: tool.name,
        website_url: tool.websiteUrl,
        tagline: tool.tagline,
        category: tool.category,
        pricing_type: tool.pricingType,
        is_china_available: tool.isChinaAvailable || false,
        note: `来源: ${tool.source} - ${new Date().toISOString().split('T')[0]}`,
        status: 'pending'
      })
    });
    
    return response.ok;
  } catch (error) {
    console.log('保存失败:', error.message);
    return false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行主函数
main();
