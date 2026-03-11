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

// AI视频工具数据
const videoTools = [
  {
    name: 'LiblibAI',
    tagline: '一站式 AI 内容创作生成平台',
    description: 'LiblibAI是一站式AI内容创作生成平台，提供全方位的AI创作服务。支持视频生成、图像创作、内容制作等功能。具备一站式服务、创作专业、功能全面等特色功能，适合内容创作者使用。',
    website_url: 'https://liblib.ai',
    tags: ['一站式平台', '内容创作', '视频生成', '图像创作'],
    pricing_type: 'freemium'
  },
  {
    name: '绘蛙AI视频',
    tagline: '绘蛙推出的AI图生视频工具',
    description: '绘蛙AI视频是绘蛙推出的专业AI图生视频工具。提供图像转视频、视频生成、创作辅助等服务。具备图生视频、技术先进、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://video.huiwa.com',
    tags: ['绘蛙出品', '图生视频', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'SoundView',
    tagline: 'Sora视频去水印，AI视频本地化工具',
    description: 'SoundView是专业的Sora视频去水印和AI视频本地化工具。提供水印去除、视频本地化、内容处理等服务。具备去水印专业、本地化处理、效果优秀等特色功能，适合视频处理使用。',
    website_url: 'https://soundview.ai',
    tags: ['去水印', '视频本地化', 'Sora处理', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Keevx',
    tagline: '开箱即用的AI数字人视频创作工具',
    description: 'Keevx是开箱即用的AI数字人视频创作工具。提供数字人视频、人物生成、创作辅助等服务。具备开箱即用、数字人专业、创作便捷等特色功能，适合数字人视频创作使用。',
    website_url: 'https://keevx.com',
    tags: ['开箱即用', '数字人视频', '人物生成', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '有言',
    tagline: '一站式AI视频创作和3D数字人生成平台',
    description: '有言是一站式AI视频创作和3D数字人生成平台。提供视频创作、3D数字人、内容制作等服务。具备一站式服务、3D技术、创作专业等特色功能，适合专业视频创作使用。',
    website_url: 'https://youyan.ai',
    tags: ['一站式平台', '3D数字人', '视频创作', '专业制作'],
    pricing_type: 'freemium'
  },
  {
    name: 'HeyGen',
    tagline: '专业的AI数字人视频创作平台',
    description: 'HeyGen是全球知名的AI数字人视频创作平台。提供数字人视频、人物生成、专业制作等服务。具备国际知名、数字人专业、制作精良等特色功能，适合专业视频创作使用。',
    website_url: 'https://heygen.com',
    tags: ['国际知名', '数字人视频', '专业制作', '制作精良'],
    pricing_type: 'paid'
  },
  {
    name: '堆友AI视频',
    tagline: '堆友AI推出的免费AI视频生成工具',
    description: '堆友AI视频是堆友AI推出的免费AI视频生成工具。提供视频生成、创作辅助、免费服务等功能。具备免费使用、堆友技术、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://video.duiyou.com',
    tags: ['堆友出品', '免费生成', '创作便捷', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: '白日梦',
    tagline: '领先AI创作平台，可生成最长50分钟的视频',
    description: '白日梦是领先的AI创作平台，可生成最长50分钟的视频。提供长视频生成、创作辅助、专业制作等服务。具备长视频支持、技术领先、创作专业等特色功能，适合长视频创作使用。',
    website_url: 'https://bairimeng.com',
    tags: ['长视频生成', '技术领先', '创作专业', '50分钟视频'],
    pricing_type: 'freemium'
  },
  {
    name: '即梦AI',
    tagline: '一站式AI视频、图片、数字人创作工具',
    description: '即梦AI是一站式AI视频、图片、数字人创作工具。提供视频生成、图像创作、数字人制作等服务。具备一站式服务、多媒体创作、功能全面等特色功能，适合综合创作使用。',
    website_url: 'https://jimeng.ai',
    tags: ['一站式平台', '多媒体创作', '数字人制作', '功能全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pollo AI',
    tagline: '一站式AI图像和视频创作平台',
    description: 'Pollo AI是一站式AI图像和视频创作平台。提供图像生成、视频创作、内容制作等服务。具备一站式服务、图像视频、创作专业等特色功能，适合综合创作使用。',
    website_url: 'https://pollo.ai',
    tags: ['一站式平台', '图像视频', '创作专业', '内容制作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Vidu',
    tagline: '生数科技推出的AI视频生成大模型',
    description: 'Vidu是生数科技推出的AI视频生成大模型。提供视频生成、大模型技术、创作辅助等服务。具备大模型驱动、技术先进、创作专业等特色功能，适合专业视频创作使用。',
    website_url: 'https://vidu.shengshu.tech',
    tags: ['生数科技', '大模型技术', '视频生成', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '蝉镜',
    tagline: 'AI数字人视频生成平台',
    description: '蝉镜是专业的AI数字人视频生成平台。提供数字人视频、人物生成、创作辅助等服务。具备数字人专业、生成质量高、创作便捷等特色功能，适合数字人视频创作使用。',
    website_url: 'https://chanjing.ai',
    tags: ['数字人视频', '人物生成', '质量优秀', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Sora',
    tagline: 'OpenAI推出的AI视频生成模型',
    description: 'Sora是OpenAI推出的革命性AI视频生成模型。提供视频生成、技术先进、创作专业等服务。具备OpenAI技术、视频专业、效果震撼等特色功能，代表AI视频技术的最高水平。',
    website_url: 'https://openai.com/sora',
    tags: ['OpenAI出品', '视频生成', '技术先进', '效果震撼'],
    pricing_type: 'freemium'
  },
  {
    name: 'JoyPix',
    tagline: 'AI数字人创作工具，支持声音克隆',
    description: 'JoyPix是AI数字人创作工具，支持声音克隆功能。提供数字人创作、声音克隆、视频制作等服务。具备数字人专业、声音克隆、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://joypix.ai',
    tags: ['数字人创作', '声音克隆', '视频制作', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '可灵AI',
    tagline: '快手推出的AI视频生成工具',
    description: '可灵AI是快手推出的AI视频生成工具。提供视频生成、创作辅助、快手生态等服务。具备快手技术、创作专业、生态集成等特色功能，适合视频创作使用。',
    website_url: 'https://keling.ai',
    tags: ['快手出品', '视频生成', '创作专业', '生态集成'],
    pricing_type: 'freemium'
  },
  {
    name: '海螺视频',
    tagline: 'MiniMax公司推出的AI视频生成工具',
    description: '海螺视频是MiniMax公司推出的AI视频生成工具。提供视频生成、创作辅助、MiniMax技术等服务。具备MiniMax技术、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://hailuo.video',
    tags: ['MiniMax出品', '视频生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '腾讯混元AI视频',
    tagline: '腾讯推出的AI视频生成工具',
    description: '腾讯混元AI视频是腾讯推出的AI视频生成工具。提供视频生成、混元技术、创作辅助等服务。具备腾讯技术、混元大模型、创作专业等特色功能，适合视频创作使用。',
    website_url: 'https://video.qq.com',
    tags: ['腾讯出品', '混元技术', '视频生成', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '通义万相AI视频',
    tagline: '通义万相AI视频是阿里推出的...',
    description: '通义万相AI视频是阿里推出的AI视频生成工具。提供视频生成、通义技术、创作辅助等服务。具备阿里技术、通义大模型、创作专业等特色功能，适合视频创作使用。',
    website_url: 'https://video.tongyi.ali.com',
    tags: ['阿里出品', '通义技术', '视频生成', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '魔珐星云',
    tagline: '具身智能3D数字人开放平台',
    description: '魔珐星云是具身智能3D数字人开放平台。提供3D数字人、具身智能、开放平台等服务。具备3D技术、具身智能、开放生态等特色功能，适合专业数字人开发使用。',
    website_url: 'https://mofaxingyun.com',
    tags: ['3D数字人', '具身智能', '开放平台', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'AdsTurbo AI',
    tagline: 'AI视频广告生成平台，自动生成可直接投放的视频',
    description: 'AdsTurbo AI是AI视频广告生成平台，自动生成可直接投放的视频。提供广告视频、自动生成、投放就绪等服务。具备广告专业、自动生成、投放便捷等特色功能，适合广告制作使用。',
    website_url: 'https://adsturbo.ai',
    tags: ['广告视频', '自动生成', '投放就绪', '广告专业'],
    pricing_type: 'freemium'
  },
  {
    name: '献丑AI',
    tagline: '首个 AI 视频开源社区，支持一键Fork与共创',
    description: '献丑AI是首个AI视频开源社区，支持一键Fork与共创。提供开源视频、社区共创、Fork功能等服务。具备开源免费、社区互动、共创便捷等特色功能，适合开源创作使用。',
    website_url: 'https://xianchou.ai',
    tags: ['开源社区', '视频共创', 'Fork功能', '社区互动'],
    pricing_type: 'opensource'
  },
  {
    name: 'MochiAni',
    tagline: 'AI动画视频创作工具',
    description: 'MochiAni是AI动画视频创作工具。提供动画视频、创作辅助、专业制作等服务。具备动画专业、创作便捷、质量优秀等特色功能，适合动画创作使用。',
    website_url: 'https://mochiani.com',
    tags: ['动画视频', '创作便捷', '质量优秀', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'TapNow',
    tagline: 'AI视觉内容创作平台，提供多种预设工作流',
    description: 'TapNow是AI视觉内容创作平台，提供多种预设工作流。提供视觉创作、工作流预设、内容制作等服务。具备工作流丰富、创作专业、效果优秀等特色功能，适合视觉创作使用。',
    website_url: 'https://tapnow.ai',
    tags: ['视觉创作', '工作流预设', '内容制作', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Higgsfield',
    tagline: 'AI视频生成工具，支持专业运镜效果',
    description: 'Higgsfield是AI视频生成工具，支持专业运镜效果。提供视频生成、运镜专业、创作辅助等服务。具备运镜专业、效果优秀、创作便捷等特色功能，适合专业视频创作使用。',
    website_url: 'https://higgsfield.ai',
    tags: ['运镜效果', '视频生成', '专业制作', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: '雾象',
    tagline: '免费开源的AI动画生成工具',
    description: '雾象是免费开源的AI动画生成工具。提供动画生成、开源免费、创作辅助等服务。具备开源免费、动画专业、创作便捷等特色功能，适合动画创作使用。',
    website_url: 'https://wuxiang.ai',
    tags: ['开源免费', '动画生成', '创作便捷', '专业工具'],
    pricing_type: 'opensource'
  },
  {
    name: '造次',
    tagline: 'AI原创IP视频社区',
    description: '造次是AI原创IP视频社区。提供IP视频、原创内容、社区互动等服务。具备IP创作、原创保护、社区生态等特色功能，适合原创视频创作使用。',
    website_url: 'https://zao.ci',
    tags: ['IP视频', '原创内容', '社区互动', '创作保护'],
    pricing_type: 'freemium'
  },
  {
    name: '造点AI',
    tagline: '夸克团队推出的AI图像与视频创作平台',
    description: '造点AI是夸克团队推出的AI图像与视频创作平台。提供图像创作、视频生成、内容制作等服务。具备夸克技术、图像视频、创作专业等特色功能，适合综合创作使用。',
    website_url: 'https://zaodian.ai',
    tags: ['夸克出品', '图像视频', '创作专业', '内容制作'],
    pricing_type: 'freemium'
  },
  {
    name: '花生AI',
    tagline: 'B站推出的AI视频创作工具',
    description: '花生AI是B站推出的AI视频创作工具。提供视频创作、B站生态、创作辅助等服务。具备B站技术、创作专业、生态集成等特色功能，适合B站创作者使用。',
    website_url: 'https://huasheng.ai',
    tags: ['B站出品', '视频创作', '生态集成', '创作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'NextCut AI',
    tagline: 'AI视频创作工具，集成无限画布 + workflow + 剪辑轨道 + 多Agent团队',
    description: 'NextCut AI是AI视频创作工具，集成无限画布、workflow、剪辑轨道、多Agent团队。提供专业剪辑、团队协作、创作辅助等服务。具备专业剪辑、团队协作、功能全面等特色功能，适合专业视频制作使用。',
    website_url: 'https://nextcut.ai',
    tags: ['专业剪辑', '团队协作', '功能全面', '创作工具'],
    pricing_type: 'freemium'
  },
  {
    name: '云幕同声',
    tagline: '专业AI视频翻译，短剧出海、跨境电商，效果超棒！',
    description: '云幕同声是专业AI视频翻译工具，专注于短剧出海、跨境电商。提供视频翻译、多语言支持、出海服务等功能。具备翻译专业、多语言、出海服务等特色功能，适合国际化视频使用。',
    website_url: 'https://yunmu.tongsheng.com',
    tags: ['视频翻译', '多语言支持', '短剧出海', '跨境电商'],
    pricing_type: 'freemium'
  },
  {
    name: '萌动AI',
    tagline: '全球首个二次元/动漫专用 AI 创作工具',
    description: '萌动AI是全球首个二次元/动漫专用AI创作工具。提供动漫创作、二次元内容、专业制作等服务。具备二次元专业、动漫创作、质量优秀等特色功能，适合动漫创作者使用。',
    website_url: 'https://mengdong.ai',
    tags: ['二次元创作', '动漫专用', '专业制作', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'KomikoAI',
    tagline: '一站式AI动漫内容创作平台',
    description: 'KomikoAI是一站式AI动漫内容创作平台。提供动漫创作、内容制作、专业服务等功能。具备一站式服务、动漫专业、创作便捷等特色功能，适合动漫创作使用。',
    website_url: 'https://komiko.ai',
    tags: ['一站式平台', '动漫创作', '内容制作', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '即创',
    tagline: '抖音推出的一站式AI智能创作平台',
    description: '即创是抖音推出的一站式AI智能创作平台。提供智能创作、抖音生态、内容制作等服务。具备抖音技术、智能创作、生态集成等特色功能，适合抖音创作者使用。',
    website_url: 'https://jichuang.douyin.com',
    tags: ['抖音出品', '智能创作', '生态集成', '内容制作'],
    pricing_type: 'freemium'
  },
  {
    name: '智谱清影',
    tagline: '智谱推出的免费AI视频生成工具',
    description: '智谱清影是智谱推出的免费AI视频生成工具。提供视频生成、免费服务、智谱技术等功能。具备免费使用、智谱技术、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://qingying.zhipu.ai',
    tags: ['智谱出品', '免费生成', '创作便捷', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: '内容特工队',
    tagline: '全球首款移动端AI营销视频生成智能体',
    description: '内容特工队是全球首款移动端AI营销视频生成智能体。提供移动端创作、营销视频、智能生成等服务。具备移动端专业、营销视频、智能生成等特色功能，适合移动端营销使用。',
    website_url: 'https://neirongtegongdui.com',
    tags: ['移动端创作', '营销视频', '智能生成', '移动专业'],
    pricing_type: 'freemium'
  },
  {
    name: '磁力开创',
    tagline: '快手推出的AI创意生产平台',
    description: '磁力开创是快手推出的AI创意生产平台。提供创意生产、AI创作、快手生态等服务。具备快手技术、创意专业、生态集成等特色功能，适合创意生产使用。',
    website_url: 'https://cili.kaishou.com',
    tags: ['快手出品', '创意生产', 'AI创作', '生态集成'],
    pricing_type: 'freemium'
  },
  {
    name: 'A2E',
    tagline: '一站式AI视频生成平台',
    description: 'A2E是一站式AI视频生成平台。提供视频生成、创作辅助、专业服务等功能。具备一站式服务、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://a2e.ai',
    tags: ['一站式平台', '视频生成', '创作便捷', '专业服务'],
    pricing_type: 'freemium'
  },
  {
    name: 'HitPaw',
    tagline: '专注于AI视频、图像和音频处理工具',
    description: 'HitPaw是专注于AI视频、图像和音频处理工具。提供视频处理、图像处理、音频处理等服务。具备多媒体处理、专业工具、效果优秀等特色功能，适合多媒体处理使用。',
    website_url: 'https://hitpaw.com',
    tags: ['多媒体处理', '视频处理', '图像处理', '音频处理'],
    pricing_type: 'freemium'
  },
  {
    name: 'Runway',
    tagline: 'AI视频工具，绿幕抠除、视频生成、动态捕捉等功能',
    description: 'Runway是全球知名的AI视频工具，提供绿幕抠除、视频生成、动态捕捉等功能。具备国际知名、功能全面、技术先进等特色功能，适合专业视频制作使用。',
    website_url: 'https://runwayml.com',
    tags: ['国际知名', '绿幕抠除', '动态捕捉', '功能全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pika',
    tagline: 'Pika Labs推出的AI视频生成和编辑工具',
    description: 'Pika是Pika Labs推出的AI视频生成和编辑工具。提供视频生成、编辑处理、创作辅助等服务。具备Pika技术、视频专业、编辑便捷等特色功能，适合视频创作使用。',
    website_url: 'https://pika.art',
    tags: ['Pika Labs', '视频生成', '编辑工具', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'KreadoAI',
    tagline: 'AI数字人视频营销创作平台',
    description: 'KreadoAI是AI数字人视频营销创作平台。提供数字人视频、营销创作、专业服务等功能。具备数字人专业、营销应用、创作便捷等特色功能，适合营销视频使用。',
    website_url: 'https://kreadoai.com',
    tags: ['数字人视频', '营销创作', '专业服务', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'SekoTalk',
    tagline: '商汤科技推出的AI对口型工具',
    description: 'SekoTalk是商汤科技推出的AI对口型工具。提供对口型生成、语音同步、视频处理等服务。具备商汤技术、对口型专业、同步精准等特色功能，适合对口型视频使用。',
    website_url: 'https://seko.sensetime.com',
    tags: ['商汤科技', '对口型工具', '语音同步', '同步精准'],
    pricing_type: 'freemium'
  },
  {
    name: '通义灵眸',
    tagline: '阿里通义推出的AI数字人生产平台',
    description: '通义灵眸是阿里通义推出的AI数字人生产平台。提供数字人生成、通义技术、创作辅助等服务。具备阿里技术、数字人专业、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://lingmou.tongyi.ali.com',
    tags: ['阿里通义', '数字人生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '巨日禄',
    tagline: '一站式AI动漫视频创作平台',
    description: '巨日禄是一站式AI动漫视频创作平台。提供动漫创作、视频制作、专业服务等功能。具备一站式服务、动漫专业、创作便捷等特色功能，适合动漫创作使用。',
    website_url: 'https://jurilu.com',
    tags: ['一站式平台', '动漫创作', '视频制作', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Medeo',
    tagline: 'AI视频创作平台，一句话生成完整视频',
    description: 'Medeo是AI视频创作平台，一句话生成完整视频。提供视频生成、一句话创作、专业服务等功能。具备一句话生成、创作便捷、质量优秀等特色功能，适合快速视频创作使用。',
    website_url: 'https://medeo.ai',
    tags: ['一句话生成', '视频创作', '创作便捷', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Boba',
    tagline: 'AI动漫视频创作工具',
    description: 'Boba是AI动漫视频创作工具。提供动漫创作、视频制作、专业服务等功能。具备动漫专业、创作便捷、质量优秀等特色功能，适合动漫创作使用。',
    website_url: 'https://boba.ai',
    tags: ['动漫创作', '视频制作', '创作便捷', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Dream Machine',
    tagline: 'Luma AI推出的AI视频生成工具',
    description: 'Dream Machine是Luma AI推出的AI视频生成工具。提供视频生成、Luma技术、创作辅助等服务。具备Luma技术、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://dreammachine.luma.ai',
    tags: ['Luma AI', '视频生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞绘镜',
    tagline: '科大讯飞推出的AI短视频创作平台',
    description: '讯飞绘镜是科大讯飞推出的AI短视频创作平台。提供短视频创作、讯飞技术、创作辅助等服务。具备讯飞技术、短视频专业、创作便捷等特色功能，适合短视频创作使用。',
    website_url: 'https://huijing.xunfei.cn',
    tags: ['科大讯飞', '短视频创作', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '绘想',
    tagline: '百度推出的AI视频创作平台',
    description: '绘想是百度推出的AI视频创作平台。提供视频创作、百度技术、创作辅助等服务。具备百度技术、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://huixiang.baidu.com',
    tags: ['百度出品', '视频创作', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Hedra',
    tagline: 'AI对口型视频生成工具',
    description: 'Hedra是AI对口型视频生成工具。提供对口型生成、语音同步、视频处理等服务。具备对口型专业、同步精准、创作便捷等特色功能，适合对口型视频使用。',
    website_url: 'https://hedra.ai',
    tags: ['对口型工具', '语音同步', '同步精准', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Vozo',
    tagline: '多功能AI视频编辑工具',
    description: 'Vozo是多功能AI视频编辑工具。提供视频编辑、功能全面、创作辅助等服务。具备功能丰富、编辑专业、创作便捷等特色功能，适合视频编辑使用。',
    website_url: 'https://vozo.ai',
    tags: ['多功能编辑', '视频编辑', '功能丰富', '编辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Viggle',
    tagline: 'AI生成可控的角色动态视频的工具',
    description: 'Viggle是AI生成可控的角色动态视频的工具。提供角色动态、可控生成、视频创作等服务。具备可控生成、角色动态、创作专业等特色功能，适合角色视频使用。',
    website_url: 'https://viggle.ai',
    tags: ['角色动态', '可控生成', '视频创作', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tavus',
    tagline: 'AI数字人克隆和AI视频实时对话工具',
    description: 'Tavus是AI数字人克隆和AI视频实时对话工具。提供数字人克隆、实时对话、视频交互等服务。具备数字人专业、实时交互、对话便捷等特色功能，适合数字人交互使用。',
    website_url: 'https://tavus.ai',
    tags: ['数字人克隆', '实时对话', '视频交互', '交互专业'],
    pricing_type: 'freemium'
  },
  {
    name: '万兴天幕',
    tagline: '万兴科技推出AIGC视频创作平台',
    description: '万兴天幕是万兴科技推出的AIGC视频创作平台。提供视频创作、AIGC技术、万兴服务等功能。具备万兴技术、AIGC专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://tianmu.wondershare.com',
    tags: ['万兴科技', 'AIGC创作', '视频创作', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '妙播',
    tagline: '腾讯广告推出的AI直播电商解决方案',
    description: '妙播是腾讯广告推出的AI直播电商解决方案。提供直播电商、AI技术、腾讯服务等功能。具备腾讯技术、电商专业、直播便捷等特色功能，适合直播电商使用。',
    website_url: 'https://miaobo.tencent.com',
    tags: ['腾讯广告', '直播电商', 'AI技术', '电商专业'],
    pricing_type: 'freemium'
  },
  {
    name: '阶跃视频',
    tagline: '阶跃星辰推出的AI视频生成工具',
    description: '阶跃视频是阶跃星辰推出的AI视频生成工具。提供视频生成、阶跃技术、创作辅助等服务。具备阶跃技术、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://video.jieyue.ai',
    tags: ['阶跃星辰', '视频生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '秒创',
    tagline: 'AIGC内容创作平台',
    description: '秒创是AIGC内容创作平台。提供内容创作、AIGC技术、创作辅助等服务。具备AIGC专业、创作便捷、功能全面等特色功能，适合内容创作使用。',
    website_url: 'https://miaochuang.ai',
    tags: ['AIGC创作', '内容平台', '创作便捷', '功能全面'],
    pricing_type: 'freemium'
  },
  {
    name: '元镜',
    tagline: 'AI视频生成工具，支持多模态创意分镜创作服务',
    description: '元镜是AI视频生成工具，支持多模态创意分镜创作服务。提供视频生成、多模态创作、分镜专业等服务。具备多模态技术、分镜专业、创作便捷等特色功能，适合专业视频创作使用。',
    website_url: 'https://yuanjing.ai',
    tags: ['多模态创作', '分镜专业', '视频生成', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'SkyReels',
    tagline: '昆仑万维推出的AI短剧创作平台',
    description: 'SkyReels是昆仑万维推出的AI短剧创作平台。提供短剧创作、昆仑技术、创作辅助等服务。具备昆仑万维、短剧专业、创作便捷等特色功能，适合短剧创作使用。',
    website_url: 'https://skyreels.kunlun.ai',
    tags: ['昆仑万维', '短剧创作', '创作便捷', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'MOKI',
    tagline: '美图推出的AI视频短片创作平台',
    description: 'MOKI是美图推出的AI视频短片创作平台。提供短片创作、美图技术、创作辅助等服务。具备美图技术、短片专业、创作便捷等特色功能，适合短片创作使用。',
    website_url: 'https://moki.meitu.com',
    tags: ['美图出品', '短片创作', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '神笔马良',
    tagline: '猫眼娱乐推出的AI影视创作生成工具',
    description: '神笔马良是猫眼娱乐推出的AI影视创作生成工具。提供影视创作、猫眼技术、创作辅助等服务。具备猫眼技术、影视专业、创作便捷等特色功能，适合影视创作使用。',
    website_url: 'https://shenbimaliang.maoyan.com',
    tags: ['猫眼娱乐', '影视创作', '创作便捷', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Video Ocean',
    tagline: '潞晨科技推出的多功能AI视频生成平台',
    description: 'Video Ocean是潞晨科技推出的多功能AI视频生成平台。提供视频生成、多功能服务、创作辅助等功能。具备多功能、技术先进、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://videoocean.luchen.tech',
    tags: ['多功能平台', '视频生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Flow Studio',
    tagline: 'FlowGPT推出的AI长视频生成工具',
    description: 'Flow Studio是FlowGPT推出的AI长视频生成工具。提供长视频生成、FlowGPT技术、创作辅助等服务。具备长视频专业、技术先进、创作便捷等特色功能，适合长视频创作使用。',
    website_url: 'https://flowstudio.flowgpt.com',
    tags: ['FlowGPT', '长视频生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Vizard',
    tagline: '将长视频转为社交短视频的AI工具',
    description: 'Vizard是将长视频转为社交短视频的AI工具。提供视频转换、短视频制作、社交适配等服务。具备转换专业、短视频适配、创作便捷等特色功能，适合短视频制作使用。',
    website_url: 'https://vizard.ai',
    tags: ['视频转换', '短视频制作', '社交适配', '转换专业'],
    pricing_type: 'freemium'
  },
  {
    name: '寻光',
    tagline: '阿里达摩院推出的全流程AI视频创作平台',
    description: '寻光是阿里达摩院推出的全流程AI视频创作平台。提供全流程创作、达摩院技术、创作辅助等服务。具备达摩院技术、全流程专业、创作便捷等特色功能，适合专业视频创作使用。',
    website_url: 'https://xunguang.damo.alibaba.com',
    tags: ['阿里达摩院', '全流程创作', '技术先进', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'Hotshot',
    tagline: 'AI视频生成工具，将文本转为3秒逼真视频',
    description: 'Hotshot是AI视频生成工具，将文本转为3秒逼真视频。提供文本转视频、逼真效果、创作辅助等服务。具备文本转视频、效果逼真、创作便捷等特色功能，适合快速视频创作使用。',
    website_url: 'https://hotshot.ai',
    tags: ['文本转视频', '逼真效果', '快速生成', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'vivago.ai',
    tagline: '免费的AI视频生成和图像创作平台',
    description: 'vivago.ai是免费的AI视频生成和图像创作平台。提供视频生成、图像创作、免费服务等功能。具备免费使用、创作便捷、功能全面等特色功能，适合综合创作使用。',
    website_url: 'https://vivago.ai',
    tags: ['免费平台', '视频生成', '图像创作', '功能全面'],
    pricing_type: 'free'
  },
  {
    name: 'Humva',
    tagline: 'AI数字人生成工具，自定义创建专属数字人',
    description: 'Humva是AI数字人生成工具，自定义创建专属数字人。提供数字人生成、自定义创作、专业服务等功能。具备自定义专业、数字人技术、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://humva.ai',
    tags: ['数字人生成', '自定义创作', '专属定制', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'D-ID',
    tagline: 'AI真人口播视频生成工具',
    description: 'D-ID是AI真人口播视频生成工具。提供口播视频、真人效果、创作辅助等服务。具备口播专业、真人效果、创作便捷等特色功能，适合口播视频使用。',
    website_url: 'https://d-id.com',
    tags: ['口播视频', '真人效果', '创作便捷', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Stable Video',
    tagline: 'Stability AI推出的AI视频生成工具',
    description: 'Stable Video是Stability AI推出的AI视频生成工具。提供视频生成、Stability技术、创作辅助等服务。具备Stability技术、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://stability.ai/video',
    tags: ['Stability AI', '视频生成', '技术先进', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'OneStory',
    tagline: '专业的AI故事生成助手',
    description: 'OneStory是专业的AI故事生成助手。提供故事生成、创作辅助、专业服务等功能。具备故事专业、创作便捷、质量优秀等特色功能，适合故事创作使用。',
    website_url: 'https://onestory.ai',
    tags: ['故事生成', '创作助手', '专业工具', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Noisee AI',
    tagline: '月之暗面旗下推出的AI音乐视频MV生成工具',
    description: 'Noisee AI是月之暗面旗下推出的AI音乐视频MV生成工具。提供音乐视频、MV生成、创作辅助等服务。具备月之暗面技术、音乐视频专业、创作便捷等特色功能，适合音乐视频使用。',
    website_url: 'https://noisee.ai',
    tags: ['月之暗面', '音乐视频', 'MV生成', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '万兴播爆',
    tagline: 'AI数字人口播视频营销工具，海量素材一键套用',
    description: '万兴播爆是AI数字人口播视频营销工具，海量素材一键套用。提供口播视频、营销工具、素材丰富等功能。具备营销专业、素材丰富、创作便捷等特色功能，适合营销视频使用。',
    website_url: 'https://bobao.wondershare.com',
    tags: ['万兴科技', '口播视频', '营销工具', '素材丰富'],
    pricing_type: 'freemium'
  },
  {
    name: 'Vimi',
    tagline: '商汤科技推出的可控人物视频生成AI模型',
    description: 'Vimi是商汤科技推出的可控人物视频生成AI模型。提供人物视频、可控生成、商汤技术等服务。具备商汤技术、可控生成、视频专业等特色功能，适合人物视频使用。',
    website_url: 'https://vimi.sensetime.com',
    tags: ['商汤科技', '人物视频', '可控生成', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Etna',
    tagline: '七火山科技推出的AI文生视频工具',
    description: 'Etna是七火山科技推出的AI文生视频工具。提供文生视频、七火山技术、创作辅助等服务。具备七火山技术、文生视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://etna.qhuoshan.tech',
    tags: ['七火山科技', '文生视频', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '艺映AI',
    tagline: 'AI视频创作工具，支持文生视频、图生视频及视频转漫画功能',
    description: '艺映AI是AI视频创作工具，支持文生视频、图生视频及视频转漫画功能。提供多种生成方式、创作辅助、专业服务等功能。具备功能全面、创作便捷、效果优秀等特色功能，适合视频创作使用。',
    website_url: 'https://yiying.ai',
    tags: ['多种生成', '视频转漫画', '功能全面', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'LensGo',
    tagline: 'AI视频创作工具，支持视频转动漫，替换3D人物',
    description: 'LensGo是AI视频创作工具，支持视频转动漫，替换3D人物。提供视频转换、动漫制作、3D人物等服务。具备转换专业、效果优秀、创作便捷等特色功能，适合视频转换使用。',
    website_url: 'https://lensgo.ai',
    tags: ['视频转动漫', '3D人物', '转换专业', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: '必剪Studio',
    tagline: 'B站推出的免费AI数字分身定制和视频创作工具',
    description: '必剪Studio是B站推出的免费AI数字分身定制和视频创作工具。提供数字分身、视频创作、B站生态等服务。具备B站技术、数字分身专业、创作便捷等特色功能，适合B站创作者使用。',
    website_url: 'https://studio.bilibili.com',
    tags: ['B站出品', '数字分身', '视频创作', '生态集成'],
    pricing_type: 'free'
  },
  {
    name: '度加创作工具',
    tagline: '百度官方出品的AIGC创作平台',
    description: '度加创作工具是百度官方出品的AIGC创作平台。提供AIGC创作、百度技术、创作辅助等服务。具备百度技术、AIGC专业、创作便捷等特色功能，适合内容创作使用。',
    website_url: 'https://dujia.baidu.com',
    tags: ['百度出品', 'AIGC创作', '创作便捷', '官方平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'WinkStudio',
    tagline: '美图推出的桌面端AI视频剪辑工具',
    description: 'WinkStudio是美图推出的桌面端AI视频剪辑工具。提供视频剪辑、美图技术、创作辅助等服务。具备美图技术、剪辑专业、桌面便捷等特色功能，适合视频剪辑使用。',
    website_url: 'https://winkstudio.meitu.com',
    tags: ['美图出品', '视频剪辑', '桌面工具', '剪辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'VMagic',
    tagline: 'AI视频处理平台，提供视频风格转换、换脸、照片舞蹈等功能',
    description: 'VMagic是AI视频处理平台，提供视频风格转换、换脸、照片舞蹈等功能。提供视频处理、特效丰富、创作辅助等服务。具备功能丰富、效果优秀、创作便捷等特色功能，适合视频处理使用。',
    website_url: 'https://vmagic.ai',
    tags: ['视频处理', '风格转换', '换脸功能', '特效丰富'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞虚拟人',
    tagline: '科大讯飞推出的全栈式AI虚拟人应用服务平台',
    description: '讯飞虚拟人是科大讯飞推出的全栈式AI虚拟人应用服务平台。提供虚拟人服务、讯飞技术、全栈支持等功能。具备讯飞技术、虚拟人专业、服务全面等特色功能，适合虚拟人应用使用。',
    website_url: 'https://xunfei.virtual.com',
    tags: ['科大讯飞', '虚拟人服务', '全栈支持', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: '飞影数字人',
    tagline: 'AI数字人创作平台，支持免费定制数字人',
    description: '飞影数字人是AI数字人创作平台，支持免费定制数字人。提供数字人创作、免费定制、专业服务等功能。具备免费定制、数字人专业、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://feiying.digital.com',
    tags: ['数字人创作', '免费定制', '专业服务', '创作便捷'],
    pricing_type: 'free'
  },
  {
    name: 'Video Studio',
    tagline: '在线AI视频制作工具，零编辑技能制作专业视频内容',
    description: 'Video Studio是在线AI视频制作工具，零编辑技能制作专业视频内容。提供视频制作、零技能创作、专业内容等服务。具备零技能、制作专业、创作便捷等特色功能，适合视频制作使用。',
    website_url: 'https://videostudio.ai',
    tags: ['零技能创作', '视频制作', '专业内容', '制作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pixfun',
    tagline: '一站式动画故事AI视频生成平台',
    description: 'Pixfun是一站式动画故事AI视频生成平台。提供动画故事、视频生成、创作辅助等服务。具备一站式服务、动画专业、创作便捷等特色功能，适合动画故事创作使用。',
    website_url: 'https://pixfun.ai',
    tags: ['一站式平台', '动画故事', '视频生成', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Decohere',
    tagline: 'AI视频生成平台，支持音频同步功能',
    description: 'Decohere是AI视频生成平台，支持音频同步功能。提供视频生成、音频同步、创作辅助等服务。具备音频同步、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://decohere.ai',
    tags: ['音频同步', '视频生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'YoYo',
    tagline: '鹿影科技推出的二次元动漫视频AI创作平台',
    description: 'YoYo是鹿影科技推出的二次元动漫视频AI创作平台。提供二次元创作、动漫视频、鹿影技术等服务。具备鹿影技术、二次元专业、创作便捷等特色功能，适合二次元创作使用。',
    website_url: 'https://yoyo.luying.tech',
    tags: ['鹿影科技', '二次元创作', '动漫视频', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Opus Clip',
    tagline: 'AI视频切片工具，自动从长视频中提取精彩片段',
    description: 'Opus Clip是AI视频切片工具，自动从长视频中提取精彩片段。提供视频切片、精彩提取、创作辅助等服务。具备切片专业、提取准确、创作便捷等特色功能，适合视频切片使用。',
    website_url: 'https://opusclip.ai',
    tags: ['视频切片', '精彩提取', '切片专业', '提取准确'],
    pricing_type: 'freemium'
  },
  {
    name: 'Filmora',
    tagline: '万兴科技推出的AI视频编辑工具',
    description: 'Filmora是万兴科技推出的AI视频编辑工具。提供视频编辑、万兴技术、创作辅助等服务。具备万兴技术、编辑专业、创作便捷等特色功能，适合视频编辑使用。',
    website_url: 'https://filmora.wondershare.com',
    tags: ['万兴科技', '视频编辑', '编辑专业', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Descript',
    tagline: 'AI视频编辑工具，支持通过编辑文字来剪辑音视频内容',
    description: 'Descript是AI视频编辑工具，支持通过编辑文字来剪辑音视频内容。提供文字编辑、视频剪辑、创作辅助等服务。具备文字编辑、剪辑创新、创作便捷等特色功能，适合视频编辑使用。',
    website_url: 'https://descript.com',
    tags: ['文字编辑', '视频剪辑', '编辑创新', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '曦灵数字人',
    tagline: '百度推出的AI数字人和视频创作平台',
    description: '曦灵数字人是百度推出的AI数字人和视频创作平台。提供数字人创作、百度技术、创作辅助等服务。具备百度技术、数字人专业、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://xiling.baidu.com',
    tags: ['百度出品', '数字人创作', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '开拍',
    tagline: '美图推出的AI口播视频制作工具',
    description: '开拍是美图推出的AI口播视频制作工具。提供口播视频、美图技术、创作辅助等服务。具备美图技术、口播专业、创作便捷等特色功能，适合口播视频使用。',
    website_url: 'https://kaipai.meitu.com',
    tags: ['美图出品', '口播视频', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Duix',
    tagline: '硅基智能推出的AI数字人生成平台',
    description: 'Duix是硅基智能推出的AI数字人生成平台。提供数字人生成、硅基技术、创作辅助等服务。具备硅基技术、数字人专业、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://duix.siliconbrain.com',
    tags: ['硅基智能', '数字人生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '场辞',
    tagline: '新片场推出的AI视频字幕制作工具',
    description: '场辞是新片场推出的AI视频字幕制作工具。提供字幕制作、新片场技术、创作辅助等服务。具备新片场技术、字幕专业、创作便捷等特色功能，适合字幕制作使用。',
    website_url: 'https://changci.xinpianchang.com',
    tags: ['新片场', '字幕制作', '创作便捷', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: '一起剪',
    tagline: 'AI短视频创作平台，图文一键成片',
    description: '一起剪是AI短视频创作平台，图文一键成片。提供短视频创作、图文成片、创作辅助等服务。具备图文成片、创作便捷、效果优秀等特色功能，适合短视频创作使用。',
    website_url: 'https://yiqijian.com',
    tags: ['短视频创作', '图文成片', '创作便捷', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Spikes Studio',
    tagline: 'AI自动将长视频切片剪辑为短视频',
    description: 'Spikes Studio是AI自动将长视频切片剪辑为短视频的工具。提供视频切片、自动剪辑、创作辅助等服务。具备自动切片、剪辑专业、创作便捷等特色功能，适合视频剪辑使用。',
    website_url: 'https://spikes.studio',
    tags: ['自动切片', '视频剪辑', '剪辑专业', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Google Vids',
    tagline: '谷歌推出的AI视频创作工具',
    description: 'Google Vids是谷歌推出的AI视频创作工具。提供视频创作、谷歌技术、创作辅助等服务。具备谷歌技术、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://vids.google.com',
    tags: ['谷歌出品', '视频创作', '技术先进', '创作便捷'],
    pricing_type: 'free'
  },
  {
    name: 'DomoAI',
    tagline: '一站式AI视频与动画创作平台',
    description: 'DomoAI是一站式AI视频与动画创作平台。提供视频创作、动画制作、创作辅助等服务。具备一站式服务、视频动画、创作专业等特色功能，适合综合创作使用。',
    website_url: 'https://domoai.ai',
    tags: ['一站式平台', '视频动画', '创作专业', '综合创作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Gatekeep',
    tagline: 'AI教学视频生成工具，可生成数学物理问题解释视频',
    description: 'Gatekeep是AI教学视频生成工具，可生成数学物理问题解释视频。提供教学视频、教育应用、创作辅助等服务。具备教育专业、教学视频、创作便捷等特色功能，适合教育视频使用。',
    website_url: 'https://gatekeep.ai',
    tags: ['教学视频', '教育应用', '创作便捷', '教育专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Morph Studio',
    tagline: '高质量的AI文本到视频生成工具',
    description: 'Morph Studio是高质量的AI文本到视频生成工具。提供文本转视频、高质量生成、创作辅助等服务。具备高质量输出、文本转视频、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://morph.studio',
    tags: ['高质量生成', '文本转视频', '创作便捷', '质量优秀'],
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

async function insertVideoTools() {
  console.log('开始检查并插入AI视频工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of videoTools) {
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
          category: 'video',
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
    
    console.log(`\n🎉 AI视频工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${videoTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertVideoTools()
