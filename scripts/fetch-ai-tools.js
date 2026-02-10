// scripts/fetch-ai-tools.js
// 自动抓取AI工具并存入Supabase

// Supabase 配置（从环境变量读取）
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// 从网页抓取AI工具信息
async function fetchAITools() {
  console.log('开始抓取AI工具...');
  
  // 使用备用方法：抓取 There's An AI For That 的最新工具
  const tools = await fetchFromTAAIF();
  
  console.log(`抓取到 ${tools.length} 个工具`);
  return tools;
}

// 从 There's An AI For That 获取数据
async function fetchFromTAAIF() {
  try {
    const response = await fetch('https://theresanaiforthat.com/api/tools/?limit=10&sort=-created', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.log('API请求失败，使用备用数据');
      return getBackupTools();
    }
    
    const data = await response.json();
    
    if (data && data.results) {
      return data.results.map(item => ({
        name: item.name || item.title,
        tagline: item.description || item.tagline || '一款AI工具',
        websiteUrl: item.url || item.website || 'https://example.com',
        category: mapCategory(item.category),
        pricingType: mapPricing(item.pricing),
        isChinaAvailable: false
      }));
    }
    
    return getBackupTools();
  } catch (err) {
    console.log('抓取失败:', err.message);
    return getBackupTools();
  }
}

// 分类映射
function mapCategory(cat) {
  const map = {
    'chatbot': 'chat',
    'writing': 'writing',
    'image': 'image',
    'video': 'video',
    'audio': 'audio',
    'code': 'coding',
    'search': 'search',
    'productivity': 'office'
  };
  return map[cat?.toLowerCase()] || 'chat';
}

// 价格映射
function mapPricing(pricing) {
  if (!pricing) return 'freemium';
  const p = pricing.toLowerCase();
  if (p.includes('free')) return 'free';
  if (p.includes('open')) return 'opensource';
  if (p.includes('paid')) return 'paid';
  return 'freemium';
}

// 备用数据：从 RSS 或热门列表
function getBackupTools() {
  console.log('使用备用数据源...');
  
  // 返回一些近期热门的AI工具
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      name: 'Grok 2',
      tagline: 'xAI推出的对话AI，集成在X平台',
      websiteUrl: 'https://x.ai',
      category: 'chat',
      pricingType: 'freemium',
      isChinaAvailable: false
    },
    {
      name: 'Claude 3.5 Sonnet',
      tagline: 'Anthropic最新最强的AI助手',
      websiteUrl: 'https://claude.ai',
      category: 'chat',
      pricingType: 'freemium',
      isChinaAvailable: false
    },
    {
      name: 'Gemini 2.0',
      tagline: 'Google最新多模态AI模型',
      websiteUrl: 'https://gemini.google.com',
      category: 'chat',
      pricingType: 'freemium',
      isChinaAvailable: false
    },
    {
      name: 'Sora',
      tagline: 'OpenAI文字生成视频模型',
      websiteUrl: 'https://openai.com/sora',
      category: 'video',
      pricingType: 'paid',
      isChinaAvailable: false
    },
    {
      name: 'Ideogram 2.0',
      tagline: 'AI图片生成工具，擅长文字渲染',
      websiteUrl: 'https://ideogram.ai',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: false
    }
  ];
}

// 检查工具是否已存在于 tools 表
async function checkExistsInTools(name, websiteUrl) {
  const url = `${SUPABASE_URL}/rest/v1/tools?or=(name.ilike.${encodeURIComponent(name)},website_url.ilike.${encodeURIComponent(websiteUrl)})`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  const data = await response.json();
  return Array.isArray(data) && data.length > 0;
}

// 检查是否在待审核列表中
async function checkExistsInSubmissions(name, websiteUrl) {
  const url = `${SUPABASE_URL}/rest/v1/tool_submissions?or=(name.ilike.${encodeURIComponent(name)},website_url.ilike.${encodeURIComponent(websiteUrl)})`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  const data = await response.json();
  return Array.isArray(data) && data.length > 0;
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
        note: '自动抓取 - ' + new Date().toISOString().split('T')[0],
        status: 'pending'
      })
    }
  );
  
  if (response.ok) {
    console.log(`✅ 已添加: ${tool.name}`);
    return true;
  } else {
    const err = await response.text();
    console.log(`❌ 添加失败: ${tool.name} - ${err}`);
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
  
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('Supabase Key:', SUPABASE_KEY ? '已设置' : '未设置');
  
  try {
    // 1. 抓取工具
    const tools = await fetchAITools();
    
    let newCount = 0;
    let existsCount = 0;
    
    // 2. 逐个检查并保存
    for (const tool of tools) {
      console.log(`\n检查: ${tool.name}`);
      
      // 检查是否已存在于 tools 表
      const existsInTools = await checkExistsInTools(tool.name, tool.websiteUrl);
      if (existsInTools) {
        console.log(`⏭️ 已在工具库中: ${tool.name}`);
        existsCount++;
        continue;
      }
      
      // 检查是否已在待审核列表
      const existsInPending = await checkExistsInSubmissions(tool.name, tool.websiteUrl);
      if (existsInPending) {
        console.log(`⏭️ 已在待审核中: ${tool.name}`);
        existsCount++;
        continue;
      }
      
      // 保存新工具
      const saved = await saveToSubmissions(tool);
      if (saved) newCount++;
    }
    
    console.log('\n========================================');
    console.log(`任务完成！`);
    console.log(`新增: ${newCount} 个工具`);
    console.log(`已存在: ${existsCount} 个工具`);
    console.log('========================================');
    
  } catch (err) {
    console.error('任务执行出错:', err);
    process.exit(1);
  }
}

main();