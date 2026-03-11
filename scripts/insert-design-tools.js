import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'
const supabase = createClient(supabaseUrl, supabaseKey)

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

const designTools = [
  {
    name: '堆友AI',
    tagline: '专为设计师打造的AI设计服务平台',
    description: '堆友AI是专为设计师打造的AI设计服务平台。提供AI设计、设计师支持、平台服务等功能。具备设计专业、AI便捷、平台全面等特色功能，适合设计师使用。',
    website_url: 'https://ai.duiyou.com',
    tags: ['设计师专用', 'AI设计', '服务平台', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: '星流AI',
    tagline: 'LiblibAI推出的一站式 AI 设计与创作工具',
    description: '星流AI是LiblibAI推出的一站式AI设计与创作工具。提供AI设计、LiblibAI技术、创作支持等服务。具备LiblibAI技术、设计专业、创作便捷等特色功能，适合AI设计使用。',
    website_url: 'https://xingliu.liblib.ai',
    tags: ['LiblibAI', '一站式设计', 'AI创作', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: '绘蛙',
    tagline: 'AI电商设计工具',
    description: '绘蛙是AI电商设计工具。提供电商设计、AI支持、专业服务等功能。具备电商专业、AI便捷、设计智能等特色功能，适合电商设计使用。',
    website_url: 'https://huiwa.com',
    tags: ['AI电商设计', '设计工具', '电商专业', '设计智能'],
    pricing_type: 'freemium'
  },
  {
    name: '稿定AI',
    tagline: '一站式AI创作和设计平台',
    description: '稿定AI是一站式AI创作和设计平台。提供AI创作、设计平台、一站式服务等功能。具备一站式服务、创作专业、设计便捷等特色功能，适合AI创作使用。',
    website_url: 'https://ai.gaoding.com',
    tags: ['稿定出品', '一站式创作', 'AI设计', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '墨刀AI',
    tagline: 'AI秒生原型稿',
    description: '墨刀AI是AI秒生原型稿。提供原型生成、AI支持、墨刀技术等服务。具备墨刀技术、原型专业、生成便捷等特色功能，适合原型设计使用。',
    website_url: 'https://ai.modao.cc',
    tags: ['墨刀', 'AI原型生成', '原型设计', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Figma AI',
    tagline: 'Figma推出的原生AI设计工具',
    description: 'Figma AI是Figma推出的原生AI设计工具。提供AI设计、Figma技术、原生支持等服务。具备Figma技术、设计专业、原生便捷等特色功能，适合AI设计使用。',
    website_url: 'https://figma.com/ai',
    tags: ['Figma', '原生AI设计', '设计工具', '原生专业'],
    pricing_type: 'freemium'
  },
  {
    name: '美图设计室',
    tagline: 'AI图像创作和设计平台',
    description: '美图设计室是AI图像创作和设计平台。提供图像创作、AI支持、美图技术等服务。具备美图技术、创作专业、设计便捷等特色功能，适合图像创作使用。',
    website_url: 'https://design.meitu.com',
    tags: ['美图秀秀', 'AI图像创作', '设计平台', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '135 AI排版',
    tagline: '公众号AI图文排版和智能文案生成工具',
    description: '135 AI排版是公众号AI图文排版和智能文案生成工具。提供图文排版、文案生成、AI支持等服务。具备排版专业、文案智能、AI便捷等特色功能，适合图文排版使用。',
    website_url: 'https://ai.135editor.com',
    tags: ['公众号排版', 'AI文案生成', '图文排版', '排版专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Holopix AI',
    tagline: '专为游戏、动漫、插画设计打造的AI设计平台',
    description: 'Holopix AI是专为游戏、动漫、插画设计打造的AI设计平台。提供游戏设计、动漫支持、插画创作等服务。具备游戏专业、动漫便捷、插画智能等特色功能，适合游戏动漫使用。',
    website_url: 'https://holopix.ai',
    tags: ['游戏动漫', '插画设计', 'AI设计平台', '游戏专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pixso AI',
    tagline: 'Pixso推出的AI设计工具',
    description: 'Pixso AI是Pixso推出的AI设计工具。提供AI设计、Pixso技术、专业支持等功能。具备Pixso技术、设计专业、AI便捷等特色功能，适合AI设计使用。',
    website_url: 'https://pixso.ai',
    tags: ['Pixso', 'AI设计', '设计工具', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Recraft AI',
    tagline: '免费无限AI画板，生成高质量矢量艺术画、图标、3D图片和插画',
    description: 'Recraft AI是免费无限AI画板，生成高质量矢量艺术画、图标、3D图片和插画。提供AI画板、矢量艺术、图标生成等服务。具备免费无限、矢量专业、生成智能等特色功能，适合AI画板使用。',
    website_url: 'https://recraft.ai',
    tags: ['免费无限', 'AI画板', '矢量艺术', '矢量专业'],
    pricing_type: 'free'
  },
  {
    name: '创客贴AI',
    tagline: 'AI辅助的智能在线设计工具',
    description: '创客贴AI是AI辅助的智能在线设计工具。提供AI辅助、在线设计、智能支持等功能。具备AI辅助、设计专业、在线便捷等特色功能，适合在线设计使用。',
    website_url: 'https://ai.chuangkit.com',
    tags: ['创客贴', 'AI辅助设计', '在线设计', '辅助专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Onlook',
    tagline: '开源AI视觉编辑工具，设计修改自动同步代码',
    description: 'Onlook是开源AI视觉编辑工具，设计修改自动同步代码。提供视觉编辑、开源免费、代码同步等服务。具备开源专业、编辑智能、同步便捷等特色功能，适合视觉编辑使用。',
    website_url: 'https://onlook.dev',
    tags: ['开源', 'AI视觉编辑', '代码同步', '编辑专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'GemDesign',
    tagline: 'AI原生高保真原型设计工具',
    description: 'GemDesign是AI原生高保真原型设计工具。提供原型设计、AI原生、高保真支持等服务。具备AI原生、原型专业、高保真便捷等特色功能，适合原型设计使用。',
    website_url: 'https://gemdesign.com',
    tags: ['AI原生', '高保真原型', '原型设计', '原型专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pic Copilot',
    tagline: '阿里国际推出的AI电商设计工具',
    description: 'Pic Copilot是阿里国际推出的AI电商设计工具。提供电商设计、阿里国际技术、AI支持等服务。具备阿里国际技术、电商专业、AI便捷等特色功能，适合电商设计使用。',
    website_url: 'https://piccopilot.alibaba.com',
    tags: ['阿里国际', 'AI电商设计', '设计工具', '电商专业'],
    pricing_type: 'freemium'
  },
  {
    name: '魔力工作室',
    tagline: 'Canva可画推出的一站式AI创作套件',
    description: '魔力工作室是Canva可画推出的一站式AI创作套件。提供AI创作、Canva技术、一站式套件等服务。具备Canva技术、创作专业、套件便捷等特色功能，适合AI创作使用。',
    website_url: 'https://magicstudio.canva.com',
    tags: ['Canva可画', '一站式创作', 'AI创作套件', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '蚂上有创意',
    tagline: '支付宝推出的AI设计工具，面向商家提供电商设计服务',
    description: '蚂上有创意是支付宝推出的AI设计工具，面向商家提供电商设计服务。提供电商设计、支付宝技术、商家支持等服务。具备支付宝技术、电商专业、商家便捷等特色功能，适合电商设计使用。',
    website_url: 'https://ma.alipay.com',
    tags: ['支付宝', 'AI设计工具', '电商设计服务', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: '爱设计',
    tagline: 'AI在线设计平台，提供多端在线拖拽设计工具',
    description: '爱设计是AI在线设计平台，提供多端在线拖拽设计工具。提供在线设计、拖拽工具、AI支持等服务。具备拖拽专业、在线便捷、AI智能等特色功能，适合在线设计使用。',
    website_url: 'https://isheji.com',
    tags: ['AI在线设计', '拖拽工具', '多端支持', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'PagePop',
    tagline: '一站式全能AI内容创作和设计平台',
    description: 'PagePop是一站式全能AI内容创作和设计平台。提供内容创作、设计平台、一站式服务等功能。具备一站式服务、创作专业、设计便捷等特色功能，适合内容创作使用。',
    website_url: 'https://pagepop.com',
    tags: ['一站式全能', 'AI内容创作', '设计平台', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '小墨鹰编辑器',
    tagline: '行业首创的AI公众号排版工具，30s搞定推文排版！',
    description: '小墨鹰编辑器是行业首创的AI公众号排版工具，30s搞定推文排版！提供公众号排版、AI支持、快速服务等功能。具备快速专业、排版智能、AI便捷等特色功能，适合公众号排版使用。',
    website_url: 'https://xiaomoying.com',
    tags: ['公众号排版', 'AI编辑器', '快速排版', '排版专业'],
    pricing_type: 'freemium'
  },
  {
    name: '美间AI',
    tagline: '新一代AI画布式创意设计平台',
    description: '美间AI是新一代AI画布式创意设计平台。提供画布设计、AI创意、平台支持等功能。具备画布专业、创意智能、平台便捷等特色功能，适合画布设计使用。',
    website_url: 'https://meijian.ai',
    tags: ['AI画布式', '创意设计', '设计平台', '画布专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Calicat',
    tagline: 'ProcessOn团队推出的一站式产设研协作平台',
    description: 'Calicat是ProcessOn团队推出的一站式产设研协作平台。提供产设研协作、ProcessOn技术、一站式服务等功能。具备ProcessOn技术、协作专业、一站式便捷等特色功能，适合产设研协作使用。',
    website_url: 'https://calicat.com',
    tags: ['ProcessOn', '产设研协作', '一站式平台', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Microsoft Designer',
    tagline: '微软推出的在线设计海报和宣传图工具',
    description: 'Microsoft Designer是微软推出的在线设计海报和宣传图工具。提供海报设计、微软技术、在线支持等服务。具备微软技术、设计专业、在线便捷等特色功能，适合海报设计使用。',
    website_url: 'https://designer.microsoft.com',
    tags: ['微软', '在线设计', '海报设计', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'UXbot',
    tagline: 'AI产品设计工具，一键生成UI与交互式原型',
    description: 'UXbot是AI产品设计工具，一键生成UI与交互式原型。提供产品设计、UI生成、交互原型等服务。具备UI专业、交互便捷、产品智能等特色功能，适合产品设计使用。',
    website_url: 'https://uxbot.ai',
    tags: ['AI产品设计', 'UI生成', '交互式原型', '产品专业'],
    pricing_type: 'freemium'
  },
  {
    name: '燕雀光年',
    tagline: 'AI LOGO设计工具',
    description: '燕雀光年是AI LOGO设计工具。提供LOGO设计、AI支持、专业服务等功能。具备LOGO专业、AI便捷、设计智能等特色功能，适合LOGO设计使用。',
    website_url: 'https://yanque.com',
    tags: ['AI LOGO设计', '设计工具', 'LOGO专业', '设计智能'],
    pricing_type: 'freemium'
  },
  {
    name: '标小智LOGO生成器',
    tagline: 'AI Logo设计平台，一键生成企业Logo',
    description: '标小智LOGO生成器是AI Logo设计平台，一键生成企业Logo。提供Logo生成、AI支持、企业服务等功能。具备生成专业、AI便捷、企业优化等特色功能，适合Logo生成使用。',
    website_url: 'https://biaoxiaozhi.com',
    tags: ['AI Logo生成', '企业Logo', '一键生成', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Looka',
    tagline: 'AI在线设计和生成logo',
    description: 'Looka是AI在线设计和生成logo。提供logo生成、AI设计、在线支持等服务。具备在线专业、生成智能、设计便捷等特色功能，适合logo生成使用。',
    website_url: 'https://looka.com',
    tags: ['AI在线设计', 'logo生成', '设计工具', '在线专业'],
    pricing_type: 'freemium'
  },
  {
    name: '智绘设计',
    tagline: '腾讯推出的智能设计平台，让内容更精彩',
    description: '智绘设计是腾讯推出的智能设计平台，让内容更精彩。提供智能设计、腾讯技术、内容支持等服务。具备腾讯技术、设计专业、内容精彩等特色功能，适合智能设计使用。',
    website_url: 'https://zhuishi.qq.com',
    tags: ['腾讯', '智能设计', '设计平台', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'MasterGo AI',
    tagline: '国产产品设计工具MasterGo推出的智能UI设计助手',
    description: 'MasterGo AI是国产产品设计工具MasterGo推出的智能UI设计助手。提供UI设计、MasterGo技术、智能助手等服务。具备MasterGo技术、UI专业、智能便捷等特色功能，适合UI设计使用。',
    website_url: 'https://mastergo.com/ai',
    tags: ['MasterGo', '智能UI设计', '设计助手', 'UI专业'],
    pricing_type: 'freemium'
  },
  {
    name: '居然设计家',
    tagline: '居然之家联合阿里推出的AI家装设计平台',
    description: '居然设计家是居然之家联合阿里推出的AI家装设计平台。提供家装设计、居然之家技术、阿里支持等服务。具备居然之家技术、家装专业、设计便捷等特色功能，适合家装设计使用。',
    website_url: 'https://shejijia.juran.com.cn',
    tags: ['居然之家', 'AI家装设计', '阿里联合', '家装专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'FigJam AI',
    tagline: 'Figma推出的AI白板协作设计工具',
    description: 'FigJam AI是Figma推出的AI白板协作设计工具。提供白板协作、Figma技术、AI设计等服务。具备Figma技术、协作专业、设计便捷等特色功能，适合白板协作使用。',
    website_url: 'https://figma.com/figjam/ai',
    tags: ['Figma', 'AI白板协作', '设计工具', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '鹿班',
    tagline: '阿里推出的智能设计商品图和海报的平台',
    description: '鹿班是阿里推出的智能设计商品图和海报的平台。提供商品图设计、海报生成、阿里技术等服务。具备阿里技术、设计专业、商品优化等特色功能，适合商品设计使用。',
    website_url: 'https://luban.alibaba.com',
    tags: ['阿里', '智能设计', '商品图海报', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Magic Design',
    tagline: '在线设计工具Canva推出的AI设计工具',
    description: 'Magic Design是在线设计工具Canva推出的AI设计工具。提供AI设计、Canva技术、在线支持等服务。具备Canva技术、设计专业、在线便捷等特色功能，适合AI设计使用。',
    website_url: 'https://canva.com/magic-design',
    tags: ['Canva', 'AI设计工具', '在线设计', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: '简单设计',
    tagline: '免费的在线设计、图片处理工具',
    description: '简单设计是免费的在线设计、图片处理工具。提供在线设计、图片处理、免费使用等服务。具备免费使用、设计专业、处理便捷等特色功能，适合在线设计使用。',
    website_url: 'https://jiandan.sheji.com',
    tags: ['免费在线设计', '图片处理', '免费使用', '设计专业'],
    pricing_type: 'free'
  },
  {
    name: '笔格设计',
    tagline: 'AI设计工具合集，包括文生图、智能消除等',
    description: '笔格设计是AI设计工具合集，包括文生图、智能消除等。提供设计合集、文生图、智能消除等服务。具备合集专业、文生图智能、消除便捷等特色功能，适合设计合集使用。',
    website_url: 'https://bige.sheji.com',
    tags: ['AI设计合集', '文生图', '智能消除', '合集专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'AI设计神器',
    tagline: '一站式创意图片设计编辑平台',
    description: 'AI设计神器是一站式创意图片设计编辑平台。提供创意设计、图片编辑、一站式服务等功能。具备一站式服务、创意专业、编辑便捷等特色功能，适合创意设计使用。',
    website_url: 'https://shenqi.sheji.com',
    tags: ['一站式创意', '图片设计编辑', '设计平台', '创意专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Logoai',
    tagline: 'AI LOGO创建设计平台，一站式品牌打造',
    description: 'Logoai是AI LOGO创建设计平台，一站式品牌打造。提供LOGO创建、品牌打造、AI支持等服务。具备创建专业、品牌智能、AI便捷等特色功能，适合LOGO创建使用。',
    website_url: 'https://logoai.com',
    tags: ['AI LOGO创建', '品牌打造', '一站式服务', '创建专业'],
    pricing_type: 'freemium'
  },
  {
    name: '豆绘AI',
    tagline: 'AI绘图设计平台，一键生成720°VR全景图',
    description: '豆绘AI是AI绘图设计平台，一键生成720°VR全景图。提供绘图设计、VR全景、AI支持等服务。具备VR专业、绘图智能、全景便捷等特色功能，适合VR全景使用。',
    website_url: 'https://douhui.ai',
    tags: ['AI绘图设计', 'VR全景图', '720°全景', 'VR专业'],
    pricing_type: 'freemium'
  },
  {
    name: '千图网',
    tagline: '在线设计图片素材平台',
    description: '千图网是在线设计图片素材平台。提供图片素材、在线设计、平台支持等功能。具备素材专业、在线便捷、平台全面等特色功能，适合图片素材使用。',
    website_url: 'https://58pic.com',
    tags: ['在线设计', '图片素材', '素材平台', '素材专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pictographic',
    tagline: 'AI插图资源库和生成平台',
    description: 'Pictographic是AI插图资源库和生成平台。提供插图资源、AI生成、平台支持等功能。具备资源专业、生成智能、平台便捷等特色功能，适合插图资源使用。',
    website_url: 'https://pictographic.ai',
    tags: ['AI插图资源库', '生成平台', '插图资源', '资源专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Fable Prism',
    tagline: 'AI动效设计和动画效果制作工具',
    description: 'Fable Prism是AI动效设计和动画效果制作工具。提供动效设计、动画制作、AI支持等服务。具备动效专业、动画智能、制作便捷等特色功能，适合动效设计使用。',
    website_url: 'https://fable.app/prism',
    tags: ['AI动效设计', '动画效果制作', '动效专业', '动画智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Wegic',
    tagline: 'AI网页设计和建站开发工具',
    description: 'Wegic是AI网页设计和建站开发工具。提供网页设计、建站开发、AI支持等服务。具备设计专业、建站便捷、AI智能等特色功能，适合网页设计使用。',
    website_url: 'https://wegic.ai',
    tags: ['AI网页设计', '建站开发', '设计工具', '建站专业'],
    pricing_type: 'freemium'
  },
  {
    name: '匠紫',
    tagline: '一站式AI设计工具',
    description: '匠紫是一站式AI设计工具。提供AI设计、一站式服务、专业支持等功能。具备一站式服务、设计专业、AI便捷等特色功能，适合AI设计使用。',
    website_url: 'https://jiangzi.ai',
    tags: ['一站式AI设计', '设计工具', 'AI便捷', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Collov AI',
    tagline: 'AI室内家居设计生成平台',
    description: 'Collov AI是AI室内家居设计生成平台。提供室内设计、家居生成、AI支持等服务。具备室内专业、家居智能、生成便捷等特色功能，适合室内设计使用。',
    website_url: 'https://collov.ai',
    tags: ['AI室内设计', '家居设计', '设计生成', '室内专业'],
    pricing_type: 'freemium'
  },
  {
    name: '包图网AI素材库',
    tagline: '包图网提供的特色图库服务',
    description: '包图网AI素材库是包图网提供的特色图库服务。提供AI素材、图库服务、包图网技术等功能。具备包图网技术、素材专业、图库便捷等特色功能，适合AI素材使用。',
    website_url: 'https://ibaotu.com',
    tags: ['包图网', 'AI素材库', '图库服务', '素材专业'],
    pricing_type: 'freemium'
  },
  {
    name: '易可图',
    tagline: '免费的AI图片编辑和海报设计平台',
    description: '易可图是免费的AI图片编辑和海报设计平台。提供图片编辑、海报设计、免费使用等服务。具备免费使用、编辑专业、设计便捷等特色功能，适合图片编辑使用。',
    website_url: 'https://yike.ai',
    tags: ['免费AI图片编辑', '海报设计', '免费使用', '编辑专业'],
    pricing_type: 'free'
  },
  {
    name: '笔魂AI',
    tagline: 'AI设计工具，支持AI抠图、消除、无损放大',
    description: '笔魂AI是AI设计工具，支持AI抠图、消除、无损放大。提供抠图消除、无损放大、AI支持等服务。具备抠图专业、消除智能、放大便捷等特色功能，适合AI设计使用。',
    website_url: 'https://bihun.ai',
    tags: ['AI抠图', '智能消除', '无损放大', '抠图专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Creatie',
    tagline: 'AI驱动的UI和UX设计工具',
    description: 'Creatie是AI驱动的UI和UX设计工具。提供UI设计、UX支持、AI驱动等服务。具备AI驱动、UI专业、UX便捷等特色功能，适合UI/UX设计使用。',
    website_url: 'https://creatie.ai',
    tags: ['AI驱动', 'UI设计', 'UX设计', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Kittl',
    tagline: 'AI驱动的平面图形设计工具',
    description: 'Kittl是AI驱动的平面图形设计工具。提供平面设计、图形设计、AI驱动等服务。具备AI驱动、平面专业、图形智能等特色功能，适合平面设计使用。',
    website_url: 'https://kittl.com',
    tags: ['AI驱动', '平面图形设计', '设计工具', '平面专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Dzine',
    tagline: '一站式AI图像编辑和设计工具',
    description: 'Dzine是一站式AI图像编辑和设计工具。提供图像编辑、设计工具、一站式服务等功能。具备一站式服务、编辑专业、设计便捷等特色功能，适合图像编辑使用。',
    website_url: 'https://dzine.ai',
    tags: ['一站式AI图像', '编辑设计', '设计工具', '编辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Ilus AI',
    tagline: 'AI插画插图生成工具',
    description: 'Ilus AI是AI插画插图生成工具。提供插画生成、插图创作、AI支持等服务。具备插画专业、插图智能、生成便捷等特色功能，适合插画生成使用。',
    website_url: 'https://ilus.ai',
    tags: ['AI插画插图', '生成工具', '插画专业', '插图智能'],
    pricing_type: 'freemium'
  },
  {
    name: '酷家乐AI',
    tagline: '功能强大的AI家居设计软件',
    description: '酷家乐AI是功能强大的AI家居设计软件。提供家居设计、酷家乐技术、AI支持等服务。具备酷家乐技术、家居专业、设计智能等特色功能，适合家居设计使用。',
    website_url: 'https://ai.kujiale.com',
    tags: ['酷家乐', 'AI家居设计', '设计软件', '家居专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Framer AI',
    tagline: 'Framer推出的AI网站自动设计、生成和上线',
    description: 'Framer AI是Framer推出的AI网站自动设计、生成和上线。提供网站设计、Framer技术、自动生成等服务。具备Framer技术、设计专业、自动便捷等特色功能，适合网站设计使用。',
    website_url: 'https://framer.com/ai',
    tags: ['Framer', 'AI网站设计', '自动生成', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'LogoliveryAI',
    tagline: '免费的AI Logo生成器，提供SVG矢量格式',
    description: 'LogoliveryAI是免费的AI Logo生成器，提供SVG矢量格式。提供Logo生成、SVG矢量、免费使用等服务。具备免费使用、生成专业、矢量便捷等特色功能，适合Logo生成使用。',
    website_url: 'https://logolivery.ai',
    tags: ['免费AI Logo', 'SVG矢量', 'Logo生成器', '矢量专业'],
    pricing_type: 'free'
  },
  {
    name: 'Motiff 妙多',
    tagline: '猿辅导旗下推出的AI界面设计工具',
    description: 'Motiff 妙多是猿辅导旗下推出的AI界面设计工具。提供界面设计、猿辅导技术、AI支持等服务。具备猿辅导技术、界面专业、AI便捷等特色功能，适合界面设计使用。',
    website_url: 'https://motiff.com',
    tags: ['猿辅导', 'AI界面设计', '设计工具', '界面专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pimento',
    tagline: '人工智能驱动的设计创意和视觉参考平台',
    description: 'Pimento是人工智能驱动的设计创意和视觉参考平台。提供设计创意、视觉参考、AI驱动等服务。具备AI驱动、创意专业、参考便捷等特色功能，适合设计创意使用。',
    website_url: 'https://pimento.ai',
    tags: ['AI驱动', '设计创意', '视觉参考', '创意专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Logo Diffusion',
    tagline: 'AI驱动的Logo和标志生成工具',
    description: 'Logo Diffusion是AI驱动的Logo和标志生成工具。提供Logo生成、标志设计、AI驱动等服务。具备AI驱动、生成专业、标志智能等特色功能，适合Logo生成使用。',
    website_url: 'https://logodiffusion.com',
    tags: ['AI驱动', 'Logo生成', '标志设计', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Realibox AI',
    tagline: 'AI免费将草图/模型生成3D渲染图',
    description: 'Realibox AI是AI免费将草图/模型生成3D渲染图。提供3D渲染、草图模型、免费使用等服务。具备免费使用、渲染专业、3D智能等特色功能，适合3D渲染使用。',
    website_url: 'https://realibox.ai',
    tags: ['AI 3D渲染', '草图模型', '免费渲染', '3D专业'],
    pricing_type: 'free'
  },
  {
    name: 'Vectorizer.AI',
    tagline: 'AI一键将位图转换为矢量图片',
    description: 'Vectorizer.AI是AI一键将位图转换为矢量图片。提供位图转换、矢量图片、AI支持等服务。具备转换专业、矢量智能、一键便捷等特色功能，适合位图转换使用。',
    website_url: 'https://vectorizer.ai',
    tags: ['AI位图转换', '矢量图片', '一键转换', '转换专业'],
    pricing_type: 'freemium'
  },
  {
    name: '模袋云AI',
    tagline: '建筑AI创作平台，专注于大型建筑、小型住宅、室内设计、景观的出图和AI模型训练',
    description: '模袋云AI是建筑AI创作平台，专注于大型建筑、小型住宅、室内设计、景观的出图和AI模型训练。提供建筑创作、室内设计、景观支持等服务。具备建筑专业、创作智能、设计便捷等特色功能，适合建筑创作使用。',
    website_url: 'https://modaiyun.com',
    tags: ['建筑AI创作', '室内设计', '景观设计', '建筑专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Vizcom',
    tagline: 'AI渲染转化手绘图为产品设计图',
    description: 'Vizcom是AI渲染转化手绘图为产品设计图。提供手绘转化、产品设计、AI渲染等服务。具备转化专业、渲染智能、产品便捷等特色功能，适合产品设计使用。',
    website_url: 'https://vizcom.ai',
    tags: ['AI渲染', '手绘转化', '产品设计', '渲染专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Dora AI',
    tagline: 'AI在线生成精美3D动画的网站',
    description: 'Dora AI是AI在线生成精美3D动画的网站。提供3D动画、在线生成、AI支持等服务。具备3D专业、动画智能、生成便捷等特色功能，适合3D动画使用。',
    website_url: 'https://dora.ai',
    tags: ['AI 3D动画', '在线生成', '动画网站', '3D专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Designs.ai',
    tagline: 'AI设计工具',
    description: 'Designs.ai是AI设计工具。提供AI设计、专业服务、全面支持等功能。具备设计专业、AI便捷、服务全面等特色功能，适合AI设计使用。',
    website_url: 'https://designs.ai',
    tags: ['AI设计工具', '设计专业', 'AI便捷', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Galileo AI',
    tagline: 'AI高保真原型设计',
    description: 'Galileo AI是AI高保真原型设计。提供高保真原型、AI设计、专业支持等功能。具备高保真专业、原型智能、设计便捷等特色功能，适合原型设计使用。',
    website_url: 'https://galileo.ai',
    tags: ['AI高保真原型', '原型设计', '高保真专业', '原型智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Spline AI',
    tagline: 'Spline推出的AI生成3D物体、动画、材质',
    description: 'Spline AI是Spline推出的AI生成3D物体、动画、材质。提供3D生成、Spline技术、AI支持等服务。具备Spline技术、3D专业、生成智能等特色功能，适合3D生成使用。',
    website_url: 'https://spline.design/ai',
    tags: ['Spline', 'AI 3D生成', '3D物体', '3D专业'],
    pricing_type: 'freemium'
  },
  {
    name: '千图设计室AI海报',
    tagline: '免费批量生成在线可编辑的AI海报工具',
    description: '千图设计室AI海报是免费批量生成在线可编辑的AI海报工具。提供AI海报、批量生成、在线编辑等服务。具备免费使用、批量专业、编辑便捷等特色功能，适合AI海报使用。',
    website_url: 'https://haibao.58pic.com',
    tags: ['免费AI海报', '批量生成', '在线编辑', '海报专业'],
    pricing_type: 'free'
  },
  {
    name: 'illostrationAI',
    tagline: 'AI插画生成，low poly、3D、矢量、logo、像素风、皮克斯等风格',
    description: 'illostrationAI是AI插画生成，low poly、3D、矢量、logo、像素风、皮克斯等风格。提供插画生成、多种风格、AI支持等服务。具备多风格专业、插画智能、生成便捷等特色功能，适合插画生成使用。',
    website_url: 'https://illostration.ai',
    tags: ['AI插画生成', '多种风格', 'low poly', '插画专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Uizard',
    tagline: 'AI网页、App和UI设计，快速生成应用和网站原型',
    description: 'Uizard是AI网页、App和UI设计，快速生成应用和网站原型。提供网页设计、App设计、UI支持等服务。具备设计专业、生成智能、原型便捷等特色功能，适合网页App设计使用。',
    website_url: 'https://uizard.io',
    tags: ['AI网页设计', 'App设计', 'UI设计', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Luma AI',
    tagline: 'AI 3D捕捉、建模和渲染',
    description: 'Luma AI是AI 3D捕捉、建模和渲染。提供3D捕捉、建模渲染、AI支持等服务。具备捕捉专业、建模智能、渲染便捷等特色功能，适合3D建模使用。',
    website_url: 'https://lumalabs.ai',
    tags: ['AI 3D捕捉', '建模渲染', '3D专业', '建模智能'],
    pricing_type: 'freemium'
  },
  {
    name: '图宇宙',
    tagline: '高品质AI智能设计平台',
    description: '图宇宙是高品质AI智能设计平台。提供智能设计、高品质支持、平台服务等功能。具备高品质专业、设计智能、平台便捷等特色功能，适合智能设计使用。',
    website_url: 'https://tuyuzhou.com',
    tags: ['高品质AI', '智能设计', '设计平台', '品质专业'],
    pricing_type: 'freemium'
  },
  {
    name: '阿里云智能logo设计',
    tagline: '阿里云推出的智能Logo设计',
    description: '阿里云智能logo设计是阿里云推出的智能Logo设计。提供Logo设计、阿里云技术、智能支持等服务。具备阿里云技术、Logo专业、智能便捷等特色功能，适合Logo设计使用。',
    website_url: 'https://logo.aliyun.com',
    tags: ['阿里云', '智能Logo设计', 'Logo专业', '设计专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'AIDesign',
    tagline: '腾讯推出的免费AI Logo在线设计工具',
    description: 'AIDesign是腾讯推出的免费AI Logo在线设计工具。提供Logo设计、腾讯技术、免费使用等服务。具备腾讯技术、Logo专业、免费使用等特色功能，适合Logo设计使用。',
    website_url: 'https://logo.qq.com',
    tags: ['腾讯', '免费AI Logo', '在线设计', 'Logo专业'],
    pricing_type: 'free'
  },
  {
    name: 'Fabrie AI',
    tagline: '在线白板协作平台Fabrie推出的AI设计助手，支持多种渲染模式',
    description: 'Fabrie AI是在线白板协作平台Fabrie推出的AI设计助手，支持多种渲染模式。提供白板协作、Fabrie技术、多种渲染等服务。具备Fabrie技术、协作专业、渲染智能等特色功能，适合白板协作使用。',
    website_url: 'https://fabrie.ai',
    tags: ['Fabrie', 'AI设计助手', '白板协作', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Poly',
    tagline: 'AI生成3D材质',
    description: 'Poly是AI生成3D材质。提供3D材质、AI生成、专业支持等功能。具备材质专业、3D智能、生成便捷等特色功能，适合3D材质使用。',
    website_url: 'https://poly.ai',
    tags: ['AI 3D材质', '材质生成', '3D专业', '材质专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Illustroke',
    tagline: 'AI SVG矢量插画生成工具',
    description: 'Illustroke是AI SVG矢量插画生成工具。提供SVG矢量、插画生成、AI支持等服务。具备矢量专业、插画智能、生成便捷等特色功能，适合SVG插画使用。',
    website_url: 'https://illustroke.com',
    tags: ['AI SVG矢量', '插画生成', '矢量专业', '插画智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Eva Design System',
    tagline: '基于深度学习的色彩生成工具',
    description: 'Eva Design System是基于深度学习的色彩生成工具。提供色彩生成、深度学习、专业支持等功能。具备深度学习、色彩专业、生成智能等特色功能，适合色彩生成使用。',
    website_url: 'https://eva.design',
    tags: ['深度学习', '色彩生成', '设计系统', '色彩专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Color Wheel',
    tagline: 'AI灰度logo或插画上色工具',
    description: 'Color Wheel是AI灰度logo或插画上色工具。提供灰度上色、logo插画、AI支持等服务。具备上色专业、logo便捷、插画智能等特色功能，适合灰度上色使用。',
    website_url: 'https://colorwheel.ai',
    tags: ['AI灰度上色', 'logo插画', '上色工具', '上色专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Huemint',
    tagline: 'AI调色生成工具',
    description: 'Huemint是AI调色生成工具。提供调色生成、AI支持、专业服务等功能。具备调色专业、AI便捷、生成智能等特色功能，适合调色生成使用。',
    website_url: 'https://huemint.com',
    tags: ['AI调色生成', '调色工具', '色彩专业', '调色智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'ColorMagic',
    tagline: 'AI调色板生成工具',
    description: 'ColorMagic是AI调色板生成工具。提供调色板生成、AI支持、专业服务等功能。具备调色板专业、AI便捷、生成智能等特色功能，适合调色板使用。',
    website_url: 'https://colormagic.io',
    tags: ['AI调色板', '调色板生成', '色彩专业', '调色板智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Logomaster.ai',
    tagline: 'AI Logo生成工具',
    description: 'Logomaster.ai是AI Logo生成工具。提供Logo生成、AI支持、专业服务等功能。具备生成专业、AI便捷、服务全面等特色功能，适合Logo生成使用。',
    website_url: 'https://logomaster.ai',
    tags: ['AI Logo生成', '生成工具', 'Logo专业', '生成智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Magician',
    tagline: 'Figma插件，AI生成图标、图片和UX文案',
    description: 'Magician是Figma插件，AI生成图标、图片和UX文案。提供Figma插件、图标生成、UX文案等服务。具备插件专业、图标智能、文案便捷等特色功能，适合Figma插件使用。',
    website_url: 'https://magician.design',
    tags: ['Figma插件', 'AI图标生成', 'UX文案', '插件专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Appicons AI',
    tagline: 'AI生成精美App图标',
    description: 'Appicons AI是AI生成精美App图标。提供App图标、AI生成、精美支持等服务。具备图标专业、生成智能、精美便捷等特色功能，适合App图标使用。',
    website_url: 'https://appicons.ai',
    tags: ['AI App图标', '图标生成', '精美图标', '图标专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'IconifyAI',
    tagline: 'AI App图标生成器',
    description: 'IconifyAI是AI App图标生成器。提供App图标、AI生成、专业支持等功能。具备生成专业、AI便捷、服务全面等特色功能，适合App图标使用。',
    website_url: 'https://iconifyai.com',
    tags: ['AI App图标', '图标生成器', 'App专业', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Khroma',
    tagline: 'AI调色盘生成工具',
    description: 'Khroma是AI调色盘生成工具。提供调色盘生成、AI支持、专业服务等功能。具备调色盘专业、AI便捷、生成智能等特色功能，适合调色盘使用。',
    website_url: 'https://khroma.co',
    tags: ['AI调色盘', '调色盘生成', '色彩专业', '调色盘智能'],
    pricing_type: 'freemium'
  },
  {
    name: '即时AI',
    tagline: '即时设计推出的由文本描述生成可编辑的原型设计稿',
    description: '即时AI是即时设计推出的由文本描述生成可编辑的原型设计稿。提供原型设计、文本生成、即时技术等服务。具备即时技术、原型专业、生成便捷等特色功能，适合原型设计使用。',
    website_url: 'https://js.design/ai',
    tags: ['即时设计', '文本生成', '原型设计稿', '原型专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Alpaca',
    tagline: '将生成式AI集成到Photoshop图像设计中',
    description: 'Alpaca是将生成式AI集成到Photoshop图像设计中。提供Photoshop集成、生成式AI、图像设计等服务。具备集成专业、生成智能、设计便捷等特色功能，适合Photoshop使用。',
    website_url: 'https://alpaca.ml',
    tags: ['Photoshop集成', '生成式AI', '图像设计', '集成专业'],
    pricing_type: 'freemium'
  },
  {
    name: '羚珑',
    tagline: '京东推出的商品图智能设计小工具',
    description: '羚珑是京东推出的商品图智能设计小工具。提供商品图设计、京东技术、智能支持等服务。具备京东技术、商品专业、设计智能等特色功能，适合商品图设计使用。',
    website_url: 'https://linglong.jd.com',
    tags: ['京东', '商品图设计', '智能设计', '商品专业'],
    pricing_type: 'freemium'
  },
  {
    name: '灵动AI',
    tagline: '专业的AI商品图生成工具',
    description: '灵动AI是专业的AI商品图生成工具。提供商品图生成、AI支持、专业服务等功能。具备生成专业、AI便捷、商品优化等特色功能，适合商品图生成使用。',
    website_url: 'https://lingdong.ai',
    tags: ['AI商品图生成', '专业生成', '商品专业', '生成专业'],
    pricing_type: 'freemium'
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

async function insertDesignTools() {
  console.log('开始检查并插入AI设计工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of designTools) {
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
          category: 'image',
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
    
    console.log(`\n🎉 AI设计工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${designTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

insertDesignTools()
