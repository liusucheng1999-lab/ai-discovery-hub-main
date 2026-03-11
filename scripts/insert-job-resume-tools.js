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

// AI求职和简历工具数据
const jobResumeTools = [
  {
    name: 'UP简历',
    tagline: 'AI聊天搞定简历',
    description: 'UP简历是AI聊天搞定简历。提供AI聊天、简历制作、智能服务等功能。具备聊天专业、简历智能、制作便捷等特色功能，适合简历制作使用。',
    website_url: 'https://upjianli.com',
    tags: ['AI聊天', '简历制作', '智能服务', '聊天专业'],
    pricing_type: 'freemium'
  },
  {
    name: '超级简历',
    tagline: '3分钟生成简历超千万人使用',
    description: '超级简历是3分钟生成简历超千万人使用。提供快速生成、简历专业、大众认可等服务。具备快速生成、简历专业、使用广泛等特色功能，适合简历制作使用。',
    website_url: 'https://chaoji.jianli.com',
    tags: ['快速生成', '简历专业', '大众认可', '生成便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '求职方舟',
    tagline: 'AI求职工具，智能识别自动填简历',
    description: '求职方舟是AI求职工具，智能识别自动填简历。提供AI求职、智能识别、自动填写等服务。具备智能识别、求职专业、填写便捷等特色功能，适合AI求职使用。',
    website_url: 'https://qiuzhi.fangzhou.com',
    tags: ['AI求职', '智能识别', '自动填写', '求职专业'],
    pricing_type: 'freemium'
  },
  {
    name: '面多多',
    tagline: '沉浸式AI模拟面试平台',
    description: '面多多是沉浸式AI模拟面试平台。提供模拟面试、沉浸体验、AI支持等服务。具备沉浸式、模拟专业、面试便捷等特色功能，适合模拟面试使用。',
    website_url: 'https://mianduoduo.com',
    tags: ['沉浸式', 'AI模拟面试', '模拟专业', '体验便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '牛面',
    tagline: 'AI面试工具，专为互联网技术人员打造',
    description: '牛面是AI面试工具，专为互联网技术人员打造。提供AI面试、技术专业、互联网支持等服务。具备技术专业、面试便捷、互联网优化等特色功能，适合技术面试使用。',
    website_url: 'https://niumian.com',
    tags: ['AI面试', '技术专业', '互联网技术', '面试专业'],
    pricing_type: 'freemium'
  },
  {
    name: '面团AI',
    tagline: 'AI面试助手，更高效拿到Offer',
    description: '面团AI是AI面试助手，更高效拿到Offer。提供面试助手、AI支持、Offer获取等服务。具备AI便捷、面试专业、Offer高效等特色功能，适合面试助手使用。',
    website_url: 'https:miantuan.ai',
    tags: ['AI面试助手', 'Offer获取', '面试专业', '获取高效'],
    pricing_type: 'freemium'
  },
  {
    name: '智简简历',
    tagline: '免费AI在线简历制作工具，可视化编辑',
    description: '智简简历是免费AI在线简历制作工具，可视化编辑。提供免费制作、AI简历、可视化编辑等服务。具备免费使用、简历专业、可视化便捷等特色功能，适合简历制作使用。',
    website_url: 'https://zhijian.jianli.com',
    tags: ['免费制作', 'AI简历', '可视化编辑', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: '笔面通',
    tagline: '最牛AI面试神器，大厂Offer拿到手软',
    description: '笔面通是最牛AI面试神器，大厂Offer拿到手软。提供AI面试、大厂支持、Offer获取等服务。具备面试专业、大厂优化、Offer便捷等特色功能，适合大厂面试使用。',
    website_url: 'https://bimiantong.com',
    tags: ['AI面试神器', '大厂Offer', '面试专业', 'Offer获取'],
    pricing_type: 'freemium'
  },
  {
    name: 'AI面试帮',
    tagline: 'AI面试辅助、笔试辅助工具，实时AI提示，offer轻松拿！',
    description: 'AI面试帮是AI面试辅助、笔试辅助工具，实时AI提示，offer轻松拿！提供面试辅助、笔试支持、AI提示等服务。具备实时提示、辅助专业、Offer便捷等特色功能，适合面试辅助使用。',
    website_url: 'https://aimianshibang.com',
    tags: ['AI面试辅助', '笔试辅助', '实时提示', '辅助专业'],
    pricing_type: 'freemium'
  },
  {
    name: '理聘AI',
    tagline: '更懂硕博的AI求职神器',
    description: '理聘AI是更懂硕博的AI求职神器。提供AI求职、硕博专业、求职支持等服务。具备硕博专业、求职智能、支持全面等特色功能，适合硕博求职使用。',
    website_url: 'https://lipin.ai',
    tags: ['硕博专业', 'AI求职', '求职智能', '硕博优化'],
    pricing_type: 'freemium'
  },
  {
    name: '51mee',
    tagline: '浅度求索推出的AI招聘管理工具',
    description: '51mee是浅度求索推出的AI招聘管理工具。提供招聘管理、浅度技术、AI支持等服务。具备浅度技术、管理专业、招聘便捷等特色功能，适合招聘管理使用。',
    website_url: 'https://51mee.com',
    tags: ['浅度求索', 'AI招聘管理', '管理专业', '招聘便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'LovTalent',
    tagline: 'AI 原生求职智能体平台',
    description: 'LovTalent是AI原生求职智能体平台。提供求职智能体、AI原生、平台支持等服务。具备AI原生、智能体专业、求职便捷等特色功能，适合智能体求职使用。',
    website_url: 'https://lovtalent.com',
    tags: ['AI原生', '求职智能体', '平台专业', '智能体便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'TelehireAI面试',
    tagline: '最轻量级的全领域AI面试官',
    description: 'TelehireAI面试是最轻量级的全领域AI面试官。提供AI面试官、轻量级、全领域支持等服务。具备轻量级、面试官专业、全领域覆盖等特色功能，适合AI面试官使用。',
    website_url: 'https://telehire.ai',
    tags: ['轻量级', 'AI面试官', '全领域', '面试官专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'DINQ',
    tagline: 'AI人才发现与分析平台，精准识别AI精英',
    description: 'DINQ是AI人才发现与分析平台，精准识别AI精英。提供人才发现、AI分析、精英识别等服务。具备AI分析、发现专业、精英识别等特色功能，适合人才发现使用。',
    website_url: 'https://dinq.ai',
    tags: ['AI人才发现', '分析平台', '精英识别', '发现专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Mercor',
    tagline: 'AI招聘求职平台',
    description: 'Mercor是AI招聘求职平台。提供AI招聘、求职支持、平台服务等功能。具备招聘专业、求职便捷、平台全面等特色功能，适合招聘求职使用。',
    website_url: 'https://mercor.com',
    tags: ['AI招聘', '求职平台', '平台全面', '招聘专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Offerin',
    tagline: 'AI面试笔试助手，精准识别面试问题秒级生成答案',
    description: 'Offerin是AI面试笔试助手，精准识别面试问题秒级生成答案。提供面试笔试、AI助手、问题识别等服务。具备精准识别、答案生成、笔试专业等特色功能，适合面试笔试使用。',
    website_url: 'https://offerin.com',
    tags: ['AI面试笔试', '问题识别', '答案生成', '笔试专业'],
    pricing_type: 'freemium'
  },
  {
    name: '智面星',
    tagline: 'AI面试辅助工具，提供全流程的面试辅助',
    description: '智面星是AI面试辅助工具，提供全流程的面试辅助。提供面试辅助、全流程支持、AI服务等功能。具备全流程、辅助专业、AI便捷等特色功能，适合面试辅助使用。',
    website_url: 'https://zhimianxing.com',
    tags: ['AI面试辅助', '全流程', '辅助专业', '流程全面'],
    pricing_type: 'freemium'
  },
  {
    name: '多面鹅',
    tagline: '免费大厂面试模拟器，线上面试答案提词器',
    description: '多面鹅是免费大厂面试模拟器，线上面试答案提词器。提供大厂模拟、答案提词、免费使用等服务。具备免费使用、大厂专业、提词便捷等特色功能，适合大厂模拟使用。',
    website_url: 'https://duomiane.com',
    tags: ['免费大厂', '面试模拟器', '答案提词', '模拟专业'],
    pricing_type: 'free'
  },
  {
    name: 'Gank Interview',
    tagline: '专为笔试和面试设计的AI面试助手',
    description: 'Gank Interview是专为笔试和面试设计的AI面试助手。提供笔试面试、AI助手、专业设计等服务。具备专业设计、笔试面试、助手便捷等特色功能，适合笔试面试使用。',
    website_url: 'https://interview.gank.io',
    tags: ['笔试面试', 'AI面试助手', '专业设计', '助手专业'],
    pricing_type: 'freemium'
  },
  {
    name: '面试猫',
    tagline: 'AI面试辅助工具，实时语音识别面试官问题',
    description: '面试猫是AI面试辅助工具，实时语音识别面试官问题。提供面试辅助、语音识别、实时支持等服务。具备语音识别、实时专业、辅助便捷等特色功能，适合面试辅助使用。',
    website_url: 'https://mianshimao.com',
    tags: ['AI面试辅助', '语音识别', '实时支持', '识别专业'],
    pricing_type: 'freemium'
  },
  {
    name: '白瓜面试',
    tagline: '在线AI面试助手，快速生成面试问题的答案',
    description: '白瓜面试是在线AI面试助手，快速生成面试问题的答案。提供在线面试、答案生成、AI支持等服务。具备答案生成、在线便捷、AI专业等特色功能，适合在线面试使用。',
    website_url: 'https://baigua.mianshi.com',
    tags: ['在线AI面试', '答案生成', 'AI支持', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: '职徒简历',
    tagline: '智能简历制作软件，基于GPT的简历优化和简历代写',
    description: '职徒简历是智能简历制作软件，基于GPT的简历优化和简历代写。提供简历制作、GPT技术、优化代写等服务。具备GPT技术、制作专业、优化便捷等特色功能，适合简历制作使用。',
    website_url: 'https://zhitu.jianli.com',
    tags: ['GPT技术', '简历优化', '简历代写', '制作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '职得简历',
    tagline: '在线AI简历生成工具',
    description: '职得简历是在线AI简历生成工具。提供在线生成、AI简历、专业服务等功能。具备在线便捷、简历专业、生成智能等特色功能，适合简历生成使用。',
    website_url: 'https://zhide.jianli.com',
    tags: ['在线AI简历', '生成工具', '在线便捷', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: '蓝字典AI求职',
    tagline: 'AI求职工具，提供AI简历生成、AI模拟面试服务',
    description: '蓝字典AI求职是AI求职工具，提供AI简历生成、AI模拟面试服务。提供AI求职、简历生成、模拟面试等服务。具备求职专业、生成便捷、模拟智能等特色功能，适合AI求职使用。',
    website_url: 'https://lanzidian.ai',
    tags: ['AI求职', '简历生成', '模拟面试', '求职专业'],
    pricing_type: 'freemium'
  },
  {
    name: '神笔简历',
    tagline: 'AI简历云平台，专为求职者提供一站式求职服务',
    description: '神笔简历是AI简历云平台，专为求职者提供一站式求职服务。提供简历云平台、一站式服务、求职支持等功能。具备一站式服务、云平台专业、求职便捷等特色功能，适合求职服务使用。',
    website_url: 'https://shenbi.jianli.com',
    tags: ['AI简历云平台', '一站式服务', '求职支持', '云平台专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'YOO简历',
    tagline: '必优科技推出的AI',
    description: 'YOO简历是必优科技推出的AI简历工具。提供AI简历、必优技术、专业服务等功能。具备必优技术、简历专业、AI便捷等特色功能，适合AI简历使用。',
    website_url: 'https://yoo.jianli.biyou.com',
    tags: ['必优科技', 'AI简历', '专业服务', '技术先进'],
    pricing_type: 'freemium'
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

async function insertJobResumeTools() {
  console.log('开始检查并插入AI求职和简历工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of jobResumeTools) {
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
          category: 'office',
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
    
    console.log(`\n🎉 AI求职和简历工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${jobResumeTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertJobResumeTools()
