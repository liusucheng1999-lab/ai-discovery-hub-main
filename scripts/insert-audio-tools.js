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

// AI音频工具数据
const audioTools = [
  {
    name: '魔音工坊',
    tagline: 'AI配音工具，轻松配出媲美真人的声音',
    description: '魔音工坊是专业的AI配音工具，能够轻松生成媲美真人的声音效果。提供文本转语音、声音定制、情感表达等服务。具备声音自然、情感丰富、多场景适用等特色功能，适合视频配音、有声读物、广告制作等使用。',
    website_url: 'https://moyingongfang.com',
    tags: ['AI配音', '声音自然', '情感表达', '视频配音'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞智作',
    tagline: 'AI文本配音工具，数字人课程、营销视频制作',
    description: '讯飞智作是科大讯飞推出的AI文本配音工具，专注于数字人课程和营销视频制作。提供文本配音、数字人配音、营销视频等服务。具备讯飞技术、专业配音、营销应用等特色功能，适合教育和营销场景使用。',
    website_url: 'https://zhizuo.xunfei.cn',
    tags: ['科大讯飞', '数字人配音', '营销视频', '专业配音'],
    pricing_type: 'freemium'
  },
  {
    name: 'Suno',
    tagline: '高质量的AI音乐创作平台',
    description: 'Suno是全球知名的高质量AI音乐创作平台。提供音乐创作、歌词生成、歌曲制作等服务。具备高质量输出、创作简单、音乐专业等特色功能，适合音乐创作和爱好者使用。',
    website_url: 'https://suno.ai',
    tags: ['国际知名', '音乐创作', '高质量输出', '创作简单'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞译制',
    tagline: '科大讯飞推出的AI音视频本地化平台',
    description: '讯飞译制是科大讯飞推出的AI音视频本地化平台。提供音视频翻译、本地化处理、多语言支持等服务。具备讯飞技术、多语言支持、专业本地化等特色功能，适合国际化内容制作使用。',
    website_url: 'https://yizhi.xunfei.cn',
    tags: ['科大讯飞', '音视频翻译', '本地化平台', '多语言支持'],
    pricing_type: 'paid'
  },
  {
    name: '海绵音乐',
    tagline: '字节跳动推出的免费AI音乐创作和发现平台',
    description: '海绵音乐是字节跳动推出的免费AI音乐创作和发现平台。提供音乐创作、作品发现、灵感激发等服务。具备字节技术、免费使用、创作发现等特色功能，适合音乐创作者使用。',
    website_url: 'https://haimian.music.bytedance.com',
    tags: ['字节跳动', '免费创作', '音乐发现', '灵感激发'],
    pricing_type: 'free'
  },
  {
    name: 'Keevx声音克隆',
    tagline: 'Keevx推出的AI声音克隆工具',
    description: 'Keevx声音克隆是专业的AI声音克隆工具。提供声音克隆、语音合成、个性化定制等服务。具备克隆精准、音质清晰、个性化强等特色功能，适合个性化语音需求使用。',
    website_url: 'https://keevx.com',
    tags: ['声音克隆', '语音合成', '个性化定制', '音质清晰'],
    pricing_type: 'freemium'
  },
  {
    name: 'ElevenLabs',
    tagline: 'AI文本转语音，支持包含中文在内的29种语言',
    description: 'ElevenLabs是全球知名的AI文本转语音工具，支持包括中文在内的29种语言。提供多语言TTS、语音合成、声音定制等服务。具备多语言支持、音质优秀、技术先进等特色功能，适合国际化语音需求使用。',
    website_url: 'https://elevenlabs.io',
    tags: ['国际知名', '多语言支持', '语音合成', '音质优秀'],
    pricing_type: 'freemium'
  },
  {
    name: '琅琅配音',
    tagline: '智能文本转语音工具',
    description: '琅琅配音是智能的文本转语音工具。提供文本配音、语音合成、声音定制等服务。具备智能配音、音质清晰、使用便捷等特色功能，适合日常配音需求使用。',
    website_url: 'https://langlangpeiyin.com',
    tags: ['智能配音', '文本转语音', '音质清晰', '使用便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '千音漫语',
    tagline: 'AI声音创作助手，支持声音克隆',
    description: '千音漫语是AI声音创作助手，支持声音克隆功能。提供声音创作、克隆服务、语音合成等服务。具备声音创作、克隆技术、语音合成等特色功能，适合声音创作使用。',
    website_url: 'https://qianyinmanyu.com',
    tags: ['声音创作', '声音克隆', '语音合成', '创作助手'],
    pricing_type: 'freemium'
  },
  {
    name: 'Noiz AI',
    tagline: 'AI配音工具，支持文本转语音和声音克隆',
    description: 'Noiz AI是专业的AI配音工具，支持文本转语音和声音克隆。提供配音服务、声音克隆、语音合成等服务。具备配音专业、克隆精准、音质优秀等特色功能，适合专业配音需求使用。',
    website_url: 'https://noiz.ai',
    tags: ['AI配音', '声音克隆', '文本转语音', '音质优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'MiniMax Audio',
    tagline: 'MiniMax推出的AI语音合成工具，支持声音克隆',
    description: 'MiniMax Audio是MiniMax推出的AI语音合成工具，支持声音克隆功能。提供语音合成、声音克隆、音频制作等服务。具备MiniMax技术、语音专业、克隆精准等特色功能。',
    website_url: 'https://audio.minimax.ai',
    tags: ['MiniMax出品', '语音合成', '声音克隆', '音频制作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tunee',
    tagline: '首个对话式音乐创作AI智能体',
    description: 'Tunee是首个对话式音乐创作AI智能体。提供对话创作、音乐生成、智能交互等服务。具备对话式创作、智能交互、音乐专业等特色功能，适合音乐创作使用。',
    website_url: 'https://tunee.ai',
    tags: ['对话式创作', '音乐智能体', '智能交互', '音乐专业'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞听见',
    tagline: '科大讯飞推出的在线AI语音转文字工具',
    description: '讯飞听见是科大讯飞推出的在线AI语音转文字工具。提供语音转文字、音频转录、文字编辑等服务。具备讯飞技术、转写准确、在线便捷等特色功能，适合语音转录使用。',
    website_url: 'https://jianchu.xunfei.cn',
    tags: ['科大讯飞', '语音转文字', '音频转录', '转写准确'],
    pricing_type: 'freemium'
  },
  {
    name: 'NotebookLM',
    tagline: '谷歌推出的AI笔记应用，5分钟生成一段对话播客',
    description: 'NotebookLM是谷歌推出的AI笔记应用，能在5分钟内生成一段对话播客。提供笔记整理、播客生成、知识总结等服务。具备谷歌技术、快速生成、播客专业等特色功能，适合学习和知识整理使用。',
    website_url: 'https://notebooklm.google.com',
    tags: ['谷歌出品', 'AI笔记', '播客生成', '知识总结'],
    pricing_type: 'free'
  },
  {
    name: '音述AI',
    tagline: '全球首个AI音乐社区',
    description: '音述AI是全球首个AI音乐社区。提供音乐创作、社区交流、作品分享等服务。具备社区互动、AI创作、音乐分享等特色功能，适合音乐创作者和爱好者使用。',
    website_url: 'https://yinshu.ai',
    tags: ['AI音乐社区', '音乐创作', '社区互动', '作品分享'],
    pricing_type: 'freemium'
  },
  {
    name: 'Vemus未音',
    tagline: '腾讯音乐旗下首款一站式AI音乐创作工具',
    description: 'Vemus未音是腾讯音乐旗下首款一站式AI音乐创作工具。提供音乐创作、编曲制作、音频处理等服务。具备腾讯音乐技术、一站式服务、创作专业等特色功能，适合音乐创作使用。',
    website_url: 'https://vemus.tencentmusic.com',
    tags: ['腾讯音乐', '一站式创作', '音乐制作', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Nafy AI',
    tagline: '在线 AI 音乐生成器，支持扩展、替换、翻唱',
    description: 'Nafy AI是在线AI音乐生成器，支持音乐扩展、替换、翻唱功能。提供音乐生成、扩展创作、翻唱服务等功能。具备在线生成、创作灵活、翻唱专业等特色功能，适合音乐创作使用。',
    website_url: 'https://nafy.ai',
    tags: ['音乐生成', '扩展创作', '翻唱功能', '在线工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'TurboScribe',
    tagline: '专业 AI 音视频转文字工具',
    description: 'TurboScribe是专业的AI音视频转文字工具。提供音视频转文字、转录服务、文字编辑等功能。具备专业转写、音视频支持、准确高效等特色功能，适合专业转录需求使用。',
    website_url: 'https://turboscribe.ai',
    tags: ['专业转写', '音视频转文字', '准确高效', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: '多维视界',
    tagline: '一站式AI音视频智能分析平台',
    description: '多维视界是一站式AI音视频智能分析平台。提供音视频分析、智能处理、内容理解等服务。具备智能分析、多维处理、内容理解等特色功能，适合音视频分析使用。',
    website_url: 'https://duoweishijie.com',
    tags: ['音视频分析', '智能处理', '内容理解', '一站式平台'],
    pricing_type: 'freemium'
  },
  {
    name: '天谱乐',
    tagline: '唱鸭团队推出的首个多模态音乐生成大模型',
    description: '天谱乐是唱鸭团队推出的首个多模态音乐生成大模型。提供多模态音乐生成、创作辅助、智能作曲等服务。具备多模态技术、大模型驱动、创作专业等特色功能，适合音乐创作使用。',
    website_url: 'https://tiangmusic.com',
    tags: ['唱鸭团队', '多模态音乐', '大模型驱动', '智能作曲'],
    pricing_type: 'freemium'
  },
  {
    name: '音疯',
    tagline: '昆仑万维推出的AI音乐创作平台，一键生成原创歌曲',
    description: '音疯是昆仑万维推出的AI音乐创作平台，支持一键生成原创歌曲。提供音乐创作、歌曲生成、原创制作等服务。具备一键生成、原创音乐、昆仑技术等特色功能，适合音乐创作使用。',
    website_url: 'https://yinfeng.kunlun.ai',
    tags: ['昆仑万维', '一键生成', '原创歌曲', '音乐创作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Mureka',
    tagline: '昆仑万维推出的 AI 音乐商用创作平台',
    description: 'Mureka是昆仑万维推出的AI音乐商用创作平台。提供商用音乐创作、版权音乐、商业应用等服务。具备商用授权、版权保护、商业应用等特色功能，适合商业音乐使用。',
    website_url: 'https://mureka.kunlun.ai',
    tags: ['昆仑万维', '商用音乐', '版权保护', '商业应用'],
    pricing_type: 'freemium'
  },
  {
    name: '音潮',
    tagline: '全栈自研的AI音乐创作平台',
    description: '音潮是全栈自研的AI音乐创作平台。提供音乐创作、编曲制作、音频处理等服务。具备全栈自研、技术自主、创作专业等特色功能，适合音乐创作使用。',
    website_url: 'https://yinchao.ai',
    tags: ['全栈自研', '技术自主', '音乐创作', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: '音剪',
    tagline: '喜马拉雅推出的一站式AI音频创作平台',
    description: '音剪是喜马拉雅推出的一站式AI音频创作平台。提供音频创作、编辑处理、内容制作等服务。具备喜马拉雅技术、一站式服务、音频专业等特色功能，适合音频创作使用。',
    website_url: 'https://yinjian.ximalaya.com',
    tags: ['喜马拉雅', '一站式创作', '音频制作', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: '音秘',
    tagline: '百度推出的AI播客创作工具',
    description: '音秘是百度推出的AI播客创作工具。提供播客创作、音频制作、内容生成等服务。具备百度技术、播客专业、创作便捷等特色功能，适合播客创作使用。',
    website_url: 'https://yinmi.baidu.com',
    tags: ['百度出品', '播客创作', '音频制作', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'MemoAI',
    tagline: '免费的AI语音转文字工具',
    description: 'MemoAI是免费的AI语音转文字工具。提供语音转文字、音频转录、文字编辑等服务。具备免费使用、转写准确、操作便捷等特色功能，适合语音转录使用。',
    website_url: 'https://memoai.com',
    tags: ['免费工具', '语音转文字', '转写准确', '操作便捷'],
    pricing_type: 'free'
  },
  {
    name: 'Reecho睿声',
    tagline: '超拟真的中英文AI语音克隆/生成平台',
    description: 'Reecho睿声是超拟真的中英文AI语音克隆/生成平台。提供语音克隆、声音生成、中英文支持等服务。具备超拟真效果、中英文支持、克隆精准等特色功能，适合专业语音需求使用。',
    website_url: 'https://reecho.ai',
    tags: ['超拟真', '语音克隆', '中英文支持', '效果精准'],
    pricing_type: 'freemium'
  },
  {
    name: 'Udio',
    tagline: '免费的AI音乐创作工具，每月可生成1200首歌曲',
    description: 'Udio是免费的AI音乐创作工具，每月可生成1200首歌曲。提供音乐创作、歌曲生成、批量制作等服务。具备免费使用、批量生成、创作高效等特色功能，适合音乐创作使用。',
    website_url: 'https://udio.com',
    tags: ['免费创作', '批量生成', '高效创作', '音乐工具'],
    pricing_type: 'free'
  },
  {
    name: '网易天音',
    tagline: '网易推出的一站式AI音乐创作工具',
    description: '网易天音是网易推出的一站式AI音乐创作工具。提供音乐创作、编曲制作、音频处理等服务。具备网易技术、一站式服务、创作专业等特色功能，适合音乐创作使用。',
    website_url: 'https://tianyin.netease.com',
    tags: ['网易出品', '一站式创作', '音乐制作', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Lyrics Into Song AI',
    tagline: '在线AI音乐创作工具，输入歌词创建个性化歌曲',
    description: 'Lyrics Into Song AI是在线AI音乐创作工具，输入歌词即可创建个性化歌曲。提供歌词创作、歌曲生成、个性化制作等服务。具备歌词输入、个性化创作、在线工具等特色功能，适合音乐创作使用。',
    website_url: 'https://lyricsintosong.ai',
    tags: ['歌词创作', '个性化歌曲', '在线工具', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Stable Audio',
    tagline: 'Stability AI最新推出的音乐生成工具',
    description: 'Stable Audio是Stability AI最新推出的音乐生成工具。提供音乐创作、音频生成、声音合成等服务。具备Stability技术、音频专业、生成质量高等特色功能，适合音乐创作使用。',
    website_url: 'https://stability.ai/audio',
    tags: ['Stability AI', '音乐生成', '音频合成', '质量优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'TextToSpeech',
    tagline: '完全免费的AI文字转语音工具',
    description: 'TextToSpeech是完全免费的AI文字转语音工具。提供文本转语音、语音合成、声音定制等服务。具备完全免费、语音清晰、使用简单等特色功能，适合日常语音合成使用。',
    website_url: 'https://texttospeech.ai',
    tags: ['完全免费', '文本转语音', '语音清晰', '使用简单'],
    pricing_type: 'free'
  },
  {
    name: 'TTSMaker',
    tagline: '马克配音（MakVoice）推出的免费AI文字转语音工具',
    description: 'TTSMaker是马克配音（MakVoice）推出的免费AI文字转语音工具。提供文本转语音、语音合成、配音服务等功能。具备免费使用、配音专业、音质清晰等特色功能，适合配音需求使用。',
    website_url: 'https://ttsmaker.com',
    tags: ['马克配音', '免费使用', '配音专业', '音质清晰'],
    pricing_type: 'free'
  },
  {
    name: 'LOVO AI',
    tagline: '专业的AI文字转语音工具，支持500+声音和100种语言',
    description: 'LOVO AI是专业的AI文字转语音工具，支持500+声音和100种语言。提供多语言TTS、语音合成、声音定制等服务。具备声音丰富、多语言支持、专业质量等特色功能，适合专业语音需求使用。',
    website_url: 'https://lovo.ai',
    tags: ['专业TTS', '声音丰富', '多语言支持', '专业质量'],
    pricing_type: 'freemium'
  },
  {
    name: 'Uberduck',
    tagline: '开源的AI语音生成社区，5000多种不同的声音',
    description: 'Uberduck是开源的AI语音生成社区，拥有5000多种不同的声音。提供语音生成、声音克隆、社区分享等服务。具备开源免费、声音丰富、社区活跃等特色功能，适合语音创作使用。',
    website_url: 'https://uberduck.ai',
    tags: ['开源社区', '声音丰富', '语音生成', '社区分享'],
    pricing_type: 'free'
  },
  {
    name: 'Sonauto',
    tagline: '免费的AI音乐生成和歌曲创作工具',
    description: 'Sonauto是免费的AI音乐生成和歌曲创作工具。提供音乐生成、歌曲创作、编曲制作等服务。具备免费使用、创作专业、音乐质量高等特色功能，适合音乐创作使用。',
    website_url: 'https://sonauto.ai',
    tags: ['免费创作', '歌曲创作', '音乐质量高', '专业工具'],
    pricing_type: 'free'
  },
  {
    name: '天工SkyMusic',
    tagline: '昆仑万维发布的国内首个AI音乐生成大模型',
    description: '天工SkyMusic是昆仑万维发布的国内首个AI音乐生成大模型。提供音乐生成、大模型创作、智能作曲等服务。具备国内首个、大模型技术、创作专业等特色功能，适合音乐创作使用。',
    website_url: 'https://skymusic.kunlun.ai',
    tags: ['昆仑万维', '国内首个', '大模型技术', '音乐生成'],
    pricing_type: 'freemium'
  },
  {
    name: '大饼AI变声',
    tagline: '免费专业的AI变声软件，一键实时语音变声',
    description: '大饼AI变声是免费专业的AI变声软件，支持一键实时语音变声。提供实时变声、声音特效、语音处理等服务。具备免费使用、实时变声、效果专业等特色功能，适合语音娱乐使用。',
    website_url: 'https://dabianbiansheng.com',
    tags: ['免费变声', '实时变声', '声音特效', '语音娱乐'],
    pricing_type: 'free'
  },
  {
    name: 'Supertone Shift',
    tagline: 'AI驱动的实时语音变换软件',
    description: 'Supertone Shift是AI驱动的实时语音变换软件。提供实时变声、语音处理、声音特效等服务。具备AI驱动、实时处理、效果专业等特色功能，适合专业语音处理使用。',
    website_url: 'https://supertone.ai',
    tags: ['AI驱动', '实时变声', '语音处理', '效果专业'],
    pricing_type: 'paid'
  },
  {
    name: 'Producer.ai',
    tagline: 'AI生成不同风格的音乐，免费开源',
    description: 'Producer.ai是AI生成不同风格音乐的工具，免费开源。提供音乐生成、风格创作、开源服务等功能。具备免费开源、风格多样、创作灵活等特色功能，适合音乐创作使用。',
    website_url: 'https://producer.ai',
    tags: ['免费开源', '风格多样', '音乐生成', '创作灵活'],
    pricing_type: 'opensource'
  },
  {
    name: 'Adobe Podcast',
    tagline: 'Adobe推出的在线AI音频录制和编辑工具',
    description: 'Adobe Podcast是Adobe推出的在线AI音频录制和编辑工具。提供音频录制、智能编辑、后期处理等服务。具备Adobe技术、专业编辑、AI辅助等特色功能，适合音频制作使用。',
    website_url: 'https://podcast.adobe.com',
    tags: ['Adobe出品', '音频编辑', '专业录制', 'AI辅助'],
    pricing_type: 'freemium'
  },
  {
    name: '网易云音乐·X Studio',
    tagline: '网易云音乐与小冰智能联合推出的免费AI歌手音乐创作软件',
    description: '网易云音乐·X Studio是网易云音乐与小冰智能联合推出的免费AI歌手音乐创作软件。提供AI歌手、音乐创作、歌曲制作等服务。具备网易云技术、小冰智能、免费创作等特色功能，适合音乐创作使用。',
    website_url: 'https://xstudio.music.163.com',
    tags: ['网易云音乐', '小冰智能', 'AI歌手', '免费创作'],
    pricing_type: 'free'
  },
  {
    name: '刺鸟配音',
    tagline: '刺鸟科技推出的专业AI配音工具',
    description: '刺鸟配音是刺鸟科技推出的专业AI配音工具。提供专业配音、语音合成、声音定制等服务。具备专业配音、音质清晰、技术先进等特色功能，适合专业配音需求使用。',
    website_url: 'https://ciniao.ai',
    tags: ['刺鸟科技', '专业配音', '语音合成', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Wondercraft',
    tagline: 'AI音频内容生成工具，可创建播客有声书等',
    description: 'Wondercraft是AI音频内容生成工具，可创建播客、有声书等内容。提供音频生成、内容创作、播客制作等服务。具备内容生成、播客专业、创作便捷等特色功能，适合音频内容创作使用。',
    website_url: 'https://wondercraft.ai',
    tags: ['音频生成', '播客制作', '有声书', '内容创作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Fryderyk',
    tagline: 'AI音乐创作工具，集成了多种乐器声音',
    description: 'Fryderyk是AI音乐创作工具，集成了多种乐器声音。提供音乐创作、乐器合成、编曲制作等服务。具备乐器丰富、创作专业、音质优秀等特色功能，适合音乐创作使用。',
    website_url: 'https://fryderyk.ai',
    tags: ['乐器集成', '音乐创作', '编曲制作', '音质优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Voicenotes',
    tagline: 'AI驱动的语音笔记工具',
    description: 'Voicenotes是AI驱动的语音笔记工具。提供语音记录、笔记整理、智能转录等服务。具备语音记录、智能整理、笔记便捷等特色功能，适合语音笔记使用。',
    website_url: 'https://voicenotes.com',
    tags: ['语音笔记', '智能整理', '语音记录', '笔记便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'OptimizerAI',
    tagline: 'AI声音效果生成工具',
    description: 'OptimizerAI是AI声音效果生成工具。提供声音特效、音频处理、效果生成等服务。具备效果生成、音频处理、声音优化等特色功能，适合音频特效制作使用。',
    website_url: 'https://optimizer.ai',
    tags: ['声音特效', '音频处理', '效果生成', '声音优化'],
    pricing_type: 'freemium'
  },
  {
    name: 'ACE Studio',
    tagline: 'AI歌声合成工具，输入歌词与旋律即可生成宛如真人的歌声',
    description: 'ACE Studio是AI歌声合成工具，输入歌词与旋律即可生成宛如真人的歌声。提供歌声合成、音乐创作、人声生成等服务。具备歌声合成、人声逼真、创作专业等特色功能，适合音乐创作使用。',
    website_url: 'https://ace.studio',
    tags: ['歌声合成', '人声逼真', '音乐创作', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: '蓝藻AI',
    tagline: '云知声旗下的AI配音和声音克隆平台',
    description: '蓝藻AI是云知声旗下的AI配音和声音克隆平台。提供配音服务、声音克隆、语音合成等服务。具备云知声技术、配音专业、克隆精准等特色功能，适合专业配音需求使用。',
    website_url: 'https://lanzao.ai',
    tags: ['云知声', '配音专业', '声音克隆', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Deepgram',
    tagline: '快速低成本的AI语音文本互转API平台',
    description: 'Deepgram是快速低成本的AI语音文本互转API平台。提供语音转文本、文本转语音、API服务等功能。具备快速处理、低成本、API专业等特色功能，适合开发者使用。',
    website_url: 'https://deepgram.com',
    tags: ['API平台', '语音文本互转', '快速处理', '低成本'],
    pricing_type: 'freemium'
  },
  {
    name: 'Audiobox',
    tagline: 'Meta推出的免费AI语音和声音生成模型',
    description: 'Audiobox是Meta推出的免费AI语音和声音生成模型。提供语音生成、声音合成、免费服务等功能。具备Meta技术、免费使用、语音专业等特色功能，适合语音生成使用。',
    website_url: 'https://audiobox.meta.com',
    tags: ['Meta出品', '免费使用', '语音生成', '技术先进'],
    pricing_type: 'free'
  },
  {
    name: 'RESEMBLE.AI',
    tagline: 'AI人声生成工具',
    description: 'RESEMBLE.AI是专业的AI人声生成工具。提供人声生成、语音合成、声音定制等服务。具备人声专业、生成质量高、技术先进等特色功能，适合人声生成使用。',
    website_url: 'https://resemble.ai',
    tags: ['人声生成', '语音合成', '质量优秀', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'IBM Watson文字转语音',
    tagline: 'IBM Watson文字转语音',
    description: 'IBM Watson文字转语音是IBM推出的专业文字转语音服务。提供文本转语音、语音合成、企业级服务等功能。具备IBM技术、企业级、专业质量等特色功能，适合企业使用。',
    website_url: 'https://cloud.ibm.com/text-to-speech',
    tags: ['IBM出品', '企业级服务', '专业质量', '技术可靠'],
    pricing_type: 'freemium'
  },
  {
    name: 'FakeYou',
    tagline: 'Deep Fake文本转语音',
    description: 'FakeYou是Deep Fake文本转语音工具。提供文本转语音、声音克隆、语音合成等服务。具备Deep Fake技术、语音合成、效果逼真等特色功能，适合语音创作使用。',
    website_url: 'https://fakeyou.com',
    tags: ['Deep Fake', '文本转语音', '声音克隆', '效果逼真'],
    pricing_type: 'freemium'
  },
  {
    name: 'BGM猫',
    tagline: '灵动音科技推出的AI智能生成BGM音乐',
    description: 'BGM猫是灵动音科技推出的AI智能生成BGM音乐工具。提供BGM生成、背景音乐、智能创作等服务。具备BGM专业、智能生成、音乐质量高等特色功能，适合背景音乐创作使用。',
    website_url: 'https://bgmcat.com',
    tags: ['BGM生成', '背景音乐', '智能创作', '音乐质量高'],
    pricing_type: 'freemium'
  },
  {
    name: '快转字幕',
    tagline: 'AI语音视频转文字和字幕的工具',
    description: '快转字幕是AI语音视频转文字和字幕的工具。提供语音转文字、字幕生成、视频转录等服务。具备转写准确、字幕专业、高效处理等特色功能，适合视频字幕制作使用。',
    website_url: 'https://kuaizhuanzimu.com',
    tags: ['字幕生成', '语音转文字', '视频转录', '转写准确'],
    pricing_type: 'freemium'
  },
  {
    name: '悦音配音',
    tagline: 'AI智能在线配音语音合成工具',
    description: '悦音配音是AI智能在线配音语音合成工具。提供在线配音、语音合成、智能服务等功能。具备在线便捷、配音专业、智能合成等特色功能，适合在线配音使用。',
    website_url: 'https://yueyinpeiyin.com',
    tags: ['在线配音', '语音合成', '智能服务', '便捷使用'],
    pricing_type: 'freemium'
  },
  {
    name: '音虫',
    tagline: '内置AI音乐编曲的音乐制作工具',
    description: '音虫是内置AI音乐编曲的音乐制作工具。提供音乐制作、AI编曲、创作辅助等服务。具备AI编曲、制作专业、创作便捷等特色功能，适合音乐制作使用。',
    website_url: 'https://yinchong.com',
    tags: ['AI编曲', '音乐制作', '创作辅助', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Mubert',
    tagline: 'AI BGM背景音乐生成工具',
    description: 'Mubert是AI BGM背景音乐生成工具。提供背景音乐生成、BGM创作、音乐制作等服务。具备BGM专业、AI生成、音乐质量高等特色功能，适合背景音乐创作使用。',
    website_url: 'https://mubert.com',
    tags: ['BGM生成', '背景音乐', 'AI创作', '音乐质量高'],
    pricing_type: 'freemium'
  },
  {
    name: 'beatoven.ai',
    tagline: '免版税AI音乐创建平台',
    description: 'beatoven.ai是免版税AI音乐创建平台。提供音乐创作、免版税授权、商业使用等服务。具备免版税、商业授权、创作专业等特色功能，适合商业音乐使用。',
    website_url: 'https://beatoven.ai',
    tags: ['免版税', '商业授权', '音乐创作', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'BeatBot',
    tagline: '输入文本提示快速生成歌曲和音乐',
    description: 'BeatBot是输入文本提示快速生成歌曲和音乐的工具。提供文本生成音乐、快速创作、智能作曲等服务。具备文本提示、快速生成、创作便捷等特色功能，适合音乐创作使用。',
    website_url: 'https://beatbot.ai',
    tags: ['文本生成音乐', '快速创作', '智能作曲', '创作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Audo Studio',
    tagline: 'AI音频清洗工具（噪音消除、声音平衡、音量调节）',
    description: 'Audo Studio是AI音频清洗工具，支持噪音消除、声音平衡、音量调节。提供音频清洗、噪音处理、音频优化等服务。具备噪音消除、音频优化、专业处理等特色功能，适合音频处理使用。',
    website_url: 'https://audo.studio',
    tags: ['音频清洗', '噪音消除', '音频优化', '专业处理'],
    pricing_type: 'freemium'
  },
  {
    name: 'NaturalReader',
    tagline: 'AI文本转语音工具',
    description: 'NaturalReader是AI文本转语音工具。提供文本转语音、语音合成、多语言支持等功能。具备语音清晰、多语言、使用便捷等特色功能，适合文本转语音使用。',
    website_url: 'https://naturalreaders.com',
    tags: ['文本转语音', '语音合成', '多语言支持', '语音清晰'],
    pricing_type: 'freemium'
  },
  {
    name: 'AssemblyAI',
    tagline: '转录和理解语音的AI模型',
    description: 'AssemblyAI是转录和理解语音的AI模型。提供语音转录、语音理解、智能分析等服务。具备转录准确、智能理解、分析专业等特色功能，适合语音处理使用。',
    website_url: 'https://assemblyai.com',
    tags: ['语音转录', '语音理解', '智能分析', '转录准确'],
    pricing_type: 'freemium'
  },
  {
    name: 'LALAL.AI',
    tagline: 'AI人声乐器分离和提取',
    description: 'LALAL.AI是AI人声乐器分离和提取工具。提供人声分离、乐器提取、音频处理等服务。具备分离精准、提取专业、音频处理等特色功能，适合音频处理使用。',
    website_url: 'https://lalal.ai',
    tags: ['人声分离', '乐器提取', '音频处理', '分离精准'],
    pricing_type: 'freemium'
  },
  {
    name: 'Krisp',
    tagline: 'AI噪音消除工具',
    description: 'Krisp是AI噪音消除工具。提供噪音消除、音频清理、声音优化等服务。具备噪音消除、音频优化、效果专业等特色功能，适合音频清理使用。',
    website_url: 'https://krisp.ai',
    tags: ['噪音消除', '音频清理', '声音优化', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Play.ht',
    tagline: '超真实在线AI语音生成',
    description: 'Play.ht是超真实在线AI语音生成工具。提供语音生成、声音合成、超真实效果等服务。具备超真实效果、语音清晰、生成专业等特色功能，适合专业语音生成使用。',
    website_url: 'https://play.ht',
    tags: ['超真实语音', '语音生成', '声音合成', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Murf AI',
    tagline: 'AI文本转语音生成工具',
    description: 'Murf AI是AI文本转语音生成工具。提供文本转语音、语音合成、声音定制等服务。具备语音生成、合成专业、音质清晰等特色功能，适合语音生成使用。',
    website_url: 'https://murf.ai',
    tags: ['文本转语音', '语音合成', '声音定制', '音质清晰'],
    pricing_type: 'freemium'
  },
  {
    name: 'Lemonaid',
    tagline: 'AI音乐生成工具',
    description: 'Lemonaid是AI音乐生成工具。提供音乐创作、歌曲生成、编曲制作等服务。具备音乐生成、创作专业、音质优秀等特色功能，适合音乐创作使用。',
    website_url: 'https://lemonaid.ai',
    tags: ['音乐生成', '歌曲创作', '编曲制作', '音质优秀'],
    pricing_type: 'freemium'
  },
  {
    name: 'Soundraw',
    tagline: 'AI音乐生成工具',
    description: 'Soundraw是AI音乐生成工具。提供音乐创作、歌曲生成、编曲制作等服务。具备音乐生成、创作专业、定制灵活等特色功能，适合音乐创作使用。',
    website_url: 'https://soundraw.com',
    tags: ['音乐生成', '歌曲创作', '编曲制作', '定制灵活'],
    pricing_type: 'freemium'
  },
  {
    name: 'Boomy',
    tagline: 'AI快速生成原创音乐的平台',
    description: 'Boomy是AI快速生成原创音乐的平台。提供音乐创作、原创生成、快速制作等服务。具备快速生成、原创音乐、创作便捷等特色功能，适合音乐创作使用。',
    website_url: 'https://boomy.com',
    tags: ['快速生成', '原创音乐', '创作便捷', '音乐平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'Typecast',
    tagline: '在线AI文字转语音生成工具',
    description: 'Typecast是在线AI文字转语音生成工具。提供文本转语音、语音合成、在线服务等功能。具备在线便捷、语音合成、生成专业等特色功能，适合在线语音生成使用。',
    website_url: 'https://typecast.ai',
    tags: ['在线语音', '文本转语音', '语音合成', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Veed AI Voice Generator',
    tagline: 'Veed推出的AI语音生成器',
    description: 'Veed AI Voice Generator是Veed推出的AI语音生成器。提供语音生成、声音合成、视频配音等服务。具备Veed技术、语音专业、视频集成等特色功能，适合视频配音使用。',
    website_url: 'https://veed.io/voice-generator',
    tags: ['Veed出品', '语音生成', '视频配音', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Clipchamp AI旁白生成器',
    tagline: 'Clipchamp的文字转语音生成器',
    description: 'Clipchamp AI旁白生成器是Clipchamp的文字转语音生成器。提供旁白生成、语音合成、视频配音等服务。具备Clipchamp技术、旁白专业、视频集成等特色功能，适合视频旁白使用。',
    website_url: 'https://clipchamp.com/voice-generator',
    tags: ['Clipchamp出品', '旁白生成', '视频配音', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'MetaVoice',
    tagline: 'AI实时变声工具',
    description: 'MetaVoice是AI实时变声工具。提供实时变声、声音特效、语音处理等服务。具备实时变声、效果专业、处理便捷等特色功能，适合语音娱乐使用。',
    website_url: 'https://metavoice.ai',
    tags: ['实时变声', '声音特效', '语音处理', '娱乐工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Speechify',
    tagline: '超5000万人都在用的文字转语音朗读器',
    description: 'Speechify是超5000万人都在用的文字转语音朗读器。提供文本转语音、语音朗读、多语言支持等功能。具备用户众多、语音清晰、使用便捷等特色功能，适合日常朗读使用。',
    website_url: 'https://speechify.com',
    tags: ['用户众多', '文本转语音', '语音朗读', '使用便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Voicemaker',
    tagline: 'AI文本到语音生成工具',
    description: 'Voicemaker是AI文本到语音生成工具。提供文本转语音、语音合成、声音定制等服务。具备语音生成、合成专业、音质清晰等特色功能，适合语音生成使用。',
    website_url: 'https://voicemaker.in',
    tags: ['文本转语音', '语音合成', '声音定制', '音质清晰'],
    pricing_type: 'freemium'
  },
  {
    name: 'Voice.ai',
    tagline: '实时AI变声工具',
    description: 'Voice.ai是实时AI变声工具。提供实时变声、声音特效、语音处理等服务。具备实时变声、效果专业、处理便捷等特色功能，适合语音娱乐使用。',
    website_url: 'https://voice.ai',
    tags: ['实时变声', '声音特效', '语音处理', '娱乐工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Listnr',
    tagline: 'AI文本到语音生成器',
    description: 'Listnr是AI文本到语音生成器。提供文本转语音、语音合成、多语言支持等功能。具备语音生成、合成专业、多语言等特色功能，适合语音生成使用。',
    website_url: 'https://listnr.tech',
    tags: ['文本转语音', '语音合成', '多语言支持', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Voicemod',
    tagline: 'AI变声工具',
    description: 'Voicemod是AI变声工具。提供实时变声、声音特效、语音处理等服务。具备变声专业、效果丰富、使用便捷等特色功能，适合语音娱乐使用。',
    website_url: 'https://voicemod.net',
    tags: ['AI变声', '声音特效', '语音处理', '效果丰富'],
    pricing_type: 'freemium'
  },
  {
    name: 'WellSaid',
    tagline: 'AI文本转语音工具',
    description: 'WellSaid是AI文本转语音工具。提供文本转语音、语音合成、专业质量等服务。具备语音专业、音质清晰、质量优秀等特色功能，适合专业语音需求使用。',
    website_url: 'https://wellsaidlabs.com',
    tags: ['文本转语音', '语音合成', '专业质量', '音质清晰'],
    pricing_type: 'paid'
  },
  {
    name: 'Notta',
    tagline: 'AI在线将语音转换成文字',
    description: 'Notta是AI在线将语音转换成文字的工具。提供语音转文字、在线转录、文字编辑等服务。具备在线便捷、转写准确、编辑专业等特色功能，适合语音转录使用。',
    website_url: 'https://notta.ai',
    tags: ['语音转文字', '在线转录', '转写准确', '编辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: '听脑AI',
    tagline: 'AI语音录音记录助手',
    description: '听脑AI是AI语音录音记录助手。提供语音记录、录音整理、智能转录等服务。具备录音专业、整理便捷、智能转录等特色功能，适合语音记录使用。',
    website_url: 'https://tingnao.ai',
    tags: ['语音记录', '录音整理', '智能转录', '记录专业'],
    pricing_type: 'freemium'
  },
  {
    name: '简单听记',
    tagline: '百度网盘推出的AI语音转文字工具',
    description: '简单听记是百度网盘推出的AI语音转文字工具。提供语音转文字、网盘集成、转录服务等功能。具备百度网盘、转写准确、集成便捷等特色功能，适合网盘用户使用。',
    website_url: 'https://jiandan.baidupan.com',
    tags: ['百度网盘', '语音转文字', '转写准确', '集成便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '通义听悟',
    tagline: '阿里推出的AI会议转录工具，万语千言，心领神会',
    description: '通义听悟是阿里推出的AI会议转录工具，支持万语千言，心领神会。提供会议转录、多语言支持、智能整理等服务。具备阿里技术、会议专业、多语言等特色功能，适合会议转录使用。',
    website_url: 'https://tingwu.aliyun.com',
    tags: ['阿里出品', '会议转录', '多语言支持', '智能整理'],
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

async function insertAudioTools() {
  console.log('开始检查并插入AI音频工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of audioTools) {
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
          category: 'audio',
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
    
    console.log(`\n🎉 AI音频工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${audioTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertAudioTools()
