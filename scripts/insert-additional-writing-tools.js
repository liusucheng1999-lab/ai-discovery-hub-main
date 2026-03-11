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

// 额外的写作类工具数据
const additionalWritingTools = [
  {
    name: 'Peppertype.ai',
    tagline: '高质量AI内容生成',
    description: 'Peppertype.ai是专业的高质量AI内容生成平台，专注于为企业用户和内容创作者提供优质的文本内容。采用先进的AI语言模型，能够生成符合品牌语调和专业标准的各类内容。支持博客文章、营销文案、产品描述、社交媒体内容等多种类型。具备品牌语调学习、SEO优化、批量生成等高级功能，是内容营销团队的专业工具。',
    website_url: 'https://peppertype.ai',
    tags: ['高质量内容', '品牌语调', 'SEO优化', '企业级'],
    pricing_type: 'paid'
  },
  {
    name: 'Compose AI',
    tagline: '免费的Chrome浏览器自动化写作扩展',
    description: 'Compose AI是免费的Chrome浏览器扩展程序，提供智能化的写作自动化功能。在用户浏览网页时实时提供写作建议、自动补全、语法检查等服务。支持Gmail、Google Docs、LinkedIn等多个平台的集成。具备智能回复、内容优化、多语言支持等特色功能。界面简洁，操作便捷，是日常办公和沟通的效率工具。',
    website_url: 'https://compose.ai',
    tags: ['Chrome扩展', '免费工具', '自动化写作', '浏览器集成'],
    pricing_type: 'free'
  },
  {
    name: 'Texta',
    tagline: 'AI博客和文章一键生成',
    description: 'Texta是专业的AI博客和文章生成工具，提供一键式内容创作服务。专注于长篇文章的智能生成，支持多种主题和风格。具备深度研究、逻辑构建、SEO优化等功能。用户只需输入关键词或大纲，即可生成完整的博客文章。适合内容营销、自媒体运营、SEO优化等场景使用。',
    website_url: 'https://texta.ai',
    tags: ['博客生成', '文章创作', '一键生成', 'SEO友好'],
    pricing_type: 'freemium'
  },
  {
    name: 'Sudowrite',
    tagline: 'AI故事写作工具，多种风格选择',
    description: 'Sudowrite是专为小说创作者设计的AI故事写作工具，提供多种文学风格选择。支持情节生成、角色塑造、对话创作、场景描写等功能。具备风格模仿、创意激发、情感表达等特色功能。界面设计符合创作者习惯，提供沉浸式写作体验。适合小说家、编剧、内容创作者使用。',
    website_url: 'https://sudowrite.com',
    tags: ['故事写作', '风格选择', '创意工具', '小说创作'],
    pricing_type: 'paid'
  },
  {
    name: 'ClosersCopy',
    tagline: 'AI文案写作机器人',
    description: 'ClosersCopy是强大的AI文案写作机器人，专注于营销和销售文案的生成。提供广告文案、销售页面、邮件营销等多种文案类型。具备情感分析、转化优化、A/B测试建议等高级功能。支持多种行业和场景的文案需求，是营销团队和销售人员的专业工具。',
    website_url: 'https://closerscopy.com',
    tags: ['文案机器人', '营销文案', '销售转化', 'A/B测试'],
    pricing_type: 'paid'
  },
  {
    name: 'WPS智能写作',
    tagline: 'WPS旗下在线智能写作工具',
    description: 'WPS智能写作是金山WPS推出的专业在线写作工具，深度整合AI技术。提供文档写作、智能校对、格式优化等功能。与WPS Office套件无缝集成，支持云端协作和多端同步。具备智能写作、语法检查、风格建议等特色功能，适合办公和学习场景使用。',
    website_url: 'https://ai.wps.cn',
    tags: ['WPS出品', '在线写作', '智能校对', '云端协作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Anyword',
    tagline: 'AI文案写作助手和文本生成器',
    description: 'Anyword是专业的AI文案写作助手和文本生成器，专注于营销内容的优化。提供广告文案、社交媒体内容、邮件营销等服务。具备预测性分析、转化率优化、受众定位等高级功能。支持多平台和多语言的文案生成，是数字营销的专业工具。',
    website_url: 'https://anyword.com',
    tags: ['文案助手', '文本生成', '转化优化', '数字营销'],
    pricing_type: 'freemium'
  },
  {
    name: 'Hypotenuse AI',
    tagline: '人工智能写作助手和文本生成器',
    description: 'Hypotenuse AI是功能全面的人工智能写作助手，提供高质量的文本生成服务。支持博客文章、产品描述、营销文案等多种内容类型。具备深度理解、逻辑构建、语言优化等特色功能。界面设计现代化，支持多语言和个性化定制，适合各类内容创作者使用。',
    website_url: 'https://hypotenuse.ai',
    tags: ['AI助手', '文本生成', '多语言支持', '个性化定制'],
    pricing_type: 'freemium'
  },
  {
    name: 'Smodin AI Research Paper',
    tagline: 'Smodin推出的AI研究论文写作工具',
    description: 'Smodin AI Research Paper是Smodin公司推出的专业研究论文写作工具。提供学术论文、研究报告、文献综述等写作服务。具备智能文献检索、研究方法建议、数据分析等功能。支持多学科和多种论文格式，特别适合研究生和科研人员使用。',
    website_url: 'https://smodin.io/research-paper',
    tags: ['研究论文', '学术写作', '文献检索', '科研工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'ParagraphAI',
    tagline: '基于ChatGPT的AI写作应用',
    description: 'ParagraphAI是基于ChatGPT技术开发的AI写作应用，提供智能化的文本创作服务。支持段落写作、文章生成、内容优化等功能。具备上下文理解、逻辑连贯、语言自然等特色功能。界面简洁友好，适合日常写作和内容创作使用。',
    website_url: 'https://paragraphai.com',
    tags: ['ChatGPT技术', '段落写作', '上下文理解', '自然语言'],
    pricing_type: 'freemium'
  },
  {
    name: 'LongShot',
    tagline: 'AI长文章写作工具',
    description: 'LongShot是专门用于长篇文章创作的AI写作工具。支持深度内容生成、逻辑结构构建、主题扩展等功能。具备研究辅助、事实核查、质量把控等高级功能。特别适合长篇报告、深度文章、专业内容等创作场景使用。',
    website_url: 'https://longshot.ai',
    tags: ['长文写作', '深度内容', '逻辑构建', '事实核查'],
    pricing_type: 'freemium'
  },
  {
    name: 'Jounce',
    tagline: '无限制免费AI文案写作',
    description: 'Jounce提供无限制的免费AI文案写作服务，专注于营销和品牌内容创作。支持广告文案、社交媒体、品牌故事等多种类型。具备模板丰富、生成快速、质量稳定等特色。完全免费使用，适合中小企业和个人创作者。',
    website_url: 'https://jounce.ai',
    tags: ['无限制免费', '文案写作', '品牌内容', '中小企业'],
    pricing_type: 'free'
  },
  {
    name: 'Reword',
    tagline: 'AI文章写作',
    description: 'Reword是专业的AI文章写作工具，提供智能化的内容创作服务。支持文章生成、改写优化、质量提升等功能。具备语义理解、逻辑优化、风格调整等特色功能。界面操作简单，适合各类文章创作需求。',
    website_url: 'https://reword.com',
    tags: ['文章写作', '内容改写', '语义理解', '质量优化'],
    pricing_type: 'freemium'
  },
  {
    name: 'Elephas',
    tagline: '与Mac、iPhone、iPad集成的个人写作助手',
    description: 'Elephas是专为苹果生态系统设计的个人写作助手，与Mac、iPhone、iPad深度集成。提供跨设备的智能写作服务，支持文档同步、语音输入、智能建议等功能。具备系统级集成、隐私保护、个性化学习等特色功能，适合苹果用户使用。',
    website_url: 'https://elephas.app',
    tags: ['苹果生态', '跨设备同步', '语音输入', '隐私保护'],
    pricing_type: 'paid'
  },
  {
    name: 'AISEO',
    tagline: 'AI创作SEO优化友好的文案和文章',
    description: 'AISEO是专注于SEO优化的AI内容创作工具。提供SEO友好的文案和文章生成服务。具备关键词优化、搜索引擎友好、排名提升等特色功能。支持内容策略、竞争分析、效果监测等高级功能，是SEO专业人士的理想工具。',
    website_url: 'https://aiseo.ai',
    tags: ['SEO优化', '搜索引擎', '关键词策略', '排名提升'],
    pricing_type: 'freemium'
  },
  {
    name: 'PaperBetter AI',
    tagline: 'AI论文写作工具，一键生成万字初稿',
    description: 'PaperBetter AI是强大的AI论文写作工具，能够一键生成万字级别的论文初稿。提供从选题到完稿的全流程服务。具备智能大纲、文献推荐、数据分析等功能。支持多学科论文类型，大大提高论文写作效率。',
    website_url: 'https://paperbetter.ai',
    tags: ['万字初稿', '论文写作', '一键生成', '效率提升'],
    pricing_type: 'freemium'
  },
  {
    name: 'Writer',
    tagline: '企业级AI内容创作工具',
    description: 'Writer是专为大型企业设计的AI内容创作平台。提供企业级的内容生成、品牌一致性、团队协作等服务。具备品牌语调控制、合规检查、内容治理等高级功能。支持大规模内容生产和管理，适合企业营销和内容团队使用。',
    website_url: 'https://writer.com',
    tags: ['企业级', '品牌一致性', '团队协作', '内容治理'],
    pricing_type: 'paid'
  },
  {
    name: '范文喵',
    tagline: '面向大学生的AI论文写作工具',
    description: '范文喵是专为大学生设计的AI论文写作工具。提供毕业论文、课程论文、学术报告等服务。具备学术规范、格式标准、引用管理等功能。界面设计符合学生使用习惯，提供论文指导和质量检查，是大学生论文写作的好帮手。',
    website_url: 'https://fanwenmiao.com',
    tags: ['大学生工具', '毕业论文', '学术规范', '格式标准'],
    pricing_type: 'freemium'
  },
  {
    name: '小微智能论文',
    tagline: '人工智能论文创作辅助工具',
    description: '小微智能论文是专业的AI论文创作辅助工具。提供论文写作、研究指导、文献分析等服务。具备智能选题、方法推荐、数据分析等功能。支持多学科论文类型，特别适合研究生和博士生使用。',
    website_url: 'https://xiaowei.ai',
    tags: ['论文创作', '研究指导', '文献分析', '研究生工具'],
    pricing_type: 'freemium'
  },
  {
    name: '笔杆论文',
    tagline: '简单高效的AI论文写作平台',
    description: '笔杆论文是简单高效的AI论文写作平台，专注于提升论文写作效率。提供从选题到答辩的全流程支持。具备智能写作、格式检查、查重降重等功能。界面设计简洁，操作流程优化，适合各层次学生使用。',
    website_url: 'https://bigan.cn',
    tags: ['简单高效', '论文写作', '格式检查', '查重降重'],
    pricing_type: 'freemium'
  },
  {
    name: 'AI论文君',
    tagline: 'AI大模型驱动的论文写作好帮手',
    description: 'AI论文君是基于先进AI大模型驱动的论文写作工具。提供高质量的论文生成和优化服务。具备深度学习、智能分析、专业写作等功能。支持多种论文类型和学科领域，是学术研究的专业助手。',
    website_url: 'https://ailunwenjun.com',
    tags: ['大模型驱动', '智能分析', '专业写作', '学术助手'],
    pricing_type: 'freemium'
  },
  {
    name: 'SurferSEO',
    tagline: 'AI SEO大纲和内容优化写作工具',
    description: 'SurferSEO是专业的SEO内容优化工具，提供AI驱动的大纲生成和内容优化服务。具备关键词分析、竞争研究、内容策略等功能。支持实时SEO建议、排名预测、效果监测，是SEO专家的必备工具。',
    website_url: 'https://surferseo.com',
    tags: ['SEO优化', '大纲生成', '竞争研究', '排名预测'],
    pricing_type: 'paid'
  },
  {
    name: 'ProWritingAid',
    tagline: '英语写作优化和修改工具',
    description: 'ProWritingAid是专业的英语写作优化和修改工具。提供语法检查、风格改进、可读性提升等服务。具备深度分析、写作建议、学习指导等功能。支持多种写作场景，是英语学习和专业写作的理想工具。',
    website_url: 'https://prowritingaid.com',
    tags: ['英语优化', '语法检查', '风格改进', '可读性提升'],
    pricing_type: 'freemium'
  },
  {
    name: 'WordTune',
    tagline: '你的个人写作助手和编辑',
    description: 'WordTune是智能的个人写作助手和编辑工具。提供实时写作建议、内容改写、风格优化等服务。具备上下文理解、语义分析、个性化建议等功能。界面集成度高，适合日常写作和沟通使用。',
    website_url: 'https://wordtune.com',
    tags: ['个人助手', '实时编辑', '语义分析', '个性化建议'],
    pricing_type: 'freemium'
  },
  {
    name: 'Yaara',
    tagline: '释放你的写作潜力',
    description: 'Yaara是专注于释放用户写作潜力的AI工具。提供创意激发、内容生成、写作指导等服务。具备思维拓展、创意优化、潜力挖掘等功能。界面设计富有创意，适合各类创作者使用。',
    website_url: 'https://yaara.ai',
    tags: ['创意激发', '潜力释放', '思维拓展', '创意写作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Copysmith',
    tagline: '企业级和电商文案生成',
    description: 'Copysmith是专业的企业级和电商文案生成工具。提供产品描述、广告文案、营销内容等服务。具备电商优化、转化提升、批量生成等特色功能。特别适合电商企业和营销团队使用。',
    website_url: 'https://copysmith.ai',
    tags: ['企业级', '电商文案', '转化提升', '批量生成'],
    pricing_type: 'paid'
  },
  {
    name: 'Frase',
    tagline: 'AI SEO内容优化和写作工具',
    description: 'Frase是专业的AI SEO内容优化和写作工具。提供内容研究、SEO优化、文章生成等服务。具备主题研究、关键词优化、内容策略等功能。支持全流程的内容创作和优化，是内容营销的专业工具。',
    website_url: 'https: //frase.io',
    tags: ['SEO优化', '内容研究', '主题分析', '内容策略'],
    pricing_type: 'paid'
  },
  {
    name: 'NeuralText',
    tagline: '人工智能SEO文章写作助手',
    description: 'NeuralText是基于人工智能的SEO文章写作助手。提供SEO友好的文章生成和优化服务。具备关键词研究、内容优化、竞争分析等功能。支持搜索引擎友好的内容创作，是SEO内容专家的工具。',
    website_url: 'https://neuraltext.com',
    tags: ['AI写作', 'SEO文章', '关键词研究', '竞争分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'Copymatic',
    tagline: 'AI文案和内容创作助手',
    description: 'Copymatic是全面的AI文案和内容创作助手。提供营销文案、博客内容、社交媒体等服务。具备多场景支持、风格定制、质量把控等功能。界面友好，操作简单，适合各类内容创作需求。',
    website_url: 'https://copymatic.ai',
    tags: ['文案创作', '内容助手', '多场景支持', '风格定制'],
    pricing_type: 'freemium'
  },
  {
    name: 'TextCortex',
    tagline: 'AI写作能手',
    description: 'TextCortex是功能强大的AI写作能手，提供全方位的写作支持服务。具备智能创作、语言优化、内容生成等功能。支持多语言和多场景的写作需求，是内容创作者的得力助手。',
    website_url: 'https://textcortex.com',
    tags: ['写作能手', '智能创作', '语言优化', '多语言支持'],
    pricing_type: 'freemium'
  },
  {
    name: '星火网文助手',
    tagline: '免费AI小说网文写作工具',
    description: '星火网文助手是免费的AI网文小说写作工具。专注于网络小说创作，提供情节生成、角色塑造、章节创作等服务。具备网文风格、热点追踪、读者分析等特色功能。完全免费使用，适合网文创作者。',
    website_url: 'https://xinghuo.wenwang.com',
    tags: ['免费工具', '网文创作', '小说写作', '热点追踪'],
    pricing_type: 'free'
  },
  {
    name: 'INK',
    tagline: 'AI内容营销和SEO助手',
    description: 'INK是专业的AI内容营销和SEO助手。提供内容创作、SEO优化、营销策略等服务。具备关键词优化、内容策略、效果分析等功能。支持全流程的内容营销，是数字营销的专业工具。',
    website_url: 'https://inkforall.com',
    tags: ['内容营销', 'SEO助手', '关键词优化', '效果分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'Content at Scale',
    tagline: 'AI SEO长内容创作',
    description: 'Content at Scale是专门用于长内容创作的AI工具，专注于SEO优化。提供长篇文章、深度内容、SEO优化等服务。具备批量生成、质量把控、SEO友好等特色功能。适合大规模内容生产和SEO优化。',
    website_url: 'https://contentatscale.ai',
    tags: ['长内容创作', 'SEO优化', '批量生成', '大规模生产'],
    pricing_type: 'paid'
  },
  {
    name: 'Mark Copy',
    tagline: 'AI快速创建营销文案',
    description: 'Mark Copy是专注于快速创建营销文案的AI工具。提供广告文案、营销内容、品牌推广等服务。具备快速生成、风格定制、效果优化等特色功能。界面设计简洁，操作高效，适合营销人员使用。',
    website_url: 'https://markcopy.ai',
    tags: ['营销文案', '快速生成', '风格定制', '效果优化'],
    pricing_type: 'freemium'
  }
]

async function insertAdditionalWritingTools() {
  console.log('开始插入额外的35个写作类AI工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    
    for (const tool of additionalWritingTools) {
      console.log(`正在插入工具: ${tool.name}`)
      
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          id: generateId(),
          name: tool.name,
          tagline: tool.tagline,
          description: tool.description,
          website_url: tool.website_url,
          category: 'writing',
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
    
    console.log(`\n🎉 额外写作类工具插入完成！`)
    console.log(`✅ 成功: ${successCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计: ${additionalWritingTools.length} 个`)
  } catch (error) {
    console.error('插入过程中发生错误:', error)
  }
}

// 执行插入
insertAdditionalWritingTools()
