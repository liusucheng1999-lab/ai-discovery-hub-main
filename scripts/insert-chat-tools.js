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

// AI聊天助手工具数据
const chatTools = [
  {
    name: '豆包',
    tagline: '智能对话助手，办公创作全能！',
    description: '豆包是字节跳动推出的全能AI智能助手，专注于办公创作场景。提供智能对话、文档写作、PPT制作、数据分析等服务。具备深度理解、专业创作、多模态交互等特色功能。依托字节强大的AI技术，为用户提供专业级的智能助手服务。',
    website_url: 'https://doubao.com',
    tags: ['字节跳动', '办公创作', '智能对话', '多模态'],
    pricing_type: 'free'
  },
  {
    name: '讯飞星火',
    tagline: 'AI智能助手，免费PPT生成、深度研究',
    description: '讯飞星火是科大讯飞推出的专业AI智能助手，特别擅长PPT生成和深度研究。提供智能对话、文档创作、数据分析等服务。具备语音交互、专业研究、免费使用等特色功能。依托讯飞在语音和AI领域的技术优势。',
    website_url: 'https://xinghuo.xunfei.cn',
    tags: ['科大讯飞', 'PPT生成', '深度研究', '语音交互'],
    pricing_type: 'freemium'
  },
  {
    name: '腾讯元宝',
    tagline: '腾讯推出的免费AI智能助手',
    description: '腾讯元宝是腾讯推出的免费AI智能助手，提供全方位的智能对话服务。支持日常问答、创作辅助、信息查询等功能。具备腾讯生态集成、免费使用、智能交互等特色功能，适合广大用户使用。',
    website_url: 'https://yuanbao.tencent.com',
    tags: ['腾讯出品', '免费助手', '生态集成', '智能交互'],
    pricing_type: 'free'
  },
  {
    name: 'ChatGPT',
    tagline: 'OpenAI 推出的AI聊天机器人',
    description: 'ChatGPT是OpenAI推出的革命性AI聊天机器人，引领了全球AI对话技术的发展。提供高质量的智能对话、创作辅助、代码生成等服务。具备强大的语言理解、逻辑推理、多领域知识等特色功能，是全球最知名的AI助手。',
    website_url: 'https://chat.openai.com',
    tags: ['OpenAI', '全球知名', '语言理解', '逻辑推理'],
    pricing_type: 'freemium'
  },
  {
    name: 'Claude',
    tagline: 'Anthropic公司推出的对话式AI智能助手',
    description: 'Claude是Anthropic公司推出的对话式AI智能助手，以安全性和可靠性著称。提供智能对话、分析推理、创作辅助等服务。具备安全AI、长文本处理、逻辑分析等特色功能，适合专业场景使用。',
    website_url: 'https://claude.ai',
    tags: ['Anthropic', '安全AI', '长文本处理', '逻辑分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'Gemini',
    tagline: 'Google推出的AI聊天对话机器人Gemini',
    description: 'Gemini是Google推出的多模态AI聊天对话机器人，支持文本、图像、视频等多种输入。提供智能对话、创作辅助、分析推理等服务。具备多模态理解、Google生态集成、先进技术等特色功能。',
    website_url: 'https://gemini.google.com',
    tags: ['Google出品', '多模态AI', '生态集成', '先进技术'],
    pricing_type: 'free'
  },
  {
    name: 'Flowith',
    tagline: '一站式使用GPT-5、Claude、Gemini',
    description: 'Flowith是一站式AI助手平台，集成GPT-5、Claude、Gemini等主流模型。提供模型切换、对比使用、最佳体验等服务。具备多模型支持、一站式体验、性能对比等特色功能，适合AI爱好者使用。',
    website_url: 'https://flowith.com',
    tags: ['多模型平台', '一站式体验', '模型对比', 'AI爱好者'],
    pricing_type: 'freemium'
  },
  {
    name: '逗逗AI',
    tagline: 'AI游戏陪玩，支持原神、黑神话、LOL！',
    description: '逗逗AI是专业的AI游戏陪玩助手，支持原神、黑神话、LOL等热门游戏。提供游戏对话、角色扮演、策略指导等服务。具备游戏专业、角色扮演、娱乐互动等特色功能，适合游戏玩家使用。',
    website_url: 'https://doudou.ai',
    tags: ['游戏陪玩', '角色扮演', '原神', 'LOL'],
    pricing_type: 'freemium'
  },
  {
    name: 'DeepSeek',
    tagline: '幻方量化推出的AI智能助手和开源大模型',
    description: 'DeepSeek是幻方量化推出的AI智能助手和开源大模型。提供智能对话、代码生成、分析推理等服务。具备开源模型、技术先进、专业质量等特色功能，适合开发者和研究者使用。',
    website_url: 'https://deepseek.ai',
    tags: ['幻方量化', '开源模型', '技术先进', '专业质量'],
    pricing_type: 'freemium'
  },
  {
    name: 'Kimi智能助手',
    tagline: '月之暗面推出的AI智能助手',
    description: 'Kimi智能助手是月之暗面推出的专业AI智能助手，特别擅长长文本处理。提供智能对话、文档分析、深度阅读等服务。具备长文本理解、深度分析、专业质量等特色功能，适合学术和研究使用。',
    website_url: 'https://kimi.moonshot.cn',
    tags: ['月之暗面', '长文本处理', '深度分析', '学术研究'],
    pricing_type: 'free'
  },
  {
    name: '千问',
    tagline: '全能AI助手，基于Qwen模型',
    description: '千问是基于Qwen模型的全能AI助手，提供全方位的智能服务。支持智能对话、创作辅助、分析推理等功能。具备模型先进、功能全面、性能优秀等特色功能，适合各类用户使用。',
    website_url: 'https://qianwen.aliyun.com',
    tags: ['Qwen模型', '全能助手', '功能全面', '性能优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Grok',
    tagline: '马斯克旗下xAI推出的人工智能助手',
    description: 'Grok是马斯克旗下xAI公司推出的人工智能助手，以幽默和实时信息著称。提供智能对话、信息查询、创作辅助等服务。具备实时信息、幽默风格、X平台集成等特色功能。',
    website_url: 'https://grok.x.ai',
    tags: ['xAI出品', '马斯克', '实时信息', 'X平台集成'],
    pricing_type: 'paid'
  },
  {
    name: 'Z.ai',
    tagline: '智谱面向全球推出的AI模型体验平台',
    description: 'Z.ai是智谱AI面向全球推出的AI模型体验平台。提供多模型体验、对比使用、性能测试等服务。具备全球服务、模型丰富、专业体验等特色功能，适合AI研究者和爱好者使用。',
    website_url: 'https://z.ai',
    tags: ['智谱AI', '全球服务', '模型体验', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'Qwen Chat',
    tagline: '阿里通义推出的 Qwen 最新模型体验平台',
    description: 'Qwen Chat是阿里通义推出的Qwen最新模型体验平台。提供最新模型体验、功能测试、性能评估等服务。具备最新模型、阿里技术、专业体验等特色功能。',
    website_url: 'https://qwenchat.alibaba.com',
    tags: ['阿里通义', '最新模型', '功能测试', '性能评估'],
    pricing_type: 'free'
  },
  {
    name: 'MiniMax',
    tagline: 'MiniMax推出的AI智能问答助手',
    description: 'MiniMax是MiniMax公司推出的AI智能问答助手。提供智能对话、问答服务、创作辅助等功能。具备智能问答、快速响应、准确回答等特色功能，适合日常使用。',
    website_url: 'https://minimax.ai',
    tags: ['MiniMax公司', '智能问答', '快速响应', '准确回答'],
    pricing_type: 'freemium'
  },
  {
    name: 'LongCat',
    tagline: '美团推出的自研大模型AI对话平台',
    description: 'LongCat是美团推出的自研大模型AI对话平台，专注于生活服务场景。提供智能对话、生活咨询、服务推荐等服务。具备生活场景、美团生态、实用功能等特色功能。',
    website_url: 'https://longcat.meituan.com',
    tags: ['美团出品', '自研模型', '生活服务', '生态集成'],
    pricing_type: 'freemium'
  },
  {
    name: '文心一言',
    tagline: '百度推出的基于文心大模型的AI智能助手',
    description: '文心一言是百度推出的基于文心大模型的AI智能助手。提供智能对话、创作辅助、分析推理等服务。具备文心大模型、百度技术、中文优化等特色功能，是中文AI助手的重要代表。',
    website_url: 'https://yiyan.baidu.com',
    tags: ['百度出品', '文心大模型', '中文优化', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '智谱清言',
    tagline: '智谱推出的全能AI助手',
    description: '智谱清言是智谱AI推出的全能AI助手。提供智能对话、创作辅助、分析推理等服务。具备智谱技术、全能功能、专业质量等特色功能，适合各类用户使用。',
    website_url: 'https://chatglm.cn',
    tags: ['智谱AI', '全能助手', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '华为小艺',
    tagline: '华为旗下小艺AI助手网页端，已接入DeepSeek-R1',
    description: '华为小艺是华为旗下的AI助手网页端，已接入DeepSeek-R1模型。提供智能对话、创作辅助、分析推理等服务。具备华为技术、DeepSeek集成、专业质量等特色功能。',
    website_url: 'https://xiaoyi.huawei.com',
    tags: ['华为出品', 'DeepSeek集成', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '问小白',
    tagline: 'AI智能助手，支持DeepSeek满血版',
    description: '问小白是支持DeepSeek满血版的AI智能助手。提供智能对话、创作辅助、分析推理等服务。具备DeepSeek满血版、强大性能、专业质量等特色功能。',
    website_url: 'https://wenxiaobai.com',
    tags: ['DeepSeek满血', '强大性能', '专业质量', '智能助手'],
    pricing_type: 'freemium'
  },
  {
    name: '百灵大模型',
    tagline: '蚂蚁集团推出的 Ling-1T 大模型对话体验平台',
    description: '百灵大模型是蚂蚁集团推出的Ling-1T大模型对话体验平台。提供大模型体验、智能对话、功能测试等服务。具备大模型技术、蚂蚁集团、专业体验等特色功能。',
    website_url: 'https://bailing.antgroup.com',
    tags: ['蚂蚁集团', 'Ling-1T模型', '大模型技术', '专业体验'],
    pricing_type: 'freemium'
  },
  {
    name: '书生大模型',
    tagline: '上海人工智能实验室推出的系列AI模型',
    description: '书生大模型是上海人工智能实验室推出的系列AI模型。提供智能对话、分析推理、创作辅助等服务。具备学术背景、技术先进、专业质量等特色功能。',
    website_url: 'https://intern-ai.org',
    tags: ['上AI实验室', '学术背景', '技术先进', '专业质量'],
    pricing_type: 'freemium'
  },
  {
    name: '阶跃AI',
    tagline: '阶跃星辰推出的支持多模态的AI聊天机器人',
    description: '阶跃AI是阶跃星辰推出的支持多模态的AI聊天机器人。提供文本、图像、音频等多模态交互服务。具备多模态技术、阶跃星辰、专业质量等特色功能。',
    website_url: 'https://jieyue.ai',
    tags: ['阶跃星辰', '多模态AI', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '百小应',
    tagline: '百川智能推出的免费AI助手',
    description: '百小应是百川智能推出的免费AI助手。提供智能对话、创作辅助、分析推理等服务。具备免费使用、百川技术、功能全面等特色功能。',
    website_url: 'https://baixiaoying.baichuan-ai.com',
    tags: ['百川智能', '免费使用', '功能全面', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: '天工AI',
    tagline: '昆仑万维推出的AI智能助手',
    description: '天工AI是昆仑万维推出的AI智能助手。提供智能对话、创作辅助、分析推理等服务。具备昆仑万维、技术先进、功能全面等特色功能。',
    website_url: 'https://tiangong.kunlun.ai',
    tags: ['昆仑万维', '技术先进', '功能全面', '智能助手'],
    pricing_type: 'freemium'
  },
  {
    name: '商量SenseChat',
    tagline: '商汤科技推出的免费AI聊天助手',
    description: '商量SenseChat是商汤科技推出的免费AI聊天助手。提供智能对话、创作辅助、分析推理等服务。具备商汤技术、免费使用、专业质量等特色功能。',
    website_url: 'https://sensetime.com/product/sensechat',
    tags: ['商汤科技', '免费使用', '专业质量', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: 'Me.bot',
    tagline: '心识宇宙推出的个性化AI伴侣产品',
    description: 'Me.bot是心识宇宙推出的个性化AI伴侣产品。提供情感陪伴、智能对话、个性化服务等功能。具备个性化定制、情感交互、专业陪伴等特色功能。',
    website_url: 'https://me.bot',
    tags: ['心识宇宙', '个性化伴侣', '情感交互', '专业陪伴'],
    pricing_type: 'freemium'
  },
  {
    name: 'Saylo',
    tagline: 'AI驱动的故事角色扮演游戏应用，沉浸式的剧本互动体验',
    description: 'Saylo是AI驱动的故事角色扮演游戏应用，提供沉浸式的剧本互动体验。支持角色扮演、故事创作、互动娱乐等功能。具备游戏化体验、AI驱动、沉浸式互动等特色功能。',
    website_url: 'https://saylo.ai',
    tags: ['角色扮演', '故事创作', '互动娱乐', '游戏化体验'],
    pricing_type: 'freemium'
  },
  {
    name: 'Poe',
    tagline: '问答社区Quora推出的问答机器人工具',
    description: 'Poe是问答社区Quora推出的问答机器人工具。提供多模型对话、智能问答、创作辅助等服务。具备Quora生态、多模型支持、专业问答等特色功能。',
    website_url: 'https://poe.com',
    tags: ['Quora出品', '问答工具', '多模型支持', '专业问答'],
    pricing_type: 'freemium'
  },
  {
    name: 'Copilot',
    tagline: '微软推出的网页版Copilot助手',
    description: 'Copilot是微软推出的网页版AI助手。提供智能对话、创作辅助、代码生成等服务。具备微软技术、系统集成、专业功能等特色功能。',
    website_url: 'https://copilot.microsoft.com',
    tags: ['微软出品', '系统集成', '专业功能', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Character.AI',
    tagline: '创建虚拟角色并与其对话',
    description: 'Character.AI是专业的虚拟角色创建和对话平台。用户可以创建虚拟角色并与进行智能对话。具备角色创建、个性定制、互动娱乐等特色功能，适合创意娱乐使用。',
    website_url: 'https://character.ai',
    tags: ['虚拟角色', '角色创建', '个性定制', '互动娱乐'],
    pricing_type: 'freemium'
  },
  {
    name: 'Meta AI助手',
    tagline: 'Meta推出的免费AI聊天助手',
    description: 'Meta AI助手是Meta公司推出的免费AI聊天助手。提供智能对话、创作辅助、分析推理等服务。具备Meta技术、免费使用、专业质量等特色功能。',
    website_url: 'https://ai.meta.com',
    tags: ['Meta出品', '免费使用', '专业质量', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: 'Bing新必应',
    tagline: '微软推出的新版结合了ChatGPT功能的必应',
    description: 'Bing新必应是微软推出的结合ChatGPT功能的新版搜索引擎。提供智能搜索、对话问答、创作辅助等服务。具备搜索集成、ChatGPT技术、微软生态等特色功能。',
    website_url: 'https://bing.com/new',
    tags: ['微软出品', '搜索集成', 'ChatGPT技术', '生态优势'],
    pricing_type: 'free'
  },
  {
    name: 'Koko AI',
    tagline: 'Seele公司推出的「AI+3D」情感陪伴产品',
    description: 'Koko AI是Seele公司推出的AI+3D情感陪伴产品。提供情感陪伴、3D交互、智能对话等服务。具备3D技术、情感交互、专业陪伴等特色功能。',
    website_url: 'https://koko.ai',
    tags: ['Seele出品', '3D技术', '情感陪伴', '专业交互'],
    pricing_type: 'freemium'
  },
  {
    name: '通义星尘',
    tagline: '用AI定制属于你自己的IP角色',
    description: '通义星尘是阿里通义推出的AI IP角色定制平台。用户可以用AI定制属于自己的IP角色。提供角色创建、个性定制、智能交互等服务。具备IP定制、阿里技术、创意工具等特色功能。',
    website_url: 'https://xingenchen.ali.com',
    tags: ['阿里通义', 'IP定制', '角色创建', '创意工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'CueMe',
    tagline: '夸克推出的AI智能对话助手，支持2万字长文写作',
    description: 'CueMe是夸克推出的AI智能对话助手，特别支持2万字长文写作。提供智能对话、长文创作、分析推理等服务。具备长文处理、夸克技术、专业创作等特色功能。',
    website_url: 'https://cueme.quark.cn',
    tags: ['夸克出品', '长文写作', '专业创作', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '造梦次元',
    tagline: 'AI互动内容平台，虚拟角色逗你开心',
    description: '造梦次元是AI互动内容平台，提供虚拟角色互动娱乐服务。支持角色互动、娱乐聊天、创意内容等功能。具备互动娱乐、AI驱动、创意内容等特色功能。',
    website_url: 'https://zaomengciyuan.com',
    tags: ['互动娱乐', '虚拟角色', 'AI驱动', '创意内容'],
    pricing_type: 'freemium'
  },
  {
    name: 'Museland',
    tagline: '沉浸式AI角色扮演产品',
    description: 'Museland是沉浸式AI角色扮演产品。提供角色扮演、互动娱乐、创意内容等服务。具备沉浸式体验、AI驱动、创意交互等特色功能。',
    website_url: 'https://museland.ai',
    tags: ['角色扮演', '沉浸式体验', 'AI驱动', '创意交互'],
    pricing_type: 'freemium'
  },
  {
    name: '百度AI助手',
    tagline: '百度推出的多场景AI智能体助手',
    description: '百度AI助手是百度推出的多场景AI智能体助手。提供智能对话、创作辅助、分析推理等服务。具备百度技术、多场景支持、专业质量等特色功能。',
    website_url: 'https://ai.baidu.com',
    tags: ['百度出品', '多场景支持', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '小悟空',
    tagline: '字节跳动推出的免费AI对话助手和个人助理',
    description: '小悟空是字节跳动推出的免费AI对话助手和个人助理。提供智能对话、个人助理、创作辅助等服务。具备字节技术、免费使用、功能全面等特色功能。',
    website_url: 'https://xiaowukong.com',
    tags: ['字节跳动', '免费使用', '个人助理', '功能全面'],
    pricing_type: 'free'
  },
  {
    name: '紫东太初',
    tagline: '中科院与武智院推出的千亿参数全模态大模型和助手',
    description: '紫东太初是中科院与武智院推出的千亿参数全模态大模型和助手。提供多模态交互、智能对话、分析推理等服务。具备学术背景、千亿参数、全模态技术等特色功能。',
    website_url: 'https://zidongtaichu.com',
    tags: ['中科院出品', '千亿参数', '全模态AI', '学术背景'],
    pricing_type: 'freemium'
  },
  {
    name: '小黄蕉',
    tagline: '字节跳动旗下推出的AI虚拟交友聊天平台',
    description: '小黄蕉是字节跳动旗下推出的AI虚拟交友聊天平台。提供虚拟交友、情感陪伴、智能对话等服务。具备虚拟交友、情感交互、字节技术等特色功能。',
    website_url: 'https://xiaohuangjiao.com',
    tags: ['字节跳动', '虚拟交友', '情感陪伴', '智能对话'],
    pricing_type: 'freemium'
  },
  {
    name: '冒泡鸭',
    tagline: '阶跃星辰推出的AI聊天机器人和智能体平台',
    description: '冒泡鸭是阶跃星辰推出的AI聊天机器人和智能体平台。提供智能对话、智能体服务、创作辅助等功能。具备阶跃技术、智能体平台、功能全面等特色功能。',
    website_url: 'https://maopaya.com',
    tags: ['阶跃星辰', '智能体平台', '功能全面', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'J1 Assistant',
    tagline: '罗永浩旗下 Jarvis 项目推出的 AI 智能助手',
    description: 'J1 Assistant是罗永浩旗下Jarvis项目推出的AI智能助手。提供智能对话、创作辅助、分析推理等服务。具备老罗生态、Jarvis技术、专业质量等特色功能。',
    website_url: 'https://j1.assistant.com',
    tags: ['罗永浩出品', 'Jarvis项目', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Cici',
    tagline: '豆包国际版，字节跳动面向海外市场推出的AI助手',
    description: 'Cici是豆包国际版，字节跳动面向海外市场推出的AI助手。提供智能对话、创作辅助、分析推理等服务。具备字节技术、国际化、专业质量等特色功能。',
    website_url: 'https://cici.ai',
    tags: ['字节跳动', '国际版', '海外市场', '专业质量'],
    pricing_type: 'freemium'
  },
  {
    name: '百川大模型',
    tagline: '百川智能推出的大模型助手，融合了意图理解、信息检索以及强化学习技术',
    description: '百川大模型是百川智能推出的大模型助手，融合了意图理解、信息检索以及强化学习技术。提供智能对话、创作辅助、分析推理等服务。具备大模型技术、百川智能、先进算法等特色功能。',
    website_url: 'https://baichuan-ai.com',
    tags: ['百川智能', '大模型技术', '意图理解', '强化学习'],
    pricing_type: 'freemium'
  },
  {
    name: 'Le Chat',
    tagline: 'Mistral推出的AI对话聊天助手',
    description: 'Le Chat是Mistral公司推出的AI对话聊天助手。提供智能对话、创作辅助、分析推理等服务。具备Mistral技术、欧洲AI、专业质量等特色功能。',
    website_url: 'https://chat.mistral.ai',
    tags: ['Mistral出品', '欧洲AI', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '百度AI伙伴',
    tagline: '百度最新上线的AI搜索对话工具',
    description: '百度AI伙伴是百度最新上线的AI搜索对话工具。提供智能搜索、对话问答、创作辅助等服务。具备百度技术、搜索集成、专业质量等特色功能。',
    website_url: 'https://aipartner.baidu.com',
    tags: ['百度出品', '搜索集成', '专业质量', '最新上线'],
    pricing_type: 'freemium'
  },
  {
    name: '超级助理',
    tagline: '百度智能云发布的基于文心一言的AI原生应用和Copilot"超级助理"',
    description: '超级助理是百度智能云发布的基于文心一言的AI原生应用和Copilot。提供智能对话、创作辅助、分析推理等服务。具备百度云技术、文心大模型、企业级应用等特色功能。',
    website_url: 'https://superassistant.baidu.com',
    tags: ['百度智能云', '文心一言', '企业级应用', 'AI原生'],
    pricing_type: 'freemium'
  },
  {
    name: '钉钉·个人版',
    tagline: '钉钉推出的个人版办公应用程序，内置AI智能助手，可进行AI创作、AI对话、AI绘画',
    description: '钉钉个人版是钉钉推出的个人版办公应用程序，内置AI智能助手，支持AI创作、AI对话、AI绘画等功能。具备钉钉生态、办公集成、多功能AI等特色功能。',
    website_url: 'https://personal.dingtalk.com',
    tags: ['钉钉出品', '办公集成', '多功能AI', '个人版'],
    pricing_type: 'freemium'
  },
  {
    name: 'Wanderboat',
    tagline: '硅谷初创公司UTA AI推出的AI旅行助手',
    description: 'Wanderboat是硅谷初创公司UTA AI推出的AI旅行助手。提供旅行规划、景点推荐、行程安排等服务。具备旅行专业、AI驱动、个性化推荐等特色功能。',
    website_url: 'https://wanderboat.ai',
    tags: ['硅谷初创', '旅行助手', '个性化推荐', 'AI驱动'],
    pricing_type: 'freemium'
  },
  {
    name: 'MChat',
    tagline: '基于孟子GPT大模型的AI对话机器人',
    description: 'MChat是基于孟子GPT大模型的AI对话机器人。提供智能对话、创作辅助、分析推理等服务。具备孟子GPT、大模型技术、专业质量等特色功能。',
    website_url: 'https://mchat.ai',
    tags: ['孟子GPT', '大模型技术', '专业质量', '智能对话'],
    pricing_type: 'freemium'
  },
  {
    name: 'Luca面壁露卡',
    tagline: '面壁智能推出的千亿多模态大模型免费智能对话助手',
    description: 'Luca面壁露卡是面壁智能推出的千亿多模态大模型免费智能对话助手。提供多模态交互、智能对话、创作辅助等服务。具备千亿参数、多模态技术、免费使用等特色功能。',
    website_url: 'https://luka.ai',
    tags: ['面壁智能', '千亿参数', '多模态AI', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: '元象XChat',
    tagline: '元象XVERSE大模型驱动的AI聊天助手',
    description: '元象XChat是元象XVERSE大模型驱动的AI聊天助手。提供智能对话、创作辅助、分析推理等服务。具备元象技术、XVERSE模型、专业质量等特色功能。',
    website_url: 'https://xchat.yuexiang.com',
    tags: ['元象科技', 'XVERSE模型', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChitChop',
    tagline: '字节旗下面向海外用户推出的免费大模型产品和AI助手工具箱',
    description: 'ChitChop是字节旗下面向海外用户推出的免费大模型产品和AI助手工具箱。提供智能对话、创作辅助、工具集成等服务。具备字节技术、海外市场、工具箱等特色功能。',
    website_url: 'https://chitchop.com',
    tags: ['字节跳动', '海外市场', '工具箱', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: '魔搭GPT（ModelScopeGPT）',
    tagline: '阿里达摩院推出的大小模型协同的智能助手，具备作诗、绘画、视频生成、语音播放等多模态能力',
    description: '魔搭GPT是阿里达摩院推出的大小模型协同的智能助手，具备作诗、绘画、视频生成、语音播放等多模态能力。提供多模态创作、智能对话、分析推理等服务。具备达摩院技术、多模态AI、大小模型协同等特色功能。',
    website_url: 'https://modelscope.cn/gpt',
    tags: ['阿里达摩院', '多模态AI', '大小模型协同', '创作能力'],
    pricing_type: 'freemium'
  },
  {
    name: 'Forefront',
    tagline: '提供GPT-3.5、GPT-4、Claude的AI聊天机器人',
    description: 'Forefront是提供GPT-3.5、GPT-4、Claude的AI聊天机器人平台。提供多模型对话、智能问答、创作辅助等服务。具备多模型支持、专业平台、功能全面等特色功能。',
    website_url: 'https://forefront.ai',
    tags: ['多模型平台', 'GPT-4', 'Claude', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'HuggingChat',
    tagline: 'HuggingFace推出的在线聊天机器人，基于Open Assistant模型',
    description: 'HuggingChat是HuggingFace推出的在线聊天机器人，基于Open Assistant模型。提供智能对话、创作辅助、分析推理等服务。具备HuggingFace技术、开源模型、专业质量等特色功能。',
    website_url: 'https://huggingface.co/chat',
    tags: ['HuggingFace', 'Open Assistant', '开源模型', '专业质量'],
    pricing_type: 'free'
  },
  {
    name: 'TigerBot',
    tagline: '虎博科技推出的AI对话聊天机器人，基于TigerBot开源大模型',
    description: 'TigerBot是虎博科技推出的AI对话聊天机器人，基于TigerBot开源大模型。提供智能对话、创作辅助、分析推理等服务。具备虎博技术、开源模型、专业质量等特色功能。',
    website_url: 'https://tigerbot.com',
    tags: ['虎博科技', '开源模型', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Stable Chat',
    tagline: 'Stability AI 最新推出的免费聊天对话网站',
    description: 'Stable Chat是Stability AI最新推出的免费聊天对话网站。提供智能对话、创作辅助、分析推理等服务。具备Stability AI技术、免费使用、专业质量等特色功能。',
    website_url: 'https://stability.ai/chat',
    tags: ['Stability AI', '免费使用', '专业质量', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: 'ColossalChat',
    tagline: 'Colossal-AI推出的免费开源版ChatGPT聊天机器人替代品',
    description: 'ColossalChat是Colossal-AI推出的免费开源版ChatGPT聊天机器人替代品。提供智能对话、创作辅助、分析推理等服务。具备开源免费、Colossal技术、专业质量等特色功能。',
    website_url: 'https://colossalai.org/chat',
    tags: ['Colossal-AI', '开源免费', 'ChatGPT替代', '专业质量'],
    pricing_type: 'free'
  },
  {
    name: 'Jasper Chat',
    tagline: 'Jasper针对内容创作者出品的AI聊天工具',
    description: 'Jasper Chat是Jasper针对内容创作者出品的AI聊天工具。提供智能对话、创作辅助、内容优化等服务。具备Jasper技术、创作专业、内容优化等特色功能。',
    website_url: 'https://jasper.ai/chat',
    tags: ['Jasper出品', '内容创作', '专业工具', '创作优化'],
    pricing_type: 'paid'
  },
  {
    name: 'MOSS',
    tagline: '复旦大学团队开发的对话式大型语言模型',
    description: 'MOSS是复旦大学团队开发的对话式大型语言模型。提供智能对话、创作辅助、分析推理等服务。具备学术背景、复旦技术、专业质量等特色功能。',
    website_url: 'https://moss.fudan.edu.cn',
    tags: ['复旦大学', '学术背景', '大型语言模型', '专业质量'],
    pricing_type: 'free'
  },
  {
    name: 'YouChat AI',
    tagline: 'AI搜索对话工具',
    description: 'YouChat AI是专业的AI搜索对话工具。提供智能搜索、对话问答、创作辅助等服务。具备搜索集成、智能对话、专业质量等特色功能。',
    website_url: 'https://youchat.ai',
    tags: ['搜索对话', '智能搜索', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChatSonic',
    tagline: 'WriteSonic出品的ChatGPT竞品',
    description: 'ChatSonic是WriteSonic出品的ChatGPT竞品。提供智能对话、创作辅助、分析推理等服务。具备WriteSonic技术、ChatGPT竞品、专业质量等特色功能。',
    website_url: 'https://writesonic.com/chat',
    tags: ['WriteSonic出品', 'ChatGPT竞品', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Replika',
    tagline: 'AI对话陪伴工具',
    description: 'Replika是专业的AI对话陪伴工具。提供情感陪伴、智能对话、个性化服务等功能。具备情感交互、个性化定制、专业陪伴等特色功能。',
    website_url: 'https://replika.ai',
    tags: ['情感陪伴', '个性化服务', '专业陪伴', '情感交互'],
    pricing_type: 'freemium'
  },
  {
    name: 'Whispr',
    tagline: '免费AI对话回应',
    description: 'Whispr是免费AI对话回应工具。提供智能对话、快速回应、创作辅助等服务。具备免费使用、快速响应、专业质量等特色功能。',
    website_url: 'https://whispr.ai',
    tags: ['免费使用', '快速回应', '专业质量', '智能对话'],
    pricing_type: 'free'
  },
  {
    name: 'Open Assistant',
    tagline: '免费开源的对话式AI，GitHub星标超3万',
    description: 'Open Assistant是免费开源的对话式AI，GitHub星标超3万。提供智能对话、创作辅助、分析推理等服务。具备开源免费、社区活跃、专业质量等特色功能。',
    website_url: 'https://open-assistant.ai',
    tags: ['开源免费', 'GitHub星标', '社区活跃', '专业质量'],
    pricing_type: 'free'
  },
  {
    name: 'Pi',
    tagline: 'DeepMind联创新公司推出的AI聊天机器人',
    description: 'Pi是DeepMind联创新公司推出的AI聊天机器人。提供智能对话、创作辅助、分析推理等服务。具备DeepMind技术、联创新公司、专业质量等特色功能。',
    website_url: 'https://pi.ai',
    tags: ['DeepMind联合', '技术先进', '专业质量', '智能对话'],
    pricing_type: 'free'
  },
  {
    name: 'Inworld',
    tagline: '开发和创建AI虚拟角色并与其互动',
    description: 'Inworld是专业的AI虚拟角色开发和互动平台。用户可以开发和创建AI虚拟角色并与其进行智能互动。具备角色开发、虚拟互动、AI驱动等特色功能。',
    website_url: 'https://inworld.ai',
    tags: ['虚拟角色', '角色开发', '智能互动', 'AI驱动'],
    pricing_type: 'freemium'
  },
  {
    name: '360智脑',
    tagline: '360搜索最新推出的AI对话聊天机器人',
    description: '360智脑是360搜索最新推出的AI对话聊天机器人。提供智能对话、创作辅助、分析推理等服务。具备360技术、搜索集成、专业质量等特色功能。',
    website_url: 'https://zhiyin.360.com',
    tags: ['360出品', '搜索集成', '专业质量', '最新推出'],
    pricing_type: 'freemium'
  },
  {
    name: 'Neeva',
    tagline: '集成了AI问答的AI搜索引擎',
    description: 'Neeva是集成了AI问答的AI搜索引擎。提供智能搜索、对话问答、创作辅助等服务。具备搜索集成、AI问答、专业质量等特色功能。',
    website_url: 'https://neeva.com',
    tags: ['AI搜索', '问答集成', '专业质量', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '对话写作猫',
    tagline: '秘塔写作猫推出的AI对话聊天工具',
    description: '对话写作猫是秘塔写作猫推出的AI对话聊天工具。提供智能对话、创作辅助、分析推理等服务。具备秘塔技术、写作专业、对话优化等特色功能。',
    website_url: 'https://duihua.xiezuomao.com',
    tags: ['秘塔出品', '写作专业', '对话优化', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '应事AI',
    tagline: 'MiniMax推出的AI对话助理，已免费开放',
    description: '应事AI是MiniMax推出的AI对话助理，已免费开放。提供智能对话、创作辅助、分析推理等服务。具备MiniMax技术、免费开放、专业质量等特色功能。',
    website_url: 'https://yingshi.ai',
    tags: ['MiniMax出品', '免费开放', '专业质量', '技术先进'],
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

async function insertChatTools() {
  console.log('开始检查并插入AI聊天助手工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of chatTools) {
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
          category: 'chat',
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
    
    console.log(`\n🎉 AI聊天助手工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${chatTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertChatTools()
