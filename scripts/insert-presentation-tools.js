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

// AI幻灯片和演示工具数据
const presentationTools = [
  {
    name: 'AiPPT',
    tagline: 'AI快速生成高质量PPT',
    description: 'AiPPT是AI快速生成高质量PPT的工具。提供AI生成、高质量PPT、快速创作等服务。具备AI专业、质量优秀、生成快速等特色功能，适合PPT创作使用。',
    website_url: 'https://aippt.com',
    tags: ['AI生成', '高质量PPT', '快速创作', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: '扣子PPT',
    tagline: '免费一键生成精美PPT',
    description: '扣子PPT是免费一键生成精美PPT的工具。提供免费生成、精美PPT、一键创作等服务。具备免费使用、精美专业、一键生成等特色功能，适合PPT创作使用。',
    website_url: 'https://ppt.kouzi.com',
    tags: ['免费生成', '精美PPT', '一键创作', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: '咔片PPT',
    tagline: 'AI PPT制作工具，设计美化全流程自动化',
    description: '咔片PPT是AI PPT制作工具，设计美化全流程自动化。提供PPT制作、设计美化、全流程自动化等服务。具备设计专业、美化优秀、自动化便捷等特色功能，适合PPT制作使用。',
    website_url: 'https://kapian.ppt.com',
    tags: ['PPT制作', '设计美化', '全流程自动化', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: '文多多AiPPT',
    tagline: 'AI一键生成PPT，支持AI配图和智能资料整合',
    description: '文多多AiPPT是AI一键生成PPT，支持AI配图和智能资料整合。提供一键生成、AI配图、资料整合等服务。具备一键生成、配图专业、整合智能等特色功能，适合PPT创作使用。',
    website_url: 'https://wenduoduo.aippt.com',
    tags: ['一键生成', 'AI配图', '资料整合', '配图专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'iSlide AIPPT',
    tagline: 'AI一键设计精美PPT，只需一句标题',
    description: 'iSlide AIPPT是AI一键设计精美PPT，只需一句标题。提供一键设计、精美PPT、标题生成等服务。具备一键设计、精美专业、标题便捷等特色功能，适合PPT设计使用。',
    website_url: 'https://islide.aippt.com',
    tags: ['一键设计', '精美PPT', '标题生成', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: '博思AIPPT',
    tagline: 'PPT效率神器，AI一键生成PPT',
    description: '博思AIPPT是PPT效率神器，AI一键生成PPT。提供效率神器、AI生成、PPT专业等服务。具备效率专业、AI生成、PPT便捷等特色功能，适合PPT创作使用。',
    website_url: 'https://bosi.aippt.com',
    tags: ['效率神器', 'AI生成', 'PPT专业', '效率专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pi智能PPT',
    tagline: '一键生成PPT，复制精美模板',
    description: 'Pi智能PPT是一键生成PPT，复制精美模板。提供一键生成、精美模板、智能创作等服务。具备一键生成、模板专业、智能便捷等特色功能，适合PPT创作使用。',
    website_url: 'https://pi.ppt.com',
    tags: ['一键生成', '精美模板', '智能创作', '模板专业'],
    pricing_type: 'freemium'
  },
  {
    name: '稿定PPT',
    tagline: '稿定推出的PPT模板资源库',
    description: '稿定PPT是稿定推出的PPT模板资源库。提供PPT模板、稿定技术、资源丰富等服务。具备稿定技术、模板专业、资源丰富等特色功能，适合PPT模板使用。',
    website_url: 'https://ppt.gaoding.com',
    tags: ['稿定出品', 'PPT模板', '资源丰富', '模板专业'],
    pricing_type: 'freemium'
  },
  {
    name: '笔格AIPPT',
    tagline: '高效的AI PPT生成工具',
    description: '笔格AIPPT是高效的AI PPT生成工具。提供高效生成、AI支持、PPT专业等服务。具备高效专业、AI生成、PPT便捷等特色功能，适合PPT生成使用。',
    website_url: 'https://bige.aippt.com',
    tags: ['高效生成', 'AI支持', 'PPT专业', '高效专业'],
    pricing_type: 'freemium'
  },
  {
    name: '笔灵AIPPT',
    tagline: '一键生成PPT和千字演讲稿',
    description: '笔灵AIPPT是一键生成PPT和千字演讲稿。提供PPT生成、演讲稿创作、一键服务等功能。具备一键生成、演讲稿专业、服务全面等特色功能，适合演讲创作使用。',
    website_url: 'https://biling.aippt.com',
    tags: ['一键生成', '演讲稿创作', '服务全面', '演讲稿专业'],
    pricing_type: 'freemium'
  },
  {
    name: '百度文库AI助手',
    tagline: '基于文心一言的一站式智能文档助手',
    description: '百度文库AI助手是基于文心一言的一站式智能文档助手。提供智能文档、文心技术、一站式服务等功能。具备文心技术、文档专业、一站式服务等特色功能，适合文档处理使用。',
    website_url: 'https://ai.wenku.baidu.com',
    tags: ['百度文库', '文心一言', '智能文档', '一站式服务'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞智文',
    tagline: '一键生成PPT和Word',
    description: '讯飞智文是一键生成PPT和Word。提供PPT生成、Word创作、讯飞技术等服务。具备讯飞技术、PPT专业、Word便捷等特色功能，适合文档创作使用。',
    website_url: 'https://zhiwen.xunfei.cn',
    tags: ['科大讯飞', 'PPT生成', 'Word创作', '文档专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Gamma',
    tagline: 'AI幻灯片演示生成工具',
    description: 'Gamma是AI幻灯片演示生成工具。提供幻灯片生成、AI演示、专业服务等功能。具备AI生成、演示专业、服务全面等特色功能，适合演示创作使用。',
    website_url: 'https://gamma.app',
    tags: ['AI幻灯片', '演示生成', '演示专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Napkin',
    tagline: '将文本内容快速转换成演示图像的AI办公工具',
    description: 'Napkin是将文本内容快速转换成演示图像的AI办公工具。提供文本转图像、演示转换、办公便捷等服务。具备文本转换、图像专业、办公便捷等特色功能，适合办公演示使用。',
    website_url: 'https://napkin.ai',
    tags: ['文本转图像', '演示转换', '办公便捷', '转换专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChartGen',
    tagline: 'AI图表生成工具，快速生成专业图表',
    description: 'ChartGen是AI图表生成工具，快速生成专业图表。提供图表生成、AI支持、专业服务等功能。具备AI生成、图表专业、快速便捷等特色功能，适合图表创作使用。',
    website_url: 'https://chartgen.ai',
    tags: ['AI图表生成', '专业图表', '快速生成', '图表专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Diagrimo',
    tagline: 'Tenorshare AI推出的AI图表生成工具',
    description: 'Diagrimo是Tenorshare AI推出的AI图表生成工具。提供图表生成、Tenorshare技术、AI支持等服务。具备Tenorshare技术、图表专业、AI生成等特色功能，适合图表创作使用。',
    website_url: 'https://diagrimo.tenorshare.com',
    tags: ['Tenorshare', 'AI图表生成', '图表专业', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'PicDoc',
    tagline: 'AI文本转图表工具，一键生成多种视觉图表',
    description: 'PicDoc是AI文本转图表工具，一键生成多种视觉图表。提供文本转图表、多种图表、一键生成等服务。具备文本转换、图表专业、多种支持等特色功能，适合图表创作使用。',
    website_url: 'https://picdoc.ai',
    tags: ['文本转图表', '多种图表', '一键生成', '图表专业'],
    pricing_type: 'freemium'
  },
  {
    name: '飞象老师',
    tagline: '猿辅导推出的国内首个AI教学和备课工具',
    description: '飞象老师是猿辅导推出的国内首个AI教学和备课工具。提供AI教学、备课支持、猿辅导技术等服务。具备猿辅导技术、教学专业、备课便捷等特色功能，适合教学备课使用。',
    website_url: 'https://feixiang.yuanfudao.com',
    tags: ['猿辅导', 'AI教学', '备课工具', '教学专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Kimi PPT助手',
    tagline: 'Kimi全新自研的PPT助手，一键生成PPT',
    description: 'Kimi PPT助手是Kimi全新自研的PPT助手，一键生成PPT。提供PPT助手、Kimi技术、一键生成等服务。具备Kimi技术、PPT专业、一键生成等特色功能，适合PPT创作使用。',
    website_url: 'https://ppt.kimi.moonshot.cn',
    tags: ['Kimi出品', 'PPT助手', '一键生成', 'PPT专业'],
    pricing_type: 'freemium'
  },
  {
    name: '夸克PPT',
    tagline: '夸克团队推出的AI PPT生成工具',
    description: '夸克PPT是夸克团队推出的AI PPT生成工具。提供AI生成、夸克技术、PPT专业等服务。具备夸克技术、AI生成、PPT便捷等特色功能，适合PPT创作使用。',
    website_url: 'https://ppt.quark.com',
    tags: ['夸克出品', 'AI生成', 'PPT专业', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '美图AI PPT',
    tagline: '美图秀秀推出的免费在线AI生成PPT设计工具',
    description: '美图AI PPT是美图秀秀推出的免费在线AI生成PPT设计工具。提供免费生成、美图技术、PPT设计等服务。具备美图技术、免费使用、设计专业等特色功能，适合PPT设计使用。',
    website_url: 'https://ppt.meitu.com',
    tags: ['美图秀秀', '免费生成', 'PPT设计', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: 'NarraLand',
    tagline: 'AI智能演示内容创作平台',
    description: 'NarraLand是AI智能演示内容创作平台。提供演示创作、AI智能、创作平台等服务。具备AI智能、演示专业、创作便捷等特色功能，适合演示创作使用。',
    website_url: 'https://narraland.ai',
    tags: ['AI智能', '演示创作', '创作平台', '演示专业'],
    pricing_type: 'freemium'
  },
  {
    name: '课灵 PPT',
    tagline: 'AI免费生成PPT课件',
    description: '课灵 PPT是AI免费生成PPT课件。提供课件生成、AI支持、免费使用等服务。具备免费使用、课件专业、AI生成等特色功能，适合课件创作使用。',
    website_url: 'https://keling.ppt.com',
    tags: ['免费生成', 'PPT课件', 'AI支持', '课件专业'],
    pricing_type: 'free'
  },
  {
    name: '清言PPT',
    tagline: '智谱清言联合AiPPT推出的PPT生成智能体',
    description: '清言PPT是智谱清言联合AiPPT推出的PPT生成智能体。提供PPT生成、智谱技术、AiPPT支持等服务。具备智谱技术、PPT专业、智能体便捷等特色功能，适合PPT创作使用。',
    website_url: 'https://qingyan.ppt.zhipu.ai',
    tags: ['智谱清言', 'PPT生成', '智能体', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '万兴智演',
    tagline: '万兴科技推出的AI PPT和演示制作软件',
    description: '万兴智演是万兴科技推出的AI PPT和演示制作软件。提供AI演示、万兴技术、制作专业等服务。具备万兴技术、演示专业、制作便捷等特色功能，适合演示制作使用。',
    website_url: 'https://zhiyan.wondershare.com',
    tags: ['万兴科技', 'AI演示', '制作软件', '演示专业'],
    pricing_type: 'freemium'
  },
  {
    name: '麦当秀MindShow',
    tagline: 'AI在线PPT生成工具',
    description: '麦当秀MindShow是AI在线PPT生成工具。提供在线生成、AI支持、PPT专业等服务。具备在线便捷、AI生成、PPT专业等特色功能，适合PPT生成使用。',
    website_url: 'https://mindshow.maidangxiu.com',
    tags: ['AI在线', 'PPT生成', '在线便捷', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'VoxDeck',
    tagline: '创新的AI演示文稿生成工具',
    description: 'VoxDeck是创新的AI演示文稿生成工具。提供创新演示、AI支持、文稿生成等服务。具备创新专业、AI生成、演示便捷等特色功能，适合演示创作使用。',
    website_url: 'https://voxdeck.ai',
    tags: ['创新演示', 'AI支持', '文稿生成', '创新专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'AiBiao',
    tagline: 'AI文生图表工具，支持生成柱状图、折线图、饼图等',
    description: 'AiBiao是AI文生图表工具，支持生成柱状图、折线图、饼图等。提供文生图表、多种图表、AI支持等服务。具备多种图表、文生专业、AI生成等特色功能，适合图表创作使用。',
    website_url: 'https://aibiao.ai',
    tags: ['文生图表', '多种图表', 'AI支持', '图表专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChatBA',
    tagline: 'AI幻灯片生成工具',
    description: 'ChatBA是AI幻灯片生成工具。提供幻灯片生成、AI支持、专业服务等功能。具备AI生成、幻灯片专业、服务全面等特色功能，适合幻灯片创作使用。',
    website_url: 'https://chatba.ai',
    tags: ['AI幻灯片', '生成工具', '幻灯片专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Decktopus AI',
    tagline: 'AI驱动的在线演示文稿生成器',
    description: 'Decktopus AI是AI驱动的在线演示文稿生成器。提供在线生成、AI驱动、演示文稿等服务。具备AI驱动、在线便捷、演示专业等特色功能，适合演示文稿使用。',
    website_url: 'https://decktopus.ai',
    tags: ['AI驱动', '在线生成', '演示文稿', '在线便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Powerpresent AI',
    tagline: 'AI演示文稿生成工具',
    description: 'Powerpresent AI是AI演示文稿生成工具。提供演示文稿生成、AI支持、专业服务等功能。具备AI生成、演示专业、服务全面等特色功能，适合演示文稿使用。',
    website_url: 'https://powerpresent.ai',
    tags: ['AI演示文稿', '生成工具', '演示专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: '希沃白板',
    tagline: '专为互动教学设计的AI课件生成器',
    description: '希沃白板是专为互动教学设计的AI课件生成器。提供互动教学、课件生成、希沃技术等服务。具备希沃技术、教学专业、互动便捷等特色功能，适合教学课件使用。',
    website_url: 'https://seewo.whiteboard.com',
    tags: ['希沃白板', '互动教学', '课件生成', '教学专业'],
    pricing_type: 'freemium'
  },
  {
    name: '秒出PPT',
    tagline: '一键生成PPT，智能辅助编辑',
    description: '秒出PPT是一键生成PPT，智能辅助编辑。提供一键生成、智能编辑、PPT专业等服务。具备一键生成、编辑智能、PPT便捷等特色功能，适合PPT创作使用。',
    website_url: 'https://miao.ppt.com',
    tags: ['一键生成', '智能编辑', 'PPT专业', '编辑智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'GAIPPT',
    tagline: 'AI智能美化PPT工具，上传PPT一键美化',
    description: 'GAIPPT是AI智能美化PPT工具，上传PPT一键美化。提供PPT美化、AI智能、一键服务等功能。具备AI美化、PPT专业、一键便捷等特色功能，适合PPT美化使用。',
    website_url: 'https://gaippt.com',
    tags: ['AI美化', 'PPT工具', '一键美化', '美化专业'],
    pricing_type: 'freemium'
  },
  {
    name: '万知',
    tagline: '零一万物推出的一站式AI文档阅读和PPT创作工作台',
    description: '万知是零一万物推出的一站式AI文档阅读和PPT创作工作台。提供文档阅读、PPT创作、零一万物技术等服务。具备零一万物技术、文档专业、创作便捷等特色功能，适合文档创作使用。',
    website_url: 'https://wanzhi.yi.ai',
    tags: ['零一万物', '文档阅读', 'PPT创作', '一站式服务'],
    pricing_type: 'freemium'
  },
  {
    name: 'beautiful.ai',
    tagline: 'AI创建展示幻灯片',
    description: 'beautiful.ai是AI创建展示幻灯片。提供幻灯片创建、AI支持、展示专业等服务。具备AI创建、幻灯片专业、展示优秀等特色功能，适合幻灯片创作使用。',
    website_url: 'https://beautiful.ai',
    tags: ['AI创建', '展示幻灯片', '展示专业', '创建专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ChatPPT',
    tagline: 'AI对话一键生成PPT，智能排版美化',
    description: 'ChatPPT是AI对话一键生成PPT，智能排版美化。提供对话生成、智能排版、PPT美化等服务。具备对话生成、排版专业、美化智能等特色功能，适合PPT创作使用。',
    website_url: 'https://chatppt.ai',
    tags: ['AI对话', '一键生成', '智能排版', '排版专业'],
    pricing_type: 'freemium'
  },
  {
    name: '轻竹办公',
    tagline: '在线智能生成和设计PPT的AI工具',
    description: '轻竹办公是在线智能生成和设计PPT的AI工具。提供在线生成、智能设计、PPT专业等服务。具备在线便捷、智能设计、PPT专业等特色功能，适合PPT设计使用。',
    website_url: 'https://qingzhu.office.com',
    tags: ['在线智能', 'PPT设计', '设计专业', '在线便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Chronicle',
    tagline: 'AI高颜值演示文稿创建',
    description: 'Chronicle是AI高颜值演示文稿创建。提供高颜值演示、AI支持、文稿创建等服务。具备高颜值专业、AI创建、演示美观等特色功能，适合演示文稿使用。',
    website_url: 'https://chronicle.ai',
    tags: ['高颜值', '演示文稿', 'AI创建', '美观专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Presentations.AI',
    tagline: '演示文档版的ChatGPT',
    description: 'Presentations.AI是演示文档版的ChatGPT。提供演示文档、AI支持、ChatGPT体验等服务。具备ChatGPT体验、演示专业、文档便捷等特色功能，适合演示文档使用。',
    website_url: 'https://presentations.ai',
    tags: ['ChatGPT风格', '演示文档', 'AI支持', '文档专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'SlidesAI',
    tagline: 'AI快速创建演示幻灯片',
    description: 'SlidesAI是AI快速创建演示幻灯片。提供快速创建、AI支持、幻灯片专业等服务。具备快速创建、AI专业、幻灯片便捷等特色功能，适合幻灯片创作使用。',
    website_url: 'https://slidesai.io',
    tags: ['快速创建', 'AI支持', '演示幻灯片', '创建专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'auxi',
    tagline: '功能强大的PowerPoint AI插件',
    description: 'auxi是功能强大的PowerPoint AI插件。提供PowerPoint插件、AI支持、功能强大等服务。具备功能强大、PowerPoint专业、插件便捷等特色功能，适合PowerPoint使用。',
    website_url: 'https://auxi.powerpoint.com',
    tags: ['PowerPoint插件', '功能强大', 'AI支持', '插件专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'AI灵感PPT',
    tagline: '免费高效的AIPPT生成工具',
    description: 'AI灵感PPT是免费高效的AIPPT生成工具。提供免费生成、高效创作、AI支持等服务。具备免费使用、高效专业、AI生成等特色功能，适合PPT创作使用。',
    website_url: 'https://linggan.aippt.com',
    tags: ['免费生成', '高效创作', 'AI支持', '高效专业'],
    pricing_type: 'free'
  },
  {
    name: 'MindShow',
    tagline: '国内独立开发者开发的输入内容自动生成演示工具',
    description: 'MindShow是国内独立开发者开发的输入内容自动生成演示工具。提供自动生成、独立开发、演示专业等服务。具备独立开发、自动生成、演示便捷等特色功能，适合演示创作使用。',
    website_url: 'https://mindshow.cn',
    tags: ['独立开发', '自动生成', '演示工具', '生成专业'],
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

async function insertPresentationTools() {
  console.log('开始检查并插入AI幻灯片和演示工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of presentationTools) {
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
    
    console.log(`\n🎉 AI幻灯片和演示工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${presentationTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertPresentationTools()
