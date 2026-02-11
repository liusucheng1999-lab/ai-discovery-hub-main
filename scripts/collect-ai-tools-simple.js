// scripts/collect-ai-tools-simple.js
// 从 ai-bot.cn 收集主流AI工具数据（简化版）

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// 主函数
async function main() {
  console.log('========================================');
  console.log('AI工具数据收集任务（简化版）');
  console.log('来源：ai-bot.cn');
  console.log('时间:', new Date().toISOString());
  console.log('========================================\n');
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('错误：缺少环境变量');
    process.exit(1);
  }
  
  // 收集到的工具数据
  const collectedTools = [
    {
      name: '通义万相',
      tagline: '阿里推出的AI创意内容生成平台，支持图像、视频等多种内容创作',
      websiteUrl: 'https://tongyi.aliyun.com/wanxiang',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: true,
      isChineseSupported: true,
      source: 'ai-bot.cn'
    },
    {
      name: '可灵AI',
      tagline: '快手推出的AI图像和视频创作平台，支持高质量内容生成',
      websiteUrl: 'https://klingai.kuaishou.com',
      category: 'video',
      pricingType: 'freemium',
      isChinaAvailable: true,
      isChineseSupported: true,
      source: 'ai-bot.cn'
    },
    {
      name: '秒画',
      tagline: '商汤科技推出的免费AI作画和图片生成平台',
      websiteUrl: 'https://miaohua.sensetime.com',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: true,
      isChineseSupported: true,
      source: 'ai-bot.cn'
    },
    {
      name: 'WHEE',
      tagline: '美图推出的AI图片和绘画创作生成平台',
      websiteUrl: 'https://whee.meitu.com',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: true,
      isChineseSupported: true,
      source: 'ai-bot.cn'
    },
    {
      name: '即梦AI',
      tagline: '一站式AI视频、图片、数字人创作工具',
      websiteUrl: 'https://jimeng.jianying.com',
      category: 'video',
      pricingType: 'freemium',
      isChinaAvailable: true,
      isChineseSupported: true,
      source: 'ai-bot.cn'
    },
    {
      name: 'Krea AI',
      tagline: '实时AI图像、视频生成和编辑平台',
      websiteUrl: 'https://www.krea.ai',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: false,
      isChineseSupported: false,
      source: 'ai-bot.cn'
    },
    {
      name: 'LiblibAI',
      tagline: '一站式AI内容创作生成平台',
      websiteUrl: 'https://www.liblib.ai',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: false,
      isChineseSupported: false,
      source: 'ai-bot.cn'
    },
    {
      name: 'HeyGen',
      tagline: '专业的AI数字人视频创作平台',
      websiteUrl: 'https://www.heygen.com',
      category: 'video',
      pricingType: 'freemium',
      isChinaAvailable: false,
      isChineseSupported: false,
      source: 'ai-bot.cn'
    },
    {
      name: 'RunningHub',
      tagline: '基于云端ComfyUI的AI图像与视频创作平台',
      websiteUrl: 'https://www.runninghub.cn',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: true,
      isChineseSupported: true,
      source: 'ai-bot.cn'
    },
    {
      name: '万相营造',
      tagline: '阿里旗下推出的多模态AI创意生成平台',
      websiteUrl: 'https://wanxiang.aliyun.com',
      category: 'image',
      pricingType: 'freemium',
      isChinaAvailable: true,
      isChineseSupported: true,
      source: 'ai-bot.cn'
    }
  ];
  
  console.log(`收集到 ${collectedTools.length} 个AI工具\n`);
  
  let successCount = 0;
  let existsCount = 0;
  let errorCount = 0;
  
  for (const tool of collectedTools) {
    try {
      // 检查是否已存在
      const exists = await checkExists(tool.name, tool.websiteUrl);
      
      if (exists) {
        console.log(`⚠️  ${tool.name} - 已存在`);
        existsCount++;
        continue;
      }
      
      // 保存到待审核表
      const saved = await saveToSubmissions(tool);
      if (saved) {
        console.log(`✅ ${tool.name} - 保存成功`);
        successCount++;
      } else {
        console.log(`❌ ${tool.name} - 保存失败`);
        errorCount++;
      }
      
      // 避免请求过快
      await sleep(300);
      
    } catch (err) {
      console.log(`❌ ${tool.name} - 错误:`, err.message);
      errorCount++;
    }
  }
  
  console.log('\n========================================');
  console.log(`收集完成！`);
  console.log(`✅ 成功: ${successCount} 个`);
  console.log(`⚠️  已存在: ${existsCount} 个`);
  console.log(`❌ 失败: ${errorCount} 个`);
  console.log('注意：工具已保存到待审核表，需要管理员审核后才能在主列表显示');
  console.log('========================================');
}

// 检查工具是否已存在
async function checkExists(name, websiteUrl) {
  try {
    const toolsUrl = `${SUPABASE_URL}/rest/v1/tools?or=(name.ilike.${encodeURIComponent(name)},website_url.ilike.${encodeURIComponent(websiteUrl)})`;
    const response = await fetch(toolsUrl, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}` 
      }
    });
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.log('检查存在性失败:', err.message);
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
        is_china_available: tool.isChinaAvailable,
        note: `来源: ${tool.source} - 支持中文: ${tool.isChineseSupported} - ${new Date().toISOString().split('T')[0]}`,
        status: 'pending'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log(`   保存失败: ${errorData.message || response.statusText}`);
      return false;
    }
    
    return true;
  } catch (err) {
    console.log('保存到待审核表失败:', err.message);
    return false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
