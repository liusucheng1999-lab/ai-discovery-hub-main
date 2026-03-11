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

// 额外的AI视频工具数据
const additionalVideoTools = [
  {
    name: 'Haiper',
    tagline: 'AI视频生成和重绘工具，支持文本/图像转视频',
    description: 'Haiper是专业的AI视频生成和重绘工具，支持文本和图像转视频。提供视频生成、图像转视频、重绘编辑等服务。具备多模态生成、重绘专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://haiper.ai',
    tags: ['视频生成', '图像转视频', '重绘工具', '多模态生成'],
    pricing_type: 'freemium'
  },
  {
    name: 'Showrunner',
    tagline: 'AI动画视频剧集生成工具',
    description: 'Showrunner是专业的AI动画视频剧集生成工具。提供动画剧集、视频创作、专业制作等服务。具备动画专业、剧集创作、质量优秀等特色功能，适合动画创作使用。',
    website_url: 'https://showrunner.ai',
    tags: ['动画剧集', '视频创作', '专业制作', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: '即构数智人',
    tagline: '即构科技推出的AI数字人创作平台',
    description: '即构数智人是即构科技推出的AI数字人创作平台。提供数字人创作、即构技术、专业服务等功能。具备即构技术、数字人专业、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://shuzhiren.zego.com',
    tags: ['即构科技', '数字人创作', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '快剪辑',
    tagline: '360旗下的AI视频剪辑工具，AI成片、AI数字人、智能添加字幕、去水印等',
    description: '快剪辑是360旗下的AI视频剪辑工具，支持AI成片、AI数字人、智能添加字幕、去水印等功能。提供视频剪辑、360技术、多功能服务等功能。具备360技术、剪辑专业、功能全面等特色功能，适合视频剪辑使用。',
    website_url: 'https://kuaijianjiu.360.com',
    tags: ['360出品', '视频剪辑', 'AI成片', '多功能'],
    pricing_type: 'freemium'
  },
  {
    name: '闪剪',
    tagline: 'AI数字人短视频创作工具',
    description: '闪剪是AI数字人短视频创作工具。提供数字人视频、短视频创作、专业服务等功能。具备数字人专业、短视频创作、创作便捷等特色功能，适合短视频创作使用。',
    website_url: 'https://shanjian.ai',
    tags: ['数字人视频', '短视频创作', '创作便捷', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Wonder Studio',
    tagline: 'AI自动为CG角色制作动画、打光并将其合成到真人场景中',
    description: 'Wonder Studio是专业的AI CG角色动画制作工具，自动为CG角色制作动画、打光并合成到真人场景中。提供CG动画、场景合成、专业制作等服务。具备CG专业、场景合成、动画优秀等特色功能，适合专业CG制作使用。',
    website_url: 'https://wonderstudio.ai',
    tags: ['CG动画', '场景合成', '专业制作', '动画优秀'],
    pricing_type: 'paid'
  },
  {
    name: 'Magicam',
    tagline: '实时的AI直播/视频换脸工具',
    description: 'Magicam是实时的AI直播/视频换脸工具。提供实时换脸、直播支持、视频处理等服务。具备实时换脸、直播专业、效果自然等特色功能，适合直播和视频换脸使用。',
    website_url: 'https://magicam.ai',
    tags: ['实时换脸', '直播工具', '视频处理', '效果自然'],
    pricing_type: 'freemium'
  },
  {
    name: 'LTX Studio',
    tagline: 'AI电影制作和视频短片生成平台',
    description: 'LTX Studio是AI电影制作和视频短片生成平台。提供电影制作、短片生成、专业服务等功能。具备电影专业、短片创作、质量优秀等特色功能，适合电影制作使用。',
    website_url: 'https://ltxstudio.ai',
    tags: ['电影制作', '短片生成', '专业服务', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Clipfly',
    tagline: '一站式AI长视频制作和编辑平台',
    description: 'Clipfly是一站式AI长视频制作和编辑平台。提供长视频制作、编辑服务、专业工具等功能。具备一站式服务、长视频专业、编辑便捷等特色功能，适合长视频制作使用。',
    website_url: 'https://clipfly.ai',
    tags: ['一站式平台', '长视频制作', '编辑服务', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Captions',
    tagline: 'AI驱动的视频剪辑和制作平台',
    description: 'Captions是AI驱动的视频剪辑和制作平台。提供视频剪辑、AI驱动、制作服务等功能。具备AI驱动、剪辑专业、制作便捷等特色功能，适合视频制作使用。',
    website_url: 'https://captions.ai',
    tags: ['AI驱动', '视频剪辑', '制作服务', '剪辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Capsule',
    tagline: 'AI驱动的在线视频剪辑工具，个人和小团队免费',
    description: 'Capsule是AI驱动的在线视频剪辑工具，个人和小团队免费。提供视频剪辑、在线服务、免费使用等功能。具备AI驱动、在线剪辑、免费使用等特色功能，适合个人和小团队使用。',
    website_url: 'https://capsule.video',
    tags: ['AI驱动', '在线剪辑', '免费使用', '小团队友好'],
    pricing_type: 'free'
  },
  {
    name: 'GoEnhance',
    tagline: 'AI视频风格转换和画质增强工具',
    description: 'GoEnhance是AI视频风格转换和画质增强工具。提供风格转换、画质增强、视频处理等服务。具备风格专业、画质优秀、处理便捷等特色功能，适合视频处理使用。',
    website_url: 'https://goenhance.ai',
    tags: ['风格转换', '画质增强', '视频处理', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'InVideo AI',
    tagline: '人工智能视频创作和剪辑工具',
    description: 'InVideo AI是人工智能视频创作和剪辑工具。提供视频创作、AI剪辑、专业服务等功能。具备AI创作、剪辑专业、服务全面等特色功能，适合视频创作使用。',
    website_url: 'https://invideo.io',
    tags: ['AI创作', '视频剪辑', '专业服务', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Unscreen',
    tagline: 'AI智能视频背景移除工具',
    description: 'Unscreen是AI智能视频背景移除工具。提供背景移除、智能处理、专业服务等功能。具备移除专业、智能处理、效果优秀等特色功能，适合背景移除使用。',
    website_url: 'https://unscreen.com',
    tags: ['背景移除', '智能处理', '效果优秀', '移除专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'EbSynth',
    tagline: 'AI将真人视频转化为油画风动画',
    description: 'EbSynth是AI将真人视频转化为油画风动画的工具。提供风格转换、油画动画、视频处理等服务。具备风格专业、油画效果、转换便捷等特色功能，适合风格转换使用。',
    website_url: 'https://ebsynth.com',
    tags: ['风格转换', '油画动画', '视频处理', '效果独特'],
    pricing_type: 'freemium'
  },
  {
    name: 'Artflow',
    tagline: 'AI创建生成视频动画',
    description: 'Artflow是AI创建生成视频动画的工具。提供动画生成、AI创作、专业服务等功能。具备AI创作、动画专业、生成便捷等特色功能，适合动画创作使用。',
    website_url: 'https://artflow.ai',
    tags: ['AI创作', '动画生成', '专业服务', '生成便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Kaiber',
    tagline: '图片文字转视频的AI引擎',
    description: 'Kaiber是图片文字转视频的AI引擎。提供图片转视频、文字转视频、AI引擎等服务。具备多模态转换、AI引擎、生成专业等特色功能，适合视频生成使用。',
    website_url: 'https://kaiber.ai',
    tags: ['图片转视频', '文字转视频', 'AI引擎', '多模态转换'],
    pricing_type: 'freemium'
  },
  {
    name: 'Typeframes',
    tagline: 'AI快速生成高质量的产品介绍视频',
    description: 'Typeframes是AI快速生成高质量产品介绍视频的工具。提供产品视频、快速生成、高质量输出等服务。具备产品专业、生成快速、质量优秀等特色功能，适合产品视频使用。',
    website_url: 'https://typeframes.com',
    tags: ['产品视频', '快速生成', '高质量输出', '产品专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'DreamFace',
    tagline: 'AI内容生成平台，一键创作AI视频、AI图像',
    description: 'DreamFace是AI内容生成平台，一键创作AI视频、AI图像。提供内容生成、一键创作、多媒体服务等功能。具备一键创作、内容专业、多媒体支持等特色功能，适合内容创作使用。',
    website_url: 'https://dreamface.ai',
    tags: ['内容生成', '一键创作', '多媒体支持', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Mootion',
    tagline: 'AI视频内容创作平台，覆盖全流程',
    description: 'Mootion是AI视频内容创作平台，覆盖全流程。提供全流程创作、AI支持、专业服务等功能。具备全流程覆盖、创作专业、AI支持等特色功能，适合专业视频创作使用。',
    website_url: 'https://mootion.ai',
    tags: ['全流程创作', 'AI支持', '专业服务', '创作覆盖'],
    pricing_type: 'freemium'
  },
  {
    name: 'PixVerse',
    tagline: '爱诗科技推出的AI视频生成工具',
    description: 'PixVerse是爱诗科技推出的AI视频生成工具。提供视频生成、爱诗技术、创作辅助等服务。具备爱诗技术、视频专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://pixverse.ai',
    tags: ['爱诗科技', '视频生成', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '来画',
    tagline: 'AI漫剧全网内测 创作不再受限',
    description: '来画是AI漫剧创作工具，全网内测中，创作不再受限。提供漫剧创作、AI技术、创作自由等服务。具备漫剧专业、创作自由、AI支持等特色功能，适合漫剧创作使用。',
    website_url: 'https://laihua.com',
    tags: ['漫剧创作', 'AI技术', '创作自由', '全网内测'],
    pricing_type: 'freemium'
  },
  {
    name: '奇妙元',
    tagline: 'AI数字人视频生成平台，由出门问问推出',
    description: '奇妙元是出门问问推出的AI数字人视频生成平台。提供数字人视频、出门问问技术、创作辅助等服务。具备出门问问技术、数字人专业、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://qimiaoyuan.com',
    tags: ['出门问问', '数字人视频', '创作便捷', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '绘影字幕',
    tagline: '一键智能在线自动为视频加字幕',
    description: '绘影字幕是一键智能在线自动为视频加字幕的工具。提供字幕添加、智能处理、在线服务等功能。具备一键添加、智能字幕、在线便捷等特色功能，适合字幕制作使用。',
    website_url: 'https://huiying.zimu.com',
    tags: ['字幕添加', '智能处理', '在线服务', '一键便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Fliki',
    tagline: 'AI文字转视频并配音',
    description: 'Fliki是AI文字转视频并配音的工具。提供文字转视频、AI配音、创作辅助等服务。具备文字转视频、配音专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://fliki.ai',
    tags: ['文字转视频', 'AI配音', '创作便捷', '配音专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Anylang.ai',
    tagline: 'AI视频翻译并保持音色和口型的同步',
    description: 'Anylang.ai是AI视频翻译工具，保持音色和口型的同步。提供视频翻译、音色保持、口型同步等服务。具备翻译专业、音色保持、口型同步等特色功能，适合视频翻译使用。',
    website_url: 'https://anylang.ai',
    tags: ['视频翻译', '音色保持', '口型同步', '翻译专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'DeepBrain',
    tagline: 'AI口播视频生成工具',
    description: 'DeepBrain是AI口播视频生成工具。提供口播视频、AI生成、专业服务等功能。具备口播专业、AI生成、创作便捷等特色功能，适合口播视频使用。',
    website_url: 'https://deepbrain.ai',
    tags: ['口播视频', 'AI生成', '创作便捷', '口播专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Synthesia',
    tagline: 'AI视频生成平台',
    description: 'Synthesia是知名的AI视频生成平台。提供视频生成、AI技术、专业服务等功能。具备国际知名、生成专业、技术先进等特色功能，适合视频创作使用。',
    website_url: 'https://synthesia.io',
    tags: ['国际知名', '视频生成', '技术先进', '生成专业'],
    pricing_type: 'paid'
  },
  {
    name: 'Lumen5',
    tagline: 'AI将博客文章转换成视频',
    description: 'Lumen5是AI将博客文章转换成视频的工具。提供文章转视频、AI转换、创作辅助等服务。具备文章转换、AI技术、创作便捷等特色功能，适合内容转换使用。',
    website_url: 'https://lumen5.com',
    tags: ['文章转视频', 'AI转换', '创作便捷', '内容转换'],
    pricing_type: 'freemium'
  },
  {
    name: 'Rephrase.ai',
    tagline: 'AI文字到视频生成',
    description: 'Rephrase.ai是AI文字到视频生成工具。提供文字转视频、AI生成、创作辅助等服务。具备文字转视频、生成专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://rephrase.ai',
    tags: ['文字转视频', 'AI生成', '创作便捷', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: '万彩微影',
    tagline: 'AI智能自动生成动画短视频',
    description: '万彩微影是AI智能自动生成动画短视频的工具。提供动画短视频、AI生成、智能创作等服务。具备动画专业、智能生成、创作便捷等特色功能，适合动画创作使用。',
    website_url: 'https://wancaiweiying.com',
    tags: ['动画短视频', 'AI生成', '智能创作', '动画专业'],
    pricing_type: 'freemium'
  },
  {
    name: '录咖',
    tagline: '一站式AI音视频总结和转录处理工具',
    description: '录咖是一站式AI音视频总结和转录处理工具。提供音视频处理、转录服务、总结功能等服务。具备一站式服务、转录专业、总结智能等特色功能，适合音视频处理使用。',
    website_url: 'https://luka.ai',
    tags: ['一站式服务', '音视频处理', '转录专业', '总结智能'],
    pricing_type: 'freemium'
  },
  {
    name: '怪兽AI数字人',
    tagline: '人工智能数字人短视频创作和直播平台',
    description: '怪兽AI数字人是人工智能数字人短视频创作和直播平台。提供数字人视频、直播平台、AI创作等服务。具备数字人专业、直播支持、创作便捷等特色功能，适合数字人创作使用。',
    website_url: 'https://guaishou.ai',
    tags: ['数字人视频', '直播平台', 'AI创作', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '团队快剪',
    tagline: '闪剪智能专为团队带货打造的AI视频工具',
    description: '团队快剪是闪剪智能专为团队带货打造的AI视频工具。提供带货视频、团队协作、AI创作等服务。具备带货专业、团队协作、创作便捷等特色功能，适合团队带货使用。',
    website_url: 'https://tuanduikuaijian.com',
    tags: ['带货视频', '团队协作', 'AI创作', '带货专业'],
    pricing_type: 'freemium'
  },
  {
    name: '鬼手剪辑GhostCut',
    tagline: '多功能AI视频二创剪辑和翻译工具',
    description: '鬼手剪辑GhostCut是多功能AI视频二创剪辑和翻译工具。提供二创剪辑、视频翻译、多功能服务等功能。具备多功能、剪辑专业、翻译便捷等特色功能，适合视频二创使用。',
    website_url: 'https://ghostcut.ai',
    tags: ['二创剪辑', '视频翻译', '多功能', '剪辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: '模力视频',
    tagline: 'AI驱动的视频编辑平台',
    description: '模力视频是AI驱动的视频编辑平台。提供视频编辑、AI驱动、创作辅助等服务。具备AI驱动、编辑专业、创作便捷等特色功能，适合视频编辑使用。',
    website_url: 'https:moli.video',
    tags: ['AI驱动', '视频编辑', '创作辅助', '编辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Gencraft',
    tagline: 'AI艺术画视频生成工具',
    description: 'Gencraft是AI艺术画视频生成工具。提供艺术视频、AI生成、创作辅助等服务。具备艺术专业、AI生成、创作便捷等特色功能，适合艺术创作使用。',
    website_url: 'https://gencraft.com',
    tags: ['艺术视频', 'AI生成', '创作辅助', '艺术专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Synthesys',
    tagline: 'AI虚拟人出镜讲解',
    description: 'Synthesys是AI虚拟人出镜讲解工具。提供虚拟人讲解、AI生成、专业服务等功能。具备虚拟人专业、讲解清晰、生成便捷等特色功能，适合讲解视频使用。',
    website_url: 'https://synthesys.io',
    tags: ['虚拟人讲解', 'AI生成', '专业服务', '讲解清晰'],
    pricing_type: 'freemium'
  },
  {
    name: 'Veed Video Background Remover',
    tagline: 'Veed推出的AI视频背景移除工具',
    description: 'Veed Video Background Remover是Veed推出的AI视频背景移除工具。提供背景移除、Veed技术、专业服务等功能。具备Veed技术、移除专业、效果优秀等特色功能，适合背景移除使用。',
    website_url: 'https://veed.io/background-remover',
    tags: ['Veed出品', '背景移除', '专业服务', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Hour One',
    tagline: '人工智能文字到视频生成',
    description: 'Hour One是人工智能文字到视频生成工具。提供文字转视频、AI生成、创作辅助等服务。具备文字转视频、生成专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://hourone.ai',
    tags: ['文字转视频', 'AI生成', '创作便捷', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'BgRem',
    tagline: '无水印AI视频背景移除',
    description: 'BgRem是无水印AI视频背景移除工具。提供背景移除、无水印处理、专业服务等功能。具备无水印、移除专业、效果优秀等特色功能，适合背景移除使用。',
    website_url: 'https://bgrem.ai',
    tags: ['无水印', '背景移除', '效果优秀', '移除专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Colourlab.ai',
    tagline: '好莱坞也在用的AI视频颜色分级工具',
    description: 'Colourlab.ai是好莱坞也在用的AI视频颜色分级工具。提供颜色分级、专业处理、好莱坞级质量等服务。具备好莱坞级、颜色专业、处理优秀等特色功能，适合专业视频处理使用。',
    website_url: 'https://colourlab.ai',
    tags: ['好莱坞级', '颜色分级', '专业处理', '质量优秀'],
    pricing_type: 'paid'
  },
  {
    name: 'Cutout.Pro',
    tagline: 'AI一键视频背景移除',
    description: 'Cutout.Pro是AI一键视频背景移除工具。提供一键移除、背景处理、专业服务等功能。具备一键操作、移除专业、效果优秀等特色功能，适合背景移除使用。',
    website_url: 'https://cutout.pro/video',
    tags: ['一键移除', '背景处理', '效果优秀', '操作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Colossyan',
    tagline: 'AI数字人视频生成平台',
    description: 'Colossyan是AI数字人视频生成平台。提供数字人视频、AI生成、专业服务等功能。具备数字人专业、生成便捷、质量优秀等特色功能，适合数字人创作使用。',
    website_url: 'https://colossyan.com',
    tags: ['数字人视频', 'AI生成', '专业服务', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'AVCLabs',
    tagline: 'AI自动移除视频背景',
    description: 'AVCLabs是AI自动移除视频背景工具。提供自动移除、背景处理、专业服务等功能。具备自动处理、移除专业、效果优秀等特色功能，适合背景移除使用。',
    website_url: 'https://avclabs.com',
    tags: ['自动移除', '背景处理', '效果优秀', '自动处理'],
    pricing_type: 'freemium'
  },
  {
    name: 'Elai.io',
    tagline: 'AI文本到视频生成工具',
    description: 'Elai.io是AI文本到视频生成工具。提供文本转视频、AI生成、创作辅助等服务。具备文本转视频、生成专业、创作便捷等特色功能，适合视频创作使用。',
    website_url: 'https://elai.io',
    tags: ['文本转视频', 'AI生成', '创作便捷', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Pictory',
    tagline: 'AI视频制作工具',
    description: 'Pictory是AI视频制作工具。提供视频制作、AI支持、创作辅助等服务。具备AI制作、创作专业、效果优秀等特色功能，适合视频制作使用。',
    website_url: 'https://pictory.ai',
    tags: ['AI制作', '视频制作', '创作辅助', '效果优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'SteveAI',
    tagline: 'Animaker旗下AI在线视频制作工具',
    description: 'SteveAI是Animaker旗下AI在线视频制作工具。提供视频制作、Animaker技术、创作辅助等服务。具备Animaker技术、制作专业、创作便捷等特色功能，适合视频制作使用。',
    website_url: 'https://steve.ai',
    tags: ['Animaker出品', '视频制作', '创作辅助', '制作专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Rask',
    tagline: 'AI视频本地化解决方案，支持超过130种语言',
    description: 'Rask是AI视频本地化解决方案，支持超过130种语言。提供视频本地化、多语言支持、专业服务等功能。具备多语言、本地化专业、支持广泛等特色功能，适合视频本地化使用。',
    website_url: 'https://rask.ai',
    tags: ['视频本地化', '多语言支持', '专业服务', '支持广泛'],
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

async function insertAdditionalVideoTools() {
  console.log('开始检查并插入额外的AI视频工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of additionalVideoTools) {
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
    
    console.log(`\n🎉 额外AI视频工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${additionalVideoTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertAdditionalVideoTools()
