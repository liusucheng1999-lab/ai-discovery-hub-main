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

// AI编程工具数据
const codingTools = [
  {
    name: 'TRAE',
    tagline: '字节跳动推出的 AI IDE 编程工具',
    description: 'TRAE是字节跳动推出的AI IDE编程工具。提供AI编程、IDE支持、字节技术等服务。具备字节技术、IDE专业、编程便捷等特色功能，适合编程开发使用。',
    website_url: 'https://trae.bytedance.com',
    tags: ['字节跳动', 'AI IDE', '编程工具', 'IDE专业'],
    pricing_type: 'freemium'
  },
  {
    name: '秒哒',
    tagline: '无代码AI应用开发平台，一句话做应用',
    description: '秒哒是无代码AI应用开发平台，一句话做应用。提供无代码开发、AI应用、一句话生成等服务。具备无代码、AI开发、一句话生成等特色功能，适合应用开发使用。',
    website_url: 'https://miaoda.com',
    tags: ['无代码开发', 'AI应用', '一句话生成', '应用开发'],
    pricing_type: 'freemium'
  },
  {
    name: '代码小浣熊',
    tagline: '商汤科技推出的免费AI编程助手',
    description: '代码小浣熊是商汤科技推出的免费AI编程助手。提供AI编程、商汤技术、免费使用等服务。具备商汤技术、编程专业、免费使用等特色功能，适合编程使用。',
    website_url: 'https://code.sensetime.com',
    tags: ['商汤科技', 'AI编程', '免费使用', '编程专业'],
    pricing_type: 'free'
  },
  {
    name: 'OpenCode',
    tagline: '开源 AI 编程工具 ， Claude Code 最佳平替',
    description: 'OpenCode是开源AI编程工具，Claude Code最佳平替。提供开源编程、AI辅助、Claude平替等服务。具备开源免费、编程专业、Claude平替等特色功能，适合编程使用。',
    website_url: 'https://opencode.dev',
    tags: ['开源免费', 'AI编程', 'Claude平替', '编程专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'Claude Code',
    tagline: 'Anthropic 推出的AI编程工具',
    description: 'Claude Code是Anthropic推出的AI编程工具。提供AI编程、Anthropic技术、编程辅助等服务。具备Anthropic技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://claude.ai/code',
    tags: ['Anthropic', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Cursor',
    tagline: 'AI代码编辑器，快速进行编程和软件开发',
    description: 'Cursor是AI代码编辑器，快速进行编程和软件开发。提供代码编辑、AI辅助、开发便捷等服务。具备AI编辑、编程专业、开发快速等特色功能，适合代码编辑使用。',
    website_url: 'https://cursor.sh',
    tags: ['AI代码编辑器', '编程快速', '软件开发', '编辑专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Qoder',
    tagline: '阿里巴巴推出的 AI Agentic 编程工具',
    description: 'Qoder是阿里巴巴推出的AI Agentic编程工具。提供AI编程、阿里技术、Agentic服务等功能。具备阿里技术、编程专业、Agentic智能等特色功能，适合编程使用。',
    website_url: 'https://qoder.alibaba.com',
    tags: ['阿里巴巴', 'AI编程', 'Agentic智能', '编程专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Kilo Code',
    tagline: '开源的 AI 编程扩展插件',
    description: 'Kilo Code是开源的AI编程扩展插件。提供开源编程、扩展插件、AI辅助等服务。具备开源免费、扩展专业、AI辅助等特色功能，适合编程扩展使用。',
    website_url: 'https://kilocode.dev',
    tags: ['开源免费', '编程扩展', 'AI辅助', '扩展专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'Google Antigravity',
    tagline: '谷歌推出的 AI IDE 编程智能体',
    description: 'Google Antigravity是谷歌推出的AI IDE编程智能体。提供AI IDE、谷歌技术、编程智能体等服务。具备谷歌技术、IDE专业、智能体编程等特色功能，适合IDE编程使用。',
    website_url: 'https://antigravity.google.com',
    tags: ['谷歌出品', 'AI IDE', '编程智能体', 'IDE专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Kiro',
    tagline: '亚马逊公司推出的 AI IDE',
    description: 'Kiro是亚马逊公司推出的AI IDE。提供AI IDE、亚马逊技术、编程辅助等服务。具备亚马逊技术、IDE专业、编程便捷等特色功能，适合IDE编程使用。',
    website_url: 'https://kiro.amazon.com',
    tags: ['亚马逊', 'AI IDE', '编程辅助', 'IDE专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'YouWare',
    tagline: '一站式 AI 编程社区与开发平台',
    description: 'YouWare是一站式AI编程社区与开发平台。提供编程社区、开发平台、一站式服务等功能。具备一站式服务、社区互动、开发专业等特色功能，适合编程社区使用。',
    website_url: 'https://youware.dev',
    tags: ['一站式平台', '编程社区', '开发平台', '社区互动'],
    pricing_type: 'freemium'
  },
  {
    name: 'Codex',
    tagline: 'OpenAI推出的AI编程模型和工具',
    description: 'Codex是OpenAI推出的AI编程模型和工具。提供AI编程、OpenAI技术、编程模型等服务。具备OpenAI技术、编程专业、模型先进等特色功能，适合编程使用。',
    website_url: 'https://openai.com/codex',
    tags: ['OpenAI出品', 'AI编程', '编程模型', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Zcode',
    tagline: '智谱推出的轻量级AI IDE编程工具',
    description: 'Zcode是智谱推出的轻量级AI IDE编程工具。提供轻量级IDE、智谱技术、编程辅助等服务。具备智谱技术、轻量级、编程专业等特色功能，适合轻量编程使用。',
    website_url: 'https://zcode.zhipu.ai',
    tags: ['智谱出品', '轻量级IDE', '编程辅助', '轻量便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'CodeBuddy IDE',
    tagline: '腾讯推出的全栈开发AI IDE',
    description: 'CodeBuddy IDE是腾讯推出的全栈开发AI IDE。提供全栈开发、AI IDE、腾讯技术等服务。具备腾讯技术、全栈专业、IDE便捷等特色功能，适合全栈开发使用。',
    website_url: 'https://codebuddy.tencent.com',
    tags: ['腾讯出品', '全栈开发', 'AI IDE', '全栈专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Lovable',
    tagline: '全栈AI编程工具，一句话构建网站应用',
    description: 'Lovable是全栈AI编程工具，一句话构建网站应用。提供全栈编程、一句话构建、AI辅助等服务。具备一句话构建、全栈专业、AI便捷等特色功能，适合全栈应用使用。',
    website_url: 'https://lovable.dev',
    tags: ['全栈编程', '一句话构建', 'AI辅助', '全栈专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'CatPaw',
    tagline: '美团推出的 AI IDE 编程工具',
    description: 'CatPaw是美团推出的AI IDE编程工具。提供AI IDE、美团技术、编程辅助等服务。具备美团技术、IDE专业、编程便捷等特色功能，适合IDE编程使用。',
    website_url: 'https://catpaw.meituan.com',
    tags: ['美团出品', 'AI IDE', '编程辅助', 'IDE专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Augment Code',
    tagline: 'AI编程辅助工具，专为大型代码库设计',
    description: 'Augment Code是AI编程辅助工具，专为大型代码库设计。提供大型代码库、AI辅助、编程支持等服务。具备大型代码库、AI辅助、编程专业等特色功能，适合大型项目使用。',
    website_url: 'https://augmentcode.com',
    tags: ['大型代码库', 'AI辅助', '编程支持', '大型项目'],
    pricing_type: 'freemium'
  },
  {
    name: 'MonkeyCode',
    tagline: '长亭科技开源的 AI 编程助手与企业级开发平台',
    description: 'MonkeyCode是长亭科技开源的AI编程助手与企业级开发平台。提供开源编程、企业级平台、长亭技术等服务。具备开源免费、企业级、编程专业等特色功能，适合企业开发使用。',
    website_url: 'https://monkeycode.chaitin.com',
    tags: ['长亭科技', '开源编程', '企业级平台', '编程专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'iFlow CLI',
    tagline: '心流AI推出的免费终端 AI 智能体',
    description: 'iFlow CLI是心流AI推出的免费终端AI智能体。提供终端AI、心流技术、免费使用等服务。具备心流技术、终端专业、免费使用等特色功能，适合终端编程使用。',
    website_url: 'https://iflow.cli.ai',
    tags: ['心流AI', '终端AI', '免费使用', '终端专业'],
    pricing_type: 'free'
  },
  {
    name: '通义灵码',
    tagline: '阿里推出的免费AI编程工具，基于通义大模型',
    description: '通义灵码是阿里推出的免费AI编程工具，基于通义大模型。提供免费编程、通义技术、大模型支持等服务。具备免费使用、通义技术、大模型专业等特色功能，适合编程使用。',
    website_url: 'https://lingma.tongyi.ali.com',
    tags: ['阿里出品', '免费编程', '通义大模型', '大模型专业'],
    pricing_type: 'free'
  },
  {
    name: 'GitHub Copilot',
    tagline: 'GitHub推出的AI编程工具',
    description: 'GitHub Copilot是GitHub推出的AI编程工具。提供AI编程、GitHub技术、编程辅助等服务。具备GitHub技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://github.com/copilot',
    tags: ['GitHub出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Firebase Studio',
    tagline: '谷歌推出的AI编程工具，一站式开发全栈应用',
    description: 'Firebase Studio是谷歌推出的AI编程工具，一站式开发全栈应用。提供全栈开发、谷歌技术、一站式服务等功能。具备谷歌技术、全栈专业、一站式开发等特色功能，适合全栈应用使用。',
    website_url: 'https://studio.firebase.google.com',
    tags: ['谷歌出品', '全栈开发', '一站式服务', '全栈专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Windsurf',
    tagline: 'Codeium公司推出的AI编程工具',
    description: 'Windsurf是Codeium公司推出的AI编程工具。提供AI编程、Codeium技术、编程辅助等服务。具备Codeium技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://windsurf.codeium.com',
    tags: ['Codeium出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Bolt.new',
    tagline: 'StackBlitz 推出的全栈AI代码工具，可以看作 Artfacts、V0 和 Replit 的结合体',
    description: 'Bolt.new是StackBlitz推出的全栈AI代码工具，可以看作Artfacts、V0和Replit的结合体。提供全栈代码、StackBlitz技术、综合服务等功能。具备StackBlitz技术、全栈专业、综合工具等特色功能，适合全栈开发使用。',
    website_url: 'https://bolt.new',
    tags: ['StackBlitz出品', '全栈代码', '综合工具', '全栈专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'InfCode',
    tagline: '词元无限推出的企业级AI编程工具',
    description: 'InfCode是词元无限推出的企业级AI编程工具。提供企业级编程、词元技术、专业服务等功能。具备企业级、编程专业、技术先进等特色功能，适合企业编程使用。',
    website_url: 'https://infcode.ciyuan.com',
    tags: ['词元无限', '企业级编程', '专业服务', '企业级'],
    pricing_type: 'freemium'
  },
  {
    name: 'CodeFlicker',
    tagline: '快手推出的AI原生IDE编程工具',
    description: 'CodeFlicker是快手推出的AI原生IDE编程工具。提供AI原生IDE、快手技术、编程辅助等服务。具备快手技术、AI原生、IDE专业等特色功能，适合IDE编程使用。',
    website_url: 'https://codeflicker.kuaishou.com',
    tags: ['快手出品', 'AI原生IDE', '编程辅助', 'IDE专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Clacky AI',
    tagline: 'AI编程工具，打造L3级的Coding Studio',
    description: 'Clacky AI是AI编程工具，打造L3级的Coding Studio。提供L3级编程、AI辅助、专业Studio等服务。具备L3级专业、AI辅助、Studio便捷等特色功能，适合专业编程使用。',
    website_url: 'https://clacky.ai',
    tags: ['L3级编程', 'AI辅助', '专业Studio', '编程专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Replit Agent',
    tagline: 'AI初创公司Replit推出的AI编程工具',
    description: 'Replit Agent是AI初创公司Replit推出的AI编程工具。提供AI编程、Replit技术、编程辅助等服务。具备Replit技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://agent.replit.com',
    tags: ['Replit出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Warp Code',
    tagline: 'Warp推出的AI编程工具',
    description: 'Warp Code是Warp推出的AI编程工具。提供AI编程、Warp技术、编程辅助等服务。具备Warp技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://code.warp.dev',
    tags: ['Warp出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'CodeWhisperer',
    tagline: '亚马逊推出的免费AI编程助手',
    description: 'CodeWhisperer是亚马逊推出的免费AI编程助手。提供免费编程、亚马逊技术、AI辅助等服务。具备免费使用、亚马逊技术、编程专业等特色功能，适合编程使用。',
    website_url: 'https://aws.amazon.com/codewhisperer',
    tags: ['亚马逊', '免费编程', 'AI辅助', '编程专业'],
    pricing_type: 'free'
  },
  {
    name: 'Zread',
    tagline: '专为开发者设计的AI源码解读产品',
    description: 'Zread是专为开发者设计的AI源码解读产品。提供源码解读、AI分析、开发者专业等服务。具备源码专业、AI分析、开发者友好等特色功能，适合源码分析使用。',
    website_url: 'https://zread.dev',
    tags: ['源码解读', 'AI分析', '开发者专业', '源码分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'Junie',
    tagline: 'JetBrains 推出的 AI 编程助手',
    description: 'Junie是JetBrains推出的AI编程助手。提供AI编程、JetBrains技术、编程辅助等服务。具备JetBrains技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://junie.jetbrains.com',
    tags: ['JetBrains出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'CodeBuddy',
    tagline: '腾讯推出的AI编程助手',
    description: 'CodeBuddy是腾讯推出的AI编程助手。提供AI编程、腾讯技术、编程辅助等服务。具备腾讯技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://codebuddy.tencent.com',
    tags: ['腾讯出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Qodo',
    tagline: '（原CodiumAI）AI开发平台',
    description: 'Qodo是（原CodiumAI）AI开发平台。提供AI开发、编程辅助、专业服务等功能。具备AI开发、编程专业、服务全面等特色功能，适合开发使用。',
    website_url: 'https://qodo.ai',
    tags: ['CodiumAI', 'AI开发', '编程辅助', '开发专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'CodeGeeX',
    tagline: '智谱AI推出的免费AI编程助手',
    description: 'CodeGeeX是智谱AI推出的免费AI编程助手。提供免费编程、智谱技术、AI辅助等服务。具备免费使用、智谱技术、编程专业等特色功能，适合编程使用。',
    website_url: 'https://codegeex.zhipu.ai',
    tags: ['智谱AI', '免费编程', 'AI辅助', '编程专业'],
    pricing_type: 'free'
  },
  {
    name: 'Amp',
    tagline: 'Sourcegraph推出的免费AI编程工具',
    description: 'Amp是Sourcegraph推出的免费AI编程工具。提供免费编程、Sourcegraph技术、AI辅助等服务。具备免费使用、Sourcegraph技术、编程专业等特色功能，适合编程使用。',
    website_url: 'https://amp.sourcegraph.com',
    tags: ['Sourcegraph', '免费编程', 'AI辅助', '编程专业'],
    pricing_type: 'free'
  },
  {
    name: 'DevChat',
    tagline: '开源的支持多款大模型的AI编程助手',
    description: 'DevChat是开源的支持多款大模型的AI编程助手。提供开源编程、多模型支持、AI辅助等服务。具备开源免费、多模型、编程专业等特色功能，适合编程使用。',
    website_url: 'https://devchat.ai',
    tags: ['开源免费', '多模型支持', 'AI辅助', '编程专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'JoyCode',
    tagline: '京东云推出的新一代智能编程 AI IDE',
    description: 'JoyCode是京东云推出的新一代智能编程AI IDE。提供智能编程、京东技术、AI IDE等服务。具备京东技术、智能编程、IDE专业等特色功能，适合智能编程使用。',
    website_url: 'https://joycode.jdcloud.com',
    tags: ['京东云', '智能编程', 'AI IDE', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Genie',
    tagline: 'Cosine AI推出的AI编程助手',
    description: 'Genie是Cosine AI推出的AI编程助手。提供AI编程、Cosine技术、编程辅助等服务。具备Cosine技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://genie.cosine.ai',
    tags: ['Cosine AI', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '文心快码',
    tagline: '百度推出的AI编程助手，基于文心大模型',
    description: '文心快码是百度推出的AI编程助手，基于文心大模型。提供AI编程、百度技术、文心大模型支持等服务。具备百度技术、文心大模型、编程专业等特色功能，适合编程使用。',
    website_url: 'https://wenxin.baidu.com/code',
    tags: ['百度出品', 'AI编程', '文心大模型', '大模型专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'iFlyCode',
    tagline: '科大讯飞推出的智能编程助手',
    description: 'iFlyCode是科大讯飞推出的智能编程助手。提供智能编程、讯飞技术、AI辅助等服务。具备讯飞技术、智能编程、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://iflycode.xunfei.cn',
    tags: ['科大讯飞', '智能编程', 'AI辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Twinny',
    tagline: '专为 VS Code 设计的AI代码补全插件',
    description: 'Twinny是专为VS Code设计的AI代码补全插件。提供代码补全、VS Code专用、AI辅助等服务。具备VS Code专业、代码补全、AI辅助等特色功能，适合VS Code使用。',
    website_url: 'https://twinny.dev',
    tags: ['VS Code专用', '代码补全', 'AI辅助', 'VS Code专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Project IDX',
    tagline: '谷歌推出的AI云端开发和代码编辑器',
    description: 'Project IDX是谷歌推出的AI云端开发和代码编辑器。提供云端开发、谷歌技术、AI编辑器等服务。具备谷歌技术、云端专业、AI编辑等特色功能，适合云端开发使用。',
    website_url: 'https://idx.dev',
    tags: ['谷歌出品', '云端开发', 'AI编辑器', '云端专业'],
    pricing_type: 'freemium'
  },
  {
    name: '华为云码道',
    tagline: '华为推出的一站式AI编程助手',
    description: '华为云码道是华为推出的一站式AI编程助手。提供一站式编程、华为技术、AI辅助等服务。具备华为技术、一站式服务、编程专业等特色功能，适合编程使用。',
    website_url: 'https://madao.huawei.com',
    tags: ['华为出品', '一站式编程', 'AI辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Sketch2Code',
    tagline: '微软AI Lab推出的将手绘草图转换成HTML代码工具',
    description: 'Sketch2Code是微软AI Lab推出的将手绘草图转换成HTML代码工具。提供草图转HTML、微软技术、AI转换等服务。具备微软技术、草图转换、HTML生成等特色功能，适合草图转换使用。',
    website_url: 'https://sketch2code.microsoft.com',
    tags: ['微软AI Lab', '草图转HTML', 'AI转换', '微软技术'],
    pricing_type: 'free'
  },
  {
    name: 'CodeFuse',
    tagline: '蚂蚁集团推出的AI代码编程助手',
    description: 'CodeFuse是蚂蚁集团推出的AI代码编程助手。提供AI编程、蚂蚁技术、编程辅助等服务。具备蚂蚁技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://codefuse.antgroup.com',
    tags: ['蚂蚁集团', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tabby',
    tagline: '免费开源的自托管AI编程助手',
    description: 'Tabby是免费开源的自托管AI编程助手。提供自托管编程、开源免费、AI辅助等服务。具备自托管、开源免费、编程专业等特色功能，适合自托管使用。',
    website_url: 'https://tabby.tabbyml.com',
    tags: ['自托管', '开源免费', 'AI辅助', '自托管专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'C知道',
    tagline: 'CSDN推出的AI技术问答工具',
    description: 'C知道是CSDN推出的AI技术问答工具。提供技术问答、CSDN技术、AI辅助等服务。具备CSDN技术、问答专业、AI辅助等特色功能，适合技术问答使用。',
    website_url: 'https://c.csdn.net',
    tags: ['CSDN出品', '技术问答', 'AI辅助', '问答专业'],
    pricing_type: 'freemium'
  },
  {
    name: '驭码CodeRider',
    tagline: '极狐GitLab推出的AI编程与软件智能研发助手',
    description: '驭码CodeRider是极狐GitLab推出的AI编程与软件智能研发助手。提供AI编程、GitLab技术、智能研发等服务。具备GitLab技术、编程专业、智能研发等特色功能，适合智能研发使用。',
    website_url: 'https://coderider.gitlab.cn',
    tags: ['极狐GitLab', 'AI编程', '智能研发', '研发专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Duo Chat',
    tagline: 'GitLab推出的AI编程助手',
    description: 'Duo Chat是GitLab推出的AI编程助手。提供AI编程、GitLab技术、编程辅助等服务。具备GitLab技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://duo.gitlab.com',
    tags: ['GitLab出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'CodeRabbit',
    tagline: 'AI驱动的代码审查平台',
    description: 'CodeRabbit是AI驱动的代码审查平台。提供代码审查、AI驱动、专业服务等功能。具备AI驱动、审查专业、服务全面等特色功能，适合代码审查使用。',
    website_url: 'https://coderabbit.ai',
    tags: ['AI驱动', '代码审查', '审查专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Devin',
    tagline: '首个全自主的AI软件工程师智能体',
    description: 'Devin是首个全自主的AI软件工程师智能体。提供全自主编程、软件工程师、AI智能体等服务。具备首个全自主、软件工程专业、智能体编程等特色功能，适合软件工程使用。',
    website_url: 'https://devin.ai',
    tags: ['首个全自主', '软件工程师', 'AI智能体', '工程专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Plandex',
    tagline: '免费开源的基于终端的AI编程引擎',
    description: 'Plandex是免费开源的基于终端的AI编程引擎。提供终端编程、开源免费、AI引擎等服务。具备开源免费、终端专业、AI引擎等特色功能，适合终端编程使用。',
    website_url: 'https://plandex.ai',
    tags: ['开源免费', '终端编程', 'AI引擎', '终端专业'],
    pricing_type: 'opensource'
  },
  {
    name: 'Fitten Code',
    tagline: '非十科技推出的免费AI代码助手',
    description: 'Fitten Code是非十科技推出的免费AI代码助手。提供免费编程、非十技术、AI辅助等服务。具备免费使用、非十技术、编程专业等特色功能，适合编程使用。',
    website_url: 'https://fitten.code',
    tags: ['非十科技', '免费编程', 'AI辅助', '编程专业'],
    pricing_type: 'free'
  },
  {
    name: 'BLACKBOX AI',
    tagline: '黑箱AI编程助理，快速代码生成',
    description: 'BLACKBOX AI是黑箱AI编程助理，快速代码生成。提供快速生成、AI编程、黑箱技术等服务。具备快速生成、编程专业、AI助理等特色功能，适合快速编程使用。',
    website_url: 'https://blackbox.ai',
    tags: ['黑箱AI', '快速生成', 'AI编程', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Solo',
    tagline: 'Mozilla推出的零编程无代码AI网站建设工具',
    description: 'Solo是Mozilla推出的零编程无代码AI网站建设工具。提供无代码建站、Mozilla技术、AI辅助等服务。具备Mozilla技术、无代码专业、建站便捷等特色功能，适合无代码建站使用。',
    website_url: 'https://solo.mozilla.org',
    tags: ['Mozilla出品', '无代码建站', 'AI辅助', '无代码专业'],
    pricing_type: 'free'
  },
  {
    name: 'JetBrains AI',
    tagline: 'JetBrains推出的AI编程开发助手',
    description: 'JetBrains AI是JetBrains推出的AI编程开发助手。提供AI编程、JetBrains技术、开发辅助等服务。具备JetBrains技术、编程专业、开发辅助等特色功能，适合编程开发使用。',
    website_url: 'https://ai.jetbrains.com',
    tags: ['JetBrains出品', 'AI编程', '开发辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'AskCodi',
    tagline: '你的个人AI编程助手',
    description: 'AskCodi是个人AI编程助手。提供个人编程、AI辅助、专业服务等功能。具备个人专用、编程专业、AI便捷等特色功能，适合个人编程使用。',
    website_url: 'https://askcodi.com',
    tags: ['个人编程', 'AI辅助', '个人专用', '编程专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'v0.app',
    tagline: 'Vercel推出的AI全栈应用构建工具',
    description: 'v0.app是Vercel推出的AI全栈应用构建工具。提供全栈构建、Vercel技术、AI辅助等服务。具备Vercel技术、全栈专业、构建便捷等特色功能，适合全栈构建使用。',
    website_url: 'https://v0.dev',
    tags: ['Vercel出品', '全栈构建', 'AI辅助', '全栈专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Boxy',
    tagline: 'CodeSandbox推出的AI编程助手',
    description: 'Boxy是CodeSandbox推出的AI编程助手。提供AI编程、CodeSandbox技术、编程辅助等服务。具备CodeSandbox技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://boxy.codesandbox.io',
    tags: ['CodeSandbox出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Quest AI',
    tagline: 'AI将设计稿生成React代码，支持JavaScript和TypeScript',
    description: 'Quest AI是AI将设计稿生成React代码，支持JavaScript和TypeScript。提供设计稿转代码、React生成、AI辅助等服务。具备设计稿转换、React专业、AI便捷等特色功能，适合设计稿转换使用。',
    website_url: 'https://quest.ai',
    tags: ['设计稿转代码', 'React生成', 'AI辅助', 'React专业'],
    pricing_type: 'freemium'
  },
  {
    name: '天工智码Skycode',
    tagline: 'AI智能编程助手，轻松生成各种代码',
    description: '天工智码Skycode是AI智能编程助手，轻松生成各种代码。提供智能编程、天工技术、代码生成等服务。具备天工技术、编程专业、生成便捷等特色功能，适合智能编程使用。',
    website_url: 'https://skycode.kunlun.ai',
    tags: ['昆仑万维', '智能编程', '代码生成', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'JamGPT',
    tagline: 'AI Debug调试助手',
    description: 'JamGPT是AI Debug调试助手。提供调试辅助、AI支持、专业服务等功能。具备调试专业、AI辅助、服务全面等特色功能，适合调试使用。',
    website_url: 'https://jamgpt.com',
    tags: ['AI调试', '调试助手', 'AI辅助', '调试专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'aiXcoder',
    tagline: '自然语言到代码的方法级代码生成，以及多行智能代码补全',
    description: 'aiXcoder是自然语言到代码的方法级代码生成，以及多行智能代码补全。提供自然语言转代码、方法级生成、智能补全等服务。具备自然语言转换、方法级专业、补全智能等特色功能，适合代码生成使用。',
    website_url: 'https://aixcoder.com',
    tags: ['自然语言转代码', '方法级生成', '智能补全', '转换专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'AirOps',
    tagline: 'AI SQL语句生成和修改',
    description: 'AirOps是AI SQL语句生成和修改工具。提供SQL生成、AI辅助、专业服务等功能。具备SQL专业、AI生成、修改便捷等特色功能，适合SQL使用。',
    website_url: 'https://airops.com',
    tags: ['SQL生成', 'AI辅助', 'SQL专业', '生成专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Imgcook',
    tagline: '阿里推出的免费设计稿智能生成前端代码',
    description: 'Imgcook是阿里推出的免费设计稿智能生成前端代码。提供设计稿转代码、阿里技术、免费使用等服务。具备阿里技术、设计稿转换、前端专业等特色功能，适合前端开发使用。',
    website_url: 'https://imgcook.alibaba.com',
    tags: ['阿里出品', '设计稿转代码', '前端专业', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: 'Deco',
    tagline: '京东推出的设计稿一键生成多端代码工具',
    description: 'Deco是京东推出的设计稿一键生成多端代码工具。提供设计稿转代码、多端生成、京东技术等服务。具备京东技术、设计稿转换、多端专业等特色功能，适合多端开发使用。',
    website_url: 'https://deco.jd.com',
    tags: ['京东出品', '设计稿转代码', '多端生成', '多端专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Ghostwriter',
    tagline: '知名在线编程IDE Replit推出的AI编程助手',
    description: 'Ghostwriter是知名在线编程IDE Replit推出的AI编程助手。提供AI编程、Replit技术、编程辅助等服务。具备Replit技术、编程专业、AI辅助等特色功能，适合编程使用。',
    website_url: 'https://ghostwriter.replit.com',
    tags: ['Replit出品', 'AI编程', '编程辅助', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: 'Codiga',
    tagline: 'AI代码实时分析',
    description: 'Codiga是AI代码实时分析工具。提供实时分析、AI支持、专业服务等功能。具备实时分析、AI专业、服务全面等特色功能，适合代码分析使用。',
    website_url: 'https://codiga.io',
    tags: ['实时分析', 'AI代码分析', '分析专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Locofy',
    tagline: 'AI无代码工具将Figma、Adobe XD和Sketch设计转换成前端代码',
    description: 'Locofy是AI无代码工具将Figma、Adobe XD和Sketch设计转换成前端代码。提供设计转代码、无代码工具、多平台支持等服务。具备多平台转换、无代码专业、前端生成等特色功能，适合设计转换使用。',
    website_url: 'https://locofy.ai',
    tags: ['设计转代码', '无代码工具', '多平台支持', '前端专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Fronty',
    tagline: 'AI智能将图片转换成HTML和CSS代码',
    description: 'Fronty是AI智能将图片转换成HTML和CSS代码。提供图片转代码、AI智能、HTML生成等服务。具备图片转换、HTML专业、CSS生成等特色功能，适合图片转代码使用。',
    website_url: 'https://fronty.ai',
    tags: ['图片转代码', 'HTML生成', 'CSS生成', '转换专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'MarsX',
    tagline: 'AI无代码软件开发',
    description: 'MarsX是AI无代码软件开发。提供无代码开发、AI支持、软件开发等服务。具备无代码专业、AI辅助、开发便捷等特色功能，适合无代码开发使用。',
    website_url: 'https://marsx.ai',
    tags: ['无代码开发', 'AI辅助', '软件开发', '无代码专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Tabnine',
    tagline: 'AI代码自动补全编程助手',
    description: 'Tabnine是AI代码自动补全编程助手。提供代码补全、AI辅助、专业服务等功能。具备补全专业、AI智能、服务全面等特色功能，适合代码补全使用。',
    website_url: 'https://tabnine.com',
    tags: ['代码补全', 'AI辅助', '补全专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Debuild',
    tagline: '低代码快速开发网页应用',
    description: 'Debuild是低代码快速开发网页应用。提供低代码开发、快速开发、网页应用等服务。具备低代码专业、开发快速、应用便捷等特色功能，适合低代码开发使用。',
    website_url: 'https://debuild.app',
    tags: ['低代码开发', '快速开发', '网页应用', '低代码专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Warp',
    tagline: '21世纪的终端工具（内置AI命令搜索）',
    description: 'Warp是21世纪的终端工具（内置AI命令搜索）。提供终端工具、AI命令搜索、现代体验等服务。具备终端专业、AI搜索、现代体验等特色功能，适合终端使用。',
    website_url: 'https://warp.dev',
    tags: ['终端工具', 'AI命令搜索', '现代体验', '终端专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Fig',
    tagline: '下一代命令行工具（内置AI终端命令自动补全）',
    description: 'Fig是下一代命令行工具（内置AI终端命令自动补全）。提供命令行工具、AI自动补全、下一代体验等服务。具备命令行专业、AI补全、下一代工具等特色功能，适合命令行使用。',
    website_url: 'https://fig.io',
    tags: ['命令行工具', 'AI自动补全', '下一代工具', '命令行专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'CodeSnippets',
    tagline: 'AI代码生成、补全、分析、重构和调试',
    description: 'CodeSnippets是AI代码生成、补全、分析、重构和调试。提供全功能代码服务、AI支持、专业工具等功能。具备全功能服务、AI专业、工具全面等特色功能，适合代码全流程使用。',
    website_url: 'https://codesnippets.ai',
    tags: ['全功能代码', 'AI支持', '工具全面', '服务专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Hocoos',
    tagline: '无代码AI智能在线快速创建网站',
    description: 'Hocoos是无代码AI智能在线快速创建网站。提供无代码建站、AI智能、在线创建等服务。具备无代码专业、AI智能、建站便捷等特色功能，适合无代码建站使用。',
    website_url: 'https://hocoos.com',
    tags: ['无代码建站', 'AI智能', '在线创建', '建站便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'HTTPie AI',
    tagline: 'AI API开发工具',
    description: 'HTTPie AI是AI API开发工具。提供API开发、AI辅助、专业服务等功能。具备API专业、AI辅助、开发便捷等特色功能，适合API开发使用。',
    website_url: 'https://httpie.ai',
    tags: ['API开发', 'AI辅助', 'API专业', '开发便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'AI Code Reviewer',
    tagline: 'AI代码检查',
    description: 'AI Code Reviewer是AI代码检查工具。提供代码检查、AI支持、专业服务等功能。具备检查专业、AI智能、服务全面等特色功能，适合代码检查使用。',
    website_url: 'https://aicodereviewer.com',
    tags: ['代码检查', 'AI支持', '检查专业', '服务全面'],
    pricing_type: 'freemium'
  },
  {
    name: 'Visual Studio IntelliCode',
    tagline: 'Visual Studio AI辅助开发',
    description: 'Visual Studio IntelliCode是Visual Studio AI辅助开发。提供AI辅助、VS技术、开发支持等服务。具备VS技术、AI专业、开发辅助等特色功能，适合VS开发使用。',
    website_url: 'https://visualstudio.microsoft.com/intellicode',
    tags: ['Visual Studio', 'AI辅助开发', 'VS技术', '开发专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'HeyCLI',
    tagline: '自然语言转义为CLI命令',
    description: 'HeyCLI是自然语言转义为CLI命令。提供自然语言转CLI、AI辅助、命令转换等服务。具备自然语言转换、CLI专业、转换便捷等特色功能，适合CLI转换使用。',
    website_url: 'https://heycli.com',
    tags: ['自然语言转CLI', 'AI辅助', '命令转换', '转换专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Codeium',
    tagline: '免费的AI编程工具，智能生成和补全代码',
    description: 'Codeium是免费的AI编程工具，智能生成和补全代码。提供免费编程、AI生成、代码补全等服务。具备免费使用、AI生成、补全专业等特色功能，适合编程使用。',
    website_url: 'https://codeium.com',
    tags: ['免费编程', 'AI生成', '代码补全', '生成专业'],
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

async function insertCodingTools() {
  console.log('开始检查并插入AI编程工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of codingTools) {
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
          category: 'coding',
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
    
    console.log(`\n🎉 AI编程工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${codingTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertCodingTools()
