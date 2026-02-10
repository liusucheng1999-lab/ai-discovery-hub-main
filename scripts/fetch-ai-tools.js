// scripts/fetch-ai-tools.js
// 自动抓取AI工具 - Product Hunt + GitHub

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Product Hunt API 配置
const PH_API_KEY = 'fe-eS5eQ2EWwk_BxdmRSP69d0WKjw_gnFUYd2DBsrIg';
const PH_API_SECRET = 'rTDOAGFr87E3lokpEdpP4mWEWOq3tv3hHBuv10FqvH4';

// 主函数
async function main() {
  console.log('========================================');
  console.log('AI工具自动抓取任务');
  console.log('时间:', new Date().toISOString());
  console.log('========================================\n');
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('错误：缺少环境变量');
    process.exit(1);
  }
  
  const allTools = [];
  
  // 数据源1：Product Hunt 最新 AI 产品
  console.log('📡 抓取 Product Hunt...');
  const phTools = await fetchProductHunt();
  allTools.push(...phTools);
  console.log(`   获取 ${phTools.length} 个\n`);
  
  // 数据源2：GitHub Trending AI 项目
  console.log('📡 抓取 GitHub Trending...');
  const githubTools = await fetchGitHubTrending();
  allTools.push(...githubTools);
  console.log(`   获取 ${githubTools.length} 个\n`);
  
  console.log(`总计: ${allTools.length} 个工具待检查\n`);
  
  // 逐个检查并保存
  let newCount = 0;
  let existsCount = 0;
  
  for (const tool of allTools) {
    const exists = await checkExists(tool.name, tool.websiteUrl);
    
    if (exists) {
      existsCount++;
      continue;
    }
    
    const saved = await saveToSubmissions(tool);
    if (saved) newCount++;
    
    await sleep(100);
  }
  
  console.log('\n========================================');
  console.log(`完成！新增 ${newCount} 个，已存在 ${existsCount} 个`);
  console.log('========================================');
}

// 获取 Product Hunt Access Token
async function getPHAccessToken() {
  try {
    const response = await fetch('https://api.producthunt.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: PH_API_KEY,
        client_secret: PH_API_SECRET,
        grant_type: 'client_credentials'
      })
    });
    
    if (!response.ok) {
      console.log('   获取 PH Token 失败:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.log('   PH Token 错误:', err.message);
    return null;
  }
}

// 抓取 Product Hunt 最新 AI 产品
async function fetchProductHunt() {
  try {
    const token = await getPHAccessToken();
    
    if (!token) {
      console.log('   无法获取 Product Hunt Token，跳过');
      return [];
    }
    
    // GraphQL 查询最新的 AI 相关产品
    const query = `
      query {
        posts(first: 30, order: NEWEST) {
          edges {
            node {
              id
              name
              tagline
              website
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      console.log('   PH API 请求失败:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data.posts) {
      console.log('   PH 数据格式异常');
      return [];
    }
    
    // 过滤出 AI 相关的产品
    const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'llm', 'chatbot', 'generative'];
    
    const tools = [];
    
    for (const edge of data.data.posts.edges) {
      const post = edge.node;
      
      // 检查是否 AI 相关
      const topics = post.topics?.edges?.map(e => e.node.name.toLowerCase()) || [];
      const isAI = topics.some(t => aiKeywords.some(k => t.includes(k))) ||
                   post.name.toLowerCase().includes('ai') ||
                   post.tagline.toLowerCase().includes('ai');
      
      if (isAI && post.website) {
        tools.push({
          name: post.name,
          tagline: post.tagline.slice(0, 100),
          websiteUrl: post.website,
          category: guessCategory(post.tagline, topics),
          pricingType: 'freemium',
          isChinaAvailable: false,
          source: 'Product Hunt'
        });
      }
    }
    
    return tools;
  } catch (err) {
    console.log('   Product Hunt 抓取失败:', err.message);
    return [];
  }
}

// 根据描述猜测分类
function guessCategory(tagline, topics) {
  const text = (tagline + ' ' + topics.join(' ')).toLowerCase();
  
  if (text.includes('video') || text.includes('视频')) return 'video';
  if (text.includes('image') || text.includes('photo') || text.includes('art') || text.includes('draw')) return 'image';
  if (text.includes('music') || text.includes('audio') || text.includes('voice') || text.includes('sound')) return 'audio';
  if (text.includes('code') || text.includes('developer') || text.includes('programming')) return 'coding';
  if (text.includes('write') || text.includes('writing') || text.includes('text') || text.includes('content')) return 'writing';
  if (text.includes('search')) return 'search';
  if (text.includes('productivity') || text.includes('document') || text.includes('pdf')) return 'office';
  if (text.includes('agent') || text.includes('automat')) return 'agent';
  if (text.includes('api') || text.includes('model') || text.includes('deploy')) return 'dev';
  
  return 'chat'; // 默认对话类
}

// GitHub Trending AI 项目
async function fetchGitHubTrending() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dateStr = oneWeekAgo.toISOString().split('T')[0];
    
    const response = await fetch(
      `https://api.github.com/search/repositories?q=topic:artificial-intelligence+created:>${dateStr}&sort=stars&per_page=20`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AI-Fetcher'
        }
      }
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    return (data.items || []).map(repo => ({
      name: repo.name,
      tagline: (repo.description || '开源AI项目').slice(0, 100),
      websiteUrl: repo.homepage || repo.html_url,
      category: 'dev',
      pricingType: 'opensource',
      isChinaAvailable: true,
      source: 'GitHub'
    }));
  } catch (err) {
    console.log('   GitHub 抓取失败:', err.message);
    return [];
  }
}

// 检查是否存在
async function checkExists(name, websiteUrl) {
  // 检查 tools 表
  const toolsUrl = `${SUPABASE_URL}/rest/v1/tools?or=(name.ilike.${encodeURIComponent(name)},website_url.ilike.${encodeURIComponent(websiteUrl)})`;
  const toolsRes = await fetch(toolsUrl, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const toolsData = await toolsRes.json();
  if (Array.isArray(toolsData) && toolsData.length > 0) return true;
  
  // 检查 submissions 表
  const subUrl = `${SUPABASE_URL}/rest/v1/tool_submissions?or=(name.ilike.${encodeURIComponent(name)},website_url.ilike.${encodeURIComponent(websiteUrl)})`;
  const subRes = await fetch(subUrl, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const subData = await subRes.json();
  return Array.isArray(subData) && subData.length > 0;
}

// 保存到待审核表
async function saveToSubmissions(tool) {
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
  
  if (response.ok) {
    console.log(`✅ ${tool.name}`);
    return true;
  }
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();