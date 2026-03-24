// 批量更新应用分类脚本
// 基于应用名称和功能特征，将289个未匹配应用分类到合适的二级分类体系

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

// 应用分类映射 - 基于应用名称和功能特征
const appCategoryMapping = [
  // === 对话类应用 ===
  // 通用对话
  { name: '01Agent', main_category: 'chat', sub_category: 'chat_general' },
  { name: '爱派AiPy', main_category: 'chat', sub_category: 'chat_general' },
  { name: '遨虾', main_category: 'chat', sub_category: 'chat_general' },
  { name: '白日梦', main_category: 'chat', sub_category: 'chat_companion' },
  { name: '逗逗AI', main_category: 'chat', sub_category: 'chat_companion' },
  { name: '简单AI', main_category: 'chat', sub_category: 'chat_general' },
  { name: '椒图AI', main_category: 'chat', sub_category: 'chat_general' },
  { name: '秘塔捉捉猫', main_category: 'chat', sub_category: 'chat_companion' },
  { name: '秘塔AI搜索', main_category: 'search', sub_category: 'search_smart' },
  { name: '问小白', main_category: 'chat', sub_category: 'chat_general' },
  { name: '元气AI Bot', main_category: 'chat', sub_category: 'chat_companion' },
  { name: '如此AI员工', main_category: 'chat', sub_category: 'chat_professional' },
  { name: 'Agnes AI', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'Bobby', main_category: 'chat', sub_category: 'chat_companion' },
  { name: 'CoCo', main_category: 'chat', sub_category: 'chat_companion' },
  { name: 'Kimi智能助手', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'memU Bot', main_category: 'chat', sub_category: 'chat_companion' },
  { name: 'MyShell', main_category: 'chat', sub_category: 'chat_multimodal' },
  { name: 'NotebookLM', main_category: 'chat', sub_category: 'chat_multimodal' },
  { name: 'Opera Neon', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'RabbitOS intern', main_category: 'chat', sub_category: 'chat_multimodal' },
  { name: 'WorkAny', main_category: 'chat', sub_category: 'chat_professional' },
  { name: 'YouMind', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'YoYo', main_category: 'chat', sub_category: 'chat_companion' },

  // === 写作类应用 ===
  // 文案营销
  { name: '光速写作', main_category: 'writing', sub_category: 'writing_marketing' },
  { name: '简单听记', main_category: 'writing', sub_category: 'writing_business' },
  { name: 'WriteWise', main_category: 'writing', sub_category: 'writing_marketing' },
  { name: 'AutoGLM沉思', main_category: 'writing', sub_category: 'writing_academic' },
  { name: 'CodeBuddy', main_category: 'writing', sub_category: 'writing_business' },

  // 学术科研
  { name: '切问学术', main_category: 'writing', sub_category: 'writing_academic' },
  { name: 'SciMaster', main_category: 'writing', sub_category: 'writing_academic' },

  // 商务办公
  { name: '内容特工队', main_category: 'writing', sub_category: 'writing_business' },

  // === 图像类应用 ===
  // 绘图生成
  { name: '超能画布', main_category: 'image', sub_category: 'image_generation' },
  { name: '创客贴AI画匠', main_category: 'image', sub_category: 'image_design' },
  { name: '即梦AI', main_category: 'image', sub_category: 'image_generation' },
  { name: '神笔马良', main_category: 'image', sub_category: 'image_generation' },
  { name: '摩笔马良', main_category: 'image', sub_category: 'image_generation' },
  { name: '通义万相AI视频', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Adobe Firefly', main_category: 'image', sub_category: 'image_generation' },
  { name: 'Bing Image Creator', main_category: 'image', sub_category: 'image_generation' },
  { name: 'Canva AI图像生成', main_category: 'image', sub_category: 'image_design' },
  { name: 'Decohere', main_category: 'image', sub_category: 'image_generation' },
  { name: 'DreamFace', main_category: 'image', sub_category: 'image_generation' },
  { name: 'Gencraft', main_category: 'image', sub_category: 'image_generation' },
  { name: 'IconGen', main_category: 'image', sub_category: 'image_design' },
  { name: 'ImageScore AI - 可解释图像质量评估系统', main_category: 'image', sub_category: 'image_recognition' },
  { name: 'LensGo', main_category: 'image', sub_category: 'image_generation' },
  { name: 'Logo Diffusion', main_category: 'image', sub_category: 'image_design' },
  { name: 'Pixfun', main_category: 'image', sub_category: 'image_generation' },

  // 设计辅助
  { name: '稿定AI', main_category: 'image', sub_category: 'image_design' },
  { name: '稿定AI社区', main_category: 'image', sub_category: 'image_design' },
  { name: '绘蛙', main_category: 'image', sub_category: 'image_design' },
  { name: '绘想', main_category: 'image', sub_category: 'image_design' },

  // 图像编辑
  { name: 'BgRem', main_category: 'image', sub_category: 'image_editing' },
  { name: 'Colourlab.ai', main_category: 'image', sub_category: 'image_editing' },

  // === 视频类应用 ===
  // 视频生成
  { name: '飞影数字人', main_category: 'video', sub_category: 'video_generation' },
  { name: '绘蛙AI视频', main_category: 'video', sub_category: 'video_generation' },
  { name: '阶跃视频', main_category: 'video', sub_category: 'video_generation' },
  { name: '模力视频', main_category: 'video', sub_category: 'video_generation' },
  { name: '魔珐星云', main_category: 'video', sub_category: 'video_generation' },
  { name: '腾讯混元AI视频', main_category: 'video', sub_category: 'video_generation' },
  { name: '万兴天幕', main_category: 'video', sub_category: 'video_generation' },
  { name: '智谱清影', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Colossyan', main_category: 'video', sub_category: 'video_generation' },
  { name: 'DomoAI', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Dream Machine', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Haiper', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Hedra', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Higgsfield', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Hotshot', main_category: 'video', sub_category: 'video_generation' },
  { name: 'LTX Studio', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Mootion', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Morph Studio', main_category: 'video', sub_category: 'video_generation' },
  { name: 'PixVerse', main_category: 'video', sub_category: 'video_generation' },
  { name: 'SkyReels', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Stable Video', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Video Ocean', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Viggle', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Vimi', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Vidu', main_category: 'video', sub_category: 'video_generation' },

  // 视频剪辑
  { name: '必剪Studio', main_category: 'video', sub_category: 'video_editing' },
  { name: '蝉镜', main_category: 'video', sub_category: 'video_editing' },
  { name: '场辞', main_category: 'video', sub_category: 'video_editing' },
  { name: '鬼手剪辑GhostCut', main_category: 'video', sub_category: 'video_editing' },
  { name: '海螺视频', main_category: 'video', sub_category: 'video_editing' },
  { name: '堆友AI视频', main_category: 'video', sub_category: 'video_editing' },
  { name: '快剪辑', main_category: 'video', sub_category: 'video_editing' },
  { name: '快转字幕', main_category: 'video', sub_category: 'video_editing' },
  { name: '录咖', main_category: 'video', sub_category: 'video_editing' },
  { name: '闪剪', main_category: 'video', sub_category: 'video_editing' },
  { name: '万彩微影', main_category: 'video', sub_category: 'video_editing' },
  { name: '团队快剪', main_category: 'video', sub_category: 'video_editing' },
  { name: '一起剪', main_category: 'video', sub_category: 'video_editing' },
  { name: '音剪', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Clipchamp AI旁白生成器', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Clipfly', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Captions', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Descript', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Filmora', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Fliki', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Flow Studio', main_category: 'video', sub_category: 'video_editing' },
  { name: 'HitPaw', main_category: 'video', sub_category: 'video_editing' },
  { name: 'InVideo AI', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Kapwing', main_category: 'video', sub_category: 'video_editing' },
  { name: 'NextCut AI', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Opus Clip', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Pictory', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Showrunner', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Spikes Studio', main_category: 'video', sub_category: 'video_editing' },
  { name: 'SteveAI', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Typeframes', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Veed AI Voice Generator', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Veed Video Background Remover', main_category: 'video', sub_category: 'video_editing' },
  { name: 'Video Studio', main_category: 'video', sub_category: 'video_editing' },
  { name: 'WinkStudio', main_category: 'video', sub_category: 'video_editing' },

  // 画质修复
  { name: 'AVCLabs', main_category: 'video', sub_category: 'video_enhancement' },
  { name: 'EbSynth', main_category: 'video', sub_category: 'video_enhancement' },
  { name: 'Google Vids', main_category: 'video', sub_category: 'video_enhancement' },

  // === 音频类应用 ===
  // 语音合成
  { name: '大饼AI变声', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '花生AI', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '悦音配音', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '音潮', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '音虫', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '音疯', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '音秘', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '音述AI', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: '云幕同声', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'ACE Studio', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Audiobox', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'BGM猫', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'FakeYou', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'IBM Watson文字转语音', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'LOVO AI', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Lyrics Into Song AI', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'MetaVoice', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Murf AI', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'NaturalReader', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Play.ht', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Reecho睿声', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'RESEMBLE.AI', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Sonauto', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Speechify', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Supertone Shift', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'TextToSpeech', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'TTSMaker', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Tunee', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'TurboScribe', main_category: 'audio', sub_category: 'audio_transcription' },
  { name: 'Typecast', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Uberduck', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Vemus未音', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Voicemaker', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Voicemod', main_category: 'audio', sub_category: 'audio_synthesis' },
  { name: 'Voicenotes', main_category: 'audio', sub_category: 'audio_transcription' },
  { name: 'WellSaid', main_category: 'audio', sub_category: 'audio_synthesis' },

  // 音乐创作
  { name: '海绵音乐', main_category: 'audio', sub_category: 'audio_composition' },
  { name: '天谱乐', main_category: 'audio', sub_category: 'audio_composition' },
  { name: '听脑AI', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'A2E', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Kaiber AI', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'KreadoAI', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Listnr', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Mureka', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Noisee AI', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Noiz AI', main_category: 'audio', sub_category: 'audio_composition' },
  { name: 'Suna', main_category: 'audio', sub_category: 'audio_composition' },

  // 语音转录
  { name: '绘影字幕', main_category: 'audio', sub_category: 'audio_transcription' },
  { name: '讯飞译制', main_category: 'audio', sub_category: 'audio_transcription' },
  { name: 'Airgram', main_category: 'audio', sub_category: 'audio_transcription' },
  { name: 'MemoAI', main_category: 'audio', sub_category: 'audio_transcription' },
  { name: 'SoundView', main_category: 'audio', sub_category: 'audio_transcription' },

  // === 编程类应用 ===
  // 代码生成
  { name: 'Augment Code', main_category: 'coding', sub_category: 'coding_generation' },
  { name: 'iFlow CLI', main_category: 'coding', sub_category: 'coding_generation' },
  { name: 'Individual-task-1', main_category: 'coding', sub_category: 'coding_generation' },
  { name: 'mnist-neural-network-', main_category: 'coding', sub_category: 'coding_generation' },
  { name: 'yolo-image-identifier', main_category: 'coding', sub_category: 'coding_generation' },

  // 测试运维
  { name: 'awesome-ai-pentesting', main_category: 'coding', sub_category: 'coding_testing' },
  { name: 'Awesome-Hacking-with-AI', main_category: 'coding', sub_category: 'coding_testing' },

  // === 搜索类应用 ===
  // 智能搜索
  { name: '1btc1btc', main_category: 'search', sub_category: 'search_smart' },
  { name: '混沌Deep Innovation', main_category: 'search', sub_category: 'search_research' },

  // === 办公类应用 ===
  // 文档处理
  { name: '度加创作工具', main_category: 'office', sub_category: 'office_document' },
  { name: '即创', main_category: 'office', sub_category: 'office_presentation' },
  { name: '开拍', main_category: 'office', sub_category: 'office_presentation' },
  { name: '小墨鹰编辑器', main_category: 'office', sub_category: 'office_document' },
  { name: '寻光', main_category: 'office', sub_category: 'office_presentation' },
  { name: '亿话', main_category: 'office', sub_category: 'office_meeting' },
  { name: '月亮树AI选品', main_category: 'office', sub_category: 'office_data' },

  // 会议辅助
  { name: '有言', main_category: 'office', sub_category: 'office_presentation' },
  { name: '元镜', main_category: 'office', sub_category: 'office_presentation' },

  // === 资源类应用 ===
  // 开发平台
  { name: '磁力开创', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: '堆友AI反应堆', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: '巨日禄', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: '万能小in', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: '雾象', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: '献丑AI', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: '志设', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: 'agent-wall', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: 'ai-best-practices', main_category: 'ai_agent', sub_category: 'ai_other' },
  { name: 'amux — Agent Multiplexer', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: 'DeepCLI - Ai Agent System', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: 'MasterAgent', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: 'Menuless —  AI Agent Layer for any App', main_category: 'ai_agent', sub_category: 'ai_platform' },
  { name: 'MonkeyCode', main_category: 'ai_agent', sub_category: 'ai_platform' },

  // 插件集合
  { name: 'Alpaca', main_category: 'ai_agent', sub_category: 'ai_plugins' },

  // 其他网站
  { name: 'CRIC深度智联', main_category: 'ai_agent', sub_category: 'ai_other' },
  { name: 'MOKI', main_category: 'ai_agent', sub_category: 'ai_other' },
  { name: 'RunningHub', main_category: 'ai_agent', sub_category: 'ai_other' },
  { name: 'Seele AI', main_category: 'ai_agent', sub_category: 'ai_other' },
  { name: 'Vizard', main_category: 'ai_agent', sub_category: 'ai_other' },
  { name: 'VMagic', main_category: 'ai_agent', sub_category: 'ai_other' },
  { name: 'Zeabur', main_category: 'ai_agent', sub_category: 'ai_other' },

  // === 工具类应用 ===
  // 模型平台
  { name: '多维视界', main_category: 'tools', sub_category: 'tools_model' },
  { name: '艺映AI', main_category: 'tools', sub_category: 'tools_model' },

  // 提示工程
  { name: '秒创', main_category: 'tools', sub_category: 'tools_prompt' },

  // 开发框架
  { name: 'AnyGen', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Anylang.ai', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Artflow', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Atoms', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Bloom', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Boba', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'BreakRot - Build Focus', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'BrowserOS', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Capsule', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'CatPaw', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'CrePal', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Dia', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Duix', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Etna', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Exactly.ai', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Fairies', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Fellou', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'FinGenius', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'FleekHire – AI powered ATS for Agencies', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'FloweAI', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'FlowMuse AI', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Fryderyk', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Gatekeep', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'GoEnhance', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Jaaz', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'JoyPix', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Keevx', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'KomikoAI', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Leewow', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Lemonaid', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Magicam', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Medeo', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Mixboard', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'MochiAni', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'MuleRun', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Nafy AI', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'NeoDomain', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'OptimizerAI', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'PagePop', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Plandex', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Pollo AI', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Poly', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Rask', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'react-planora-ai', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Realibox AI', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Rephrase.ai', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'RoboNeo', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Seko', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'SekoTalk', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'SWE-Model-Arena', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Synthesys', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'TabTab', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Tago', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'TapNow', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Tavus', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Tbox', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Teamo', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Vozo', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'vivago.ai', main_category: 'tools', sub_category: 'tools_framework' },
  { name: 'Wonder Studio', main_category: 'tools', sub_category: 'tools_framework' },

  // 内容检测
  { name: '萌动AI', main_category: 'tools', sub_category: 'tools_detection' },
  { name: '千音漫语', main_category: 'tools', sub_category: 'tools_detection' },
  { name: '酷宣AI', main_category: 'tools', sub_category: 'tools_detection' },
  { name: '妙播', main_category: 'tools', sub_category: 'tools_detection' },
  { name: '造次', main_category: 'tools', sub_category: 'tools_detection' },

  // === 其他未明确分类的应用 ===
  // 这些应用名称比较模糊，需要进一步确认功能
  { name: 'AdsTurbo AI', main_category: 'writing', sub_category: 'writing_marketing' },
  { name: 'Elai.io', main_category: 'video', sub_category: 'video_generation' },
  { name: 'Humva', main_category: 'image', sub_category: 'image_generation' },
  { name: 'Hour One', main_category: 'video', sub_category: 'video_generation' },
  { name: 'OneStory', main_category: 'writing', sub_category: 'writing_marketing' },
  { name: 'Voice.ai', main_category: 'audio', sub_category: 'audio_synthesis' }
];

async function updateAppCategories() {
  console.log('开始批量更新应用分类...');
  
  let successCount = 0;
  let failCount = 0;
  const notFoundApps = [];
  
  for (const app of appCategoryMapping) {
    try {
      // 查找应用
      const { data: existingApp, error: findError } = await supabase
        .from('tools')
        .select('*')
        .eq('name', app.name)
        .single();
      
      if (findError || !existingApp) {
        console.log(`未找到应用: ${app.name}`);
        notFoundApps.push(app.name);
        failCount++;
        continue;
      }
      
      // 更新分类
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          main_category: app.main_category,
          sub_category: app.sub_category,
          updated_at: new Date().toISOString()
        })
        .eq('name', app.name);
      
      if (updateError) {
        console.error(`更新应用 ${app.name} 失败:`, updateError);
        failCount++;
      } else {
        console.log(`✓ 成功更新应用: ${app.name} -> ${app.main_category}/${app.sub_category}`);
        successCount++;
      }
      
    } catch (error) {
      console.error(`处理应用 ${app.name} 时出错:`, error);
      failCount++;
    }
  }
  
  console.log('\n=== 分类更新完成 ===');
  console.log(`成功更新: ${successCount} 个应用`);
  console.log(`更新失败: ${failCount} 个应用`);
  
  if (notFoundApps.length > 0) {
    console.log('\n未找到的应用:');
    notFoundApps.forEach(app => console.log(`- ${app}`));
  }
}

// 执行更新
updateAppCategories().catch(console.error);
