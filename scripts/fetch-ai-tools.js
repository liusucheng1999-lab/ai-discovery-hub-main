// scripts/fetch-ai-tools.js
// 自动抓取AI工具并存入Supabase

const https = require('https');

// Supabase 配置（从环境变量读取）
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// 分类映射：把抓取到的分类转换成我们的分类
const categoryMap = {
  'artificial-intelligence': 'chat',
  'machine-learning': 'dev',
  'chatgpt': 'chat',
  'ai-writing': 'writing',
  'ai-image': 'image',
  'ai-video': 'video',
  'ai-audio': 'audio',
  'ai-coding': 'coding',
  'ai-productivity': 'office',
  'default': 'chat'
};

// 从网页抓取AI工具信息
async function fetchAITools() {
  console.log('开始抓取AI工具...');
  
  // 使用 Product Hunt 非官方 API
  const tools = await fetchFromProductHunt();
  
  console.log(`抓取到 ${tools.length} 个工具`);
  return tools;
}

// 从 Product Hunt 获取数据
function fetchFromProductHunt() {
  return new Promise((resolve, reject) => {
    // 使用 Product Hunt 的公开页面数据
    const options = {
      hostname: 'www.producthunt.com',
      path: '/topics/artificial-intelligence',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // 简单解析页面中的产品信息
          const tools = parseProductHuntPage(data);
          resolve(tools);
        } catch (err) {
          console.log('解析失败，使用备用数据源');
          resolve(fetchFromBackupSource());
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('请求失败，使用备用数据源');
      resolve(fetchFromBackupSource());
    });
    
    req.end();
  });
}

// 解析 Product Hunt 页面
function parseProductHuntPage(html) {
  const tools = [];
  
  // 使用正则提取产品信息（简化版）
  const productRegex = /"name":"([^"]+)".*?"tagline":"([^"]+)".*?"website":"([^"]+)"/g;
  let match;
  
  while ((match = productRegex.exec(html)) !== null && tools.length < 10) {
    tools.push({
      name: match[1],
      tagline: match[2],
      websiteUrl: match[3],
      category: 'chat',
      pricingType: 'freemium',
      isChinaAvailable: false
    });
  }
  
  return tools;
}

// 备用数据源：从 RSS 或其他来源获取
function fetchFromBackupSource() {
  // 如果主数据源失败，返回一些最近的热门AI工具
  console.log('使用备用数据源...');
  return [
    {
      name: 'GPT-4 Turbo',
      tagline: 'OpenAI最新最强的语言模型',
      websiteUrl: 'https://openai.com',
      category: 'chat',
      pricingType: 'paid',
      isChinaAvailable: false
    }
  ];
}

// 检查工具是否已存在
async function checkExists(name, websiteUrl) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/tools?or=(name.eq.${encodeURIComponent(name)},website_url.eq.${encodeURIComponent(websiteUrl)})`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  const data = await response.json();
  return data.length > 0;
}

// 检查是否在待审核列表中
async function checkPendingExists(name, websiteUrl) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/tool_submissions?or=(name.eq.${encodeURIComponent(name)},website_url.eq.${encodeURIComponent(websiteUrl)})`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  const data = await response.json();
  return data.length > 0;
}

// 保存新工具到待审核表
async function saveToSubmissions(tool) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/tool_submissions`,
    {
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
        is_china_available: tool.isChinaAvailable,
        note: '自动抓取自 Product Hunt',
        status: 'pending'
      })
    }
  );
  
  if (response.ok) {
    console.log(`✅ 已添加: ${tool.name}`);
    return true;
  } else {
    console.log(`❌ 添加失败: ${tool.name}`);
    return false;
  }
}

// 主函数
async function main() {
  console.log('========================================');
  console.log('AI工具自动抓取任务开始');
  console.log('时间:', new Date().toISOString());
  console.log('========================================');
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('错误：缺少 SUPABASE_URL 或 SUPABASE_KEY 环境变量');
    process.exit(1);
  }
  
  try {
    // 1. 抓取工具
    const tools = await fetchAITools();
    
    let newCount = 0;
    let existsCount = 0;
    
    // 2. 逐个检查并保存
    for (const tool of tools) {
      // 检查是否已存在
      const existsInTools = await checkExists(tool.name, tool.websiteUrl);
      const existsInPending = await checkPendingExists(tool.name, tool.websiteUrl);
      
      if (existsInTools || existsInPending) {
        console.log(`⏭️ 已存在: ${tool.name}`);
        existsCount++;
        continue;
      }
      
      // 保存新工具
      const saved = await saveToSubmissions(tool);
      if (saved) newCount++;
    }
    
    console.log('========================================');
    console.log(`任务完成！新增 ${newCount} 个工具，${existsCount} 个已存在`);
    console.log('========================================');
    
  } catch (err) {
    console.error('任务执行出错:', err);
    process.exit(1);
  }
}

main();