import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

// 标准分类映射表（基于您提供的分类清单）
const standardCategories = {
  // 写作类
  '文案创作': '写作',
  '论文学术': '写作', 
  '小说网文': '写作',
  '文档解析': '写作',
  
  // 视觉类
  '图像生成': '视觉',
  '图像处理': '视觉',
  '创意设计': '视觉',
  '视频数字人': '视觉',
  
  // 音频类
  '音乐生成': '音频',
  '配音克隆': '音频',
  '语音转写': '音频',
  '音频编辑': '音频',
  
  // 编程类
  '代码编写': '编程',
  'AI工程': '编程',
  '开发工具': '编程',
  '智能体开发': '编程',
  
  // 办公类
  'PPT演示': '办公',
  '文档协同': '办公',
  '数据表格': '办公',
  '思维导图': '办公',
  
  // 对话类
  '通用大模': '对话',
  '海外模型': '对话',
  '国产模型': '对话',
  '趣味聊天': '对话',
  
  // 工具类
  '智能搜索': '工具',
  '效率工具': '工具',
  '学习科研': '工具',
  '小众工具': '工具',
  
  // 职场类
  '求职辅助': '职场',
  '法律合规': '职场',
  '职场工具': '职场',
  '医疗健康': '职场'
};

// 标准应用名称映射表（从您提供的清单中提取）
const standardAppNames = new Set([
  // 写作-文案创作
  '秘塔写作猫', 'Jasper', 'Rytr', 'Grammarly', 'Writesonic', '彩云小梦', '火龙果写作',
  '讯飞写作', '稿定 AI 文案', '魔撰写作', 'Copy.ai', 'DeepL Write', '有道写作',
  '写作蛙', '文思助手', '爱改写', 'HeyFriday', '易撰', '讯飞绘文', '笔灵 AI 写作',
  '新华妙笔', '讯飞文书', '创一 AI', 'Muset', '华文笔杆', '松果 AI 写作', '公文宝',
  'PaperXie 智能写作', '迅捷 AI 写作', '橙篇', '深言达意', '墨狐 AI', '灵犀速写',
  '库宝 AI 工作助手', '文状元', '晓语台', 'Jenni', '有道翻译・AI 写作', 'Wordvice AI',
  'AI 新媒体文章', '宙语 Cosmos', '灵构 AI 笔记', '百度作家平台', '爱创作', 'Verse',
  'Moonbeam', 'Cohesive', '万彩 AI', 'WritingPal', 'Magic Write', '奇妙文',
  'Spell.tools', 'HyperWrite', 'Typeface AI', '悉语', '文涌 Effidit', '树熊写作',
  '智搜', '创作王', '字符狂飙', 'XPaper AI', '悟智写作', '讯飞智检', '5118 SEO 优化精灵',
  'ContentBot', 'Bearly', '快文 CopyDone', 'Peppertype.ai', 'Compose AI', 'Texta',
  'ClosersCopy', 'Sudowrite', 'WPS 智能写作', 'Anyword', 'Hypotenuse AI', 'ParagraphAI',
  'LongShot', 'Jounce', 'Reword', 'Elephas', 'AISEO', 'Writer', 'SurferSEO',
  'ProWritingAid', 'Yaara', 'WordTune', 'Copysmith', 'NeuralText', 'Frase',
  'Copymatic', 'TextCortex', 'INK', 'Content at Scale', 'Mark Copy', '蛙蛙写作',
  'FlowUs AI',
  
  // 写作-论文学术
  'Paperpal', '笔目鱼', '稿易 AI 论文', '千笔 AI 论文', '66AI 论文', '维普科创助手',
  '沁言学术', '茅茅虫', 'GetDraft', '掌桥科研 AI 论文', 'PaperBetter AI', '小微智能论文',
  '范文喵', '笔杆论文', 'AI 论文君', 'Smodin AI Research Paper', 'QuillBot', 'Rubriq',
  '材料星 AI', '社研通', '量子探险',
  
  // 写作-小说网文
  '笔灵 AI 小说', '千页小说 AI', 'NovelAI', 'MidReal', '星火网文助手', '小鱼 AI 写作',
  '超级小说家', '墨问', 'Loomi', 'FeelFish', '落笔 AI 写作', 'ReadPo',
  
  // 写作-文档解析
  'ChatPDF', 'QuotePDF', 'docs2skills', 'Notion AI', 'Gamma', 'ChatDOC', 'PDF.ai',
  'Humata', 'PandaGPT', '司马阅', '知我 AI',
  
  // 视觉-图像生成
  'Midjourney', 'Civitai', 'Stable Diffusion', '吐司 AI', '造点 AI', '可灵', '可灵 AI',
  '通义万相', '秒画', 'WHEE', '呜哩', 'insMind', '咖图 AI', '视觉工厂', '秒绘 AI',
  '妙话 AI', '炉米 Lumi', 'Krea AI', 'Leonardo AI', 'Firefly AI', 'Playground AI',
  'Ideogram AI', 'SeaArt AI', 'Luma AI', '言之画', '百度智能云一念', '艾绘',
  'Graviti Diffus', '奇域 AI', '触手 AI 绘画', '造梦日记', '6pen Art', '画宇宙',
  'Visual Electric', '360 智绘', '网易 AI 创意工坊', 'Imagine with Meta',
  'Freepik AI Image Generator', 'Stockimg AI', '175FUN', 'Stable Doodle', '行者 AI 美术',
  'Skybox AI',
  
  // 视觉-图像处理
  'AI 改图神器', 'Kira', 'Photoroom', 'Ribbet.ai', '悟空图像 PhotoSir', '360 智图',
  '像素蛋糕', '如果相机', 'ARC', 'Cutout.Pro', 'remove.bg', 'MagicStudio', 'Booltool',
  'Faceswapper', 'ClipDrop', 'Vmake AI', 'DeepSwapper', 'Kacha AI', 'PicTech AI',
  'Hotpot.ai', '万相营造', 'Facet', 'Relight', 'Unscreen', 'Picsart Aura', 'Glinky',
  
  // 视觉-创意设计
  '墨刀 AI', 'Figma AI', '美图设计室', '135 AI 排版', 'Holopix AI', 'Pixso AI',
  'Recraft AI', '创客贴 AI', '鹿班', 'Magic Design', '标小智 LOGO 生成器', 'Looka',
  'Logoai', 'Vectorizer.AI', '阿里云智能 logo 设计', 'Neural Canvas',
  
  // 视觉-视频数字人
  'Pika', 'Runway', 'HeyGen', 'Sora', '万兴播爆', 'Kaiber', 'D-ID', '来画',
  '讯飞绘镜', '曦灵数字人', '讯飞虚拟人', 'DeepBrain', 'Synthesia', '怪兽 AI 数字人',
  '奇妙元', '即构数智人',
  
  // 音频-音乐生成
  'Suno', 'Udio', 'Soundraw', '网易天音', 'Stable Audio', '天工 SkyMusic', 'Mubert',
  'Boomy', 'Producer.ai', 'Adobe Podcast',
  
  // 音频-配音克隆
  '魔音工坊', '讯飞智作', 'ElevenLabs', '琅琅配音', 'MiniMax Audio', 'Keevx 声音克隆',
  '刺鸟配音', 'Wondercraft',
  
  // 音频-语音转写
  '讯飞听见', '通义听悟', 'Notta', 'Otter.ai', 'AssemblyAI', 'LALAL.AI', 'Krisp',
  '讯飞会议', '飞书妙记',
  
  // 音频-音频编辑
  '网易云音乐・X Studio', 'Audo Studio', 'BeatBot', 'beatoven.ai', '蓝藻 AI', 'Deepgram',
  
  // 编程-代码编写
  'Cursor', 'GitHub Copilot', 'Codeium', '文心快码', '豆包 AI 编程', 'CodeGeeX',
  'aiXcoder', 'Devin', 'CodeRabbit', 'Tabnine', '代码小浣熊', 'Qoder', 'OpenCode',
  'Kilo Code', 'Google Antigravity', 'Claude Code', 'Kiro', 'Codex', 'YouWare',
  'Zcode', 'CodeBuddy IDE', 'Lovable', '通义灵码', 'Firebase Studio', 'InfCode',
  'CodeFlicker', 'Clacky AI', 'Replit Agent', 'Warp Code', 'CodeWhisperer', 'Zread',
  'Junie', 'Qodo', 'Amp', 'DevChat', 'JoyCode', 'Genie', 'iFlyCode', 'Twinny',
  'Project IDX', '华为云码道', 'Sketch2Code', 'CodeFuse', 'Tabby', 'C 知道',
  '驭码 CodeRider', 'Duo Chat', 'Fitten Code', 'BLACKBOX AI', 'Solo', 'JetBrains AI',
  'AskCodi', 'v0.app', 'Boxy', 'Quest AI', '天工智码 Skycode', 'JamGPT', 'AirOps',
  'Imgcook', 'Deco', 'Ghostwriter', 'Codiga', 'Locofy', 'Fronty', 'MarsX', 'Debuild',
  'Warp', 'Fig', 'CodeSnippets', 'Hocoos', 'HTTPie AI', 'AI Code Reviewer',
  'Visual Studio IntelliCode', 'HeyCLI', 'Claude Code Security', 'moCODE',
  'Python_Minimax_Tictactoe',
  
  // 编程-AI工程
  'LangChain', 'AutoGPT', 'Ollama', 'ComfyUI', 'Gradio', 'Streamlit', 'Hugging Face',
  'Replicate', 'Weights & Biases', 'Pinecone',
  
  // 编程-开发工具
  'Replit', 'Windsurf', 'V0.dev', 'Bolt.new', 'Visual Studio IntelliCode', 'Imgcook',
  'Locofy', 'Debuild',
  
  // 编程-智能体开发
  'Dify', 'Coze / 扣子', 'OpenClaw', 'AutoClaw', 'SkillHub', 'QoderWork', 'GenFlow',
  '讯飞星辰 Agent', 'Manus', '码上飞', '金灵 AI', '新 AutoClaw', 'EvoMap', 'happycapy',
  'Genspark', 'OiiOii', 'QClaw', 'MiniMax Agent', 'Lovart', 'Operator', 'Skywork',
  '小云雀', 'Tabbit', '新 SkillHub',
  
  // 办公-PPT演示
  'AiPPT', '扣子 PPT', '咔片 PPT', '文多多 AiPPT', 'iSlide AIPPT', '博思 AIPPT',
  'Pi 智能 PPT', '稿定 PPT', '笔格 AIPPT', '笔灵 AIPPT', '百度文库 AI 助手', '讯飞智文',
  'Napkin', 'ChartGen', 'Diagrimo', 'PicDoc', '飞象老师', 'Kimi PPT 助手', '夸克 PPT',
  '美图 AI PPT', 'NarraLand', '课灵 PPT', '清言 PPT', '万兴智演', '麦当秀 MindShow',
  'VoxDeck', 'AiBiao', 'ChatBA', 'Decktopus AI', 'Powerpresent AI', '希沃白板',
  '秒出 PPT', 'GAIPPT', '万知', 'beautiful.ai', 'ChatPPT', '轻竹办公', 'Chronicle',
  'Presentations.AI', 'SlidesAI', 'auxi', 'AI 灵感 PPT', 'MindShow', '办公小浣熊',
  
  // 办公-文档协同
  'WPS AI', '腾讯文档智能助手', 'Acrobat AI Assistant', 'Cubox', 'Quivr', 'Coda',
  '通义智文', '字语智能', 'PMAI', '星火文档问答', '印象 AI', 'Craft AI Assistant',
  'Rossum.ai', 'Super AI',
  
  // 办公-数据表格
  'ChatExcel', '察言观数 AskTable', 'Tomoro', 'Shortcut', '爱图表', 'ChartinAI',
  'vika 维格云', '百度 GBI', 'Ajelix', 'Sheet+', '轻云图', '北极九章', 'Formula bot',
  'FormX.ai', 'Rows', 'Excelly-AI', 'SheetGod', 'Excel Formularizer',
  
  // 办公-思维导图
  'TreeMind 树图', '博思白板', '亿图脑图', 'Xmind AI', 'ProcessOn', 'Miro AI',
  '畅图 AI', '可赞 AI', '自由画布', '妙办画板', 'Mapify', '小画桌', '印象图记',
  '知犀 AI', 'GitMind 思乎', '亿图图示 AI', 'Whimsical', 'AmyMind', 'Taskade',
  'Ayoa Ultimate', 'txyz', '小绿鲸', '包阅 AI', 'Wisfile', '凹凸工坊', 'OmniBox 小黑',
  '智写流程', 'Doc2X',
  
  // 对话-通用大模
  'ChatGPT', 'Claude', 'Gemini', 'Kimi', '通义千问', '文心一言', '智谱清言', 'DeepSeek',
  '豆包', '讯飞星火', '腾讯元宝',
  
  // 对话-海外模型
  'Google Bard', 'Microsoft Copilot', 'Mistral AI', 'Cohere AI', 'Meta AI', 'AI21 Labs',
  'Stability AI',
  
  // 对话-国产模型
  '书生大模型', '百川大模型', '阶跃 AI', '天工 AI', '百小应', '商量 SenseChat',
  '华为小艺', '百灵大模型', 'LongCat', 'Z.ai', 'Qwen Chat', 'MiniMax', '千问', 'Grok',
  
  // 对话-趣味聊天
  'Character.AI', 'Bing 新必应', 'Poe', '夸克 AI', '360 智脑', 'Replika', 'Pi',
  'Inworld', '钉钉・个人版', 'Meta AI 助手', 'Koko AI', '通义星尘', 'CueMe', '造梦次元',
  'Museland', '百度 AI 助手', '小悟空', '紫东太初', '小黄蕉', '冒泡鸭', 'J1 Assistant',
  'Cici', 'Le Chat', '百度 AI 伙伴', '超级助理', 'Wanderboat', 'MChat', 'Luca 面壁露卡',
  '元象 XChat', 'ChitChop', '魔搭 GPT', 'Forefront', 'HuggingChat', 'TigerBot',
  'Stable Chat', 'ColossalChat', 'Jasper Chat', 'MOSS', 'YouChat AI', 'ChatSonic',
  'Whispr', 'Open Assistant', 'Neeva', '对话写作猫', '应事 AI', 'Me.bot', 'Saylo',
  'TRAE', '秒哒',
  
  // 工具-智能搜索
  'Perplexity', '玻尔', 'SearchGPT', 'AMiner', '心流', '点点', 'Devv', '知乎直答',
  '纳米 AI', '百度 AI 探索版', 'Felo', '天工 AI 搜索', 'Exa AI', '博查 AI 搜索',
  'WisPaper', 'CuspAI', '博简智慧专利', '链企 AI', '360AI 搜索', '问问小宇宙',
  'Dexa AI', 'XAnswer', 'Glean', 'AlphaSense', 'Globe Explorer', 'Reportify', 'Phind',
  'iAsk AI', 'Consensus', 'Komo Search', 'Searcholic', 'Andi', 'Songtell', 'ThinkAny',
  'Miku', 'Qdrant', 'Adot', '开搜 AI', 'SearchAI', 'Searcle', 'Root Calculator',
  'ImageScore AI', 'LiblibAI', 'LiblibAI・哩布哩布 AI', '阿贝智能',
  
  // 工具-效率工具
  'Zapier', 'TempMail.website', 'TenMinEmail', 'FocusFlow', 'BreakRot', 'ListivoAI',
  'Holditt', 'ProHeadshot AI', 'SlickyBrain', 'WeflineAI', 'EuPass', 'microgpt-c',
  'PersistAi', 'GreenPT for Android', 'ToolBake', 'SVAHNAR', 'SupportSyndicate',
  'Wrapify', 'PromptStore', 'portfolio-showcase-generator', 'UTIM AI',
  'Dating Photo Editor AI', 'Ciral', 'What I Paid', 'NeuralGPT', 'Nova', 'ClawTrace',
  'MercuryAi', '{clarity}', 'WowAI.pet', 'AI SlideRush', 'ICTBroadcast', 'awesome-skills',
  'Fresh Deal', 'Reviews Teams', 'Flux.ai', 'Welcome to Astral', 'WMIT - What Movie Is That?',
  'FleekHire', 'BrowserPod for Node.js', 'ZIN Advisor', 'BotBot', 'WALL', 'Clawdy',
  'Archivia: AI Notebooks', 'MaxyService', 'book-ai', 'opengnothia', 'alive',
  'Molten.Bot', 'BotSmith', 'Common Ground', 'Rork Max', 'git-lrc',
  'Lyria 3 by Google Deepmind', 'Woise', 'KraftCV', 'Stish From Start to Finish',
  'Prism Videos', 'eidolon-womb', 'MindForge', 'awesome-text-to-video', 'Imflow',
  'Oculer', 'ClawCloud', 'ClearClause', 'Gratitude Self Love Journal', 'Synthetic',
  'Kidy Ai', 'Spaire', 'ResumeMatch AI', 'claude-skills-collection-2026', 'clawd-cursor',
  'EcoAI-Environmental-Intelligence-Agent', 'GeoSeer', 'PS-HK19_MindForge_MindForge',
  'consciousness', 'argus-ai-debate', 'anything-llm-cli', 'LeadFind', 'Cuto',
  'Free HTML Email Signature Generator v2.0', 'awesome-eu-ai-act', 'awesome-ai-for-economists',
  'Anima', 'WebMCP', 'Collective OS', 'CollabCord', 'Block Puzzle Challenge',
  'Word Equation', 'llm-classifier', 'mnemosyne', 'NoteKitLM: Supercharge Your NotebookLM',
  'world-model', 'IDChecker AI', 'Desenmascara.me', 'AI Safe Chat Guard', 'IBYOK',
  'DeClaw', 'grad.jobs', 'amux', 'Vertical_3_Ultra', 'NAIL', 'maise', 'Ling-1T',
  '夸克团队', 'Skill Soup', 'Founder Clarity', 'Summonr', 'HelloClaww', 'EMAS',
  'nexus-ai-life-os', 'Open-Source-AI-News', 'aiseo-audit', 'hatdubuyingintent.info',
  'picogpt', 'Versor', 'openclaw-skills', 'connect4-3d-hand', 'Free-LLM', 'MineGASP',
  'intentspec', 'SENTRA Ai', 'permanently-jailbroken', 'GenAI-Projects', 'Warren',
  'Kamero.ai: AI Event Photo Sharing', 'Saypien', 'WebZum', 'StackSpend', 'Quiet Bloom',
  'Quen AI: Chat with Qwen', 'Repaint',
  
  // 工具-学习科研
  'Coursera', 'DeepLearning.AI', 'Kaggle', '飞桨 AI Studio', '腾讯扣叮', 'Google AI',
  'fast.ai', 'Elements of AI', '动手学深度学习', 'MachineLearningMastery',
  'Generative AI for Beginners', 'ML for Beginners', '神经网络入门', 'Trancy',
  'Reading Coach', '阿里云 AI 学习路线', 'Udacity AI 学院', 'ShowMeAI 知识社区',
  '堆友 AI', '星流 AI', 'AI 大学堂', '堆友 AI 学习', 'AI 分享圈', 'OpenAI Academy',
  'Day of AI', '学吧导航', 'Lynote',
  
  // 工具-小众工具
  'Roast My Desk', 'Virtual runner AI', 'QmetaRam.ai', 'PicQR', 'Create Caricature Of Me',
  'The Wheel Visualizer', 'PaidYet?', 'fast-weight-product-key-memory',
  'openclaw-self-healing', 'modelviz', 'two-stage-dexterity-learning',
  'synthetic-phenomenology', 'norman-compliance-engine', 'speq-skill', 'resumate',
  'Email-Spam-Classifier', 'crypto-predictor', 'Medibly',
  'withJess - the a.i. for your soul', 'learn-coding-by-building', 'Xirea',
  'ANIME-VIDEO-DOWNLOADER', 'Vibe XL', 'Homesage.ai', 'TrendSpark', 'NKEMBA',
  'SoulMateNeat', 'Easy Testing',
  
  // 职场-求职辅助
  '智简简历', 'UP 简历', '超级简历', '求职方舟', '面多多', '牛面', '面团 AI',
  '笔面通', 'AI 面试帮', '理聘 AI', '51mee', 'LovTalent', 'TelehireAI 面试', 'DINQ',
  'Mercor', '智面星', 'Offerin', '多面鹅', 'Gank Interview', '面试猫', '白瓜面试',
  '职徒简历', '职得简历', '蓝字典 AI 求职', '神笔简历', 'YOO 简历',
  
  // 职场-法律合规
  'iTerms-AI 法律', '吾律 AI 律师', '元典智库', '通义法睿', '法行宝', 'MetaLaw',
  'ChatLaw', '得理法搜', '法智', '海瑞智法', '合同嗖嗖',
  
  // 职场-职场工具
  'WorkBuddy', 'InStreet', 'SheepGeo', 'Health EnviroTesting', 'MediScribe',
  'pharmacy-ai-assistant', 'AI-Heart-Guardian', 'hemoconnect-public',
  'China cryogenic tanker-semi-trailer', 'AI-sign-language-translator', 'Cencurity',
  'monkeys-with-typewriters', 'laravel-ai-database'
]);

// 应用名称到分类的映射
const appToCategoryMap = {};
const lines = fs.readFileSync(0, 'utf8').trim().split('\n');
for (const line of lines) {
  if (line.startsWith('一级分类，二级分类，应用名称')) continue;
  const [mainCat, subCat, appName] = line.split('，');
  if (appName && mainCat && subCat) {
    appToCategoryMap[appName.trim()] = {
      main_category: mainCat.trim(),
      sub_category: subCat.trim()
    };
  }
}

async function performDataCleaning() {
  try {
    console.log('=== 开始数据清洗 ===');
    
    // 读取现有数据
    const toolsData = JSON.parse(fs.readFileSync('tools_export.json', 'utf8'));
    console.log(`原始数据总量: ${toolsData.length}`);
    
    // 数据清洗统计
    const stats = {
      original: toolsData.length,
      duplicates: 0,
      unmatched: 0,
      format_fixed: 0,
      category_fixed: 0,
      cleaned: 0,
      invalid: 0
    };
    
    const cleanedTools = [];
    const duplicateMap = new Map();
    const unmatchedApps = new Set();
    const formatFixes = [];
    const categoryFixes = [];
    
    // Step 1: 去重处理
    for (const tool of toolsData) {
      const normalizedName = normalizeAppName(tool.name);
      
      if (duplicateMap.has(normalizedName)) {
        stats.duplicates++;
        duplicateMap.get(normalizedName).count++;
      } else {
        duplicateMap.set(normalizedName, {
          original: tool,
          count: 1,
          cleaned: { ...tool }
        });
      }
    }
    
    console.log(`发现重复项: ${stats.duplicates} 个`);
    
    // Step 2: 处理每个工具
    for (const [normalizedName, data] of duplicateMap) {
      const tool = data.original;
      const cleaned = { ...tool };
      
      // Step 3: 格式标准化
      const formatFixed = normalizeAppNameFormat(tool.name);
      if (formatFixed !== tool.name) {
        cleaned.name = formatFixed;
        stats.format_fixed++;
        formatFixes.push({
          original: tool.name,
          fixed: formatFixed
        });
      }
      
      // Step 4: 分类匹配
      const categoryMatch = findCategoryMatch(cleaned.name);
      if (categoryMatch) {
        if (categoryMatch.main_category !== tool.main_category || 
            categoryMatch.sub_category !== tool.sub_category) {
          stats.category_fixed++;
          categoryFixes.push({
            name: cleaned.name,
            old_main: tool.main_category,
            old_sub: tool.sub_category,
            new_main: categoryMatch.main_category,
            new_sub: categoryMatch.sub_category
          });
        }
        cleaned.main_category = categoryMatch.main_category;
        cleaned.sub_category = categoryMatch.sub_category;
        cleaned.status = 'active'; // 标记为已清洗
        stats.cleaned++;
      } else {
        stats.unmatched++;
        unmatchedApps.add(cleaned.name);
        cleaned.status = 'pending'; // 标记为待人工确认
      }
      
      // Step 5: 删除无效数据
      if (isValidApp(cleaned.name)) {
        cleanedTools.push(cleaned);
      } else {
        stats.invalid++;
      }
    }
    
    // Step 6: 排序
    cleanedTools.sort((a, b) => {
      const mainOrder = ['写作', '视觉', '音频', '编程', '办公', '对话', '工具', '职场'];
      const aMainIndex = mainOrder.indexOf(a.main_category);
      const bMainIndex = mainOrder.indexOf(b.main_category);
      
      if (aMainIndex !== bMainIndex) {
        return aMainIndex - bMainIndex;
      }
      
      return a.name.localeCompare(b.name, 'zh-CN');
    });
    
    // 输出结果
    const results = {
      cleaned_tools: cleanedTools,
      statistics: stats,
      unmatched_apps: Array.from(unmatchedApps),
      format_fixes: formatFixes,
      category_fixes: categoryFixes
    };
    
    // 保存结果
    fs.writeFileSync('cleaned_tools.json', JSON.stringify(cleanedTools, null, 2));
    fs.writeFileSync('cleaning_log.json', JSON.stringify(results, null, 2));
    
    // 生成CSV格式
    const csvContent = '一级分类,二级分类,应用名称\n' + 
      cleanedTools.map(tool => 
        `${tool.main_category || ''},${tool.sub_category || ''},${tool.name || ''}`
      ).join('\n');
    fs.writeFileSync('cleaned_tools.csv', csvContent);
    
    console.log('\n=== 数据清洗完成 ===');
    console.log(`原始数据总量: ${stats.original}`);
    console.log(`去重数量: ${stats.duplicates}`);
    console.log(`清洗后数据总量: ${stats.cleaned}`);
    console.log(`未匹配应用数量: ${stats.unmatched}`);
    console.log(`格式修正数量: ${stats.format_fixed}`);
    console.log(`分类修正数量: ${stats.category_fixed}`);
    console.log(`无效数据删除数量: ${stats.invalid}`);
    
    console.log('\n=== 输出文件 ===');
    console.log('1. cleaned_tools.json - 清洗后的JSON数据');
    console.log('2. cleaned_tools.csv - 清洗后的CSV数据');
    console.log('3. cleaning_log.json - 详细清洗日志');
    
  } catch (error) {
    console.error('数据清洗失败:', error.message);
  }
}

// 标准化应用名称（用于去重）
function normalizeAppName(name) {
  return name.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w\u4e00-\u9fa5]/g, '');
}

// 标准化应用名称格式
function normalizeAppNameFormat(name) {
  // 常见的格式修正规则
  const corrections = {
    'langchain': 'LangChain',
    'dify': 'Dify',
    'copilot': 'Microsoft Copilot',
    'coze': 'Coze / 扣子',
    '可灵ai': '可灵 AI',
    '扣子': 'Coze / 扣子'
  };
  
  const lowerName = name.toLowerCase();
  for (const [wrong, correct] of Object.entries(corrections)) {
    if (lowerName.includes(wrong)) {
      return correct;
    }
  }
  
  return name;
}

// 查找分类匹配
function findCategoryMatch(appName) {
  // 直接匹配
  if (appToCategoryMap[appName]) {
    return appToCategoryMap[appName];
  }
  
  // 模糊匹配
  const normalizedName = normalizeAppName(appName);
  for (const [standardName, category] of Object.entries(appToCategoryMap)) {
    if (normalizeAppName(standardName) === normalizedName) {
      return category;
    }
  }
  
  return null;
}

// 验证应用名称有效性
function isValidApp(name) {
  if (!name || name.trim().length === 0) return false;
  if (name.length > 100) return false; // 过长的名称可能是乱码
  if (!/[\w\u4e00-\u9fa5]/.test(name)) return false; // 不包含中英文
  return true;
}

// 执行清洗
performDataCleaning();
