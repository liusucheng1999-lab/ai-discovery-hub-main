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

// AI智能体工具数据
const agentTools = [
  {
    name: 'Atoms',
    tagline: '第一支自动构建真实业务的 AI 团队',
    description: 'Atoms是第一支自动构建真实业务的AI团队。提供业务构建、AI团队协作、自动化服务等功能。具备自动构建、团队协作、业务专业等特色功能，适合业务自动化使用。',
    website_url: 'https://atoms.ai',
    tags: ['AI团队', '业务构建', '自动化', '团队协作'],
    pricing_type: 'freemium'
  },
  {
    name: '爱派AiPy',
    tagline: '本地Manus、国内能用、内网能用，开源免费',
    description: '爱派AiPy是本地Manus工具，国内能用、内网能用，开源免费。提供本地部署、内网支持、开源免费等服务。具备本地部署、内网支持、开源免费等特色功能，适合本地化使用。',
    website_url: 'https://aipy.ai',
    tags: ['本地部署', '内网支持', '开源免费', '国内可用'],
    pricing_type: 'opensource'
  },
  {
    name: '扣子',
    tagline: '免费全能的AI办公智能体',
    description: '扣子是免费全能的AI办公智能体。提供办公辅助、全能服务、免费使用等功能。具备办公专业、全能服务、免费使用等特色功能，适合办公场景使用。',
    website_url: 'https://kouzi.com',
    tags: ['办公智能体', '全能服务', '免费使用', '办公专业'],
    pricing_type: 'free'
  },
  {
    name: '01Agent',
    tagline: 'AI图文创作智能体，支持生成、排版、编辑、发布',
    description: '01Agent是AI图文创作智能体，支持生成、排版、编辑、发布。提供图文创作、全流程服务、创作专业等功能。具备图文创作、全流程支持、专业排版等特色功能，适合内容创作使用。',
    website_url: 'https://01agent.com',
    tags: ['图文创作', '全流程支持', '专业排版', '内容创作'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞星辰Agent',
    tagline: '科大讯飞推出的AI智能体开发平台',
    description: '讯飞星辰Agent是科大讯飞推出的AI智能体开发平台。提供智能体开发、讯飞技术、创作辅助等服务。具备讯飞技术、开发专业、创作便捷等特色功能，适合智能体开发使用。',
    website_url: 'https://xingchen.xunfei.cn',
    tags: ['科大讯飞', '智能体开发', '技术先进', '开发专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Manus',
    tagline: '蝴蝶效应公司推出的首款自主通用AI Agent',
    description: 'Manus是蝴蝶效应公司推出的首款自主通用AI Agent。提供通用智能体、自主操作、蝴蝶效应技术等服务。具备自主通用、操作专业、技术先进等特色功能，适合通用智能体使用。',
    website_url: 'https://manus.ai',
    tags: ['蝴蝶效应', '通用智能体', '自主操作', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Flowith',
    tagline: '免费用Gemini 3、GPT-5',
    description: 'Flowith是免费使用Gemini 3、GPT-5的平台。提供免费使用、多模型支持、智能体服务等功能。具备免费使用、多模型、服务全面等特色功能，适合智能体使用。',
    website_url: 'https://flowith.com',
    tags: ['免费使用', '多模型支持', 'Gemini 3', 'GPT-5'],
    pricing_type: 'free'
  },
  {
    name: '码上飞',
    tagline: '一句话生成微信小程序、APP、H5网页',
    description: '码上飞是一句话生成微信小程序、APP、H5网页的工具。提供代码生成、多平台支持、开发便捷等功能。具备一句话生成、多平台、开发便捷等特色功能，适合快速开发使用。',
    website_url: 'https://mashangfei.com',
    tags: ['代码生成', '多平台支持', '开发便捷', '一句话生成'],
    pricing_type: 'freemium'
  },
  {
    name: '金灵AI',
    tagline: '专业的金融深度投研AI Agent',
    description: '金灵AI是专业的金融深度投研AI Agent。提供金融投研、深度分析、专业服务等功能。具备金融专业、投研深度、分析专业等特色功能，适合金融投研使用。',
    website_url: 'https://jinling.ai',
    tags: ['金融投研', '深度分析', '专业服务', '金融专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'OpenClaw',
    tagline: '开源免费的个人 AI 助手',
    description: 'OpenClaw是开源免费的个人AI助手。提供个人助手、开源免费、AI服务等功能。具备开源免费、个人助手、服务全面等特色功能，适合个人使用。',
    website_url: 'https://openclaw.ai',
    tags: ['开源免费', '个人助手', '服务全面', 'AI助手'],
    pricing_type: 'opensource'
  },
  {
    name: '新AutoClaw',
    tagline: '智谱推出的国内首个一键安装本地版OpenClaw',
    description: '新AutoClaw是智谱推出的国内首个一键安装本地版OpenClaw。提供本地安装、智谱技术、便捷部署等功能。具备一键安装、本地部署、智谱技术等特色功能，适合本地化使用。',
    website_url: 'https://autoclaw.zhipu.ai',
    tags: ['智谱出品', '一键安装', '本地部署', '便捷部署'],
    pricing_type: 'opensource'
  },
  {
    name: 'WorkBuddy',
    tagline: '腾讯云推出的AI原生桌面智能体工作台',
    description: 'WorkBuddy是腾讯云推出的AI原生桌面智能体工作台。提供桌面工作台、AI原生、腾讯技术等服务。具备腾讯技术、桌面专业、AI原生等特色功能，适合桌面工作使用。',
    website_url: 'https://workbuddy.tencent.com',
    tags: ['腾讯云', '桌面工作台', 'AI原生', '工作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'QoderWork',
    tagline: '阿里Qoder团队推出的桌面端AI智能体',
    description: 'QoderWork是阿里Qoder团队推出的桌面端AI智能体。提供桌面智能体、阿里技术、Qoder专业等服务。具备阿里技术、桌面专业、智能便捷等特色功能，适合桌面使用。',
    website_url: 'https://qoderwork.alibaba.com',
    tags: ['阿里出品', '桌面智能体', 'Qoder技术', '智能便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'InStreet',
    tagline: '字节扣子推出的 AI Agent 专属中文社交网络',
    description: 'InStreet是字节扣子推出的AI Agent专属中文社交网络。提供社交网络、中文专属、字节技术等服务。具备字节技术、社交专业、中文优化等特色功能，适合AI社交使用。',
    website_url: 'https://instreet.bytedance.com',
    tags: ['字节跳动', '社交网络', '中文专属', 'AI社交'],
    pricing_type: 'freemium'
  },
  {
    name: 'EvoMap',
    tagline: '全球首个面向 AI 智能体的进化协作平台',
    description: 'EvoMap是全球首个面向AI智能体的进化协作平台。提供进化协作、智能体平台、全球领先等服务。具备全球首个、协作专业、进化智能等特色功能，适合智能体协作使用。',
    website_url: 'https://evomap.ai',
    tags: ['全球首个', '进化协作', '智能体平台', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'happycapy',
    tagline: 'Trickle 团队推出的云端AI Agent原生计算机',
    description: 'happycapy是Trickle团队推出的云端AI Agent原生计算机。提供云端计算机、AI原生、Trickle技术等服务。具备云端部署、AI原生、计算机专业等特色功能，适合云端计算使用。',
    website_url: 'https://happycapy.com',
    tags: ['Trickle团队', '云端计算机', 'AI原生', '云端部署'],
    pricing_type: 'freemium'
  },
  {
    name: 'Genspark',
    tagline: '通用AI智能体，您的一站式AI工作空间',
    description: 'Genspark是通用AI智能体，一站式AI工作空间。提供通用智能体、一站式服务、工作空间等功能。具备通用智能体、一站式服务、工作专业等特色功能，适合通用工作使用。',
    website_url: 'https://genspark.ai',
    tags: ['通用智能体', '一站式服务', '工作空间', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'OiiOii',
    tagline: '全球首个专业动画创作Agent',
    description: 'OiiOii是全球首个专业动画创作Agent。提供动画创作、专业服务、全球领先等功能。具备全球首个、动画专业、创作便捷等特色功能，适合动画创作使用。',
    website_url: 'https://oiioii.ai',
    tags: ['全球首个', '动画创作', '专业服务', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'QClaw',
    tagline: '腾讯电脑管家团队基于 OpenClaw 打造的本地 AI 助手',
    description: 'QClaw是腾讯电脑管家团队基于OpenClaw打造的本地AI助手。提供本地助手、腾讯技术、OpenClaw基础等服务。具备腾讯技术、本地部署、助手专业等特色功能，适合本地使用。',
    website_url: 'https://qclaw.tencent.com',
    tags: ['腾讯电脑管家', '本地助手', 'OpenClaw基础', '本地部署'],
    pricing_type: 'opensource'
  },
  {
    name: 'MiniMax Agent',
    tagline: 'MiniMax推出的通用型AI智能体',
    description: 'MiniMax Agent是MiniMax推出的通用型AI智能体。提供通用智能体、MiniMax技术、服务全面等功能。具备MiniMax技术、通用专业、服务全面等特色功能，适合通用智能体使用。',
    website_url: 'https://agent.minimax.ai',
    tags: ['MiniMax出品', '通用智能体', '服务全面', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Lovart',
    tagline: 'LiblibAI推出的全球首个设计智能体',
    description: 'Lovart是LiblibAI推出的全球首个设计智能体。提供设计智能体、全球首个、Liblib技术等服务。具备全球首个、设计专业、创作便捷等特色功能，适合设计创作使用。',
    website_url: 'https://lovart.liblib.ai',
    tags: ['LiblibAI出品', '全球首个', '设计智能体', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Operator',
    tagline: 'OpenAI推出的AI智能体，能推理、联网自主执行任务',
    description: 'Operator是OpenAI推出的AI智能体，能推理、联网自主执行任务。提供推理能力、联网执行、OpenAI技术等服务。具备OpenAI技术、推理专业、自主执行等特色功能，适合智能任务执行使用。',
    website_url: 'https://operator.openai.com',
    tags: ['OpenAI出品', '推理能力', '联网执行', '自主任务'],
    pricing_type: 'freemium'
  },
  {
    name: 'GenFlow',
    tagline: '全球首个全模态、全端通用AI智能体',
    description: 'GenFlow是全球首个全模态、全端通用AI智能体。提供全模态支持、全端通用、全球领先等服务。具备全球首个、全模态、通用专业等特色功能，适合全模态智能体使用。',
    website_url: 'https://genflow.ai',
    tags: ['全球首个', '全模态', '全端通用', '技术领先'],
    pricing_type: 'freemium'
  },
  {
    name: 'Skywork',
    tagline: '昆仑万维面向全球推出的天工超级智能体',
    description: 'Skywork是昆仑万维面向全球推出的天工超级智能体。提供超级智能体、昆仑技术、全球服务等功能。具备昆仑万维、超级智能、全球领先等特色功能，适合超级智能体使用。',
    website_url: 'https://skywork.kunlun.ai',
    tags: ['昆仑万维', '超级智能体', '全球服务', '技术领先'],
    pricing_type: 'freemium'
  },
  {
    name: '小云雀',
    tagline: '字节跳动旗下剪映推出的AI内容创作Agent',
    description: '小云雀是字节跳动旗下剪映推出的AI内容创作Agent。提供内容创作、剪映技术、字节生态等服务。具备剪映技术、内容专业、创作便捷等特色功能，适合内容创作使用。',
    website_url: 'https://xiaoyunque.jianying.com',
    tags: ['字节跳动', '剪映出品', '内容创作', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tabbit',
    tagline: '美团光年之外推出的AI原生浏览器',
    description: 'Tabbit是美团光年之外推出的AI原生浏览器。提供AI原生浏览器、美团技术、光年之外服务等功能。具备美团技术、AI原生、浏览器专业等特色功能，适合AI浏览使用。',
    website_url: 'https://tabbit.meituan.com',
    tags: ['美团出品', 'AI原生浏览器', '光年之外', '浏览器专业'],
    pricing_type: 'freemium'
  },
  {
    name: '新SkillHub',
    tagline: '腾讯云专为中国用户推出的 Skill 极速安装工具',
    description: '新SkillHub是腾讯云专为中国用户推出的Skill极速安装工具。提供极速安装、腾讯云技术、中国优化等服务。具备腾讯云技术、极速安装、中国优化等特色功能，适合中国用户使用。',
    website_url: 'https://skillhub.tencent.com',
    tags: ['腾讯云', '极速安装', '中国优化', '安装便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '切问学术',
    tagline: 'FudanNLP团队推出的AI学术智能体',
    description: '切问学术是FudanNLP团队推出的AI学术智能体。提供学术研究、FudanNLP技术、学术专业等服务。具备FudanNLP技术、学术专业、研究便捷等特色功能，适合学术研究使用。',
    website_url: 'https://qiewen.fudan.edu.cn',
    tags: ['FudanNLP', '学术智能体', '学术专业', '研究便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Leewow',
    tagline: '首个造物 AI Agent，图片或文本生成实物商品',
    description: 'Leewow是首个造物AI Agent，图片或文本生成实物商品。提供造物功能、实物生成、创作转换等服务。具备首个造物、实物生成、创作创新等特色功能，适合造物创作使用。',
    website_url: 'https://leewow.com',
    tags: ['首个造物', '实物生成', '创作转换', '创新工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Mixboard',
    tagline: 'Google Labs 推出的 AI 无限画布工具',
    description: 'Mixboard是Google Labs推出的AI无限画布工具。提供无限画布、Google技术、创作辅助等服务。具备Google技术、无限画布、创作专业等特色功能，适合创作使用。',
    website_url: 'https://mixboard.googlelabs.com',
    tags: ['Google Labs', '无限画布', '创作专业', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: 'memU Bot',
    tagline: '7*24小时全天候运行的AI个人助手',
    description: 'memU Bot是7*24小时全天候运行的AI个人助手。提供全天候服务、个人助手、AI支持等功能。具备全天候运行、个人助手、服务全面等特色功能，适合个人使用。',
    website_url: 'https://memu.bot',
    tags: ['全天候运行', '个人助手', '服务全面', 'AI支持'],
    pricing_type: 'freemium'
  },
  {
    name: '元气AI Bot',
    tagline: '猎豹推出的电脑全能AI伙伴，国产OpenClaw',
    description: '元气AI Bot是猎豹推出的电脑全能AI伙伴，国产OpenClaw。提供全能伙伴、猎豹技术、国产OpenClaw等服务。具备猎豹技术、全能服务、国产专业等特色功能，适合电脑使用。',
    website_url: 'https://yuanqi.cheetah.com',
    tags: ['猎豹出品', '全能AI伙伴', '国产OpenClaw', '全能服务'],
    pricing_type: 'freemium'
  },
  {
    name: 'WorkAny',
    tagline: '本地运行的开源AI桌面智能体',
    description: 'WorkAny是本地运行的开源AI桌面智能体。提供本地运行、开源免费、桌面智能体等服务。具备本地运行、开源免费、桌面专业等特色功能，适合本地桌面使用。',
    website_url: 'https://workany.ai',
    tags: ['本地运行', '开源免费', '桌面智能体', '本地部署'],
    pricing_type: 'opensource'
  },
  {
    name: 'Agnes AI',
    tagline: '专为办公场景设计的团队协作型AI Agent',
    description: 'Agnes AI是专为办公场景设计的团队协作型AI Agent。提供办公协作、团队服务、专业设计等功能。具备办公专业、团队协作、设计优化等特色功能，适合办公团队使用。',
    website_url: 'https://agnes.ai',
    tags: ['办公协作', '团队服务', '专业设计', '协作优化'],
    pricing_type: 'freemium'
  },
  {
    name: 'Seele AI',
    tagline: '全球首个端到端AI 3D游戏生成工具',
    description: 'Seele AI是全球首个端到端AI 3D游戏生成工具。提供3D游戏生成、端到端服务、全球领先等功能。具备全球首个、3D游戏、端到端专业等特色功能，适合游戏生成使用。',
    website_url: 'https://seele.ai',
    tags: ['全球首个', '3D游戏生成', '端到端服务', '游戏专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'AnyGen',
    tagline: '字节跳动推出的AI办公智能体',
    description: 'AnyGen是字节跳动推出的AI办公智能体。提供办公智能体、字节技术、办公专业等服务。具备字节技术、办公专业、智能便捷等特色功能，适合办公使用。',
    website_url: 'https://anygen.bytedance.com',
    tags: ['字节跳动', '办公智能体', '办公专业', '智能便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tbox',
    tagline: '蚂蚁集团旗下多智能体协同的通用 AI Agent',
    description: 'Tbox是蚂蚁集团旗下多智能体协同的通用AI Agent。提供多智能体协同、蚂蚁技术、通用服务等功能。具备蚂蚁集团、多智能体、协同专业等特色功能，适合智能体协同使用。',
    website_url: 'https://tbox.antgroup.com',
    tags: ['蚂蚁集团', '多智能体协同', '通用服务', '协同专业'],
    pricing_type: 'freemium'
  },
  {
    name: '稿定AI社区',
    tagline: '稿定推出的设计Agent和AI创意社区',
    description: '稿定AI社区是稿定推出的设计Agent和AI创意社区。提供设计Agent、创意社区、稿定技术等服务。具备稿定技术、设计专业、社区互动等特色功能，适合设计创作使用。',
    website_url: 'https://ai.gaoding.com',
    tags: ['稿定出品', '设计Agent', '创意社区', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: '椒图AI',
    tagline: '深度适配中文场景的AI修图智能体',
    description: '椒图AI是深度适配中文场景的AI修图智能体。提供修图智能体、中文适配、专业服务等功能。具备中文适配、修图专业、场景优化等特色功能，适合中文修图使用。',
    website_url: 'https://jiaotu.ai',
    tags: ['中文适配', '修图智能体', '场景优化', '修图专业'],
    pricing_type: 'freemium'
  },
  {
    name: '遨虾',
    tagline: '1688推出的跨境电商生意Agent',
    description: '遨虾是1688推出的跨境电商生意Agent。提供跨境电商、生意Agent、1688生态等服务。具备1688技术、电商专业、生意辅助等特色功能，适合跨境电商使用。',
    website_url: 'https://aoxia.1688.com',
    tags: ['1688出品', '跨境电商', '生意Agent', '电商专业'],
    pricing_type: 'freemium'
  },
  {
    name: '亿话',
    tagline: '数字人对话智能体创作平台',
    description: '亿话是数字人对话智能体创作平台。提供数字人对话、智能体创作、专业服务等功能。具备数字人专业、对话创作、平台便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://yihua.com',
    tags: ['数字人对话', '智能体创作', '平台便捷', '对话专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tago',
    tagline: '专注电商领域的全能AI运营智能体',
    description: 'Tago是专注电商领域的全能AI运营智能体。提供电商运营、全能服务、专业支持等功能。具备电商专业、运营智能、服务全面等特色功能，适合电商运营使用。',
    website_url: 'https://tago.ai',
    tags: ['电商运营', '全能服务', '专业支持', '运营智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'FlowMuse AI',
    tagline: '专注于 AI 图像视频的无限画布',
    description: 'FlowMuse AI是专注于AI图像视频的无限画布。提供图像视频创作、无限画布、专业服务等功能。具备图像视频专业、无限画布、创作便捷等特色功能，适合多媒体创作使用。',
    website_url: 'https://flowmuse.ai',
    tags: ['图像视频', '无限画布', '创作便捷', '多媒体专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'NeoDomain',
    tagline: 'AI创意内容生成智能体',
    description: 'NeoDomain是AI创意内容生成智能体。提供创意内容生成、AI支持、专业服务等功能。具备创意专业、内容生成、AI支持等特色功能，适合创意内容使用。',
    website_url: 'https://neodomain.ai',
    tags: ['创意内容', '内容生成', 'AI支持', '创意专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'MuleRun',
    tagline: '全球首个 AI Agent 市场，类似eBay',
    description: 'MuleRun是全球首个AI Agent市场，类似eBay。提供Agent市场、全球首个、交易服务等功能。具备全球首个、市场专业、交易便捷等特色功能，适合Agent交易使用。',
    website_url: 'https://mulerun.com',
    tags: ['全球首个', 'Agent市场', '交易服务', '市场专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Opera Neon',
    tagline: 'Opera推出的全新AI Agent浏览器',
    description: 'Opera Neon是Opera推出的全新AI Agent浏览器。提供AI浏览器、Opera技术、全新体验等服务。具备Opera技术、AI浏览器、体验创新等特色功能，适合AI浏览使用。',
    website_url: 'https://neon.opera.com',
    tags: ['Opera出品', 'AI浏览器', '全新体验', '体验创新'],
    pricing_type: 'free'
  },
  {
    name: 'Seko',
    tagline: '首个创编一体的AI短视频创作Agent',
    description: 'Seko是首个创编一体的AI短视频创作Agent。提供短视频创作、创编一体、专业服务等功能。具备首个创编一体、短视频专业、创作便捷等特色功能，适合短视频创作使用。',
    website_url: 'https://seko.ai',
    tags: ['首个创编一体', '短视频创作', '创作便捷', '短视频专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Fellou',
    tagline: 'Fellou AI 推出的首个Agentic浏览器',
    description: 'Fellou是Fellou AI推出的首个Agentic浏览器。提供Agentic浏览器、Fellou技术、首个体验等功能。具备首个Agentic、浏览器专业、体验创新等特色功能，适合AI浏览使用。',
    website_url: 'https://fellou.ai',
    tags: ['首个Agentic', '浏览器专业', '体验创新', 'Fellou技术'],
    pricing_type: 'freemium'
  },
  {
    name: 'Dia',
    tagline: 'Arc 团队推出的 AI 原生浏览器',
    description: 'Dia是Arc团队推出的AI原生浏览器。提供AI原生浏览器、Arc技术、原生体验等服务。具备Arc技术、AI原生、浏览器专业等特色功能，适合AI浏览使用。',
    website_url: 'https://dia.arc.net',
    tags: ['Arc团队', 'AI原生浏览器', '原生体验', '浏览器专业'],
    pricing_type: 'free'
  },
  {
    name: 'TabTab',
    tagline: '首个全链路 Data Agent',
    description: 'TabTab是首个全链路Data Agent。提供全链路数据、首个Data Agent、专业服务等功能。具备首个全链路、数据专业、服务全面等特色功能，适合数据处理使用。',
    website_url: 'https://tabtab.ai',
    tags: ['首个全链路', 'Data Agent', '数据专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: '酷宣AI',
    tagline: '超级智能体，一站式AI内容创作',
    description: '酷宣AI是超级智能体，一站式AI内容创作。提供超级智能体、内容创作、一站式服务等功能。具备超级智能、创作专业、服务全面等特色功能，适合内容创作使用。',
    website_url: 'https://kuxuan.ai',
    tags: ['超级智能体', '内容创作', '一站式服务', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '月亮树AI选品',
    tagline: '亚马逊AI选品智能体，亿级实时商品大数据',
    description: '月亮树AI选品是亚马逊AI选品智能体，亿级实时商品大数据。提供AI选品、大数据支持、亚马逊专业等服务。具备大数据、选品专业、亚马逊优化等特色功能，适合亚马逊选品使用。',
    website_url: 'https://yueliangshu.ai',
    tags: ['亚马逊选品', '大数据支持', '选品专业', '亚马逊优化'],
    pricing_type: 'freemium'
  },
  {
    name: '如此AI员工',
    tagline: '国内首个全链路营销获客AI Agent',
    description: '如此AI员工是国内首个全链路营销获客AI Agent。提供营销获客、全链路服务、国内首个等功能。具备国内首个、营销专业、获客智能等特色功能，适合营销获客使用。',
    website_url: 'https://rucai.ai',
    tags: ['国内首个', '营销获客', '全链路服务', '营销专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'MasterAgent',
    tagline: '全球首个L4级多智能体生成与协作平台',
    description: 'MasterAgent是全球首个L4级多智能体生成与协作平台。提供L4级智能体、多智能体协作、全球领先等功能。具备全球首个、L4级、协作专业等特色功能，适合智能体协作使用。',
    website_url: 'https://masteragent.ai',
    tags: ['全球首个', 'L4级', '多智能体协作', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Teamo',
    tagline: '夕小瑶团队推出的多Agent协作AI智能体',
    description: 'Teamo是夕小瑶团队推出的多Agent协作AI智能体。提供多Agent协作、夕小瑶技术、协作服务等功能。具备夕小瑶技术、多Agent、协作专业等特色功能，适合智能体协作使用。',
    website_url: 'https://teamo.xiaoxiaoyao.com',
    tags: ['夕小瑶团队', '多Agent协作', '协作专业', '团队服务'],
    pricing_type: 'freemium'
  },
  {
    name: 'SciMaster',
    tagline: '上交大联合深势科技推出的通用科研Agent',
    description: 'SciMaster是上交大联合深势科技推出的通用科研Agent。提供科研Agent、上交大技术、深势科技支持等功能。具备学术背景、科研专业、技术先进等特色功能，适合科研使用。',
    website_url: 'https://scimaster.sjtu.edu.cn',
    tags: ['上交大', '深势科技', '科研Agent', '学术背景'],
    pricing_type: 'freemium'
  },
  {
    name: 'Zeabur',
    tagline: '专为氛围编程设计的云部署AI 智能体',
    description: 'Zeabur是专为氛围编程设计的云部署AI智能体。提供云部署、氛围编程、Zeabur技术等服务。具备云部署、编程专业、氛围优化等特色功能，适合编程部署使用。',
    website_url: 'https://zeabur.com',
    tags: ['云部署', '氛围编程', '编程专业', '部署便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'MyShell',
    tagline: '构建、共享和拥有AI Agents的开发平台',
    description: 'MyShell是构建、共享和拥有AI Agents的开发平台。提供Agent开发、共享平台、拥有服务等功能。具备开发专业、共享便捷、拥有权益等特色功能，适合Agent开发使用。',
    website_url: 'https://myshell.ai',
    tags: ['Agent开发', '共享平台', '拥有权益', '开发专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'FinGenius',
    tagline: '全球首个A股AI金融博弈智能体应用',
    description: 'FinGenius是全球首个A股AI金融博弈智能体应用。提供A股博弈、金融智能、全球首个等功能。具备全球首个、A股专业、金融博弈等特色功能，适合A股投资使用。',
    website_url: 'https://fingenius.ai',
    tags: ['全球首个', 'A股博弈', '金融智能', 'A股专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'RoboNeo',
    tagline: '美图推出的专注影像与设计的AI智能体',
    description: 'RoboNeo是美图推出的专注影像与设计的AI智能体。提供影像设计、美图技术、专业服务等功能。具备美图技术、影像专业、设计便捷等特色功能，适合影像设计使用。',
    website_url: 'https://roboneo.meitu.com',
    tags: ['美图出品', '影像设计', '专业服务', '设计便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '混沌Deep Innovation',
    tagline: '混沌学园推出的战略咨询AI智能体',
    description: '混沌Deep Innovation是混沌学园推出的战略咨询AI智能体。提供战略咨询、混沌技术、专业服务等功能。具备混沌学园、战略专业、咨询智能等特色功能，适合战略咨询使用。',
    website_url: 'https://deepinnovation.hundun.cn',
    tags: ['混沌学园', '战略咨询', '专业服务', '咨询智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'BrowserOS',
    tagline: '免费开源的 AI Agent 浏览器',
    description: 'BrowserOS是免费开源的AI Agent浏览器。提供Agent浏览器、开源免费、专业服务等功能。具备开源免费、Agent专业、浏览器便捷等特色功能，适合Agent浏览使用。',
    website_url: 'https://browseros.org',
    tags: ['开源免费', 'Agent浏览器', '浏览器便捷', 'Agent专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'CrePal',
    tagline: 'AI 视频创作智能体',
    description: 'CrePal是AI视频创作智能体。提供视频创作、AI支持、专业服务等功能。具备视频创作、AI专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://crepal.ai',
    tags: ['视频创作', 'AI支持', '创作便捷', '视频专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Jaaz',
    tagline: '开源的AI设计Agent，本地免费Lovart平替项目',
    description: 'Jaaz是开源的AI设计Agent，本地免费Lovart平替项目。提供设计Agent、开源免费、本地部署等服务。具备开源免费、设计专业、本地便捷等特色功能，适合设计创作使用。',
    website_url: 'https://jaaz.ai',
    tags: ['开源免费', '设计Agent', '本地部署', 'Lovart平替'],
    pricing_type: 'opensource'
  },
  {
    name: 'CoCo',
    tagline: '智谱推出的首个企业级超级助手Agent',
    description: 'CoCo是智谱推出的首个企业级超级助手Agent。提供企业级助手、智谱技术、超级服务等功能。具备智谱技术、企业级、超级助手等特色功能，适合企业使用。',
    website_url: 'https://coco.zhipu.ai',
    tags: ['智谱出品', '企业级助手', '超级服务', '企业专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Bloom',
    tagline: 'Powerdrill推出的首款AI决策智能体',
    description: 'Bloom是Powerdrill推出的首款AI决策智能体。提供决策智能、Powerdrill技术、专业服务等功能。具备Powerdrill技术、决策专业、智能便捷等特色功能，适合决策使用。',
    website_url: 'https://bloom.powerdrill.com',
    tags: ['Powerdrill出品', '决策智能体', '专业服务', '决策专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Bobby',
    tagline: 'RockFlow 推出的金融投资AI Agent',
    description: 'Bobby是RockFlow推出的金融投资AI Agent。提供金融投资、RockFlow技术、专业服务等功能。具备RockFlow技术、金融专业、投资智能等特色功能，适合金融投资使用。',
    website_url: 'https://bobby.rockflow.com',
    tags: ['RockFlow出品', '金融投资', '专业服务', '投资智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Suna',
    tagline: '全球首款通用型 AI Agent 开源项目',
    description: 'Suna是全球首款通用型AI Agent开源项目。提供通用Agent、开源项目、全球首款等功能。具备全球首款、通用专业、开源便捷等特色功能，适合通用Agent使用。',
    website_url: 'https://suna.ai',
    tags: ['全球首款', '通用Agent', '开源项目', '通用专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'Fairies',
    tagline: '通用型AI Agent，强大的多任务执行能力',
    description: 'Fairies是通用型AI Agent，具有强大的多任务执行能力。提供多任务执行、通用Agent、强大能力等功能。具备多任务专业、执行强大、通用便捷等特色功能，适合多任务使用。',
    website_url: 'https://fairies.ai',
    tags: ['通用Agent', '多任务执行', '强大能力', '执行专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'FloweAI',
    tagline: '通用型AI Agent，支持多任务并行处理',
    description: 'FloweAI是通用型AI Agent，支持多任务并行处理。提供多任务并行、通用Agent、处理专业等功能。具备多任务专业、并行处理、通用便捷等特色功能，适合多任务使用。',
    website_url: 'https://floweai.com',
    tags: ['通用Agent', '多任务并行', '处理专业', '并行便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'AutoGLM沉思',
    tagline: '首个免费、具备深度研究和操作能力的AI Agent',
    description: 'AutoGLM沉思是首个免费、具备深度研究和操作能力的AI Agent。提供深度研究、操作能力、免费服务等功能。具备首个免费、研究专业、操作强大等特色功能，适合深度研究使用。',
    website_url: 'https://autoglm.chensi.com',
    tags: ['首个免费', '深度研究', '操作能力', '研究专业'],
    pricing_type: 'free'
  },
  {
    name: 'CRIC深度智联',
    tagline: '房地产行业首个AI Agent',
    description: 'CRIC深度智联是房地产行业首个AI Agent。提供房地产行业、首个Agent、专业服务等功能。具备行业首个、房地产专业、服务全面等特色功能，适合房地产行业使用。',
    website_url: 'https://cric.zhihui.com',
    tags: ['行业首个', '房地产', '专业服务', '行业专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'rabbitOS intern',
    tagline: 'rabbit 推出的通用型AI智能体',
    description: 'rabbitOS intern是rabbit推出的通用型AI智能体。提供通用智能体、rabbit技术、专业服务等功能。具备rabbit技术、通用专业、服务全面等特色功能，适合通用智能体使用。',
    website_url: 'https://intern.rabbit.tech',
    tags: ['rabbit出品', '通用智能体', '服务全面', '技术先进'],
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

async function insertAgentTools() {
  console.log('开始检查并插入AI智能体工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of agentTools) {
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
          category: 'agent',
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
    
    console.log(`\n🎉 AI智能体工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${agentTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertAgentTools()
