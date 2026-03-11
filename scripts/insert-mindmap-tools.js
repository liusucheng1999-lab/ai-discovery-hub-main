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

// AI思维导图和白板工具数据
const mindmapTools = [
  {
    name: 'TreeMind树图',
    tagline: '新一代AI智能思维导图，一句话生成思维导图',
    description: 'TreeMind树图是新一代AI智能思维导图，一句话生成思维导图。提供智能思维导图、一句话生成、AI支持等服务。具备一句话生成、思维导图专业、AI智能等特色功能，适合思维导图使用。',
    website_url: 'https://treemind.com',
    tags: ['AI思维导图', '一句话生成', '智能导图', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: '博思白板',
    tagline: '博思云创推出的AI多功能白板工具',
    description: '博思白板是博思云创推出的AI多功能白板工具。提供多功能白板、博思技术、AI支持等服务。具备博思技术、白板专业、多功能便捷等特色功能，适合白板使用。',
    website_url: 'https://bosi.whiteboard.com',
    tags: ['博思云创', '多功能白板', 'AI支持', '白板专业'],
    pricing_type: 'freemium'
  },
  {
    name: '畅图AI',
    tagline: 'AI图表生成工具，一键生成思维导图、流程图',
    description: '畅图AI是AI图表生成工具，一键生成思维导图、流程图。提供图表生成、思维导图、流程图支持等服务。具备一键生成、图表专业、思维导图便捷等特色功能，适合图表生成使用。',
    website_url: 'https://changtu.ai',
    tags: ['AI图表生成', '思维导图', '流程图', '图表专业'],
    pricing_type: 'freemium'
  },
  {
    name: '可赞AI',
    tagline: 'AI办公可视化工具，文字转图表',
    description: '可赞AI是AI办公可视化工具，文字转图表。提供办公可视化、文字转图表、AI支持等服务。具备文字转换、图表专业、办公便捷等特色功能，适合办公可视化使用。',
    website_url: 'https://kezann.ai',
    tags: ['AI办公可视化', '文字转图表', '办公便捷', '转换专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ProcessOn',
    tagline: '在线AI流程图和思维导图制作工具',
    description: 'ProcessOn是在线AI流程图和思维导图制作工具。提供流程图制作、思维导图、在线服务等功能。具备在线便捷、流程图专业、思维导图支持等特色功能，适合流程图使用。',
    website_url: 'https://processon.com',
    tags: ['在线流程图', '思维导图', '在线便捷', '流程图专业'],
    pricing_type: 'freemium'
  },
  {
    name: '自由画布',
    tagline: '百度文库和百度网盘联合推出的AI万能白板',
    description: '自由画布是百度文库和百度网盘联合推出的AI万能白板。提供万能白板、百度技术、AI支持等服务。具备百度技术、白板专业、万能便捷等特色功能，适合白板使用。',
    website_url: 'https://freehuabu.baidu.com',
    tags: ['百度出品', '万能白板', 'AI支持', '白板专业'],
    pricing_type: 'freemium'
  },
  {
    name: '亿图脑图',
    tagline: '万兴科技推出的跨端AI思维导图助手',
    description: '亿图脑图是万兴科技推出的跨端AI思维导图助手。提供跨端思维导图、万兴技术、AI支持等服务。具备万兴技术、跨端专业、思维导图便捷等特色功能，适合跨端使用。',
    website_url: 'https://yitu.naotu.wondershare.com',
    tags: ['万兴科技', '跨端思维导图', 'AI支持', '跨端专业'],
    pricing_type: 'freemium'
  },
  {
    name: '妙办画板',
    tagline: '在线实时协作的画图工具，AI一键生成流程图',
    description: '妙办画板是在线实时协作的画图工具，AI一键生成流程图。提供实时协作、画图工具、AI生成等服务。具备实时协作、画图专业、AI生成等特色功能，适合协作画图使用。',
    website_url: 'https://miaoban.huaban.com',
    tags: ['实时协作', '画图工具', 'AI生成', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Mapify',
    tagline: 'Xmind推出的AI思维导图生成工具',
    description: 'Mapify是Xmind推出的AI思维导图生成工具。提供思维导图生成、Xmind技术、AI支持等服务。具备Xmind技术、思维导图专业、AI生成等特色功能，适合思维导图使用。',
    website_url: 'https://mapify.xmind.com',
    tags: ['Xmind出品', 'AI思维导图', '生成专业', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '小画桌',
    tagline: '在线协作白板工具，内置AIGC功能',
    description: '小画桌是在线协作白板工具，内置AIGC功能。提供协作白板、AIGC功能、在线服务等功能。具备AIGC专业、协作便捷、白板智能等特色功能，适合协作白板使用。',
    website_url: 'https://xiaohuazhuo.com',
    tags: ['协作白板', 'AIGC功能', '在线服务', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '印象图记',
    tagline: '印象AI加持的在线思维导图工具',
    description: '印象图记是印象AI加持的在线思维导图工具。提供在线思维导图、印象技术、AI加持等服务。具备印象技术、思维导图专业、AI加持等特色功能，适合思维导图使用。',
    website_url: 'https://tuji.yinxiang.com',
    tags: ['印象出品', '在线思维导图', 'AI加持', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '知犀AI',
    tagline: '知犀推出的AI思维导图生成工具',
    description: '知犀AI是知犀推出的AI思维导图生成工具。提供思维导图生成、知犀技术、AI支持等服务。具备知犀技术、思维导图专业、AI生成等特色功能，适合思维导图使用。',
    website_url: 'https://zhixi.ai',
    tags: ['知犀出品', 'AI思维导图', '生成专业', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Xmind AI',
    tagline: 'Xmind AI思维导图助手',
    description: 'Xmind AI是Xmind AI思维导图助手。提供AI思维导图、Xmind技术、专业服务等功能。具备Xmind技术、思维导图专业、AI便捷等特色功能，适合思维导图使用。',
    website_url: 'https://xmind.ai',
    tags: ['Xmind出品', 'AI思维导图', '专业服务', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'GitMind思乎',
    tagline: 'AI驱动的免费思维导图工具',
    description: 'GitMind思乎是AI驱动的免费思维导图工具。提供AI驱动、免费使用、思维导图等服务。具备AI驱动、免费专业、思维导图便捷等特色功能，适合思维导图使用。',
    website_url: 'https://gitmind.com',
    tags: ['AI驱动', '免费思维导图', '免费使用', '驱动专业'],
    pricing_type: 'free'
  },
  {
    name: '亿图图示AI',
    tagline: '专业的办公绘图软件，轻松绘制图表和图形',
    description: '亿图图示AI是专业的办公绘图软件，轻松绘制图表和图形。提供办公绘图、图表绘制、图形支持等服务。具备绘图专业、图表便捷、图形丰富等特色功能，适合办公绘图使用。',
    website_url: 'https://edraw.ai',
    tags: ['办公绘图', '图表绘制', '图形支持', '绘图专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Whimsical',
    tagline: 'Whimsical推出的AI思维导图工具',
    description: 'Whimsical是Whimsical推出的AI思维导图工具。提供AI思维导图、Whimsical技术、专业服务等功能。具备Whimsical技术、思维导图专业、服务全面等特色功能，适合思维导图使用。',
    website_url: 'https://whimsical.com',
    tags: ['Whimsical出品', 'AI思维导图', '专业服务', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'AmyMind',
    tagline: '开箱即用的在线AI思维导图工具',
    description: 'AmyMind是开箱即用的在线AI思维导图工具。提供开箱即用、在线思维导图、AI支持等服务。具备开箱即用、思维导图专业、在线便捷等特色功能，适合思维导图使用。',
    website_url: 'https://amymind.com',
    tags: ['开箱即用', '在线思维导图', 'AI支持', '使用便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Taskade',
    tagline: '高颜值AI大纲和思维导图生成',
    description: 'Taskade是高颜值AI大纲和思维导图生成。提供高颜值生成、大纲支持、思维导图等服务。具备高颜值专业、大纲便捷、思维导图美观等特色功能，适合思维导图使用。',
    website_url: 'https://taskade.com',
    tags: ['高颜值', 'AI大纲', '思维导图', '美观专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Miro AI',
    tagline: '在线白板协作工具推出的AI功能，Beta测试中',
    description: 'Miro AI是在线白板协作工具推出的AI功能，Beta测试中。提供白板协作、AI功能、Beta测试等服务。具备协作专业、AI便捷、Beta创新等特色功能，适合白板协作使用。',
    website_url: 'https://miro.com/ai',
    tags: ['在线白板', '协作工具', 'AI功能', 'Beta测试'],
    pricing_type: 'freemium'
  },
  {
    name: 'Ayoa Ultimate',
    tagline: 'AI思维导图和任务管理工具',
    description: 'Ayoa Ultimate是AI思维导图和任务管理工具。提供思维导图、任务管理、AI支持等服务。具备思维导图专业、任务管理、AI便捷等特色功能，适合任务管理使用。',
    website_url: 'https://ayoa.com',
    tags: ['AI思维导图', '任务管理', 'AI支持', '管理专业'],
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

async function insertMindmapTools() {
  console.log('开始检查并插入AI思维导图和白板工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of mindmapTools) {
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
    
    console.log(`\n🎉 AI思维导图和白板工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${mindmapTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertMindmapTools()
