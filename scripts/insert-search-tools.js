import { createClient } from '@supabase/supabase-js'

// 从环境变量获取Supabase配置
const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 生成数字ID的函数（基于时间戳和随机数）
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// AI搜索引擎工具数据
const searchTools = [
  {
    name: '夸克AI',
    tagline: '集AI搜索、网盘、文档、创作等功能于一体的应用',
    description: '夸克AI是阿里巴巴旗下夸克推出的全能AI应用，集成了AI搜索、网盘存储、文档处理、内容创作等多种功能。提供智能搜索、文件管理、文档编辑、AI创作等服务。具备阿里生态集成、功能全面、智能便捷等特色功能，是个人和办公的全能助手。',
    website_url: 'https://quark.ai',
    tags: ['阿里出品', '全能应用', '网盘集成', '文档创作'],
    pricing_type: 'freemium'
  },
  {
    name: '秘塔AI搜索',
    tagline: '最好用的AI搜索工具，没有广告，直达结果',
    description: '秘塔AI搜索是秘塔科技推出的专业AI搜索引擎，以无广告和直达结果著称。提供精准搜索、智能问答、深度分析等服务。具备无广告体验、结果精准、智能直达等特色功能，是追求高效搜索体验用户的理想选择。',
    website_url: 'https://mita.search',
    tags: ['秘塔出品', '无广告', '直达结果', '精准搜索'],
    pricing_type: 'freemium'
  },
  {
    name: 'Perplexity',
    tagline: 'AI搜索引擎与深度研究工具',
    description: 'Perplexity是全球知名的AI搜索引擎和深度研究工具。提供智能搜索、学术研究、深度分析等服务。具备研究级搜索、多模态理解、专业分析等特色功能，适合学术研究和专业分析使用。',
    website_url: 'https://perplexity.ai',
    tags: ['国际知名', '深度研究', '学术搜索', '专业分析'],
    pricing_type: 'freemium'
  },
  {
    name: '玻尔',
    tagline: '新一代科研知识库与AI学术搜索平台',
    description: '玻尔是新一代科研知识库与AI学术搜索平台，专注于学术研究领域。提供学术搜索、知识库查询、研究分析等服务。具备科研专业、知识库丰富、AI驱动等特色功能，适合科研工作者和学术研究者使用。',
    website_url: 'https://boer.ai',
    tags: ['科研平台', '知识库', '学术搜索', 'AI驱动'],
    pricing_type: 'freemium'
  },
  {
    name: 'SearchGPT',
    tagline: 'OpenAI最新推出的AI搜索引擎',
    description: 'SearchGPT是OpenAI最新推出的革命性AI搜索引擎。提供智能搜索、实时信息、深度分析等服务。具备OpenAI技术、实时搜索、智能分析等特色功能，代表了AI搜索技术的最新发展方向。',
    website_url: 'https://search.openai.com',
    tags: ['OpenAI出品', '最新技术', '实时搜索', '智能分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'AMiner',
    tagline: '智谱AI推出的大模型学术平台',
    description: 'AMiner是智谱AI推出的大模型学术平台，专注于学术研究和知识发现。提供学术搜索、论文分析、专家网络等服务。具备智谱技术、学术专业、大模型驱动等特色功能，是学术研究的重要工具。',
    website_url: 'https://aminer.cn',
    tags: ['智谱AI', '学术平台', '大模型驱动', '论文分析'],
    pricing_type: 'freemium'
  },
  {
    name: '心流',
    tagline: '阿里旗下推出的AI搜索助手',
    description: '心流是阿里巴巴旗下推出的AI搜索助手，提供智能搜索和知识服务。提供智能问答、知识检索、信息整合等服务。具备阿里技术、智能搜索、知识服务等特色功能，适合日常信息查询使用。',
    website_url: 'https://xinliu.ali.com',
    tags: ['阿里出品', '智能搜索', '知识服务', '信息整合'],
    pricing_type: 'freemium'
  },
  {
    name: '点点',
    tagline: '小红书推出的 AI 搜索应用，主打生活场景',
    description: '点点是小红书推出的AI搜索应用，专注于生活场景搜索。提供生活信息、消费指南、趋势发现等服务。具备小红书生态、生活场景、消费指南等特色功能，适合生活信息查询使用。',
    website_url: 'https://diandian.xiaohongshu.com',
    tags: ['小红书出品', '生活搜索', '消费指南', '场景化'],
    pricing_type: 'free'
  },
  {
    name: 'Devv',
    tagline: '面向程序员的新一代AI搜索引擎',
    description: 'Devv是专为程序员设计的新一代AI搜索引擎。提供代码搜索、技术文档、编程问答等服务。具备程序员专业、技术搜索、代码理解等特色功能，是开发者的专业搜索工具。',
    website_url: 'https://devv.ai',
    tags: ['程序员工具', '代码搜索', '技术文档', '编程问答'],
    pricing_type: 'freemium'
  },
  {
    name: '知乎直答',
    tagline: '知乎推出的AI搜索引擎，直达问题答案',
    description: '知乎直答是知乎推出的AI搜索引擎，专注于问题答案的精准直达。提供问题搜索、答案提取、知识整合等服务。具备知乎生态、问答专业、直达答案等特色功能，适合知识查询使用。',
    website_url: 'https://zhida.zhihu.com',
    tags: ['知乎出品', '问答搜索', '知识整合', '直达答案'],
    pricing_type: 'freemium'
  },
  {
    name: '纳米AI',
    tagline: '360推出的新一代超级AI搜索工具',
    description: '纳米AI是360推出的新一代超级AI搜索工具。提供智能搜索、深度分析、多模态搜索等服务。具备360技术、超级搜索、多模态支持等特色功能，是AI搜索技术的重要代表。',
    website_url: 'https://nano.ai.360.com',
    tags: ['360出品', '超级搜索', '多模态AI', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '百度AI探索版',
    tagline: '百度推出的深度AI搜索引擎',
    description: '百度AI探索版是百度推出的深度AI搜索引擎。提供深度搜索、智能探索、知识发现等服务。具备百度技术、深度搜索、智能探索等特色功能，适合深度信息探索使用。',
    website_url: 'https://explore.baidu.com',
    tags: ['百度出品', '深度搜索', '智能探索', '知识发现'],
    pricing_type: 'freemium'
  },
  {
    name: 'Felo',
    tagline: '免费AI智能搜索引擎，支持社交联网搜索和多语种问答结果',
    description: 'Felo是免费的AI智能搜索引擎，支持社交联网搜索和多语种问答结果。提供智能搜索、社交搜索、多语言支持等服务。具备免费使用、社交搜索、多语言等特色功能，适合国际化搜索需求。',
    website_url: 'https://felo.ai',
    tags: ['免费搜索', '社交搜索', '多语言支持', '联网搜索'],
    pricing_type: 'free'
  },
  {
    name: '天工AI搜索',
    tagline: '昆仑万维最新推出的结合大模型的AI搜索引擎',
    description: '天工AI搜索是昆仑万维最新推出的结合大模型的AI搜索引擎。提供智能搜索、大模型驱动、深度分析等服务。具备昆仑万维技术、大模型集成、智能分析等特色功能。',
    website_url: 'https://search.kunlun.ai',
    tags: ['昆仑万维', '大模型驱动', '智能分析', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Exa AI',
    tagline: '专门为AI模型设计的搜索引擎平台',
    description: 'Exa AI是专门为AI模型设计的搜索引擎平台。提供AI模型搜索、技术文档、开发资源等服务。具备AI专业、模型搜索、技术资源等特色功能，适合AI开发者和研究者使用。',
    website_url: 'https://exa.ai',
    tags: ['AI专业', '模型搜索', '技术资源', '开发者工具'],
    pricing_type: 'freemium'
  },
  {
    name: '博查AI搜索',
    tagline: '支持多模型的AI搜索引擎',
    description: '博查AI搜索是支持多模型的AI搜索引擎。提供多模型搜索、智能对比、综合分析等服务。具备多模型支持、智能对比、综合分析等特色功能，适合专业搜索需求。',
    website_url: 'https://bocha.ai',
    tags: ['多模型支持', '智能对比', '综合分析', '专业搜索'],
    pricing_type: 'freemium'
  },
  {
    name: 'WisPaper',
    tagline: '复旦团队推出的 AI 学术搜索工具',
    description: 'WisPaper是复旦团队推出的AI学术搜索工具。提供学术搜索、论文检索、研究分析等服务。具备复旦学术、AI驱动、专业搜索等特色功能，适合学术研究使用。',
    website_url: 'https://wispaper.fudan.edu.cn',
    tags: ['复旦出品', '学术搜索', '论文检索', 'AI驱动'],
    pricing_type: 'free'
  },
  {
    name: 'CuspAI',
    tagline: '剑桥大学推出的材料学专业AI搜索工具',
    description: 'CuspAI是剑桥大学推出的材料学专业AI搜索工具。提供材料学搜索、专业文献、研究分析等服务。具备剑桥学术、材料学专业、AI搜索等特色功能，适合材料学研究使用。',
    website_url: 'https://cuspai.cam.ac.uk',
    tags: ['剑桥出品', '材料学', '专业搜索', '学术工具'],
    pricing_type: 'freemium'
  },
  {
    name: '博简智慧专利',
    tagline: 'AI专利查新检索与撰写平台',
    description: '博简智慧专利是AI专利查新检索与撰写平台。提供专利搜索、查新分析、专利撰写等服务。具备专利专业、AI分析、撰写辅助等特色功能，适合专利工作者使用。',
    website_url: 'https://bojian.patent.com',
    tags: ['专利搜索', '查新分析', '撰写辅助', 'AI分析'],
    pricing_type: 'freemium'
  },
  {
    name: '链企AI',
    tagline: '链企智能推出的AI商业搜索和AI标书写作工具',
    description: '链企AI是链企智能推出的AI商业搜索和标书写作工具。提供商业搜索、标书撰写、商业分析等服务。具备商业专业、AI写作、搜索分析等特色功能，适合商务使用。',
    website_url: 'https://lianqi.ai',
    tags: ['商业搜索', '标书写作', '商业分析', 'AI写作'],
    pricing_type: 'freemium'
  },
  {
    name: '360AI搜索',
    tagline: '360推出的新一代AI搜索引擎',
    description: '360AI搜索是360推出的新一代AI搜索引擎。提供智能搜索、安全浏览、深度分析等服务。具备360技术、安全搜索、智能分析等特色功能，适合安全搜索需求。',
    website_url: 'https://ai.360.com',
    tags: ['360出品', '安全搜索', '智能分析', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '问问小宇宙',
    tagline: '小宇宙推出的AI搜索产品',
    description: '问问小宇宙是小宇宙推出的AI搜索产品。提供智能搜索、知识问答、信息检索等服务。具备小宇宙技术、智能问答、知识检索等特色功能。',
    website_url: 'https://wenwen.xiaoyuzhou.com',
    tags: ['小宇宙出品', '智能问答', '知识检索', 'AI搜索'],
    pricing_type: 'freemium'
  },
  {
    name: 'Dexa AI',
    tagline: 'AI播客搜索工具',
    description: 'Dexa AI是专业的AI播客搜索工具。提供播客搜索、内容分析、智能推荐等服务。具备播客专业、AI分析、内容推荐等特色功能，适合播客内容搜索使用。',
    website_url: 'https://dexa.ai',
    tags: ['播客搜索', '内容分析', '智能推荐', 'AI工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'XAnswer',
    tagline: '支持生成思维导图的免费AI搜索工具',
    description: 'XAnswer是支持生成思维导图的免费AI搜索工具。提供智能搜索、思维导图、知识可视化等服务。具备免费使用、思维导图、知识可视化等特色功能，适合学习和研究使用。',
    website_url: 'https://xanswer.ai',
    tags: ['免费搜索', '思维导图', '知识可视化', '学习工具'],
    pricing_type: 'free'
  },
  {
    name: 'Glean',
    tagline: '专为职场人设计的AI搜索引擎',
    description: 'Glean是专为职场人设计的AI搜索引擎。提供职场搜索、工作助手、信息整合等服务。具备职场专业、工作助手、信息整合等特色功能，适合职场使用。',
    website_url: 'https://glean.co',
    tags: ['职场工具', '工作搜索', '信息整合', '专业助手'],
    pricing_type: 'freemium'
  },
  {
    name: 'AlphaSense',
    tagline: '专为金融专业人士设计的AI搜索工具',
    description: 'AlphaSense是专为金融专业人士设计的AI搜索工具。提供金融搜索、投资分析、市场研究等服务。具备金融专业、投资分析、市场研究等特色功能，适合金融从业者使用。',
    website_url: 'https://alphasense.com',
    tags: ['金融工具', '投资分析', '市场研究', '专业搜索'],
    pricing_type: 'paid'
  },
  {
    name: 'Globe Explorer',
    tagline: '结构化AI知识搜索引擎',
    description: 'Globe Explorer是结构化AI知识搜索引擎。提供知识搜索、结构化信息、智能探索等服务。具备结构化搜索、知识图谱、智能探索等特色功能，适合知识探索使用。',
    website_url: 'https://globeexplorer.ai',
    tags: ['结构化搜索', '知识图谱', '智能探索', '知识引擎'],
    pricing_type: 'freemium'
  },
  {
    name: 'Reportify',
    tagline: 'AI投资研究问答搜索引擎',
    description: 'Reportify是AI投资研究问答搜索引擎。提供投资搜索、研究分析、问答服务等功能。具备投资专业、研究分析、智能问答等特色功能，适合投资研究使用。',
    website_url: 'https://reportify.ai',
    tags: ['投资研究', '研究分析', '智能问答', '专业搜索'],
    pricing_type: 'freemium'
  },
  {
    name: 'Phind',
    tagline: '专为开发者设计的AI搜索引擎',
    description: 'Phind是专为开发者设计的AI搜索引擎。提供开发搜索、技术问答、代码理解等服务。具备开发者专业、技术搜索、代码理解等特色功能，适合开发使用。',
    website_url: 'https://phind.com',
    tags: ['开发者工具', '技术搜索', '代码理解', '编程助手'],
    pricing_type: 'freemium'
  },
  {
    name: 'iAsk AI',
    tagline: '快速准确的AI搜索引擎',
    description: 'iAsk AI是快速准确的AI搜索引擎。提供快速搜索、准确答案、智能问答等服务。具备快速准确、智能问答、高效搜索等特色功能，适合快速信息查询使用。',
    website_url: 'https://iask.ai',
    tags: ['快速搜索', '准确答案', '智能问答', '高效搜索'],
    pricing_type: 'free'
  },
  {
    name: 'Consensus',
    tagline: 'AI科研学术搜索引擎',
    description: 'Consensus是AI科研学术搜索引擎。提供学术搜索、科研分析、论文检索等服务。具备科研专业、学术搜索、论文分析等特色功能，适合科研使用。',
    website_url: 'https://consensus.app',
    tags: ['科研搜索', '学术分析', '论文检索', 'AI工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Komo Search',
    tagline: '简洁直观的AI搜索引擎',
    description: 'Komo Search是简洁直观的AI搜索引擎。提供简洁搜索、直观界面、智能问答等服务。具备简洁设计、直观体验、智能搜索等特色功能，适合追求简洁体验的用户。',
    website_url: 'https://komo.ai',
    tags: ['简洁搜索', '直观设计', '智能问答', '用户体验'],
    pricing_type: 'free'
  },
  {
    name: 'Searcholic',
    tagline: 'AI驱动的电子书和文档搜索引擎',
    description: 'Searcholic是AI驱动的电子书和文档搜索引擎。提供文档搜索、电子书检索、内容分析等服务。具备文档专业、AI驱动、内容分析等特色功能，适合文档搜索使用。',
    website_url: 'https://searcholic.com',
    tags: ['文档搜索', '电子书检索', '内容分析', 'AI驱动'],
    pricing_type: 'freemium'
  },
  {
    name: 'Andi',
    tagline: '对话式人工智能搜索引擎',
    description: 'Andi是对话式人工智能搜索引擎。提供对话搜索、智能问答、信息整合等服务。具备对话交互、智能问答、信息整合等特色功能，适合对话式搜索体验。',
    website_url: 'https://andi.ai',
    tags: ['对话搜索', '智能问答', '信息整合', '交互体验'],
    pricing_type: 'freemium'
  },
  {
    name: 'Songtell',
    tagline: 'AI驱动的音乐百科搜索引擎',
    description: 'Songtell是AI驱动的音乐百科搜索引擎。提供音乐搜索、百科查询、歌词分析等服务。具备音乐专业、AI分析、百科搜索等特色功能，适合音乐爱好者使用。',
    website_url: 'https://songtell.ai',
    tags: ['音乐搜索', '百科查询', '歌词分析', 'AI分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'ThinkAny',
    tagline: '新时代的AI搜索引擎',
    description: 'ThinkAny是新时代的AI搜索引擎。提供智能搜索、深度分析、知识发现等服务。具备新时代技术、智能分析、知识发现等特色功能，适合现代搜索需求。',
    website_url: 'https://thinkany.ai',
    tags: ['新时代搜索', '智能分析', '知识发现', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Miku',
    tagline: '快速精准的AI搜索引擎',
    description: 'Miku是快速精准的AI搜索引擎。提供快速搜索、精准结果、智能问答等服务。具备快速精准、智能问答、高效搜索等特色功能，适合高效信息获取。',
    website_url: 'https://miku.ai',
    tags: ['快速搜索', '精准结果', '智能问答', '高效获取'],
    pricing_type: 'free'
  },
  {
    name: 'Qdrant',
    tagline: '开源的向量数据库和向量相似性AI搜索引擎',
    description: 'Qdrant是开源的向量数据库和向量相似性AI搜索引擎。提供向量搜索、相似性匹配、开源服务等功能。具备开源免费、向量技术、相似性搜索等特色功能，适合技术开发者使用。',
    website_url: 'https://qdrant.ai',
    tags: ['开源工具', '向量数据库', '相似性搜索', '技术开发'],
    pricing_type: 'opensource'
  },
  {
    name: 'Adot',
    tagline: '一个由AI驱动的 Web3 搜索引擎',
    description: 'Adot是AI驱动的Web3搜索引擎。提供Web3搜索、区块链查询、智能分析等服务。具备Web3专业、AI驱动、区块链搜索等特色功能，适合Web3生态使用。',
    website_url: 'https://adot.ai',
    tags: ['Web3搜索', '区块链查询', 'AI驱动', '生态专业'],
    pricing_type: 'freemium'
  },
  {
    name: '开搜AI',
    tagline: '面向大众的免费AI问答搜索引擎',
    description: '开搜AI是面向大众的免费AI问答搜索引擎。提供免费搜索、智能问答、大众服务等功能。具备免费使用、智能问答、大众友好等特色功能，适合广大用户使用。',
    website_url: 'https://kaisou.ai',
    tags: ['免费搜索', '智能问答', '大众服务', '用户友好'],
    pricing_type: 'free'
  }
]

// 检查工具是否已存在的函数
async function checkToolExists(name) {
  const { data, error } = await supabase
    .from('tools')
    .select('id')
    .eq('name', name)
    .single()
  
  return !error && data
}

async function insertSearchTools() {
  console.log('开始检查并插入AI搜索引擎工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of searchTools) {
      // 检查工具是否已存在
      const exists = await checkToolExists(tool.name)
      
      if (exists) {
        console.log(`⏭️  跳过已存在的工具: ${tool.name}`)
        skipCount++
        continue
      }
      
      console.log(`正在插入工具: ${tool.name}`)
      
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          id: generateId(),
          name: tool.name,
          tagline: tool.tagline,
          description: tool.description,
          website_url: tool.website_url,
          category: 'search',
          tags: tool.tags,
          pricing_type: tool.pricing_type,
          is_china_available: true,
          is_chinese_supported: true,
          rating: 4.0 + Math.random() * 1.5, // 随机评分 4.0-5.5
          rating_count: Math.floor(Math.random() * 500) + 50, // 随机评价数 50-550
          view_count: Math.floor(Math.random() * 8000) + 1000, // 随机浏览量 1000-9000
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) {
        console.error(`插入工具 ${tool.name} 失败:`, error)
        failCount++
      } else {
        console.log(`✅ 成功插入工具: ${tool.name}, ID: ${data[0].id}`)
        successCount++
      }
      
      // 避免请求过快，稍微延迟
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n🎉 AI搜索引擎工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${searchTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertSearchTools()
