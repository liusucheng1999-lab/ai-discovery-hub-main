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

// AI文档工具数据
const documentTools = [
  {
    name: 'txyz',
    tagline: 'AI文献阅读和学术研究辅助平台',
    description: 'txyz是AI文献阅读和学术研究辅助平台。提供文献阅读、学术研究、AI支持等服务。具备AI阅读、学术专业、研究便捷等特色功能，适合学术研究使用。',
    website_url: 'https://txyz.ai',
    tags: ['AI文献阅读', '学术研究', 'AI支持', '学术专业'],
    pricing_type: 'freemium'
  },
  {
    name: '小绿鲸',
    tagline: 'AI英文文献阅读工具',
    description: '小绿鲸是AI英文文献阅读工具。提供英文文献阅读、AI支持、专业服务等功能。具备英文阅读、AI专业、文献便捷等特色功能，适合英文文献使用。',
    website_url: 'https://xiaolvjing.com',
    tags: ['AI英文文献', '文献阅读', 'AI支持', '英文专业'],
    pricing_type: 'freemium'
  },
  {
    name: '包阅AI',
    tagline: '高效的AI智能阅读助手',
    description: '包阅AI是高效的AI智能阅读助手。提供智能阅读、AI支持、高效服务等功能。具备智能阅读、AI专业、高效便捷等特色功能，适合智能阅读使用。',
    website_url: 'https://baoyue.ai',
    tags: ['AI智能阅读', '高效阅读', 'AI支持', '智能专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Wisfile',
    tagline: 'AI文件整理工具，支持批量归纳文件',
    description: 'Wisfile是AI文件整理工具，支持批量归纳文件。提供文件整理、批量归纳、AI支持等服务。具备批量整理、AI专业、文件便捷等特色功能，适合文件整理使用。',
    website_url: 'https://wisfile.com',
    tags: ['AI文件整理', '批量归纳', 'AI支持', '整理专业'],
    pricing_type: 'freemium'
  },
  {
    name: '凹凸工坊',
    tagline: '一键生成手写文稿',
    description: '凹凸工坊是一键生成手写文稿。提供手写文稿、一键生成、AI支持等服务。具备一键生成、手写专业、文稿便捷等特色功能，适合手写文稿使用。',
    website_url: 'https://aotu.gongfang.com',
    tags: ['手写文稿', '一键生成', 'AI支持', '手写专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'OmniBox小黑',
    tagline: '解析全网内容 秒变文本生产力',
    description: 'OmniBox小黑是解析全网内容，秒变文本生产力。提供全网解析、文本生产力、AI支持等服务。具备全网解析、文本专业、生产力便捷等特色功能，适合文本生产使用。',
    website_url: 'https://omnibox.xiaohei.com',
    tags: ['全网解析', '文本生产力', 'AI支持', '解析专业'],
    pricing_type: 'freemium'
  },
  {
    name: '智写流程',
    tagline: 'AI文档工具，捕捉网页操作自动生成图文教程',
    description: '智写流程是AI文档工具，捕捉网页操作自动生成图文教程。提供流程文档、捕捉操作、图文教程等服务。具备捕捉专业、图文教程、文档便捷等特色功能，适合流程文档使用。',
    website_url: 'https://zhixie.liucheng.com',
    tags: ['AI文档工具', '捕捉操作', '图文教程', '教程专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Doc2X',
    tagline: 'AI文档识别、转换与翻译工具',
    description: 'Doc2X是AI文档识别、转换与翻译工具。提供文档识别、转换翻译、AI支持等服务。具备识别专业、转换便捷、翻译智能等特色功能，适合文档处理使用。',
    website_url: 'https://doc2x.com',
    tags: ['AI文档识别', '转换翻译', 'AI支持', '识别专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Acrobat AI Assistant',
    tagline: 'Adobe推出的Acrobat PDF文档AI助手',
    description: 'Acrobat AI Assistant是Adobe推出的Acrobat PDF文档AI助手。提供PDF文档、Adobe技术、AI支持等服务。具备Adobe技术、PDF专业、AI便捷等特色功能，适合PDF文档使用。',
    website_url: 'https://acrobat.adobe.com/ai',
    tags: ['Adobe出品', 'PDF文档', 'AI支持', 'PDF专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'WPS AI',
    tagline: 'WPS推出的AI办公助手，已免费开放',
    description: 'WPS AI是WPS推出的AI办公助手，已免费开放。提供AI办公、WPS技术、免费使用等服务。具备WPS技术、办公专业、免费使用等特色功能，适合办公使用。',
    website_url: 'https://ai.wps.cn',
    tags: ['WPS出品', 'AI办公', '免费使用', '办公专业'],
    pricing_type: 'free'
  },
  {
    name: '腾讯文档智能助手',
    tagline: '腾讯推出的AI文档生成和辅助工具',
    description: '腾讯文档智能助手是腾讯推出的AI文档生成和辅助工具。提供文档生成、腾讯技术、AI辅助等服务。具备腾讯技术、文档专业、AI便捷等特色功能，适合文档生成使用。',
    website_url: 'https://docs.qq.com/ai',
    tags: ['腾讯出品', 'AI文档生成', 'AI辅助', '文档专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Cubox',
    tagline: '高效的AI阅读学习助手和信息收集管理工具',
    description: 'Cubox是高效的AI阅读学习助手和信息收集管理工具。提供阅读学习、信息收集、AI支持等服务。具备阅读专业、收集管理、AI便捷等特色功能，适合信息管理使用。',
    website_url: 'https://cubox.cc',
    tags: ['AI阅读学习', '信息收集', '管理工具', '阅读专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Quivr',
    tagline: '开源的知识库搭建工具，构建你的第二大脑',
    description: 'Quivr是开源的知识库搭建工具，构建你的第二大脑。提供知识库搭建、开源免费、第二大脑等服务。具备开源免费、知识库专业、大脑构建等特色功能，适合知识库使用。',
    website_url: 'https://quivr.app',
    tags: ['开源知识库', '第二大脑', '知识库专业', '开源免费'],
    pricing_type: 'opensource'
  },
  {
    name: 'Coda',
    tagline: '在线协作平台Coda推出的AI写作和文档助手，类似于Notion AI',
    description: 'Coda是在线协作平台Coda推出的AI写作和文档助手，类似于Notion AI。提供AI写作、文档助手、Coda技术等服务。具备Coda技术、写作专业、文档便捷等特色功能，适合写作文档使用。',
    website_url: 'https://coda.io/ai',
    tags: ['Coda出品', 'AI写作', '文档助手', '写作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '有道速读',
    tagline: '网易有道推出的AI论文和文档阅读助手',
    description: '有道速读是网易有道推出的AI论文和文档阅读助手。提供论文阅读、有道技术、AI支持等服务。具备有道技术、论文专业、阅读便捷等特色功能，适合论文阅读使用。',
    website_url: 'https://sudu.youdao.com',
    tags: ['网易有道', 'AI论文阅读', 'AI支持', '论文专业'],
    pricing_type: 'freemium'
  },
  {
    name: '腾讯问卷',
    tagline: '腾讯推出的AI生成调查问卷的免费工具',
    description: '腾讯问卷是腾讯推出的AI生成调查问卷的免费工具。提供问卷生成、腾讯技术、免费使用等服务。具备腾讯技术、问卷专业、免费使用等特色功能，适合问卷生成使用。',
    website_url: 'https://wj.qq.com/ai',
    tags: ['腾讯出品', 'AI问卷生成', '免费使用', '问卷专业'],
    pricing_type: 'free'
  },
  {
    name: '匡优AI',
    tagline: 'AI出题工具，快速生成各类考试题目',
    description: '匡优AI是AI出题工具，快速生成各类考试题目。提供出题工具、AI支持、考试题目等服务。具备出题专业、AI便捷、题目生成等特色功能，适合出题使用。',
    website_url: 'https://kuangyou.ai',
    tags: ['AI出题', '考试题目', 'AI支持', '出题专业'],
    pricing_type: 'freemium'
  },
  {
    name: '通义智文',
    tagline: '基于通义大模型的AI阅读助手，可智能阅读网页、论文、图书和文档',
    description: '通义智文是基于通义大模型的AI阅读助手，可智能阅读网页、论文、图书和文档。提供智能阅读、通义技术、多格式支持等服务。具备通义技术、阅读专业、多格式支持等特色功能，适合智能阅读使用。',
    website_url: 'https://zhiwen.tongyi.ali.com',
    tags: ['通义大模型', 'AI阅读助手', '多格式支持', '阅读专业'],
    pricing_type: 'freemium'
  },
  {
    name: '字语智能',
    tagline: '一站式智能Office内容创作平台',
    description: '字语智能是一站式智能Office内容创作平台。提供Office创作、智能支持、一站式服务等功能。具备一站式服务、Office专业、创作便捷等特色功能，适合Office创作使用。',
    website_url: 'https://ziyu.zhineng.com',
    tags: ['一站式平台', 'Office创作', '智能支持', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '星火文档问答',
    tagline: '基于讯飞星火大模型的AI文档和知识库问答助手',
    description: '星火文档问答是基于讯飞星火大模型的AI文档和知识库问答助手。提供文档问答、星火技术、知识库支持等服务。具备星火技术、问答专业、知识库便捷等特色功能，适合文档问答使用。',
    website_url: 'https://wenwen.xinghuo.cn',
    tags: ['讯飞星火', 'AI文档问答', '知识库支持', '问答专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'PMAI',
    tagline: '面向产品经理的AI助手',
    description: 'PMAI是面向产品经理的AI助手。提供产品经理、AI支持、专业服务等功能。具备产品经理专业、AI便捷、服务全面等特色功能，适合产品经理使用。',
    website_url: 'https://pm.ai',
    tags: ['产品经理', 'AI助手', '专业服务', '经理专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'PDF.ai',
    tagline: 'AI PDF文档阅读工具，智能文档总结摘要',
    description: 'PDF.ai是AI PDF文档阅读工具，智能文档总结摘要。提供PDF阅读、AI总结、摘要生成等服务。具备PDF专业、AI总结、摘要便捷等特色功能，适合PDF阅读使用。',
    website_url: 'https://pdf.ai',
    tags: ['AI PDF阅读', '文档总结', '摘要生成', 'PDF专业'],
    pricing_type: 'freemium'
  },
  {
    name: '司马阅',
    tagline: 'AI文档阅读分析工具',
    description: '司马阅是AI文档阅读分析工具。提供文档阅读、AI分析、专业服务等功能。具备阅读专业、分析智能、服务全面等特色功能，适合文档分析使用。',
    website_url: 'https://simayue.com',
    tags: ['AI文档阅读', '文档分析', '分析智能', '阅读专业'],
    pricing_type: 'freemium'
  },
  {
    name: '知我AI',
    tagline: '智能阅读机器人，AI总结文档、网页、视频、播客等',
    description: '知我AI是智能阅读机器人，AI总结文档、网页、视频、播客等。提供智能阅读、多格式总结、AI支持等服务。具备多格式总结、阅读专业、AI便捷等特色功能，适合智能阅读使用。',
    website_url: 'https://zhiwo.ai',
    tags: ['智能阅读', '多格式总结', 'AI支持', '阅读专业'],
    pricing_type: 'freemium'
  },
  {
    name: '星火科研助手',
    tagline: '科大讯飞联合中科院推出的AI科研文献助手',
    description: '星火科研助手是科大讯飞联合中科院推出的AI科研文献助手。提供科研文献、讯飞技术、中科院支持等服务。具备讯飞技术、科研专业、文献便捷等特色功能，适合科研文献使用。',
    website_url: 'https://keyan.xinghuo.cn',
    tags: ['科大讯飞', '中科院', 'AI科研文献', '科研专业'],
    pricing_type: 'freemium'
  },
  {
    name: '印象AI',
    tagline: '印象笔记推出的AI知识和信息管理功能',
    description: '印象AI是印象笔记推出的AI知识和信息管理功能。提供知识管理、印象技术、AI支持等服务。具备印象技术、知识专业、管理便捷等特色功能，适合知识管理使用。',
    website_url: 'https://yinxiang.ai',
    tags: ['印象笔记', 'AI知识管理', '信息管理', '知识专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Craft AI Assistant',
    tagline: '在线文档工具Craft推出的AI文档和创作助手',
    description: 'Craft AI Assistant是在线文档工具Craft推出的AI文档和创作助手。提供AI文档、创作助手、Craft技术等服务。具备Craft技术、文档专业、创作便捷等特色功能，适合文档创作使用。',
    website_url: 'https://craft.do/ai',
    tags: ['Craft出品', 'AI文档', '创作助手', '文档专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Humata',
    tagline: '基于GPT的AI文档分析、阅读和问答工具',
    description: 'Humata是基于GPT的AI文档分析、阅读和问答工具。提供文档分析、GPT技术、问答支持等服务。具备GPT技术、分析专业、问答便捷等特色功能，适合文档分析使用。',
    website_url: 'https://humata.ai',
    tags: ['GPT技术', 'AI文档分析', '问答支持', '分析专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChatDOC',
    tagline: '基于ChatGPT的文档阅读、提取、总结、摘要的工具',
    description: 'ChatDOC是基于ChatGPT的文档阅读、提取、总结、摘要的工具。提供文档阅读、ChatGPT技术、总结提取等服务。具备ChatGPT技术、阅读专业、总结便捷等特色功能，适合文档阅读使用。',
    website_url: 'https://chatdoc.com',
    tags: ['ChatGPT技术', '文档阅读', '总结提取', '阅读专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'PandaGPT',
    tagline: 'AI文档要点总结工具',
    description: 'PandaGPT是AI文档要点总结工具。提供文档总结、AI支持、要点提取等服务。具备总结专业、AI便捷、要点提取等特色功能，适合文档总结使用。',
    website_url: 'https://pandagpt.com',
    tags: ['AI文档总结', '要点提取', 'AI支持', '总结专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Rossum.ai',
    tagline: '现代化的AI文档处理工具',
    description: 'Rossum.ai是现代化的AI文档处理工具。提供文档处理、AI支持、现代化服务等功能。具备现代化专业、处理智能、服务全面等特色功能，适合文档处理使用。',
    website_url: 'https://rossum.ai',
    tags: ['现代化', 'AI文档处理', '处理智能', '现代专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Super AI',
    tagline: 'AI复杂文档自动识别处理转换',
    description: 'Super AI是AI复杂文档自动识别处理转换。提供文档识别、自动处理、转换支持等服务。具备自动识别、处理专业、转换便捷等特色功能，适合文档处理使用。',
    website_url: 'https://super.ai',
    tags: ['AI文档识别', '自动处理', '转换支持', '识别专业'],
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

async function insertDocumentTools() {
  console.log('开始检查并插入AI文档工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of documentTools) {
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
    
    console.log(`\n🎉 AI文档工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${documentTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertDocumentTools()
