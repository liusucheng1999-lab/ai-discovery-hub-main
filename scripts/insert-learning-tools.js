import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'
const supabase = createClient(supabaseUrl, supabaseKey)

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

const learningTools = [
  {
    name: 'AI大学堂',
    tagline: '科大讯飞推出的在线AI学习平台',
    description: 'AI大学堂是科大讯飞推出的在线AI学习平台。提供AI学习、讯飞技术、在线服务等功能。具备讯飞技术、学习专业、在线便捷等特色功能，适合AI学习使用。',
    website_url: 'https://ai.xunfei.cn',
    tags: ['科大讯飞', 'AI学习', '在线平台', '学习专业'],
    pricing_type: 'free'
  },
  {
    name: '堆友AI学习',
    tagline: '堆友AI推出的AI设计知识学习网站',
    description: '堆友AI学习是堆友AI推出的AI设计知识学习网站。提供AI设计学习、堆友技术、知识服务等功能。具备设计专业、学习便捷、知识全面等特色功能，适合AI设计学习使用。',
    website_url: 'https://ai.duiyou.com',
    tags: ['堆友AI', 'AI设计学习', '知识服务', '设计专业'],
    pricing_type: 'free'
  },
  {
    name: 'AI分享圈',
    tagline: '最好最全的AI免费资源分享网站',
    description: 'AI分享圈是最好最全的AI免费资源分享网站。提供免费资源、AI分享、全面服务等功能。具备免费使用、分享专业、全面便捷等特色功能，适合AI资源分享使用。',
    website_url: 'https://aifenxiangquan.com',
    tags: ['免费资源', 'AI分享', '全面服务', '分享专业'],
    pricing_type: 'free'
  },
  {
    name: 'OpenAI Academy',
    tagline: 'OpenAI 推出的免费 AI 学习平台',
    description: 'OpenAI Academy是OpenAI推出的免费AI学习平台。提供AI学习、OpenAI技术、免费使用等服务。具备OpenAI技术、学习专业、免费使用等特色功能，适合AI学习使用。',
    website_url: 'https://academy.openai.com',
    tags: ['OpenAI', 'AI学习', '免费使用', '学习专业'],
    pricing_type: 'free'
  },
  {
    name: 'Day of AI',
    tagline: '麻省理工学院（MIT）推出的免费AI学习平台',
    description: 'Day of AI是麻省理工学院（MIT）推出的免费AI学习平台。提供AI学习、MIT技术、免费使用等服务。具备MIT技术、学习专业、免费使用等特色功能，适合AI学习使用。',
    website_url: 'https://dayofai.mit.edu',
    tags: ['MIT', 'AI学习', '免费使用', '学习专业'],
    pricing_type: 'free'
  },
  {
    name: 'fast.ai',
    tagline: '免费开源的深度学习和AI学习网站，让每个人都参与到AI！',
    description: 'fast.ai是免费开源的深度学习和AI学习网站，让每个人都参与到AI！提供深度学习、AI学习、开源免费等服务。具备开源专业、学习便捷、参与全面等特色功能，适合深度学习使用。',
    website_url: 'https://fast.ai',
    tags: ['开源免费', '深度学习', 'AI学习', '开源专业'],
    pricing_type: 'opensource'
  },
  {
    name: '学吧导航',
    tagline: '学习爱好者首选的学霸导航网站',
    description: '学吧导航是学习爱好者首选的学霸导航网站。提供学习导航、学霸服务、全面支持等功能。具备导航专业、学习便捷、学霸优化等特色功能，适合学习导航使用。',
    website_url: 'https://xueba.xueba.com',
    tags: ['学习导航', '学霸首选', '全面支持', '导航专业'],
    pricing_type: 'free'
  },
  {
    name: 'Lynote',
    tagline: '面向学生、研究者和职场人士的 AI 学习助手',
    description: 'Lynote是面向学生、研究者和职场人士的AI学习助手。提供AI学习、学生支持、研究服务等功能。具备学生专业、研究便捷、职场优化等特色功能，适合AI学习使用。',
    website_url: 'https://lynote.com',
    tags: ['AI学习助手', '学生研究者', '职场人士', '学习专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Coursera',
    tagline: '知名MOOC平台，提供众多人工智能和机器学习课程',
    description: 'Coursera是知名MOOC平台，提供众多人工智能和机器学习课程。提供MOOC平台、AI课程、机器学习等服务。具备平台专业、课程便捷、学习全面等特色功能，适合MOOC学习使用。',
    website_url: 'https://coursera.org',
    tags: ['MOOC平台', 'AI课程', '机器学习', '平台专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Elements of AI',
    tagline: '免费在线AI通识学习课程',
    description: 'Elements of AI是免费在线AI通识学习课程。提供AI通识、在线学习、免费课程等服务。具备通识专业、在线便捷、免费使用等特色功能，适合AI通识学习使用。',
    website_url: 'https://elementsofai.com',
    tags: ['AI通识', '在线学习', '免费课程', '通识专业'],
    pricing_type: 'free'
  },
  {
    name: 'DeepLearning.AI',
    tagline: '深度学习和人工智能学习平台',
    description: 'DeepLearning.AI是深度学习和人工智能学习平台。提供深度学习、AI学习、平台支持等功能。具备学习专业、平台便捷、深度全面等特色功能，适合深度学习使用。',
    website_url: 'https://deeplearning.ai',
    tags: ['深度学习', 'AI学习', '学习平台', '学习专业'],
    pricing_type: 'freemium'
  },
  {
    name: '动手学深度学习',
    tagline: '结合理论与实践的深度学习教材和课程',
    description: '动手学深度学习是结合理论与实践的深度学习教材和课程。提供深度学习、理论实践、教材课程等服务。具备理论专业、实践便捷、教材全面等特色功能，适合深度学习使用。',
    website_url: 'https://zh.d2l.ai',
    tags: ['理论与实践', '深度学习', '教材课程', '实践专业'],
    pricing_type: 'free'
  },
  {
    name: 'MachineLearningMastery',
    tagline: '免费在线的机器学习平台，提供从基础到高级全面教程',
    description: 'MachineLearningMastery是免费在线的机器学习平台，提供从基础到高级全面教程。提供机器学习、免费在线、全面教程等服务。具备学习专业、教程便捷、全面优化等特色功能，适合机器学习使用。',
    website_url: 'https://machinelearningmastery.com',
    tags: ['机器学习', '免费在线', '全面教程', '学习专业'],
    pricing_type: 'free'
  },
  {
    name: 'Generative AI for Beginners',
    tagline: '微软推出的面向初学者的免费生成式人工智能课程',
    description: 'Generative AI for Beginners是微软推出的面向初学者的免费生成式人工智能课程。提供生成式AI、微软技术、初学者支持等服务。具备微软技术、初学者专业、生成式便捷等特色功能，适合生成式AI学习使用。',
    website_url: 'https://github.com/microsoft/generative-ai-for-beginners',
    tags: ['微软', '生成式AI', '初学者', '免费课程'],
    pricing_type: 'free'
  },
  {
    name: 'ML for Beginners',
    tagline: '微软推出的免费开源的机器学习课程，GitHub标星7万+',
    description: 'ML for Beginners是微软推出的免费开源的机器学习课程，GitHub标星7万+。提供机器学习、微软技术、开源免费等服务。具备微软技术、开源专业、学习便捷等特色功能，适合机器学习使用。',
    website_url: 'https://github.com/microsoft/ml-for-beginners',
    tags: ['微软', '机器学习', '开源免费', 'GitHub热门'],
    pricing_type: 'opensource'
  },
  {
    name: 'Kaggle',
    tagline: '机器学习和数据科学社区',
    description: 'Kaggle是机器学习和数据科学社区。提供机器学习、数据科学、社区支持等功能。具备学习专业、社区便捷、科学全面等特色功能，适合机器学习使用。',
    website_url: 'https://kaggle.com',
    tags: ['机器学习', '数据科学', '社区', '学习专业'],
    pricing_type: 'freemium'
  },
  {
    name: '神经网络入门',
    tagline: 'Brilliant推出的Introduction to Neural Networks课程',
    description: '神经网络入门是Brilliant推出的Introduction to Neural Networks课程。提供神经网络、Brilliant技术、入门课程等服务。具备入门专业、神经网络便捷、课程全面等特色功能，适合神经网络学习使用。',
    website_url: 'https://brilliant.org',
    tags: ['神经网络', '入门课程', 'Brilliant', '学习专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Trancy',
    tagline: 'AI驱动的语言学习工具',
    description: 'Trancy是AI驱动的语言学习工具。提供语言学习、AI驱动、专业服务等功能。具备AI专业、学习便捷、语言全面等特色功能，适合语言学习使用。',
    website_url: 'https://trancy.ai',
    tags: ['AI驱动', '语言学习', '学习工具', '语言专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Reading Coach',
    tagline: '微软推出的免费个性化AI阅读学习教练',
    description: 'Reading Coach是微软推出的免费个性化AI阅读学习教练。提供阅读学习、微软技术、个性化服务等功能。具备微软技术、阅读专业、个性化便捷等特色功能，适合阅读学习使用。',
    website_url: 'https://readingcoach.microsoft.com',
    tags: ['微软', 'AI阅读学习', '个性化', '阅读专业'],
    pricing_type: 'free'
  },
  {
    name: '飞桨AI Studio',
    tagline: '百度推出的AI学习与实训社区',
    description: '飞桨AI Studio是百度推出的AI学习与实训社区。提供AI学习、实训社区、百度技术等服务。具备百度技术、学习专业、实训便捷等特色功能，适合AI学习使用。',
    website_url: 'https://aistudio.baidu.com',
    tags: ['百度飞桨', 'AI学习', '实训社区', '学习专业'],
    pricing_type: 'freemium'
  },
  {
    name: '腾讯扣叮',
    tagline: '腾讯推出的青少年编程教育平台',
    description: '腾讯扣叮是腾讯推出的青少年编程教育平台。提供编程教育、青少年支持、腾讯技术等服务。具备腾讯技术、教育专业、青少年优化等特色功能，适合编程教育使用。',
    website_url: 'https://kouding.qq.com',
    tags: ['腾讯', '青少年编程', '教育平台', '教育专业'],
    pricing_type: 'free'
  },
  {
    name: '阿里云AI学习路线',
    tagline: '阿里云推出的人工智能学习路线（学+测）',
    description: '阿里云AI学习路线是阿里云推出的人工智能学习路线（学+测）。提供AI学习、学习路线、阿里云技术等服务。具备阿里云技术、学习专业、路线便捷等特色功能，适合AI学习使用。',
    website_url: 'https://edu.aliyun.com',
    tags: ['阿里云', 'AI学习路线', '学测结合', '学习专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Udacity AI学院',
    tagline: 'Udacity推出的School of AI，从入门到高级',
    description: 'Udacity AI学院是Udacity推出的School of AI，从入门到高级。提供AI学院、Udacity技术、入门高级等服务。具备Udacity技术、学院专业、入门高级等特色功能，适合AI学院使用。',
    website_url: 'https://udacity.com/school-of-ai',
    tags: ['Udacity', 'AI学院', '入门到高级', '学院专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Google AI',
    tagline: 'Google AI学习平台',
    description: 'Google AI是Google AI学习平台。提供AI学习、Google技术、平台支持等功能。具备Google技术、学习专业、平台便捷等特色功能，适合AI学习使用。',
    website_url: 'https://ai.google/education',
    tags: ['Google', 'AI学习', '学习平台', '学习专业'],
    pricing_type: 'free'
  },
  {
    name: 'ShowMeAI知识社区',
    tagline: '人工智能领域的资料库和学习社区',
    description: 'ShowMeAI知识社区是人工智能领域的资料库和学习社区。提供AI知识、资料库、社区支持等功能。具备知识专业、资料便捷、社区全面等特色功能，适合AI知识使用。',
    website_url: 'https://showmeai.tech',
    tags: ['AI知识社区', '资料库', '学习社区', '知识专业'],
    pricing_type: 'free'
  }
]

async function checkToolExists(name) {
  const { data, error } = await supabase
    .from('tools')
    .select('id')
    .eq('name', name)
    .single()
  
  return !error && data
}

async function insertLearningTools() {
  console.log('开始检查并插入AI学习网站...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of learningTools) {
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
          rating: 4.0 + Math.random() * 1.5,
          rating_count: Math.floor(Math.random() * 500) + 50,
          view_count: Math.floor(Math.random() * 8000) + 1000,
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
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n🎉 AI学习网站处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${learningTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

insertLearningTools()
