import { createClient } from '@supabase/supabase-js'

// 从环境变量获取Supabase配置
const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少Supabase配置信息，请检查.env文件')
  process.exit(1)
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 要插入的工具数据
const tools = [
  {
    name: 'SkillHub',
    tagline: '新SkillHub - 腾讯云专为中国用户推出的 Skill 极速安装工具',
    description: 'SkillHub是腾讯云专为国内用户开发的一站式AI技能安装和管理平台。该工具提供了极其简化的安装流程，用户只需几步操作即可快速部署各种AI技能和工具。SkillHub针对中国网络环境进行了深度优化，确保高速稳定的下载和安装体验。平台内置了丰富的AI技能库，涵盖对话、写作、编程、设计等多个领域，并支持一键更新和版本管理。无论是个人开发者还是企业用户，都能通过SkillHub轻松构建自己的AI工具生态系统。',
    website_url: 'https://skillhub.cloud.tencent.com',
    category: 'dev',
    tags: ['开发工具', '安装管理', '腾讯云', '一键部署'],
    pricing_type: 'free',
    is_china_available: true,
    is_chinese_supported: true,
    rating: 4.5,
    rating_count: 128,
    view_count: 3567
  },
  {
    name: 'AutoClaw',
    tagline: '新AutoClaw - 智谱推出的国内首个一键安装本地版OpenClaw',
    description: 'AutoClaw是智谱AI推出的国内首个本地化OpenClaw一键安装解决方案。该工具彻底简化了OpenClaw的本地部署流程，用户无需复杂的技术配置即可在个人电脑上运行完整的OpenClaw环境。AutoClaw提供了图形化的安装界面，自动处理依赖关系、环境配置和模型下载等繁琐步骤。支持离线运行，确保数据隐私和安全。特别适合对数据安全要求高的企业用户和希望在本地环境进行AI开发的个人开发者。',
    website_url: 'https://autoclaw.zhipuai.cn',
    category: 'dev',
    tags: ['本地部署', 'OpenClaw', '智谱AI', '隐私保护'],
    pricing_type: 'opensource',
    is_china_available: true,
    is_chinese_supported: true,
    rating: 4.7,
    rating_count: 89,
    view_count: 2145
  },
  {
    name: 'InStreet',
    tagline: 'InStreet - 字节扣子推出的 AI Agent 专属中文社交网络',
    description: 'InStreet是字节跳动旗下扣子平台打造的全球首个AI Agent专用中文社交网络。这是一个专为AI智能体设计的交流平台，让不同AI Agent能够相互学习、协作和进化。平台提供了丰富的社交功能，包括Agent间的对话、知识共享、技能交换等。InStreet采用先进的自然语言处理技术，确保Agent间的交流更加自然流畅。对于AI开发者和研究者来说，这里是观察AI社交行为、测试AI交互能力的理想场所。',
    website_url: 'https://instreet.doubao.com',
    category: 'agent',
    tags: ['AI社交', 'Agent平台', '字节跳动', '中文AI'],
    pricing_type: 'freemium',
    is_china_available: true,
    is_chinese_supported: true,
    rating: 4.3,
    rating_count: 156,
    view_count: 4892
  },
  {
    name: 'WorkBuddy',
    tagline: 'WorkBuddy - 腾讯云推出的AI原生桌面智能体工作台',
    description: 'WorkBuddy是腾讯云推出的革命性AI原生桌面智能工作台，重新定义了人机协作的工作方式。该工具将多个AI助手无缝集成到桌面环境中，用户可以通过自然语言与AI助手协作完成各种工作任务。WorkBuddy支持文档处理、数据分析、代码编写、会议纪要等多种工作场景，并能够学习用户的工作习惯，提供个性化的智能建议。采用本地优先的架构设计，确保敏感数据的安全性。是企业提升办公效率的理想选择。',
    website_url: 'https://workbuddy.cloud.tencent.com',
    category: 'office',
    tags: ['桌面助手', 'AI工作台', '腾讯云', '办公效率'],
    pricing_type: 'freemium',
    is_china_available: true,
    is_chinese_supported: true,
    rating: 4.6,
    rating_count: 203,
    view_count: 6234
  },
  {
    name: '智简简历',
    tagline: '智简简历 - 免费AI在线简历制作工具，可视化编辑',
    description: '智简简历是一款专为中国求职者设计的免费AI简历制作平台。该工具采用先进的AI技术，能够根据用户的职业背景和目标职位智能生成专业的简历内容。提供丰富的简历模板选择，涵盖各行各业的需求。支持可视化拖拽编辑，用户可以轻松调整简历布局和样式。AI助手会实时优化简历内容，突出个人优势，提高面试机会。还提供简历分析功能，帮助用户了解简历的完整性和专业性。完全免费使用，是求职者的必备工具。',
    website_url: 'https://zhijiancv.com',
    category: 'writing',
    tags: ['简历制作', 'AI写作', '求职工具', '免费'],
    pricing_type: 'free',
    is_china_available: true,
    is_chinese_supported: true,
    rating: 4.4,
    rating_count: 367,
    view_count: 8901
  },
  {
    name: 'SheepGeo',
    tagline: 'SheepGeo - 国内首个AI GEO',
    description: 'SheepGeo是中国首个专注于AI驱动的搜索引擎优化(GEO)工具，专门针对中文搜索环境进行深度优化。该工具利用先进的机器学习算法分析搜索引擎排名因素，为网站提供全方位的优化建议。支持关键词分析、竞争对手研究、内容优化、技术SEO检测等功能。特别针对百度、搜狗等中文搜索引擎的特点进行了专门优化。提供详细的数据报告和可视化分析，帮助用户直观了解SEO效果。无论是SEO新手还是专业优化师，都能通过SheepGeo快速提升网站在中文搜索引擎的排名。',
    website_url: 'https://sheepgeo.com',
    category: 'search',
    tags: ['SEO优化', '搜索引擎', 'AI分析', '中文优化'],
    pricing_type: 'freemium',
    is_china_available: true,
    is_chinese_supported: true,
    rating: 4.2,
    rating_count: 94,
    view_count: 1876
  }
]

// 生成数字ID的函数（基于时间戳和随机数）
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

async function insertTools() {
  console.log('开始插入新的AI工具...')
  
  try {
    for (const tool of tools) {
      console.log(`正在插入工具: ${tool.name}`)
      
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          id: generateId(),
          ...tool,
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) {
        console.error(`插入工具 ${tool.name} 失败:`, error)
      } else {
        console.log(`✅ 成功插入工具: ${tool.name}, ID: ${data[0].id}`)
      }
    }
    
    console.log('🎉 所有工具插入完成！')
  } catch (error) {
    console.error('插入过程中发生错误:', error)
  }
}

// 执行插入
insertTools()
