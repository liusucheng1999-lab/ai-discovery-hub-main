/**
 * 🤖 AI-BOT.CN 网站抓取脚本
 * 
 * 功能：从 ai-bot.cn 网站抓取AI工具数据并存储到数据库
 * 
 * 特点：
 * - 🌐 专门针对 ai-bot.cn 网站结构
 * - 📝 自动分类处理
 * - 🔄 增量更新支持
 * - 📊 数据验证功能
 * 
 * 使用方法：
 * node scripts/fetch-ai-bot-cn.js
 * 
 * 数据源：
 * - https://ai-bot.cn/ AI工具导航网站
 * 
 * 依赖：
 * - Supabase数据库
 * - Node.js环境
 * - cheerio (HTML解析)
 * 
 * 注意事项：
 * - 需要配置环境变量
 * - 注意请求频率限制
 * - 数据需要人工审核
 * 
 * 作者：AI创客团队
 * 创建时间：2026-02-27
 * 版本：v1.0.0
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// 分类映射
const CATEGORY_MAP = {
  'AI写作工具': 'writing',
  'AI图像工具': 'image',
  'AI视频工具': 'video',
  'AI办公工具': 'office',
  'AI智能体': 'agent',
  'AI聊天助手': 'chat',
  'AI编程工具': 'coding',
  'AI开发平台': 'dev',
  'AI设计工具': 'design',
  'AI音频工具': 'audio',
  'AI搜索引擎': 'search',
  'AI学习网站': 'education',
  'AI训练模型': 'dev',
  'AI模型评测': 'dev',
  'AI内容检测': 'content',
  'AI提示指令': 'writing'
};

// 主函数
async function main() {
  console.log('========================================');
  console.log('AI-BOT.CN 工具抓取任务');
  console.log('时间:', new Date().toISOString());
  console.log('========================================\n');
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('错误：缺少环境变量');
    process.exit(1);
  }
  
  try {
    // 1. 获取主页数据
    console.log('📡 抓取 AI-BOT.CN 主页...');
    const mainPageTools = await fetchMainPage();
    console.log(`   主页获取 ${mainPageTools.length} 个工具\n`);
    
    // 2. 获取分类页面数据
    console.log('📡 抓取分类页面...');
    const categoryTools = await fetchCategoryPages();
    console.log(`   分类页面获取 ${categoryTools.length} 个工具\n`);
    
    // 3. 合并并去重
    const allTools = [...mainPageTools, ...categoryTools];
    const uniqueTools = removeDuplicates(allTools);
    console.log(`总计: ${uniqueTools.length} 个唯一工具待处理\n`);
    
    // 4. 保存到数据库
    console.log('💾 开始保存到数据库...\n');
    
    let newCount = 0;
    let existsCount = 0;
    
    for (const tool of uniqueTools) {
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
      }
      
      await sleep(200); // 避免请求过快
    }
    
    console.log('\n========================================');
    console.log(`完成！新增 ${newCount} 个，已存在 ${existsCount} 个`);
    console.log('========================================');
    
  } catch (error) {
    console.error('抓取失败:', error);
    process.exit(1);
  }
}

// 抓取主页数据
async function fetchMainPage() {
  try {
    const response = await fetch('https://ai-bot.cn/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    if (!response.ok) {
      console.log('   主页请求失败:', response.status);
      return [];
    }
    
    const html = await response.text();
    const tools = parseMainPage(html);
    
    return tools;
  } catch (error) {
    console.log('   主页抓取失败:', error.message);
    return [];
  }
}

// 解析主页HTML
function parseMainPage(html) {
  const tools = [];
  
  // 使用更精确的正则表达式提取工具信息
  // 匹配格式: [工具名称\n\n描述](链接)
  const toolRegex = /\[([^\]]+?)\s*\n\s*([^\]]+?)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = toolRegex.exec(html)) !== null) {
    const name = match[1].trim();
    const description = match[2].trim();
    const url = match[3].trim();
    
    // 跳过非工具链接（如"查看更多 >>"）
    if (name.includes('查看更多') || name.includes('更多') || name.includes('>>')) {
      continue;
    }
    
    // 确保是有效的工具链接
    if (url.includes('/sites/') || (url.startsWith('http') && !url.includes('ai-bot.cn'))) {
      tools.push({
        name: name,
        tagline: description,
        websiteUrl: url.startsWith('http') ? url : `https://ai-bot.cn${url}`,
        category: guessCategoryFromDescription(description),
        pricingType: guessPricingType(description),
        isChinaAvailable: guessChinaAvailability(description),
        source: 'AI-BOT.CN'
      });
    }
  }
  
  console.log(`   主页解析发现 ${tools.length} 个工具`);
  return tools;
}

// 抓取分类页面
async function fetchCategoryPages() {
  const tools = [];
  
  // 常见的分类页面URL模式
  const categoryUrls = [
    'https://ai-bot.cn/favorites/ai-writing-tools/',
    'https://ai-bot.cn/favorites/ai-image-tools/',
    'https://ai-bot.cn/favorites/ai-video-tools/',
    'https://ai-bot.cn/favorites/ai-office-tools/',
    'https://ai-bot.cn/favorites/ai-agent-tools/',
    'https://ai-bot.cn/favorites/ai-chat-tools/',
    'https://ai-bot.cn/favorites/ai-programming-tools/',
    'https://ai-bot.cn/favorites/ai-dev-platforms/',
    'https://ai-bot.cn/favorites/ai-design-tools/',
    'https://ai-bot.cn/favorites/ai-audio-tools/',
    'https://ai-bot.cn/favorites/ai-search-tools/',
    'https://ai-bot.cn/favorites/ai-learning-sites/',
    'https://ai-bot.cn/favorites/ai-content-detection/'
  ];
  
  for (const categoryUrl of categoryUrls) {
    try {
      console.log(`   抓取分类: ${categoryUrl}`);
      
      const response = await fetch(categoryUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      });
      
      if (!response.ok) {
        console.log(`     分类页面请求失败: ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      const categoryTools = parseCategoryPage(html);
      tools.push(...categoryTools);
      
      console.log(`     获取 ${categoryTools.length} 个工具`);
      
      await sleep(500); // 避免请求过快
      
    } catch (error) {
      console.log(`   分类抓取失败:`, error.message);
    }
  }
  
  return tools;
}

// 解析分类页面
function parseCategoryPage(html) {
  const tools = [];
  
  // 使用正则表达式提取工具信息
  const toolRegex = /\[([^\]]+?)\s*\n\s*([^\]]+?)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = toolRegex.exec(html)) !== null) {
    const name = match[1].trim();
    const description = match[2].trim();
    const url = match[3].trim();
    
    // 跳过非工具链接
    if (name.includes('查看更多') || name.includes('更多') || name.includes('>>')) {
      continue;
    }
    
    if (url.includes('/sites/') || (url.startsWith('http') && !url.includes('ai-bot.cn'))) {
      tools.push({
        name: name,
        tagline: description,
        websiteUrl: url.startsWith('http') ? url : `https://ai-bot.cn${url}`,
        category: guessCategoryFromDescription(description),
        pricingType: guessPricingType(description),
        isChinaAvailable: guessChinaAvailability(description),
        source: 'AI-BOT.CN'
      });
    }
  }
  
  return tools;
}

// 根据描述猜测分类
function guessCategoryFromDescription(description) {
  const text = description.toLowerCase();
  
  if (text.includes('写作') || text.includes('内容') || text.includes('文案') || text.includes('文章')) return 'writing';
  if (text.includes('图像') || text.includes('图片') || text.includes('绘画') || text.includes('设计') || text.includes('画')) return 'image';
  if (text.includes('视频') || text.includes('影片') || text.includes('动画')) return 'video';
  if (text.includes('音频') || text.includes('音乐') || text.includes('声音') || text.includes('语音')) return 'audio';
  if (text.includes('编程') || text.includes('代码') || text.includes('开发') || text.includes('程序')) return 'coding';
  if (text.includes('办公') || text.includes('文档') || text.includes('表格') || text.includes('PPT')) return 'office';
  if (text.includes('聊天') || text.includes('对话') || text.includes('助手') || text.includes('问答')) return 'chat';
  if (text.includes('搜索') || text.includes('检索') || text.includes('引擎')) return 'search';
  if (text.includes('智能体') || text.includes('代理') || text.includes('自动化')) return 'agent';
  
  return 'chat'; // 默认分类
}

// 猜测价格类型
function guessPricingType(description) {
  const text = description.toLowerCase();
  
  if (text.includes('免费') || text.includes('free')) return 'free';
  if (text.includes('开源') || text.includes('open source')) return 'opensource';
  if (text.includes('试用') || text.includes('trial') || text.includes('部分免费')) return 'freemium';
  
  return 'freemium'; // 默认
}

// 猜测国内可用性
function guessChinaAvailability(description) {
  const text = description.toLowerCase();
  
  // 国内公司产品
  if (text.includes('阿里') || text.includes('腾讯') || text.includes('百度') || 
      text.includes('字节') || text.includes('抖音') || text.includes('快手') ||
      text.includes('商汤') || text.includes('美图') || text.includes('360') ||
      text.includes('华为') || text.includes('小米') || text.includes('网易')) {
    return true;
  }
  
  // 明确提到支持中文或国内可用
  if (text.includes('中文') || text.includes('国内') || text.includes('中国')) {
    return true;
  }
  
  return false; // 默认不可用
}

// 去重
function removeDuplicates(tools) {
  const seen = new Set();
  return tools.filter(tool => {
    const key = `${tool.name.toLowerCase()}-${tool.websiteUrl}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
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
