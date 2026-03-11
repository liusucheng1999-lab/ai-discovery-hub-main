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

// 写作类工具数据
const writingTools = [
  {
    name: '蛙蛙写作',
    tagline: 'AI小说和内容创作工具',
    description: '蛙蛙写作是一款专为小说作者和内容创作者设计的AI写作工具。该工具利用先进的自然语言处理技术，能够帮助用户快速生成小说情节、角色设定、对话内容等。支持多种文学体裁，包括言情、玄幻、都市、科幻等。提供智能续写、情节推演、人物关系梳理等功能，大大提升创作效率。界面简洁友好，适合各个水平的写作者使用。',
    website_url: 'https://wawaxiezuo.com',
    tags: ['小说创作', 'AI写作', '内容生成', '文学创作'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞绘文',
    tagline: '免费AI写作工具，5分钟生成一篇原创稿！',
    description: '讯飞绘文是科大讯飞推出的免费AI写作平台，专为中国用户优化。该工具凭借讯飞强大的语言模型技术，能够在5分钟内生成高质量的原创文章。支持新闻稿、产品介绍、工作总结、演讲稿等多种文体。具备智能改写、语法检查、风格调整等功能。完全免费使用，是学生、职场人士和内容创作者的理想写作助手。',
    website_url: 'https://huiwen.xunfei.cn',
    tags: ['免费写作', '科大讯飞', '快速生成', '原创内容'],
    pricing_type: 'free'
  },
  {
    name: '笔灵AI写作',
    tagline: '600+写作模板、AI一键生成论文/小说，论文降重降AI',
    description: '笔灵AI写作是国内领先的AI写作平台，提供600+专业写作模板。涵盖学术论文、小说创作、工作报告、商业文案等多个领域。特色功能包括论文降重、AI检测率降低、智能改写等。采用先进的AI技术，确保生成内容的原创性和专业性。界面操作简单，支持批量处理，是学生和研究人员的必备工具。',
    website_url: 'https://ibiling.cn',
    tags: ['论文写作', '降重服务', '模板丰富', '学术写作'],
    pricing_type: 'freemium'
  },
  {
    name: '新华妙笔',
    tagline: '新华社推出的体制内办公学习平台',
    description: '新华妙笔是新华社专为体制内工作人员打造的办公学习平台。该工具结合了新华社的权威资源优势，提供公文写作、政策解读、学习资料等功能。支持各类公文模板，包括报告、请示、通知、总结等。具备智能写作辅助、格式规范检查、政策法规查询等特色功能。是政府机关、事业单位工作人员的专业写作助手。',
    website_url: 'https://xinhua.miaobi.com',
    tags: ['公文写作', '新华社', '体制内', '办公学习'],
    pricing_type: 'paid'
  },
  {
    name: '笔灵AI小说',
    tagline: 'AI一键写全篇+爆文拆解，搞定大纲、素材，新手写作过稿神器！',
    description: '笔灵AI小说是专为小说创作者设计的AI写作工具。提供一键生成全篇小说、爆文拆解分析、智能大纲生成等功能。内置丰富的素材库和情节模板，帮助新手作者快速掌握写作技巧。支持多种网文类型，包括都市、玄幻、言情、历史等。具备人物设定、世界观构建、情节推演等专业功能，是网络写手的必备神器。',
    website_url: 'https://xiaoshuo.ibiling.cn',
    tags: ['小说写作', '爆文分析', '大纲生成', '网文创作'],
    pricing_type: 'freemium'
  },
  {
    name: '稿定AI文案',
    tagline: '小红书、公众号、短视频AI文案生成工具',
    description: '稿定AI文案是稿定设计推出的专注于新媒体文案创作的AI工具。特别针对小红书、微信公众号、短视频平台的特点进行优化。能够生成吸引人的标题、正文、标签等完整文案。支持多种文案风格，包括种草、测评、教程、故事等。内置热门话题库和关键词优化功能，帮助内容创作者提高曝光率和互动量。',
    website_url: 'https://gaoding.com/ai-copy',
    tags: ['新媒体文案', '小红书', '公众号', '短视频'],
    pricing_type: 'freemium'
  },
  {
    name: '01Agent',
    tagline: 'AI图文创作工具，支持生成、排版、编辑、发布',
    description: '01Agent是一款全能型AI图文创作工具，提供从内容生成到发布的完整工作流。支持AI写作、智能排版、图片编辑、多平台发布等功能。适用于公众号、微博、知乎等多个内容平台。具备风格定制、批量处理、定时发布等高级功能。界面设计现代化，操作流程优化，是内容创作者的效率神器。',
    website_url: 'https://01agent.com',
    tags: ['图文创作', '排版编辑', '多平台发布', '内容管理'],
    pricing_type: 'freemium'
  },
  {
    name: 'Paperpal',
    tagline: '英文论文写作助手',
    description: 'Paperpal是专为学术研究人员设计的英文论文写作助手。提供语法检查、学术写作规范、引用格式化等专业功能。支持SCI、SSCI等顶级期刊的写作标准。具备语言润色、逻辑优化、结构建议等高级功能。采用先进的AI技术，确保学术论文的专业性和规范性。是科研工作者和留学生的必备工具。',
    website_url: 'https://paperpal.com',
    tags: ['英文论文', '学术写作', '语法检查', 'SCI写作'],
    pricing_type: 'freemium'
  },
  {
    name: '笔目鱼',
    tagline: '专业英文论文写作器',
    description: '笔目鱼是专注于英文论文写作的AI工具，提供从选题到定稿的全流程服务。支持文献综述、研究方法、数据分析等论文各部分的写作。具备学术语言优化、逻辑结构检查、引用格式规范等功能。特别针对中国学生的写作习惯进行优化，帮助提升英文学术写作水平。',
    website_url: 'https://bimuyu.com',
    tags: ['英文论文', '学术写作', '留学生', '研究工具'],
    pricing_type: 'freemium'
  },
  {
    name: '稿易AI论文',
    tagline: 'AI论文写作助手，免费生成2000字大纲',
    description: '稿易AI论文是专业的论文写作辅助工具，提供免费的大纲生成服务。支持2000字以上的详细大纲生成，涵盖各个学科领域。具备智能文献推荐、研究方法建议、论文结构优化等功能。界面简洁易用，生成速度快，是学生和研究人员的论文写作好帮手。',
    website_url: 'https://gaoyi.ai',
    tags: ['论文大纲', '免费生成', '学术研究', '写作辅助'],
    pricing_type: 'freemium'
  },
  {
    name: '千笔AI论文',
    tagline: '全网首家论文无限改稿平台',
    description: '千笔AI论文是首家提供无限次改稿服务的AI论文平台。用户可以无限次要求AI修改和优化论文内容，直到满意为止。支持深度改写、结构调整、语言润色等服务。具备查重降重、AI检测率降低等特色功能。是追求完美论文质量学生的首选平台。',
    website_url: 'https://qianbi.ai',
    tags: ['无限改稿', '论文优化', '查重降重', '质量保证'],
    pricing_type: 'paid'
  },
  {
    name: '66AI论文',
    tagline: '高质量、低查重、低AIGC率的AI论文写作工具',
    description: '66AI论文专注于提供高质量的论文写作服务，特别注重降低查重率和AIGC检测率。采用先进的AI模型和独特的算法，生成更加自然和原创的内容。支持多学科、多层次的论文写作。具备智能降重、语言优化、逻辑检查等功能，是追求高质量论文学生的理想选择。',
    website_url: 'https://66ai.ai',
    tags: ['低查重率', '低AIGC', '高质量论文', '原创写作'],
    pricing_type: 'paid'
  },
  {
    name: '维普科创助手',
    tagline: '维普的一站式AI科研服务平台',
    description: '维普科创助手是维普资讯推出的专业科研服务平台，整合了维普丰富的学术资源。提供文献检索、论文写作、科研管理等功能。支持与维普数据库的无缝对接，方便用户查找和引用文献。具备学术规范检查、研究趋势分析、专家推荐等高级功能。是科研工作者的全能助手。',
    website_url: 'https://kechuang.cqvip.com',
    tags: ['科研服务', '维普', '文献管理', '学术资源'],
    pricing_type: 'freemium'
  },
  {
    name: '沁言学术',
    tagline: 'AI科研写作平台，一站式文献管理',
    description: '沁言学术是专为科研人员设计的AI写作和文献管理平台。提供从文献检索到论文写作的全流程服务。支持智能文献综述、研究方法推荐、数据分析等功能。具备文献管理、引用生成、协作写作等特色功能。界面设计专业，适合各学科的研究人员使用。',
    website_url: 'https://qinyan.ai',
    tags: ['文献管理', '科研写作', '学术协作', '研究工具'],
    pricing_type: 'freemium'
  },
  {
    name: '茅茅虫',
    tagline: '一站式AI论文写作助手',
    description: '茅茅虫是功能全面的AI论文写作助手，提供从选题到答辩的全流程支持。支持开题报告、文献综述、实验设计、结果分析等各环节写作。具备智能选题、方法推荐、数据分析等功能。界面友好，操作简单，是本科生和研究生的论文写作好伙伴。',
    website_url: 'https://maomaochong.com',
    tags: ['论文写作', '开题报告', '学术研究', '写作助手'],
    pricing_type: 'freemium'
  },
  {
    name: 'GetDraft',
    tagline: '得到推出的多AI专家协作AI写作工具',
    description: 'GetDraft是得到App推出的专业AI写作工具，采用多AI专家协作模式。每个AI专家负责不同的写作领域，提供专业化的写作建议。支持商业分析、行业报告、知识付费内容等高端写作。具备深度研究、逻辑分析、专业润色等功能，是知识创作者的利器。',
    website_url: 'https://getdraft.dedao.cn',
    tags: ['得到App', '专家协作', '商业写作', '知识创作'],
    pricing_type: 'paid'
  },
  {
    name: '光速写作',
    tagline: 'AI写作、PPT生成工具，单篇最长15000字',
    description: '光速写作是高效的AI写作和PPT生成工具，支持单篇最长15000字的长文创作。提供快速写作、智能排版、PPT自动生成等功能。支持多种文档类型，包括报告、方案、演讲稿等。具备一键生成、批量处理、模板丰富等特色，是职场人士的效率工具。',
    website_url: 'https://guangsu.ai',
    tags: ['长文写作', 'PPT生成', '高效办公', '批量处理'],
    pricing_type: 'freemium'
  },
  {
    name: 'YouMind',
    tagline: '专注提升创作效率和信息整合的AI原生工具',
    description: 'YouMind是AI原生的创作工具，专注于提升创作效率和信息整合能力。提供思维导图、内容创作、信息整理等功能。支持从灵感到成稿的完整创作流程。具备智能联想、知识图谱、协作创作等高级功能。界面设计现代化，适合创意工作者和知识工作者使用。',
    website_url: 'https://youmind.ai',
    tags: ['创作效率', '信息整合', '思维导图', 'AI原生'],
    pricing_type: 'freemium'
  },
  {
    name: '万能小in',
    tagline: '3分钟4万字150+应用，只需标题，快速生成毕业论文',
    description: '万能小in是强大的AI论文生成工具，能在3分钟内生成4万字的长文。支持150+不同应用场景，只需输入标题即可快速生成毕业论文。具备智能结构、自动引用、格式规范等功能。特别适合毕业季的学生使用，大大提高论文写作效率。',
    website_url: 'https://wanxiaoin.com',
    tags: ['快速生成', '毕业论文', '长文写作', '高效工具'],
    pricing_type: 'freemium'
  },
  {
    name: '墨问',
    tagline: '专为创作者设计的AI笔记工具',
    description: '墨问是专为创作者设计的AI笔记工具，提供智能记录、整理、创作功能。支持语音转文字、图片识别、智能标签等功能。具备知识图谱、灵感捕捉、内容生成等特色。界面设计简洁优雅，适合作家、记者、研究人员等创作者使用。',
    website_url: 'https://mowen.ai',
    tags: ['AI笔记', '创作者工具', '知识管理', '灵感记录'],
    pricing_type: 'freemium'
  },
  {
    name: '超级小说家',
    tagline: '专为网文作家和短剧编剧打造的AI创作助手',
    description: '超级小说家是专为网文作家和短剧编剧设计的AI创作工具。提供小说创作、剧本编写、角色设定等功能。支持多种网文类型和短剧格式。具备情节推演、对话生成、世界观构建等专业功能。内置热门IP分析工具，帮助创作者把握市场趋势。',
    website_url: 'https://chaojixiaoshuojia.com',
    tags: ['网文创作', '短剧编剧', 'IP分析', '市场趋势'],
    pricing_type: 'freemium'
  },
  {
    name: 'FeelFish',
    tagline: '专为小说创作者打造的 AI 写作 PC 客户端软件',
    description: 'FeelFish是专业的小说创作PC客户端软件，提供本地化的写作体验。支持离线写作、云端同步、版本管理等功能。具备智能续写、人物管理、情节时间线等专业功能。界面专为长文写作优化，提供专注模式和护眼模式，是小说家的专业创作工具。',
    website_url: 'https://feelfish.com',
    tags: ['PC客户端', '离线写作', '小说创作', '专业工具'],
    pricing_type: 'paid'
  },
  {
    name: 'Loomi',
    tagline: '创作版Claude Code，AI原生写作工具',
    description: 'Loomi被称为创作版的Claude Code，是专为写作者设计的AI原生工具。提供代码级的内容创作能力，支持复杂的文档结构和逻辑关系。具备版本控制、协作编辑、智能重构等功能。适合技术文档、学术著作、专业书籍等高质量内容创作。',
    website_url: 'https://loomi.ai',
    tags: ['AI原生', '专业写作', '版本控制', '协作编辑'],
    pricing_type: 'freemium'
  },
  {
    name: '落笔AI写作',
    tagline: '专注于小说网文创作的AI写作工具',
    description: '落笔AI写作是专注于网文小说创作的AI工具，深度理解网文创作规律。提供章节生成、情节推进、人物塑造等功能。支持玄幻、都市、言情、历史等主流网文类型。具备热点追踪、读者偏好分析、SEO优化等特色功能，帮助作者提升作品人气。',
    website_url: 'https://luobi.ai',
    tags: ['网文创作', '小说写作', '热点追踪', '读者分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'ReadPo',
    tagline: 'AI读写助手，支持内容聚合快速阅读并总结',
    description: 'ReadPo是AI驱动的读写助手，提供内容聚合、快速阅读、智能总结功能。支持多源信息采集、关键信息提取、观点整合等功能。具备个性化推荐、阅读效率优化、知识图谱构建等特色。适合研究人员、学生、专业人士等需要大量阅读的用户。',
    website_url: 'https://readpo.com',
    tags: ['阅读助手', '内容聚合', '信息总结', '知识管理'],
    pricing_type: 'freemium'
  },
  {
    name: '小鱼AI写作',
    tagline: '一站式AI写作平台，一键生成高质量原创内容',
    description: '小鱼AI写作是功能全面的AI写作平台，提供一站式的内容创作服务。支持多种文体和风格，一键生成高质量原创内容。具备智能改写、SEO优化、批量生成等功能。界面操作简单，生成速度快，适合内容营销、自媒体、学术写作等多种场景。',
    website_url: 'https://xiaoyu.ai',
    tags: ['一站式平台', '原创内容', 'SEO优化', '批量生成'],
    pricing_type: 'freemium'
  },
  {
    name: '材料星AI',
    tagline: '专为秘书工作设计的AI写作工具',
    description: '材料星AI是专为行政秘书设计的专业写作工具。提供公文写作、会议纪要、工作报告等功能。支持各类公文模板和格式规范。具备智能拟稿、政策解读、文件管理等特色功能。界面设计符合办公习惯，是秘书工作者的效率神器。',
    website_url: 'https://cailiaoxing.ai',
    tags: ['秘书工具', '公文写作', '会议纪要', '办公效率'],
    pricing_type: 'paid'
  },
  {
    name: '量子探险',
    tagline: 'AI小说写作工具，长文本一键生成',
    description: '量子探险是专注于长篇小说创作的AI写作工具。支持一键生成数万字的长文本内容。提供世界观构建、角色系统、情节框架等创作支持。具备风格一致性、逻辑连贯性、情感表达等质量控制功能。适合创作长篇网络小说、文学作品等。',
    website_url: 'https://liangziutanxian.com',
    tags: ['长文本生成', '小说创作', '世界观构建', '文学创作'],
    pricing_type: 'freemium'
  },
  {
    name: '社研通',
    tagline: '专注于服务文科研究生的多模态AI学术写作工具',
    description: '社研通是专为文科研究生设计的多模态AI学术写作工具。支持文本、图像、音频等多种模态的学术内容创作。提供定性分析、理论框架、研究方法等专业支持。具备文献综述、案例分析、批判性思维等文科特色功能。',
    website_url: 'https://sheyantong.com',
    tags: ['文科研究', '多模态写作', '定性分析', '学术写作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Rubriq',
    tagline: '免费试用，AI学术论文润色与翻译工具',
    description: 'Rubriq是专业的学术论文润色和翻译工具，提供免费试用服务。支持中英双语互译、学术语言润色、格式规范检查等功能。具备专业术语优化、逻辑表达改进、引用格式规范等特色。适合发表论文、国际交流等学术场景。',
    website_url: 'https://rubriq.com',
    tags: ['论文润色', '学术翻译', '免费试用', '国际发表'],
    pricing_type: 'freemium'
  },
  {
    name: 'QuillBot',
    tagline: 'AI英/德语写作润色和改进工具',
    description: 'QuillBot是国际知名的AI写作润色工具，支持英语和德语。提供语法检查、风格改进、同义词替换等功能。具备多种写作模式，包括正式、非正式、创意等。支持实时润色、批量处理、浏览器插件等，是外语写作的专业助手。',
    website_url: 'https://quillbot.com',
    tags: ['多语言支持', '语法检查', '风格改进', '国际工具'],
    pricing_type: 'freemium'
  },
  {
    name: '创一AI',
    tagline: 'AI评剧本，轻松创作爆款剧本',
    description: '创一AI是专业的剧本创作和评估工具。提供剧本写作、结构分析、市场评估等功能。支持电影、电视剧、短视频等多种剧本格式。具备AI剧本评估、情节优化、角色塑造等专业功能。帮助编剧创作出更符合市场需求的爆款剧本。',
    website_url: 'https://chuangyi.ai',
    tags: ['剧本创作', 'AI评估', '市场分析', '编剧工具'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞文书',
    tagline: '科大讯飞推出的AI公文写作助手',
    description: '讯飞文书是科大讯飞推出的专业公文写作助手。提供各类公文模板和智能写作功能。支持通知、报告、请示、函件等标准公文格式。具备智能拟稿、格式检查、政策法规查询等特色功能。是政府机关、企事业单位的办公好帮手。',
    website_url: 'https://wenshu.xunfei.cn',
    tags: ['公文写作', '科大讯飞', '格式规范', '办公助手'],
    pricing_type: 'paid'
  },
  {
    name: 'Muset',
    tagline: '为深度创作者提供的AI原生写作工具',
    description: 'Muset是为深度创作者设计的AI原生写作工具。提供长文创作、深度思考、知识整合等功能。支持复杂的文档结构和逻辑关系。具备版本管理、协作编辑、智能重构等高级功能。适合学术著作、专业书籍、深度报道等高质量内容创作。',
    website_url: 'https://muset.ai',
    tags: ['深度创作', 'AI原生', '知识整合', '专业写作'],
    pricing_type: 'freemium'
  },
  {
    name: '华文笔杆',
    tagline: '一站式AI公文写作工具',
    description: '华文笔杆是专业的一站式AI公文写作平台。提供全面的公文写作服务，包括拟稿、审核、格式化等环节。支持各类公文模板和标准格式。具备智能写作、合规检查、历史文档管理等功能。是机关单位公文处理的专业工具。',
    website_url: 'https://huawenbigan.com',
    tags: ['公文写作', '一站式服务', '合规检查', '文档管理'],
    pricing_type: 'paid'
  },
  {
    name: '千页小说AI',
    tagline: '一站式AI小说写作平台，从灵感到完稿',
    description: '千页小说AI是完整的小说创作平台，提供从灵感到完稿的全流程服务。支持创意激发、大纲设计、章节生成、全文润色等功能。具备人物管理、情节时间线、世界观构建等专业工具。适合各类小说创作，特别是长篇网络小说。',
    website_url: 'https://qianye.ai',
    tags: ['小说创作', '全流程服务', '灵感管理', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: '秘塔写作猫',
    tagline: 'AI写作，文章自成',
    description: '秘塔写作猫是知名的AI写作工具，提供智能写作和编辑功能。支持多种文体和写作场景。具备AI写作、语法检查、风格优化等功能。界面设计简洁，操作便捷，适合日常写作和内容创作。',
    website_url: 'https://xiezuocat.com',
    tags: ['AI写作', '语法检查', '风格优化', '简单易用'],
    pricing_type: 'freemium'
  },
  {
    name: '松果AI写作',
    tagline: 'AI写作工具，支持批量生成文章',
    description: '松果AI写作是支持批量生成的AI写作工具。提供批量文章生成、主题多样化、风格定制等功能。适合内容营销、自媒体运营、SEO文章等场景。具备模板库、批量处理、质量把控等特色功能，是内容创作者的效率工具。',
    website_url: 'https://songguo.ai',
    tags: ['批量生成', '内容营销', 'SEO文章', '效率工具'],
    pricing_type: 'freemium'
  },
  {
    name: '公文宝',
    tagline: '体制工作者的AI公文写作专家',
    description: '公文宝是专为体制内工作者设计的AI公文写作工具。提供专业的公文写作服务，包括各类公文模板和智能拟稿功能。支持标准公文格式和规范要求。具备智能写作、合规检查、历史文档管理等特色功能，是机关单位办公的专业助手。',
    website_url: 'https://gongwenbao.com',
    tags: ['公文写作', '体制内', '专业助手', '合规检查'],
    pricing_type: 'paid'
  },
  {
    name: '讯飞写作',
    tagline: '科大讯飞推出的AI智能写作助手',
    description: '讯飞写作是科大讯飞推出的通用AI写作助手。提供多场景的智能写作服务，包括作文、简历、文案等。支持多种文体和风格。具备智能写作、语言优化、格式规范等功能。界面友好，适合学生、职场人士等广大用户群体。',
    website_url: 'https://xiezuo.xunfei.cn',
    tags: ['科大讯飞', '智能写作', '多场景', '通用工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'PaperXie智能写作',
    tagline: 'AI学术写作辅助工具，覆盖全流程服务',
    description: 'PaperXie是全面的AI学术写作辅助工具，覆盖从选题到发表的全流程。提供文献检索、开题报告、论文写作、投稿指导等服务。支持多学科、多层次的学术写作需求。具备专业指导、质量把控、进度管理等特色功能。',
    website_url: 'https://paperxie.com',
    tags: ['学术写作', '全流程服务', '专业指导', '质量把控'],
    pricing_type: 'freemium'
  },
  {
    name: 'FlowUs AI',
    tagline: '在线文档平台息流推出的AI创作助手，类似于Notion AI',
    description: 'FlowUs AI是在线文档平台FlowUs推出的AI创作助手，功能类似于Notion AI。提供文档写作、知识管理、团队协作等功能。支持智能写作、内容优化、自动总结等AI功能。具备模板丰富、协作便捷、集成度高特色，适合个人和团队使用。',
    website_url: 'https://flowus.cn/ai',
    tags: ['在线文档', '知识管理', '团队协作', 'Notion替代'],
    pricing_type: 'freemium'
  },
  {
    name: 'Rytr',
    tagline: 'AI内容生成和写作助手',
    description: 'Rytr是国际知名的AI内容生成和写作助手。提供多语言、多场景的内容创作服务。支持博客文章、营销文案、社交媒体内容等。具备多种写作风格、语气调整、SEO优化等功能。界面简洁，生成速度快，适合全球内容创作者使用。',
    website_url: 'https://rytr.me',
    tags: ['内容生成', '多语言', 'SEO优化', '国际工具'],
    pricing_type: 'freemium'
  },
  {
    name: '迅捷AI写作',
    tagline: '迅捷办公团队推出的AI写作工具',
    description: '迅捷AI写作是迅捷办公团队推出的专业写作工具。提供文档处理、内容创作、格式转换等功能。支持多种办公场景和文档类型。具备智能写作、格式优化、批量处理等特色功能。适合办公人士和内容创作者使用。',
    website_url: 'https://xunjie.ai',
    tags: ['迅捷办公', '文档处理', '格式转换', '办公工具'],
    pricing_type: 'freemium'
  },
  {
    name: '橙篇',
    tagline: '百度推出的AI长文理解和内容创作工具',
    description: '橙篇是百度推出的专业长文处理工具，提供深度理解和内容创作功能。支持长文档分析、内容总结、智能创作等功能。具备深度阅读、逻辑分析、知识图谱等百度AI技术优势。适合处理长篇报告、学术论文、专业文献等。',
    website_url: 'https://chengpian.baidu.com',
    tags: ['百度出品', '长文理解', '内容创作', '知识图谱'],
    pricing_type: 'freemium'
  },
  {
    name: '深言达意',
    tagline: '免费的词句查询智能写作辅助工具，输入模糊描述即可查找词句',
    description: '深言达意是独特的智能写作辅助工具，专注于词句查询和表达优化。用户只需输入模糊描述，即可找到合适的词句表达。支持同义词查询、句式优化、表达建议等功能。完全免费使用，是提升写作表达能力的专业工具。',
    website_url: 'https://shenyandayi.com',
    tags: ['词句查询', '表达优化', '免费工具', '写作辅助'],
    pricing_type: 'free'
  },
  {
    name: '彩云小梦',
    tagline: '彩云科技推出的智能AI故事写作工具',
    description: '彩云小梦是彩云科技推出的AI故事创作工具。专注于故事和小说的创作，提供情节生成、角色塑造、对话创作等功能。支持多种故事类型和风格。具备创意激发、情节推演、情感表达等特色功能，适合故事创作者使用。',
    website_url: 'https://xiaomeng.caiyunapp.com',
    tags: ['故事创作', '彩云科技', '情节生成', 'AI创意'],
    pricing_type: 'freemium'
  },
  {
    name: 'MidReal',
    tagline: 'AI互动式小说文本生成工具',
    description: 'MidReal是创新的互动式小说生成工具。提供AI与用户协作创作小说的体验，支持实时互动和情节分支。用户可以与AI共同决定故事走向，创造独特的阅读体验。具备互动性强、创意无限、个性化定制等特色。',
    website_url: 'https://midreal.ai',
    tags: ['互动小说', '协作创作', '个性化', '创新体验'],
    pricing_type: 'freemium'
  },
  {
    name: '墨狐AI',
    tagline: '短篇小说AI写作助手，专为网文小说作者设计',
    description: '墨狐AI是专为网文小说作者设计的短篇小说写作助手。提供快速创作、情节设计、角色塑造等功能。特别针对短篇小说的特点进行优化。具备热点追踪、读者喜好分析、快速成稿等特色功能，适合网文平台创作者。',
    website_url: 'https://mohu.ai',
    tags: ['短篇小说', '网文创作', '快速成稿', '热点分析'],
    pricing_type: 'freemium'
  },
  {
    name: '掌桥科研AI论文',
    tagline: '依托3亿+真实文献库的AI论文写作工具',
    description: '掌桥科研AI论文依托掌桥科研3亿+真实文献库，提供专业的论文写作服务。支持文献检索、引用生成、论文写作等功能。具备真实的学术资源支撑，确保论文的学术性和权威性。适合各学科的研究人员和学生使用。',
    website_url: 'https://zhangqiao.ai',
    tags: ['文献库支撑', '学术权威', '论文写作', '科研服务'],
    pricing_type: 'freemium'
  },
  {
    name: '灵犀速写',
    tagline: 'AI小说创作工具，支持AI写作工作流',
    description: '灵犀速写是专业的AI小说创作工具，提供完整的AI写作工作流。从灵感捕捉到完稿发布，全程AI辅助。支持大纲设计、章节生成、全文润色等功能。具备工作流优化、质量把控、效率提升等特色，适合小说创作者。',
    website_url: 'https://lingxi.suxie.com',
    tags: ['小说创作', 'AI工作流', '效率提升', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Copy.ai',
    tagline: '人工智能营销文案和内容创作工具',
    description: 'Copy.ai是国际知名的AI营销文案和内容创作工具。提供广告文案、营销内容、品牌故事等创作服务。支持多种营销场景和文案类型。具备品牌语调学习、A/B测试建议、效果优化等高级功能，是营销人员的专业工具。',
    website_url: 'https://copy.ai',
    tags: ['营销文案', '品牌创作', 'A/B测试', '国际工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Jasper',
    tagline: 'AI文字内容创作工具',
    description: 'Jasper是全球领先的AI内容创作工具，提供高质量的文字内容生成服务。支持博客文章、广告文案、社交媒体内容等多种类型。具备50+写作模板、品牌语调定制、SEO优化等功能。是内容营销和品牌推广的专业工具。',
    website_url: 'https://jasper.ai',
    tags: ['内容创作', '品牌营销', '模板丰富', 'SEO优化'],
    pricing_type: 'paid'
  },
  {
    name: '库宝AI工作助手',
    tagline: '千库网推出的多功能AI创作工具',
    description: '库宝AI工作助手是千库网推出的多功能AI创作平台。整合了千库网丰富的设计资源，提供文案创作、设计建议、内容优化等功能。支持多种创作场景和媒体类型。具备资源丰富、操作便捷、效果专业等特色。',
    website_url: 'https://kubao.ai',
    tags: ['千库网', '多功能工具', '设计资源', '创作平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'Grammarly',
    tagline: 'AI英语语法和拼写检查写作助手',
    description: 'Grammarly是全球知名的AI英语写作助手，提供专业的语法检查和拼写校对服务。支持语法纠错、风格改进、语气调整等功能。具备实时检查、浏览器插件、多平台同步等特色。是英语写作和学习必备工具。',
    website_url: 'https://grammarly.com',
    tags: ['语法检查', '英语写作', '拼写校对', '学习工具'],
    pricing_type: 'freemium'
  },
  {
    name: '文状元',
    tagline: 'AI公文写作助手，提供大量范文库',
    description: '文状元是专业的AI公文写作助手，提供丰富的范文库资源。支持各类公文写作，包括报告、请示、通知、函件等。具备智能写作、模板参考、格式规范等功能。特别适合政府机关和事业单位使用。',
    website_url: 'https://wenzhuangyuan.com',
    tags: ['公文写作', '范文库', '格式规范', '政府办公'],
    pricing_type: 'paid'
  },
  {
    name: '晓语台',
    tagline: '智能AI写作工具，内置500+创作模板',
    description: '晓语台是功能全面的AI写作工具，内置500+创作模板。覆盖各种写作场景和文体类型。支持智能写作、模板套用、风格定制等功能。界面设计简洁，操作便捷，适合广大写作爱好者使用。',
    website_url: 'https://xiaoyutai.com',
    tags: ['模板丰富', '多场景写作', '智能创作', '简单易用'],
    pricing_type: 'freemium'
  },
  {
    name: 'Writesonic',
    tagline: 'AI写作，文案，释义工具',
    description: 'Writesonic是国际知名的AI写作和文案创作工具。提供文章写作、营销文案、内容释义等功能。支持多种语言和写作风格。具备SEO优化、A/B测试、效果分析等高级功能，是内容营销的专业工具。',
    website_url: 'https://writesonic.com',
    tags: ['文案创作', '内容释义', 'SEO优化', '多语言'],
    pricing_type: 'freemium'
  },
  {
    name: 'DeepL Write',
    tagline: 'DeepL推出的AI驱动的写作助手',
    description: 'DeepL Write是DeepL推出的专业AI写作助手。依托DeepL强大的语言处理能力，提供高质量的写作和翻译服务。支持多语言写作、语法检查、风格优化等功能。具备翻译准确、表达自然、专业性强等特色。',
    website_url: 'https://deepl.com/write',
    tags: ['DeepL出品', '多语言写作', '专业翻译', '高质量'],
    pricing_type: 'freemium'
  },
  {
    name: 'Jenni',
    tagline: 'AI研究文章和博客写作辅助工具',
    description: 'Jenni是专为研究文章和博客写作设计的AI辅助工具。提供学术写作、博客创作、内容研究等功能。支持文献引用、数据分析、逻辑构建等学术写作需求。具备研究辅助、质量把控、原创性检查等特色功能。',
    website_url: 'https://jenni.ai',
    tags: ['研究文章', '博客写作', '学术辅助', '原创检查'],
    pricing_type: 'freemium'
  },
  {
    name: '有道翻译·AI写作',
    tagline: '网易有道推出的智能写作辅助工具，支持100多种语言',
    description: '有道翻译·AI写作是网易有道推出的多语言智能写作工具。支持100多种语言的写作和翻译服务。提供语法检查、风格优化、文化适配等功能。具备翻译准确、语言丰富、文化理解等有道技术优势。',
    website_url: 'https://fanyi.youdao.com/ai-writing',
    tags: ['有道出品', '多语言支持', '翻译写作', '文化适配'],
    pricing_type: 'freemium'
  },
  {
    name: 'Wordvice AI',
    tagline: 'Wordvice推出的免费AI写作助手',
    description: 'Wordvice AI是Wordvice推出的免费AI写作助手。提供学术写作、语法检查、语言润色等服务。特别针对学术英语写作进行优化。具备专业术语、学术规范、期刊标准等特色功能，适合学术研究者使用。',
    website_url: 'https://wordvice.ai',
    tags: ['学术写作', '免费工具', '英语润色', '期刊标准'],
    pricing_type: 'freemium'
  },
  {
    name: 'AI新媒体文章',
    tagline: '夸克推出的AI写作工具',
    description: 'AI新媒体文章是夸克推出的专业新媒体写作工具。提供热点追踪、内容创作、传播优化等功能。特别针对新媒体平台特点进行优化。具备热点分析、标题优化、传播预测等特色功能，适合新媒体创作者。',
    website_url: 'https://quark.cn/ai-writing',
    tags: ['夸克出品', '新媒体写作', '热点追踪', '传播优化'],
    pricing_type: 'freemium'
  },
  {
    name: '魔撰写作',
    tagline: '出门问问旗下推出的AI智能写作工具',
    description: '魔撰写作是出门问问推出的AI智能写作工具。提供多场景的智能写作服务，包括文案、故事、剧本等。依托出门问问的AI技术优势，提供高质量的生成内容。具备语音输入、智能续写、风格学习等特色功能。',
    website_url: 'https://mzhuang.com',
    tags: ['出门问问', '智能写作', '语音输入', '风格学习'],
    pricing_type: 'freemium'
  },
  {
    name: '宙语Cosmos',
    tagline: '专为中文写作设计的AI智能写作助手',
    description: '宙语Cosmos是专为中文写作设计的AI智能助手。深度理解中文表达习惯和文化内涵。提供文学创作、公文写作、学术写作等服务。具备中文语境理解、文化表达、语言美学等特色功能。',
    website_url: 'https://zhouyu.cosmos',
    tags: ['中文写作', '文化理解', '语言美学', '专业助手'],
    pricing_type: 'freemium'
  },
  {
    name: '灵构AI笔记',
    tagline: '在线安全的灵感收集、思路整理AI笔记工具',
    description: '灵构AI笔记是专业的AI笔记工具，提供安全的灵感收集和思路整理功能。支持智能分类、自动标签、知识图谱等功能。具备云端同步、隐私保护、协作分享等特色。适合创意工作者和知识管理者使用。',
    website_url: 'https://linggou.ai',
    tags: ['AI笔记', '灵感收集', '思路整理', '知识管理'],
    pricing_type: 'freemium'
  },
  {
    name: '有道写作',
    tagline: '网易有道出品的智能英文写作修改和润色工具',
    description: '有道写作是网易有道推出的专业英文写作工具。提供语法检查、语言润色、风格优化等服务。依托有道强大的翻译和语言技术，提供专业的英文写作支持。适合学生、职场人士等需要英文写作的用户。',
    website_url: 'https://writing.youdao.com',
    tags: ['有道出品', '英文写作', '语言润色', '语法检查'],
    pricing_type: 'freemium'
  },
  {
    name: '写作蛙',
    tagline: '智谱AI推出的免费智能写作工具',
    description: '写作蛙是智谱AI推出的免费智能写作工具。提供多场景的写作服务，包括作文、文案、小说等。依托智谱AI的强大语言模型，提供高质量的生成内容。完全免费使用，适合广大写作爱好者。',
    website_url: 'https://xiezuo.zhipuai.cn',
    tags: ['智谱AI', '免费工具', '多场景写作', '高质量生成'],
    pricing_type: 'free'
  },
  {
    name: '文思助手',
    tagline: '强大的AI写作智能体，支持生成专业报告和科研论文',
    description: '文思助手是功能强大的AI写作智能体，专注于专业报告和科研论文的生成。提供学术写作、研究报告、技术文档等服务。具备专业分析、逻辑构建、学术规范等特色功能，适合研究人员和专业人士使用。',
    website_url: 'https://wensi.ai',
    tags: ['专业报告', '科研论文', '学术写作', '智能分析'],
    pricing_type: 'freemium'
  },
  {
    name: 'WriteWise',
    tagline: '喜马拉雅推出的免费网文和小说AI写作工具',
    description: 'WriteWise是喜马拉雅推出的免费AI写作工具，专注于网文和小说创作。提供章节生成、情节设计、角色塑造等功能。结合喜马拉雅的内容生态，提供有声化适配等特色功能。适合网文作者和有声内容创作者。',
    website_url: 'https://writewise.ximalaya.com',
    tags: ['喜马拉雅出品', '网文创作', '小说写作', '有声适配'],
    pricing_type: 'free'
  },
  {
    name: '百度作家平台',
    tagline: '百度免费AI小说写作工具',
    description: '百度作家平台是百度推出的免费AI小说写作工具。提供小说创作、发布、运营等全流程服务。依托百度强大的AI技术和流量优势，为创作者提供全方位支持。完全免费使用，适合小说创作者。',
    website_url: 'https://zuojia.baidu.com',
    tags: ['百度出品', '免费工具', '小说创作', '流量支持'],
    pricing_type: 'free'
  },
  {
    name: '爱创作',
    tagline: 'ZAKER新闻推出的AI写作工具',
    description: '爱创作是ZAKER新闻推出的AI写作工具，专注于新闻和内容创作。提供新闻写作、热点评论、内容编辑等功能。结合ZAKER的新闻优势，提供热点追踪、传播分析等特色功能。适合新闻工作者和内容创作者。',
    website_url: 'https://aichuangzuo.zaker.com',
    tags: ['ZAKER出品', '新闻写作', '热点追踪', '内容创作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Verse',
    tagline: '印象笔记旗下团队推出的AI写作和文档工具',
    description: 'Verse是印象笔记团队推出的AI写作和文档工具。提供智能写作、知识管理、文档协作等功能。与印象笔记深度整合，支持笔记智能处理和知识图谱构建。具备笔记优化、智能总结、知识关联等特色功能。',
    website_url: 'https://verse.yinxiang.com',
    tags: ['印象笔记', '知识管理', '文档协作', '智能处理'],
    pricing_type: 'freemium'
  },
  {
    name: 'Moonbeam',
    tagline: '长文章AI内容创作助手',
    description: 'Moonbeam是专业的长文章AI创作助手。提供长文写作、结构规划、内容优化等功能。特别适合长篇报告、学术论文、深度文章等创作。具备逻辑构建、连贯性优化、质量把控等特色功能。',
    website_url: 'https://moonbeam.ai',
    tags: ['长文写作', '结构规划', '逻辑构建', '质量把控'],
    pricing_type: 'freemium'
  },
  {
    name: 'Cohesive',
    tagline: '人工智能文案内容创作和编辑工具',
    description: 'Cohesive是专业的AI文案创作和编辑工具。提供营销文案、品牌内容、社交媒体内容等服务。具备内容创作、编辑优化、效果分析等功能。支持团队协作和版本管理，适合营销团队使用。',
    website_url: 'https://cohesive.ai',
    tags: ['文案创作', '内容编辑', '团队协作', '效果分析'],
    pricing_type: 'freemium'
  },
  {
    name: '万彩AI',
    tagline: '全能型AI内容和文案创作助手',
    description: '万彩AI是全能型的AI内容创作平台。提供文案写作、图像生成、视频制作等多媒体创作服务。支持多种内容类型和创作场景。具备一站式创作、多媒体支持、模板丰富等特色功能。',
    website_url: 'https://wancai.ai',
    tags: ['全能创作', '多媒体支持', '一站式服务', '模板丰富'],
    pricing_type: 'freemium'
  },
  {
    name: 'WritingPal',
    tagline: '面向留学生的AI英文写作工具',
    description: 'WritingPal是专为留学生设计的AI英文写作工具。提供学术写作、论文辅导、语言润色等服务。特别针对留学生的写作需求和学习特点进行优化。具备学术规范、语言适应、文化理解等特色功能。',
    website_url: 'https://writingpal.com',
    tags: ['留学生工具', '英文写作', '学术辅导', '语言适应'],
    pricing_type: 'freemium'
  },
  {
    name: 'Magic Write',
    tagline: 'Canva旗下AI文案生成器',
    description: 'Magic Write是Canva推出的AI文案生成器，与设计工具深度整合。提供营销文案、社交媒体内容、品牌故事等创作服务。支持与Canva设计模板的无缝配合，实现图文一体化创作。适合设计师和营销人员使用。',
    website_url: 'https://canva.com/magic-write',
    tags: ['Canva出品', '设计整合', '图文创作', '营销文案'],
    pricing_type: 'freemium'
  },
  {
    name: 'NovelAI',
    tagline: 'AI小说故事创作工具',
    description: 'NovelAI是国际知名的AI小说创作工具。提供故事生成、角色塑造、情节设计等功能。支持多种文学类型和写作风格。具备创意生成、风格学习、质量把控等特色功能，适合小说创作者使用。',
    website_url: 'https://novelai.net',
    tags: ['小说创作', '故事生成', '风格学习', '国际工具'],
    pricing_type: 'paid'
  },
  {
    name: '奇妙文',
    tagline: '出门问问推出的AI写作助理',
    description: '奇妙文是出门问问推出的AI写作助理。提供多场景的智能写作服务，包括文案、故事、剧本等。依托出门问问的AI技术优势，提供高质量的生成内容。具备语音交互、智能续写、个性化学习等特色功能。',
    website_url: 'https://qimiawen.com',
    tags: ['出门问问', '智能助理', '语音交互', '个性化学习'],
    pricing_type: 'freemium'
  },
  {
    name: 'Spell.tools',
    tagline: '高颜值AI内容营销创作工具',
    description: 'Spell.tools是注重设计美感的AI内容营销创作工具。提供营销文案、品牌内容、社交媒体创作等服务。界面设计精美，用户体验优秀。具备视觉创作、品牌美学、效果分析等特色功能。',
    website_url: 'https://spell.tools',
    tags: ['高颜值设计', '内容营销', '品牌美学', '用户体验'],
    pricing_type: 'freemium'
  },
  {
    name: 'HyperWrite',
    tagline: 'AI写作助手帮助你创作内容更自信',
    description: 'HyperWrite是帮助用户提升写作信心的AI助手。提供写作建议、内容优化、风格改进等服务。具备实时反馈、学习指导、个性化建议等特色功能。适合各种水平的写作者使用。',
    website_url: 'https://hyperwrite.ai',
    tags: ['写作助手', '信心提升', '个性化建议', '学习指导'],
    pricing_type: 'freemium'
  },
  {
    name: 'Typeface AI',
    tagline: 'AI创意内容创作助手',
    description: 'Typeface AI是专注于创意内容创作的AI工具。提供品牌故事、营销创意、广告文案等服务。具备创意激发、品牌语调学习、视觉化表达等特色功能。适合创意工作者和营销团队使用。',
    website_url: 'https://typeface.ai',
    tags: ['创意内容', '品牌故事', '视觉表达', '营销创意'],
    pricing_type: 'freemium'
  },
  {
    name: '悉语',
    tagline: '阿里旗下智能文案工具，一键生成电商营销文案',
    description: '悉语是阿里巴巴推出的智能电商文案工具。专为电商营销场景优化，提供产品描述、广告文案、推广内容等服务。依托阿里电商生态，提供行业洞察、转化优化等特色功能。',
    website_url: 'https://xiyu.ali.com',
    tags: ['阿里出品', '电商文案', '营销优化', '转化提升'],
    pricing_type: 'freemium'
  },
  {
    name: '文涌Effidit',
    tagline: '腾讯AI Lab开发的智能创作助手',
    description: '文涌Effidit是腾讯AI Lab开发的智能创作助手。依托腾讯强大的AI技术实力，提供专业的写作辅助服务。具备深度理解、智能创作、风格学习等特色功能。适合各种专业写作场景。',
    website_url: 'https://effidit.qq.com',
    tags: ['腾讯AI Lab', '智能创作', '深度学习', '专业写作'],
    pricing_type: 'freemium'
  },
  {
    name: '火龙果写作',
    tagline: 'AI驱动的文字生产力工具',
    description: '火龙果写作是AI驱动的文字生产力工具。提供文档处理、内容创作、知识管理等功能。具备智能写作、效率优化、协作编辑等特色功能。适合提升个人和团队的文字工作效率。',
    website_url: 'https://huolongguo.ai',
    tags: ['生产力工具', '效率提升', '协作编辑', '知识管理'],
    pricing_type: 'freemium'
  },
  {
    name: '树熊写作',
    tagline: '树熊AI推出的AI智能写作工具',
    description: '树熊写作是树熊AI推出的智能写作工具。提供多场景的写作服务，包括文案、故事、学术等。具备智能创作、风格定制、质量把控等功能。界面友好，操作便捷，适合广大用户使用。',
    website_url: 'https://shuxiong.ai',
    tags: ['树熊AI', '智能写作', '多场景服务', '质量把控'],
    pricing_type: 'freemium'
  },
  {
    name: '爱改写',
    tagline: 'AI改写、纠错、润色辅助工具',
    description: '爱改写是专业的文本改写和润色工具。提供智能改写、语法纠错、语言润色等服务。支持多种改写风格和语言优化。具备原创性提升、表达改进、质量优化等特色功能。',
    website_url: 'https://aigaixie.com',
    tags: ['文本改写', '语法纠错', '语言润色', '原创提升'],
    pricing_type: 'freemium'
  },
  {
    name: 'HeyFriday',
    tagline: '国内团队推出的智能AI写作工具',
    description: 'HeyFriday是国内团队推出的智能AI写作工具。提供多场景的写作服务，特别针对中文写作优化。具备智能创作、文化理解、语言美学等特色功能。界面设计现代化，适合中文用户使用。',
    website_url: 'https://heyfriday.ai',
    tags: ['国内团队', '中文优化', '智能创作', '现代界面'],
    pricing_type: 'freemium'
  },
  {
    name: '易撰',
    tagline: '新媒体AI内容创作助手',
    description: '易撰是专业的新媒体AI内容创作助手。提供新媒体文案、热点内容、传播分析等服务。特别针对新媒体平台特点进行优化。具备热点追踪、传播优化、效果分析等特色功能。',
    website_url: 'https://yizhuan.com',
    tags: ['新媒体创作', '热点追踪', '传播分析', '效果优化'],
    pricing_type: 'freemium'
  },
  {
    name: '智搜',
    tagline: 'Giiso写作机器人，内容创作AI辅助工具',
    description: '智搜是Giiso推出的写作机器人和内容创作AI辅助工具。提供智能写作、内容研究、素材收集等服务。具备信息检索、知识整合、智能创作等特色功能。适合内容创作者和研究人员使用。',
    website_url: 'https://zhisou.ai',
    tags: ['Giiso出品', '写作机器人', '内容研究', '知识整合'],
    pricing_type: 'freemium'
  },
  {
    name: '创作王',
    tagline: 'AI一键帮助你创作营销内容',
    description: '创作王是专业的营销内容创作工具。提供营销文案、品牌内容、广告创意等服务。具备一键创作、风格定制、效果优化等特色功能。适合营销人员和内容创作者使用。',
    website_url: 'https://chuangzuowang.com',
    tags: ['营销内容', '一键创作', '风格定制', '效果优化'],
    pricing_type: 'freemium'
  },
  {
    name: '字符狂飙',
    tagline: '全方位AI文档生成工具，快速生成专业文档',
    description: '字符狂飙是全方位的AI文档生成工具。提供各类专业文档的快速生成服务。支持报告、方案、合同等多种文档类型。具备模板丰富、格式规范、质量把控等特色功能。',
    website_url: 'https://zifukuangbiao.com',
    tags: ['文档生成', '专业模板', '格式规范', '快速生成'],
    pricing_type: 'freemium'
  },
  {
    name: 'XPaper AI',
    tagline: '晓语台旗下的论文写作辅助指导平台',
    description: 'XPaper AI是晓语台旗下的专业论文写作指导平台。提供论文写作全流程的辅助和指导服务。支持选题指导、文献分析、写作辅导等功能。具备专业指导、质量把控、进度管理等特色功能。',
    website_url: 'https://xpaper.ai',
    tags: ['论文指导', '写作辅导', '质量把控', '专业服务'],
    pricing_type: 'freemium'
  },
  {
    name: '悟智写作',
    tagline: '人工智能驱动的自动化写作平台',
    description: '悟智写作是AI驱动的自动化写作平台。提供大规模、自动化的内容生成服务。支持批量创作、模板化生成、自动化流程等功能。具备效率优化、成本控制、质量稳定等特色功能。',
    website_url: 'https://wuzhi.ai',
    tags: ['自动化写作', '批量创作', '效率优化', '成本控制'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞智检',
    tagline: '讯飞推出的智能写作SaaS工具，支持智能写作后的校对与合规审核',
    description: '讯飞智检是科大讯飞推出的智能写作SaaS工具，专注于写作后的校对和合规审核。提供语法检查、合规审查、风险识别等服务。具备智能校对、合规保障、风险防控等特色功能。适合企业和机构使用。',
    website_url: 'https://zhijian.xunfei.cn',
    tags: ['讯飞出品', '智能校对', '合规审核', '风险防控'],
    pricing_type: 'paid'
  },
  {
    name: '5118 SEO优化精灵',
    tagline: '一键式生成高质量SEO文章，提高搜索引擎排名获得更多流量',
    description: '5118 SEO优化精灵是专业的SEO文章生成工具。提供关键词优化、内容生成、排名提升等服务。具备SEO分析、关键词策略、内容优化等特色功能。适合网站运营和SEO优化人员使用。',
    website_url: 'https://5118.com/seo-elf',
    tags: ['SEO优化', '关键词策略', '排名提升', '流量增长'],
    pricing_type: 'freemium'
  },
  {
    name: 'ContentBot',
    tagline: 'AI快速写作工具',
    description: 'ContentBot是高效的AI快速写作工具。提供快速内容生成、批量创作、模板化写作等服务。具备高效率、高质量、多场景等特色功能。适合需要快速产出内容的用户使用。',
    website_url: 'https://contentbot.ai',
    tags: ['快速写作', '批量创作', '高效率', '多场景'],
    pricing_type: 'freemium'
  },
  {
    name: 'Bearly',
    tagline: 'AI阅读总结、写作和内容生成助手',
    description: 'Bearly是全能型的AI内容助手，提供阅读总结、写作创作、内容生成等服务。支持文档处理、信息提取、内容创作等功能。具备阅读效率、创作质量、信息整合等特色功能。',
    website_url: 'https://bearly.ai',
    tags: ['阅读总结', '内容生成', '信息整合', '全能助手'],
    pricing_type: 'freemium'
  },
  {
    name: '快文CopyDone',
    tagline: 'AIGC原创内容创作和营销文案生成',
    description: '快文CopyDone是专业的AIGC内容创作平台。提供原创内容生成、营销文案创作、品牌故事等服务。具备原创保障、质量优化、效果分析等特色功能。适合内容营销和品牌推广使用。',
    website_url: 'https://copydone.com',
    tags: ['AIGC创作', '原创内容', '营销文案', '品牌推广'],
    pricing_type: 'freemium'
  }
]

async function insertWritingTools() {
  console.log('开始插入写作类AI工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    
    for (const tool of writingTools) {
      console.log(`正在插入工具: ${tool.name}`)
      
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          id: generateId(),
          name: tool.name,
          tagline: tool.tagline,
          description: tool.description,
          website_url: tool.website_url,
          category: 'writing',
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
    
    console.log(`\n🎉 写作类工具插入完成！`)
    console.log(`✅ 成功: ${successCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计: ${writingTools.length} 个`)
  } catch (error) {
    console.error('插入过程中发生错误:', error)
  }
}

// 执行插入
insertWritingTools()
