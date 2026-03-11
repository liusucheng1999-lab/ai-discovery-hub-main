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

// AI办公和数据分析工具数据
const officeDataTools = [
  {
    name: '办公小浣熊',
    tagline: '最强AI数据分析助手',
    description: '办公小浣熊是最强AI数据分析助手。提供数据分析、AI支持、办公专业等服务。具备AI分析、数据专业、办公便捷等特色功能，适合数据分析使用。',
    website_url: 'https://ban.xiaohuaxiong.com',
    tags: ['AI数据分析', '办公助手', '数据分析', 'AI分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChatExcel',
    tagline: 'AI Excel表格处理与数据分析工具',
    description: 'ChatExcel是AI Excel表格处理与数据分析工具。提供Excel处理、数据分析、AI支持等服务。具备Excel专业、AI分析、处理便捷等特色功能，适合Excel处理使用。',
    website_url: 'https://chatexcel.com',
    tags: ['AI Excel', '表格处理', '数据分析', 'Excel专业'],
    pricing_type: 'freemium'
  },
  {
    name: '察言观数AskTable',
    tagline: '企业级AI数据智能体平台',
    description: '察言观数AskTable是企业级AI数据智能体平台。提供企业级服务、AI数据智能、平台支持等功能。具备企业级、数据智能、平台专业等特色功能，适合企业数据使用。',
    website_url: 'https://asktable.com',
    tags: ['企业级', 'AI数据智能', '平台专业', '企业服务'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tomoro',
    tagline: '腾讯灯塔推出的AI原生大数据分析工具',
    description: 'Tomoro是腾讯灯塔推出的AI原生大数据分析工具。提供大数据分析、腾讯技术、AI原生等服务。具备腾讯技术、大数据专业、AI原生等特色功能，适合大数据分析使用。',
    website_url: 'https://tomoro.tencent.com',
    tags: ['腾讯灯塔', '大数据分析', 'AI原生', '大数据专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Shortcut',
    tagline: 'AI Excel 超级智能体，处理复杂 Excel 任务',
    description: 'Shortcut是AI Excel超级智能体，处理复杂Excel任务。提供Excel智能体、复杂任务处理、AI支持等服务。具备Excel专业、智能体便捷、任务处理等特色功能，适合Excel任务使用。',
    website_url: 'https://shortcut.excel.com',
    tags: ['AI Excel', '超级智能体', '复杂任务', 'Excel专业'],
    pricing_type: 'freemium'
  },
  {
    name: '爱图表',
    tagline: '镝数科技推出的AI数据可视化和分析工具',
    description: '爱图表是镝数科技推出的AI数据可视化和分析工具。提供数据可视化、AI分析、镝数技术等服务。具备镝数技术、可视化专业、AI分析等特色功能，适合数据可视化使用。',
    website_url: 'https://aichart.deyi.com',
    tags: ['镝数科技', '数据可视化', 'AI分析', '可视化专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChartinAI',
    tagline: '一句话生成专业图表，AI自动搜集数据并可视化',
    description: 'ChartinAI是一句话生成专业图表，AI自动搜集数据并可视化。提供一句话生成、专业图表、数据搜集等服务。具备一句话生成、图表专业、数据搜集等特色功能，适合图表生成使用。',
    website_url: 'https://chartinai.com',
    tags: ['一句话生成', '专业图表', '数据搜集', '图表专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'vika维格云',
    tagline: '智能多维表格和数据生产力平台',
    description: 'vika维格云是智能多维表格和数据生产力平台。提供多维表格、数据生产力、智能支持等功能。具备多维表格、生产力专业、智能便捷等特色功能，适合数据表格使用。',
    website_url: 'https://vika.cn',
    tags: ['多维表格', '数据生产力', '智能支持', '生产力专业'],
    pricing_type: 'freemium'
  },
  {
    name: '百度GBI',
    tagline: '百度推出的全球商业智能平台',
    description: '百度GBI是百度推出的全球商业智能平台。提供商业智能、百度技术、全球服务等功能。具备百度技术、商业智能、全球服务专业等特色功能，适合商业智能使用。',
    website_url: 'https://gbi.baidu.com',
    tags: ['百度出品', '商业智能', '全球服务', '商业专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Ajelix',
    tagline: '处理Excel和Google Sheets表格的AI工具',
    description: 'Ajelix是处理Excel和Google Sheets表格的AI工具。提供表格处理、Excel支持、Google Sheets兼容等服务。具备表格专业、Excel兼容、处理便捷等特色功能，适合表格处理使用。',
    website_url: 'https://ajelix.com',
    tags: ['表格处理', 'Excel兼容', 'Google Sheets', '表格专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Sheet+',
    tagline: 'Excel和Google Sheets表格AI处理工具',
    description: 'Sheet+是Excel和Google Sheets表格AI处理工具。提供表格AI处理、Excel支持、Google Sheets兼容等服务。具备AI处理、表格专业、兼容便捷等特色功能，适合表格处理使用。',
    website_url: 'https://sheetplus.ai',
    tags: ['表格AI处理', 'Excel兼容', 'Google Sheets', 'AI处理专业'],
    pricing_type: 'freemium'
  },
  {
    name: '轻云图',
    tagline: '必优科技推出的AI一键生成可视化云图工具',
    description: '轻云图是必优科技推出的AI一键生成可视化云图工具。提供可视化云图、一键生成、必优技术等服务。具备必优技术、云图专业、一键生成等特色功能，适合可视化使用。',
    website_url: 'https://qingyun.biyou.com',
    tags: ['必优科技', '可视化云图', '一键生成', '可视化专业'],
    pricing_type: 'freemium'
  },
  {
    name: '北极九章',
    tagline: '北极数据推出的AI数据分析平台',
    description: '北极九章是北极数据推出的AI数据分析平台。提供数据分析、北极数据技术、AI支持等服务。具备北极数据技术、分析专业、AI便捷等特色功能，适合数据分析使用。',
    website_url: 'https://jiuzhang.beiji.cn',
    tags: ['北极数据', 'AI数据分析', '分析专业', '数据技术'],
    pricing_type: 'freemium'
  },
  {
    name: 'Formula bot',
    tagline: 'AI将指令转换成Excel的函数公式',
    description: 'Formula bot是AI将指令转换成Excel的函数公式。提供指令转换、Excel公式、AI支持等服务。具备指令转换、公式专业、AI便捷等特色功能，适合Excel公式使用。',
    website_url: 'https://formulabot.com',
    tags: ['指令转换', 'Excel公式', 'AI支持', '公式专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'FormX.ai',
    tagline: 'AI自动从表格和文档中提取数据',
    description: 'FormX.ai是AI自动从表格和文档中提取数据。提供数据提取、表格支持、文档处理等服务。具备数据提取、表格专业、文档便捷等特色功能，适合数据提取使用。',
    website_url: 'https://formx.ai',
    tags: ['数据提取', '表格支持', '文档处理', '提取专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Rows',
    tagline: '集成了AI功能的在线表格处理工具',
    description: 'Rows是集成了AI功能的在线表格处理工具。提供在线表格、AI集成、处理专业等服务。具备AI集成、表格专业、在线便捷等特色功能，适合在线表格使用。',
    website_url: 'https://rows.com',
    tags: ['在线表格', 'AI集成', '处理专业', '在线便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Excelly-AI',
    tagline: '将文本转换成Excel或Google Sheets公式',
    description: 'Excelly-AI是将文本转换成Excel或Google Sheets公式。提供文本转换、Excel公式、Google Sheets兼容等服务。具备文本转换、公式专业、兼容便捷等特色功能，适合公式转换使用。',
    website_url: 'https://excelly.ai',
    tags: ['文本转换', 'Excel公式', 'Google Sheets', '公式专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'SheetGod',
    tagline: 'BoloForms推出的AI Excel公式生成工具',
    description: 'SheetGod是BoloForms推出的AI Excel公式生成工具。提供Excel公式生成、BoloForms技术、AI支持等服务。具备BoloForms技术、公式专业、AI生成等特色功能，适合Excel公式使用。',
    website_url: 'https://sheetgod.boloforms.com',
    tags: ['BoloForms', 'Excel公式生成', 'AI支持', '公式专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Excel Formularizer',
    tagline: 'AI将文本输入转换为',
    description: 'Excel Formularizer是AI将文本输入转换为Excel公式。提供文本转换、Excel公式、AI支持等服务。具备文本转换、公式专业、AI便捷等特色功能，适合Excel公式使用。',
    website_url: 'https://excelformularizer.com',
    tags: ['文本转换', 'Excel公式', 'AI支持', '公式专业'],
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

async function insertOfficeDataTools() {
  console.log('开始检查并插入AI办公和数据分析工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of officeDataTools) {
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
    
    console.log(`\n🎉 AI办公和数据分析工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${officeDataTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertOfficeDataTools()
