import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

// 新增的应用分类映射
const newAppMappings = new Map([
  // 写作-文案创作
  ['光速写作', { main_category: '写作', sub_category: '文案创作' }],
  ['WriteWise', { main_category: '写作', sub_category: '文案创作' }],
  ['万能小in', { main_category: '写作', sub_category: '文案创作' }],
  ['YouMind', { main_category: '写作', sub_category: '文案创作' }],
  
  // 视觉-图像生成
  ['超能画布', { main_category: '视觉', sub_category: '图像生成' }],
  ['创客贴 AI 画匠', { main_category: '视觉', sub_category: '图像生成' }],
  ['秘塔捉捉猫', { main_category: '视觉', sub_category: '图像生成' }],
  ['稿定 AI', { main_category: '视觉', sub_category: '图像生成' }],
  ['简单 AI', { main_category: '视觉', sub_category: '图像生成' }],
  ['摩笔马良', { main_category: '视觉', sub_category: '图像生成' }],
  ['Canva AI 图像生成', { main_category: '视觉', sub_category: '图像生成' }],
  ['Bing Image Creator', { main_category: '视觉', sub_category: '图像生成' }],
  ['Adobe Firefly', { main_category: '视觉', sub_category: '图像生成' }],
  ['IconGen', { main_category: '视觉', sub_category: '图像生成' }],
  ['Logo Diffusion', { main_category: '视觉', sub_category: '图像生成' }],
  ['Realibox AI', { main_category: '视觉', sub_category: '图像生成' }],
  ['Poly', { main_category: '视觉', sub_category: '图像生成' }],
  ['志设', { main_category: '视觉', sub_category: '图像生成' }],
  
  // 视觉-图像处理
  ['ImageScore AI - 可解释图像质量评估系统', { main_category: '视觉', sub_category: '图像处理' }],
  
  // 视觉-创意设计
  ['小墨鹰编辑器', { main_category: '视觉', sub_category: '创意设计' }],
  ['PagePop', { main_category: '视觉', sub_category: '创意设计' }],
  
  // 视觉-视频数字人 (大量视频工具)
  ['白日梦', { main_category: '视觉', sub_category: '视频数字人' }],
  ['必剪 Studio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['蝉镜', { main_category: '视觉', sub_category: '视频数字人' }],
  ['场辞', { main_category: '视觉', sub_category: '视频数字人' }],
  ['磁力开创', { main_category: '视觉', sub_category: '视频数字人' }],
  ['堆友 AI 反应堆', { main_category: '视觉', sub_category: '视频数字人' }],
  ['堆友 AI 视频', { main_category: '视觉', sub_category: '视频数字人' }],
  ['飞影数字人', { main_category: '视觉', sub_category: '视频数字人' }],
  ['鬼手剪辑 GhostCut', { main_category: '视觉', sub_category: '视频数字人' }],
  ['海螺视频', { main_category: '视觉', sub_category: '视频数字人' }],
  ['花生 AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['绘蛙', { main_category: '视觉', sub_category: '视频数字人' }],
  ['绘蛙 AI 视频', { main_category: '视觉', sub_category: '视频数字人' }],
  ['绘想', { main_category: '视觉', sub_category: '视频数字人' }],
  ['绘影字幕', { main_category: '视觉', sub_category: '视频数字人' }],
  ['即创', { main_category: '视觉', sub_category: '视频数字人' }],
  ['阶跃视频', { main_category: '视觉', sub_category: '视频数字人' }],
  ['巨日禄', { main_category: '视觉', sub_category: '视频数字人' }],
  ['开拍', { main_category: '视觉', sub_category: '视频数字人' }],
  ['快剪辑', { main_category: '视觉', sub_category: '视频数字人' }],
  ['快转字幕', { main_category: '视觉', sub_category: '视频数字人' }],
  ['录咖', { main_category: '视觉', sub_category: '视频数字人' }],
  ['萌动 AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['秒创', { main_category: '视觉', sub_category: '视频数字人' }],
  ['妙播', { main_category: '视觉', sub_category: '视频数字人' }],
  ['模力视频', { main_category: '视觉', sub_category: '视频数字人' }],
  ['魔珐星云', { main_category: '视觉', sub_category: '视频数字人' }],
  ['内容特工队', { main_category: '视觉', sub_category: '视频数字人' }],
  ['闪剪', { main_category: '视觉', sub_category: '视频数字人' }],
  ['神笔马良', { main_category: '视觉', sub_category: '视频数字人' }],
  ['腾讯混元 AI 视频', { main_category: '视觉', sub_category: '视频数字人' }],
  ['团队快剪', { main_category: '视觉', sub_category: '视频数字人' }],
  ['万彩微影', { main_category: '视觉', sub_category: '视频数字人' }],
  ['万兴天幕', { main_category: '视觉', sub_category: '视频数字人' }],
  ['雾象', { main_category: '视觉', sub_category: '视频数字人' }],
  ['献丑 AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['寻光', { main_category: '视觉', sub_category: '视频数字人' }],
  ['一起剪', { main_category: '视觉', sub_category: '视频数字人' }],
  ['艺映 AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['元镜', { main_category: '视觉', sub_category: '视频数字人' }],
  ['云幕同声', { main_category: '视觉', sub_category: '视频数字人' }],
  ['造次', { main_category: '视觉', sub_category: '视频数字人' }],
  ['智谱清影', { main_category: '视觉', sub_category: '视频数字人' }],
  
  // 更多视频工具
  ['A2E', { main_category: '视觉', sub_category: '视频数字人' }],
  ['AdsTurbo AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Artflow', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Atoms', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Capsule', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Captions', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Clipfly', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Decohere', { main_category: '视觉', sub_category: '视频数字人' }],
  ['DomoAI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Dream Machine', { main_category: '视觉', sub_category: '视频数字人' }],
  ['DreamFace', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Duix', { main_category: '视觉', sub_category: '视频数字人' }],
  ['EbSynth', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Etna', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Filmora', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Fliki', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Flow Studio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Gatekeep', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Gencraft', { main_category: '视觉', sub_category: '视频数字人' }],
  ['GoEnhance', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Google Vids', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Haiper', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Hedra', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Higgsfield', { main_category: '视觉', sub_category: '视频数字人' }],
  ['HitPaw', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Hotshot', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Humva', { main_category: '视觉', sub_category: '视频数字人' }],
  ['InVideo AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['JoyPix', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Kaiber AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Kapwing', { main_category: '视觉', sub_category: '视频数字人' }],
  ['KomikoAI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['KreadoAI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['LensGo', { main_category: '视觉', sub_category: '视频数字人' }],
  ['LTX Studio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Lumen5', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Magicam', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Medeo', { main_category: '视觉', sub_category: '视频数字人' }],
  ['MochiAni', { main_category: '视觉', sub_category: '视频数字人' }],
  ['MOKI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Mootion', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Morph Studio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Noisee AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['OneStory', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Opus Clip', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Pictory', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Pixfun', { main_category: '视觉', sub_category: '视频数字人' }],
  ['PixVerse', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Pollo AI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Rask', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Rephrase.ai', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Synthesys', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Spikes Studio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Stable Video', { main_category: '视觉', sub_category: '视频数字人' }],
  ['SteveAI', { main_category: '视觉', sub_category: '视频数字人' }],
  ['SkyReels', { main_category: '视觉', sub_category: '视频数字人' }],
  ['SWE-Model-Arena', { main_category: '视觉', sub_category: '视频数字人' }],
  ['TapNow', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Tavus', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Veed Video Background Remover', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Video Ocean', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Video Studio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Vidu', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Viggle', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Vimi', { main_category: '视觉', sub_category: '视频数字人' }],
  ['vivago.ai', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Vizard', { main_category: '视觉', sub_category: '视频数字人' }],
  ['VMagic', { main_category: '视觉', sub_category: '视频数字人' }],
  ['WinkStudio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Wonder Studio', { main_category: '视觉', sub_category: '视频数字人' }],
  ['YoYo', { main_category: '视觉', sub_category: '视频数字人' }],
  ['BgRem', { main_category: '视觉', sub_category: '视频数字人' }],
  ['AVCLabs', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Colossyan', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Colourlab.ai', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Elai.io', { main_category: '视觉', sub_category: '视频数字人' }],
  ['Hour One', { main_category: '视觉', sub_category: '视频数字人' }],
  
  // 音频-音乐生成
  ['海绵音乐', { main_category: '音频', sub_category: '音乐生成' }],
  ['天谱乐', { main_category: '音频', sub_category: '音乐生成' }],
  ['Lyrics Into Song AI', { main_category: '音频', sub_category: '音乐生成' }],
  ['Sonauto', { main_category: '音频', sub_category: '音乐生成' }],
  ['SoundView', { main_category: '音频', sub_category: '音乐生成' }],
  ['Noiz AI', { main_category: '音频', sub_category: '音乐生成' }],
  ['Mureka', { main_category: '音频', sub_category: '音乐生成' }],
  ['Tunee', { main_category: '音频', sub_category: '音乐生成' }],
  
  // 音频-配音克隆
  ['大饼 AI 变声', { main_category: '音频', sub_category: '配音克隆' }],
  ['千音漫语', { main_category: '音频', sub_category: '配音克隆' }],
  ['悦音配音', { main_category: '音频', sub_category: '配音克隆' }],
  ['ACE Studio', { main_category: '音频', sub_category: '配音克隆' }],
  ['Audiobox', { main_category: '音频', sub_category: '配音克隆' }],
  ['FakeYou', { main_category: '音频', sub_category: '配音克隆' }],
  ['Fryderyk', { main_category: '音频', sub_category: '配音克隆' }],
  ['IBM Watson 文字转语音', { main_category: '音频', sub_category: '配音克隆' }],
  ['LOVO AI', { main_category: '音频', sub_category: '配音克隆' }],
  ['Murf AI', { main_category: '音频', sub_category: '配音克隆' }],
  ['NaturalReader', { main_category: '音频', sub_category: '配音克隆' }],
  ['RESEMBLE.AI', { main_category: '音频', sub_category: '配音克隆' }],
  ['Supertone Shift', { main_category: '音频', sub_category: '配音克隆' }],
  ['TextToSpeech', { main_category: '音频', sub_category: '配音克隆' }],
  ['TTSMaker', { main_category: '音频', sub_category: '配音克隆' }],
  ['Typecast', { main_category: '音频', sub_category: '配音克隆' }],
  ['Uberduck', { main_category: '音频', sub_category: '配音克隆' }],
  ['Veed AI Voice Generator', { main_category: '音频', sub_category: '配音克隆' }],
  ['Voice.ai', { main_category: '音频', sub_category: '配音克隆' }],
  ['Voicemaker', { main_category: '音频', sub_category: '配音克隆' }],
  ['Voicemod', { main_category: '音频', sub_category: '配音克隆' }],
  ['Voicenotes', { main_category: '音频', sub_category: '配音克隆' }],
  ['WellSaid', { main_category: '音频', sub_category: '配音克隆' }],
  ['Speechify', { main_category: '音频', sub_category: '配音克隆' }],
  ['Play.ht', { main_category: '音频', sub_category: '配音克隆' }],
  ['MetaVoice', { main_category: '音频', sub_category: '配音克隆' }],
  ['Clipchamp AI 旁白生成器', { main_category: '音频', sub_category: '配音克隆' }],
  ['OptimizerAI', { main_category: '音频', sub_category: '配音克隆' }],
  ['Reecho 睿声', { main_category: '音频', sub_category: '配音克隆' }],
  ['讯飞译制', { main_category: '音频', sub_category: '配音克隆' }],
  
  // 音频-语音转写
  ['多维视界', { main_category: '音频', sub_category: '语音转写' }],
  ['简单听记', { main_category: '音频', sub_category: '语音转写' }],
  ['听脑 AI', { main_category: '音频', sub_category: '语音转写' }],
  ['音述 AI', { main_category: '音频', sub_category: '语音转写' }],
  ['Vemus 未音', { main_category: '音频', sub_category: '语音转写' }],
  ['Nafy AI', { main_category: '音频', sub_category: '语音转写' }],
  ['TurboScribe', { main_category: '音频', sub_category: '语音转写' }],
  ['NotebookLM', { main_category: '音频', sub_category: '语音转写' }],
  ['Airgram', { main_category: '音频', sub_category: '语音转写' }],
  
  // 音频-音频编辑
  ['音潮', { main_category: '音频', sub_category: '音频编辑' }],
  ['音虫', { main_category: '音频', sub_category: '音频编辑' }],
  ['音疯', { main_category: '音频', sub_category: '音频编辑' }],
  ['音剪', { main_category: '音频', sub_category: '音频编辑' }],
  ['音秘', { main_category: '音频', sub_category: '音频编辑' }],
  ['MemoAI', { main_category: '音频', sub_category: '音频编辑' }],
  ['Lemonaid', { main_category: '音频', sub_category: '音频编辑' }],
  ['BGM 猫', { main_category: '音频', sub_category: '音频编辑' }],
  ['Descript', { main_category: '音频', sub_category: '音频编辑' }],
  
  // 编程-代码编写
  ['CodeBuddy', { main_category: '编程', sub_category: '代码编写' }],
  ['Plandex', { main_category: '编程', sub_category: '代码编写' }],
  ['react-planora-ai', { main_category: '编程', sub_category: '代码编写' }],
  ['yolo-image-identifier', { main_category: '编程', sub_category: '代码编写' }],
  ['mnist-neural-network-', { main_category: '编程', sub_category: '代码编写' }],
  ['MonkeyCode', { main_category: '编程', sub_category: '代码编写' }],
  ['Augment Code', { main_category: '编程', sub_category: '代码编写' }],
  ['ai-best-practices', { main_category: '编程', sub_category: '代码编写' }],
  ['Individual-task-1', { main_category: '编程', sub_category: '代码编写' }],
  
  // 编程-AI工程
  ['Awesome-Hacking-with-AI', { main_category: '编程', sub_category: 'AI工程' }],
  ['awesome-ai-pentesting', { main_category: '编程', sub_category: 'AI工程' }],
  
  // 编程-开发工具
  ['iFlow CLI', { main_category: '编程', sub_category: '开发工具' }],
  ['RunningHub', { main_category: '编程', sub_category: '开发工具' }],
  
  // 编程-智能体开发
  ['01Agent', { main_category: '编程', sub_category: '智能体开发' }],
  ['agent-wall', { main_category: '编程', sub_category: '智能体开发' }],
  ['Agnes AI', { main_category: '编程', sub_category: '智能体开发' }],
  ['amux — Agent Multiplexer', { main_category: '编程', sub_category: '智能体开发' }],
  ['AnyGen', { main_category: '编程', sub_category: '智能体开发' }],
  ['AutoGLM 沉思', { main_category: '编程', sub_category: '智能体开发' }],
  ['CRIC 深度智联', { main_category: '编程', sub_category: '智能体开发' }],
  ['DeepCLI - Ai Agent System', { main_category: '编程', sub_category: '智能体开发' }],
  ['FinGenius', { main_category: '编程', sub_category: '智能体开发' }],
  ['FlowMuse AI', { main_category: '编程', sub_category: '智能体开发' }],
  ['Jaaz', { main_category: '编程', sub_category: '智能体开发' }],
  ['MasterAgent', { main_category: '编程', sub_category: '智能体开发' }],
  ['Menuless', { main_category: '编程', sub_category: '智能体开发' }],
  ['Mixboard', { main_category: '编程', sub_category: '智能体开发' }],
  ['MyShell', { main_category: '编程', sub_category: '智能体开发' }],
  ['NeoDomain', { main_category: '编程', sub_category: '智能体开发' }],
  ['Opera Neon', { main_category: '编程', sub_category: '智能体开发' }],
  ['rabbitOS intern', { main_category: '编程', sub_category: '智能体开发' }],
  ['RoboNeo', { main_category: '编程', sub_category: '智能体开发' }],
  ['SciMaster', { main_category: '编程', sub_category: '智能体开发' }],
  ['Seele AI', { main_category: '编程', sub_category: '智能体开发' }],
  ['Seko', { main_category: '编程', sub_category: '智能体开发' }],
  ['TabTab', { main_category: '编程', sub_category: '智能体开发' }],
  ['Tago', { main_category: '编程', sub_category: '智能体开发' }],
  ['Tbox', { main_category: '编程', sub_category: '智能体开发' }],
  ['Teamo', { main_category: '编程', sub_category: '智能体开发' }],
  ['WorkAny', { main_category: '编程', sub_category: '智能体开发' }],
  ['Zeabur', { main_category: '编程', sub_category: '智能体开发' }],
  ['遨虾', { main_category: '编程', sub_category: '智能体开发' }],
  ['椒图 AI', { main_category: '编程', sub_category: '智能体开发' }],
  ['混沌 Deep Innovation', { main_category: '编程', sub_category: '智能体开发' }],
  ['切问学术', { main_category: '编程', sub_category: '智能体开发' }],
  ['如此 AI 员工', { main_category: '编程', sub_category: '智能体开发' }],
  ['元气 AI Bot', { main_category: '编程', sub_category: '智能体开发' }],
  ['月亮树 AI 选品', { main_category: '编程', sub_category: '智能体开发' }],
  ['亿话', { main_category: '编程', sub_category: '智能体开发' }],
  ['CoCo', { main_category: '编程', sub_category: '智能体开发' }],
  ['Bloom', { main_category: '编程', sub_category: '智能体开发' }],
  ['Bobby', { main_category: '编程', sub_category: '智能体开发' }],
  ['CatPaw', { main_category: '编程', sub_category: '智能体开发' }],
  ['CrePal', { main_category: '编程', sub_category: '智能体开发' }],
  ['Fairies', { main_category: '编程', sub_category: '智能体开发' }],
  ['Fellou', { main_category: '编程', sub_category: '智能体开发' }],
  ['FloweAI', { main_category: '编程', sub_category: '智能体开发' }],
  ['MuleRun', { main_category: '编程', sub_category: '智能体开发' }],
  ['Suna', { main_category: '编程', sub_category: '智能体开发' }],
  
  // 对话-通用大模
  ['逗逗 AI', { main_category: '对话', sub_category: '通用大模' }],
  ['Kimi 智能助手', { main_category: '对话', sub_category: '通用大模' }],
  ['Flowith', { main_category: '对话', sub_category: '通用大模' }],
  ['通义灵眸', { main_category: '对话', sub_category: '通用大模' }],
  ['问小白', { main_category: '对话', sub_category: '通用大模' }],
  
  // 对话-国产模型
  ['魔搭 GPT（ModelScopeGPT）', { main_category: '对话', sub_category: '国产模型' }],
  ['即梦 AI', { main_category: '对话', sub_category: '国产模型' }],
  ['NLUI', { main_category: '对话', sub_category: '国产模型' }],
  
  // 工具-智能搜索
  ['秘塔 AI 搜索', { main_category: '工具', sub_category: '智能搜索' }],
  
  // 工具-效率工具
  ['BreakRot - Build Focus', { main_category: '工具', sub_category: '效率工具' }],
  ['BrowserOS', { main_category: '工具', sub_category: '效率工具' }],
  ['FleekHire – AI powered ATS for Agencies', { main_category: '工具', sub_category: '效率工具' }],
  ['Keevx', { main_category: '工具', sub_category: '效率工具' }],
  ['Typeframes', { main_category: '工具', sub_category: '效率工具' }],
  ['Vozo', { main_category: '工具', sub_category: '效率工具' }],
  ['稿定 AI 社区', { main_category: '工具', sub_category: '效率工具' }],
  ['酷宣 AI', { main_category: '工具', sub_category: '效率工具' }],
  
  // 工具-学习科研
  ['Leewow', { main_category: '工具', sub_category: '学习科研' }],
  
  // 工具-小众工具
  ['1btc1btc', { main_category: '工具', sub_category: '小众工具' }],
  
  // 职场-职场工具
  ['爱派 AiPy', { main_category: '职场', sub_category: '职场工具' }]
]);

// 分类ID映射
const categoryIdMap = {
  '写作': 'writing',
  '视觉': 'image',
  '音频': 'audio',
  '编程': 'coding',
  '办公': 'office',
  '对话': 'chat',
  '工具': 'search',
  '职场': 'ai_agent'
};

const subCategoryIdMap = {
  '文案创作': 'writing_marketing',
  '图像生成': 'image_generation',
  '图像处理': 'image_editing',
  '创意设计': 'image_design',
  '视频数字人': 'video_generation',
  '音乐生成': 'audio_composition',
  '配音克隆': 'audio_synthesis',
  '语音转写': 'audio_transcription',
  '音频编辑': 'audio_synthesis',
  '代码编写': 'coding_generation',
  'AI工程': 'coding_documentation',
  '开发工具': 'coding_testing',
  '智能体开发': 'ai_platform',
  '通用大模': 'chat_general',
  '国产模型': 'chat_professional',
  '智能搜索': 'search_smart',
  '效率工具': 'tools_model',
  '学习科研': 'search_academic',
  '小众工具': 'tools_detection',
  '职场工具': 'ai_other'
};

async function continueDataCleaning() {
  try {
    console.log('=== 继续数据清洗 ===');
    
    // 读取现有的未匹配应用
    const cleaningLog = JSON.parse(fs.readFileSync('cleaning_log.json', 'utf8'));
    const unmatchedApps = new Set(cleaningLog.unmatched_apps);
    
    console.log(`现有未匹配应用数量: ${unmatchedApps.size}`);
    
    // 找到可以匹配的应用
    const matchedApps = [];
    const stillUnmatched = [];
    
    unmatchedApps.forEach(appName => {
      const mapping = newAppMappings.get(appName);
      if (mapping) {
        matchedApps.push({
          name: appName,
          main_category: categoryIdMap[mapping.main_category],
          sub_category: subCategoryIdMap[mapping.sub_category],
          main_category_name: mapping.main_category,
          sub_category_name: mapping.sub_category
        });
      } else {
        stillUnmatched.push(appName);
      }
    });
    
    console.log(`新匹配应用数量: ${matchedApps.length}`);
    console.log(`仍未匹配应用数量: ${stillUnmatched.length}`);
    
    // 更新数据库中的分类信息
    let updateCount = 0;
    for (const app of matchedApps) {
      const { error } = await supabase
        .from('tools')
        .update({
          main_category: app.main_category,
          sub_category: app.sub_category,
          status: 'active' // 标记为已清洗
        })
        .eq('name', app.name);
      
      if (error) {
        console.error(`更新 ${app.name} 失败:`, error.message);
      } else {
        updateCount++;
        console.log(`✅ 更新 ${app.name} -> ${app.main_category_name}-${app.sub_category_name}`);
      }
    }
    
    console.log(`\n=== 更新完成 ===`);
    console.log(`成功更新数据库: ${updateCount} 条记录`);
    
    // 生成更新后的清洗日志
    const updatedLog = {
      ...cleaningLog,
      newly_matched: matchedApps,
      still_unmatched: stillUnmatched,
      updated_statistics: {
        original: cleaningLog.statistics.original,
        cleaned: cleaningLog.statistics.cleaned + updateCount,
        unmatched: stillUnmatched.length,
        newly_matched: matchedApps.length
      }
    };
    
    // 保存更新后的日志
    fs.writeFileSync('updated_cleaning_log.json', JSON.stringify(updatedLog, null, 2));
    
    // 生成匹配报告
    const report = `# 继续数据清洗报告

## 清洗结果
- **新匹配应用**: ${matchedApps.length} 个
- **数据库更新**: ${updateCount} 条记录
- **剩余未匹配**: ${stillUnmatched.length} 个

## 新匹配应用详情
${matchedApps.map(app => `- ${app.name} → ${app.main_category_name}-${app.sub_category_name}`).join('\n')}

## 剩余未匹配应用
${stillUnmatched.map(app => `- ${app}`).join('\n')}

## 分类统计更新
- 原始数据总量: ${updatedLog.updated_statistics.original}
- 已清洗数据: ${updatedLog.updated_statistics.cleaned}
- 未匹配数据: ${updatedLog.updated_statistics.unmatched}
- 匹配成功率: ${((updatedLog.updated_statistics.cleaned / updatedLog.updated_statistics.original) * 100).toFixed(1)}%
`;
    
    fs.writeFileSync('continue_cleaning_report.md', report);
    
    console.log('\n=== 文件输出 ===');
    console.log('1. updated_cleaning_log.json - 更新后的清洗日志');
    console.log('2. continue_cleaning_report.md - 清洗报告');
    
  } catch (error) {
    console.error('继续清洗失败:', error.message);
  }
}

continueDataCleaning();
