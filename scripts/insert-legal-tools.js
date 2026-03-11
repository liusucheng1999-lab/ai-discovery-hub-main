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

// AI法律工具数据
const legalTools = [
  {
    name: 'iTerms-AI法律',
    tagline: 'AI合同审查｜AI合同起草｜法律AI检索',
    description: 'iTerms-AI法律是AI合同审查、AI合同起草、法律AI检索工具。提供合同审查、合同起草、法律检索等服务。具备审查专业、起草智能、检索便捷等特色功能，适合法律合同使用。',
    website_url: 'https://iterms.ai',
    tags: ['AI合同审查', 'AI合同起草', '法律AI检索', '审查专业'],
    pricing_type: 'freemium'
  },
  {
    name: '吾律AI律师',
    tagline: '首款能交付真实法律任务的AI律师智能体',
    description: '吾律AI律师是首款能交付真实法律任务的AI律师智能体。提供AI律师、智能体服务、真实任务交付等服务。具备智能体专业、律师便捷、任务交付等特色功能，适合AI律师使用。',
    website_url: 'https://wulv.ai',
    tags: ['AI律师', '智能体', '真实任务交付', '律师专业'],
    pricing_type: 'freemium'
  },
  {
    name: '元典智库',
    tagline: '智能法律知识服务平台和搜索引擎',
    description: '元典智库是智能法律知识服务平台和搜索引擎。提供法律知识、智能服务、搜索引擎等功能。具备知识专业、搜索智能、服务全面等特色功能，适合法律知识使用。',
    website_url: 'https://yuandian.com',
    tags: ['智能法律知识', '服务平台', '搜索引擎', '知识专业'],
    pricing_type: 'freemium'
  },
  {
    name: '通义法睿',
    tagline: '阿里推出的免费AI法律顾问助手',
    description: '通义法睿是阿里推出的免费AI法律顾问助手。提供法律顾问、阿里技术、免费使用等服务。具备阿里技术、法律专业、免费使用等特色功能，适合法律顾问使用。',
    website_url: 'https://farui.tongyi.ali.com',
    tags: ['阿里出品', 'AI法律顾问', '免费使用', '法律专业'],
    pricing_type: 'free'
  },
  {
    name: '法行宝',
    tagline: '百度推出的免费AI法律助手',
    description: '法行宝是百度推出的免费AI法律助手。提供AI法律、百度技术、免费使用等服务。具备百度技术、法律专业、免费使用等特色功能，适合AI法律使用。',
    website_url: 'https://faxingbao.baidu.com',
    tags: ['百度出品', 'AI法律助手', '免费使用', '法律专业'],
    pricing_type: 'free'
  },
  {
    name: 'MetaLaw',
    tagline: 'AI法律类案检索与分析助手',
    description: 'MetaLaw是AI法律类案检索与分析助手。提供类案检索、AI分析、法律支持等服务。具备检索专业、分析智能、法律便捷等特色功能，适合类案检索使用。',
    website_url: 'https://metalaw.ai',
    tags: ['AI法律类案', '检索分析', '分析智能', '检索专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChatLaw',
    tagline: '北大开源的法律大模型和助手',
    description: 'ChatLaw是北大开源的法律大模型和助手。提供法律大模型、北大技术、开源免费等服务。具备北大技术、大模型专业、开源免费等特色功能，适合法律大模型使用。',
    website_url: 'https://chatlaw.pku.edu.cn',
    tags: ['北大开源', '法律大模型', '开源免费', '大模型专业'],
    pricing_type: 'opensource'
  },
  {
    name: '得理法搜',
    tagline: 'AI法律智能检索系统',
    description: '得理法搜是AI法律智能检索系统。提供法律检索、AI智能、系统支持等功能。具备检索专业、AI智能、系统便捷等特色功能，适合法律检索使用。',
    website_url: 'https://deli.fasou.com',
    tags: ['AI法律检索', '智能检索', '系统支持', '检索专业'],
    pricing_type: 'freemium'
  },
  {
    name: '法智',
    tagline: '同花顺推出的AI法律助手',
    description: '法智是同花顺推出的AI法律助手。提供AI法律、同花顺技术、专业服务等功能。具备同花顺技术、法律专业、AI便捷等特色功能，适合AI法律使用。',
    website_url: 'https://fazhi.tonghuashun.com',
    tags: ['同花顺', 'AI法律助手', '专业服务', '法律专业'],
    pricing_type: 'freemium'
  },
  {
    name: '海瑞智法',
    tagline: '一站式AI法律咨询助手',
    description: '海瑞智法是一站式AI法律咨询助手。提供法律咨询、AI支持、一站式服务等功能。具备一站式服务、咨询专业、AI便捷等特色功能，适合法律咨询使用。',
    website_url: 'https://hairui.zhifa.com',
    tags: ['一站式服务', 'AI法律咨询', '咨询专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: '合同嗖嗖',
    tagline: '专业的AI法律合同生成工具',
    description: '合同嗖嗖是专业的AI法律合同生成工具。提供合同生成、AI支持、专业服务等功能。具备生成专业、AI智能、合同便捷等特色功能，适合合同生成使用。',
    website_url: 'https://hetong.sousou.com',
    tags: ['AI合同生成', '专业服务', '生成专业', '合同便捷'],
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

async function insertLegalTools() {
  console.log('开始检查并插入AI法律工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of legalTools) {
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
    
    console.log(`\n🎉 AI法律工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${legalTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertLegalTools()
