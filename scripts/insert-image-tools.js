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

// AI图像工具数据
const imageTools = [
  {
    name: '绘蛙',
    tagline: 'AI电商营销工具，免费生成商品图',
    description: '绘蛙是专为电商营销设计的AI图像生成工具，专注于商品图的创作。提供产品展示、场景搭配、营销海报等多种图像生成服务。具备电商场景优化、产品细节突出、风格统一等特色功能。完全免费使用，是电商卖家和营销人员的理想工具。',
    website_url: 'https://huiwa.com',
    tags: ['电商图像', '商品图', '营销工具', '免费生成'],
    pricing_type: 'free'
  },
  {
    name: '堆友AI反应堆',
    tagline: '阿里堆友推出的多风格AI绘画生成器',
    description: '堆友AI反应堆是阿里巴巴堆友平台推出的多风格AI绘画生成器。提供多种艺术风格和绘画类型的图像生成服务。具备风格切换、质量优化、批量生成等功能。依托阿里强大的AI技术，生成效果专业且多样化，适合设计师和内容创作者使用。',
    website_url: 'https://ai.duiyou.com',
    tags: ['阿里出品', '多风格绘画', '艺术创作', '设计工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'LiblibAI·哩布哩布AI',
    tagline: '国内领先的AI图像创作平台和模型分享社区',
    description: 'LiblibAI是国内领先的AI图像创作平台，同时也是活跃的模型分享社区。提供高质量的图像生成服务和丰富的模型资源。支持多种AI绘画模型和风格定制。具备社区分享、模型下载、创作交流等特色功能，是AI创作者的专业平台。',
    website_url: 'https://liblib.ai',
    tags: ['模型社区', '图像创作', '模型分享', '创作者平台'],
    pricing_type: 'freemium'
  },
  {
    name: '稿定AI',
    tagline: '一站式AI设计工具集，免费AI绘图、图片转AI绘画、AI抠图消除',
    description: '稿定AI是稿定设计推出的一站式AI设计工具集。提供AI绘图、图片转AI绘画、AI抠图、智能消除等多种功能。具备设计模板、批量处理、效果优化等特色功能。界面设计专业，操作流程优化，适合设计师和普通用户使用。',
    website_url: 'https://ai.gaoding.com',
    tags: ['稿定出品', '一站式工具', '设计辅助', '图像处理'],
    pricing_type: 'freemium'
  },
  {
    name: '阿贝智能',
    tagline: '一站式AI绘本创作平台，副业变现必备',
    description: '阿贝智能是专业的AI绘本创作平台，提供从故事创作到图像生成的完整服务。支持绘本制作、故事生成、图像创作等功能。具备智能叙事、风格统一、批量创作等特色功能。特别适合副业创作和内容变现使用。',
    website_url: 'https://abei.ai',
    tags: ['绘本创作', '副业工具', '故事生成', '内容变现'],
    pricing_type: 'freemium'
  },
  {
    name: 'Midjourney',
    tagline: 'AI图像和插画生成工具',
    description: 'Midjourney是全球知名的AI图像和插画生成工具，以高质量的艺术风格图像著称。提供专业级的图像生成服务，支持多种艺术风格和创作需求。具备风格控制、细节优化、批量生成等功能。是艺术家和设计师的专业创作工具。',
    website_url: 'https://midjourney.com',
    tags: ['国际知名', '艺术创作', '高质量图像', '专业工具'],
    pricing_type: 'paid'
  },
  {
    name: 'Stable Diffusion',
    tagline: 'StabilityAI推出的文本到图像生成AI',
    description: 'Stable Diffusion是StabilityAI推出的开源文本到图像生成AI模型。提供高质量的图像生成服务，支持本地部署和自定义训练。具备开源免费、模型丰富、社区活跃等特色。是AI图像生成领域的重要技术基础。',
    website_url: 'https://stability.ai',
    tags: ['开源模型', '文本生成图像', '技术基础', '社区活跃'],
    pricing_type: 'opensource'
  },
  {
    name: 'Civitai',
    tagline: '免费的AI图像绘画作品和模型分享平台和社区',
    description: 'Civitai是全球知名的AI图像作品和模型分享平台。提供海量AI绘画作品展示和模型下载服务。具备作品分享、模型评测、社区交流等功能。界面设计现代化，是AI创作者的重要交流平台。',
    website_url: 'https://civitai.com',
    tags: ['模型分享', '作品展示', '社区平台', '国际知名'],
    pricing_type: 'free'
  },
  {
    name: '吐司AI',
    tagline: 'AI绘画模型社区和在线生图平台',
    description: '吐司AI是专业的AI绘画模型社区和在线生图平台。提供丰富的AI绘画模型和在线图像生成服务。具备模型分享、在线创作、作品展示等功能。界面设计友好，适合各水平的AI创作者使用。',
    website_url: 'https://toast.ai',
    tags: ['模型社区', '在线生图', '作品分享', '创作平台'],
    pricing_type: 'freemium'
  },
  {
    name: '造点AI',
    tagline: '夸克团队推出的AI图像与视频创作平台',
    description: '造点AI是夸克团队推出的综合性AI创作平台，支持图像和视频创作。提供AI绘画、视频生成、内容编辑等服务。具备多模态创作、质量优化、批量处理等特色功能。依托夸克的技术优势，提供专业的创作体验。',
    website_url: 'https://zaodian.ai',
    tags: ['夸克出品', '多模态创作', '图像视频', '技术优势'],
    pricing_type: 'freemium'
  },
  {
    name: 'RunningHub',
    tagline: '基于云端ComfyUI的AI图像与视频创作平台',
    description: 'RunningHub是基于云端ComfyUI的专业AI创作平台，支持图像和视频生成。提供可视化工作流、自定义节点、批量创作等功能。具备云端部署、工作流编辑、效果优化等特色功能，适合专业创作者使用。',
    website_url: 'https://runninghub.com',
    tags: ['ComfyUI', '云端平台', '工作流编辑', '专业创作'],
    pricing_type: 'freemium'
  },
  {
    name: '通义万相',
    tagline: '阿里推出的AI创意内容生成平台',
    description: '通义万相是阿里巴巴推出的AI创意内容生成平台。提供图像生成、创意设计、内容创作等服务。具备多模态生成、创意优化、批量处理等功能。依托阿里强大的AI技术，提供专业级的创作体验。',
    website_url: 'https://tongyi.aliyun.com/wanxiang',
    tags: ['阿里出品', '创意内容', '多模态生成', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: '可灵AI',
    tagline: '快手推出的AI图像和视频创作平台',
    description: '可灵AI是快手推出的AI创作平台，专注于图像和视频内容创作。提供AI绘画、视频生成、内容编辑等服务。具备短视频优化、社交内容适配、批量创作等特色功能。适合短视频创作者和内容营销使用。',
    website_url: 'https://keling.ai',
    tags: ['快手出品', '视频创作', '社交内容', '短视频优化'],
    pricing_type: 'freemium'
  },
  {
    name: '秒画',
    tagline: '商汤科技推出的免费AI作画和图片生成平台',
    description: '秒画是商汤科技推出的免费AI作画平台，提供专业的图像生成服务。依托商汤强大的AI技术优势，提供高质量的艺术风格图像。具备免费使用、效果专业、风格多样等特色，适合各类创作者使用。',
    website_url: 'https://miaohua.sensetime.com',
    tags: ['商汤科技', '免费作画', '技术优势', '高质量图像'],
    pricing_type: 'free'
  },
  {
    name: 'WHEE',
    tagline: '美图推出的AI图片和绘画创作生成平台',
    description: 'WHEE是美图公司推出的AI图片和绘画创作平台。提供图像生成、美颜优化、艺术创作等服务。具备美颜技术、风格转换、质量优化等特色功能。依托美图在图像处理领域的技术积累，提供专业的创作体验。',
    website_url: 'https://whee.meitu.com',
    tags: ['美图出品', '美颜技术', '艺术创作', '图像优化'],
    pricing_type: 'freemium'
  },
  {
    name: '呜哩',
    tagline: '阿里推出的AIGC创意生产力平台',
    description: '呜哩是阿里巴巴推出的AIGC创意生产力平台。提供图像生成、创意设计、内容创作等服务。具备创意工具、生产力优化、批量处理等特色功能。依托阿里生态优势，为创作者提供全方位的支持。',
    website_url: 'https://wuli.ali.com',
    tags: ['阿里出品', 'AIGC平台', '创意生产力', '生态优势'],
    pricing_type: 'freemium'
  },
  {
    name: 'insMind',
    tagline: '稿定面向全球市场推出的AI图片编辑工具',
    description: 'insMind是稿定设计面向全球市场推出的AI图片编辑工具。提供专业的图像编辑、效果优化、创意设计等服务。具备国际化界面、多语言支持、专业功能等特色，适合全球用户使用。',
    website_url: 'https://insmind.com',
    tags: ['稿定出品', '全球市场', '图像编辑', '国际化'],
    pricing_type: 'freemium'
  },
  {
    name: 'AI改图神器',
    tagline: 'AI在线图像编辑工具',
    description: 'AI改图神器是专业的在线AI图像编辑工具。提供图像修复、风格转换、效果增强等服务。具备智能编辑、效果优化、批量处理等功能。界面操作简单，适合各类图像编辑需求。',
    website_url: 'https://gaitu.ai',
    tags: ['在线编辑', '图像修复', '效果增强', '批量处理'],
    pricing_type: 'freemium'
  },
  {
    name: '咖图AI',
    tagline: 'AI图像设计平台，搭载NanoBanana Pro模型',
    description: '咖图AI是专业的AI图像设计平台，搭载了先进的NanoBanana Pro模型。提供高质量图像生成、设计辅助、创意优化等服务。具备模型优势、效果专业、设计友好等特色功能，适合专业设计师使用。',
    website_url: 'https://katu.ai',
    tags: ['NanoBanana Pro', '设计平台', '高质量图像', '专业设计'],
    pricing_type: 'freemium'
  },
  {
    name: '视觉工厂',
    tagline: 'AI创作工具，支持AI生图和视频生成服务',
    description: '视觉工厂是专业的AI创作工具平台，支持AI图像生成和视频创作服务。提供图像生成、视频制作、内容编辑等功能。具备多模态创作、质量优化、批量处理等特色功能，适合内容创作者使用。',
    website_url: 'https://shijuegongchang.com',
    tags: ['多模态创作', '视频生成', '内容编辑', '批量处理'],
    pricing_type: 'freemium'
  },
  {
    name: '秒绘AI',
    tagline: '一键生成爆款图文，免费发布小红书',
    description: '秒绘AI是专为小红书内容创作设计的AI工具。提供爆款图文生成、内容优化、一键发布等服务。具备社交内容适配、热点追踪、效果优化等特色功能。完全免费使用，适合小红书创作者。',
    website_url: 'https://miaohui.ai',
    tags: ['小红书工具', '爆款图文', '社交内容', '免费发布'],
    pricing_type: 'free'
  },
  {
    name: '妙话AI',
    tagline: '专为内容创作者设计的创意图片生成工具',
    description: '妙话AI是专为内容创作者设计的创意图片生成工具。提供创意图像生成、内容优化、风格定制等服务。具备创意辅助、内容适配、质量把控等特色功能，适合各类内容创作者使用。',
    website_url: 'https://miaohua.ai',
    tags: ['内容创作', '创意图片', '风格定制', '质量把控'],
    pricing_type: 'freemium'
  },
  {
    name: '炉米Lumi',
    tagline: '字节跳动推出的AIGC图像创作平台',
    description: '炉米Lumi是字节跳动推出的AIGC图像创作平台。提供AI图像生成、创意设计、内容创作等服务。具备先进技术、创意优化、批量处理等特色功能。依托字节的技术优势，提供专业的创作体验。',
    website_url: 'https://lumi.bytedance.com',
    tags: ['字节跳动', 'AIGC平台', '创意设计', '技术优势'],
    pricing_type: 'freemium'
  },
  {
    name: 'Krea AI',
    tagline: '实时AI图像、视频生成和编辑平台',
    description: 'Krea AI是专业的实时AI创作平台，支持图像和视频的实时生成和编辑。提供实时预览、交互编辑、效果优化等功能。具备实时性、交互性、高质量等特色，适合专业创作者使用。',
    website_url: 'https://krea.ai',
    tags: ['实时创作', '交互编辑', '视频生成', '专业平台'],
    pricing_type: 'freemium'
  },
  {
    name: 'Kira',
    tagline: 'AI 图像生成与编辑工具',
    description: 'Kira是专业的AI图像生成与编辑工具。提供图像创作、效果编辑、风格转换等服务。具备高质量生成、专业编辑、效果优化等特色功能，适合设计师和创作者使用。',
    website_url: 'https://kira.ai',
    tags: ['图像编辑', '效果生成', '风格转换', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Photoroom',
    tagline: '在线AI图片编辑工具',
    description: 'Photoroom是专业的在线AI图片编辑工具。提供背景移除、图像编辑、效果优化等服务。具备智能编辑、批量处理、专业效果等特色功能，适合电商和营销使用。',
    website_url: 'https://photoroom.com',
    tags: ['在线编辑', '背景移除', '电商工具', '批量处理'],
    pricing_type: 'freemium'
  },
  {
    name: 'Ribbet.ai',
    tagline: '免费的多功能AI图片处理工具箱',
    description: 'Ribbet.ai是免费的多功能AI图片处理工具箱。提供图像编辑、效果增强、创意设计等服务。具备功能丰富、免费使用、效果专业等特色，适合各类图像处理需求。',
    website_url: 'https://ribbet.ai',
    tags: ['多功能工具', '免费使用', '图像处理', '效果专业'],
    pricing_type: 'free'
  },
  {
    name: '万相营造',
    tagline: '阿里旗下推出的多模态AI创意生成平台',
    description: '万相营造是阿里巴巴推出的多模态AI创意生成平台。提供图像生成、创意设计、内容创作等服务。具备多模态支持、创意优化、批量处理等特色功能，依托阿里技术优势。',
    website_url: 'https://wanxiang.ali.com',
    tags: ['阿里出品', '多模态AI', '创意生成', '技术优势'],
    pricing_type: 'freemium'
  },
  {
    name: '悟空图像PhotoSir',
    tagline: '新一代专业图像处理软件，更智能、更高效、更好用',
    description: '悟空图像PhotoSir是新一代专业图像处理软件。提供智能编辑、高效处理、专业效果等服务。具备智能化、高效率、易用性等特色功能，适合专业图像处理使用。',
    website_url: 'https://photosir.com',
    tags: ['专业软件', '智能编辑', '高效处理', '易用性'],
    pricing_type: 'freemium'
  },
  {
    name: '360智图',
    tagline: '360推出的AI作图平台，支持智能抠图、智能消除、智能放大、智能配图',
    description: '360智图是360推出的专业AI作图平台。提供智能抠图、智能消除、智能放大、智能配图等服务。具备多功能集成、智能处理、效果专业等特色功能，适合各类图像处理需求。',
    website_url: 'https://zhitu.360.com',
    tags: ['360出品', '智能作图', '多功能集成', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: '像素蛋糕',
    tagline: '像甜科技推出的AI图像后期软件',
    description: '像素蛋糕是像甜科技推出的专业AI图像后期软件。提供图像后期处理、效果优化、质量提升等服务。具备专业后期、智能优化、质量把控等特色功能，适合专业摄影师和设计师使用。',
    website_url: 'https://xiangsu蛋糕.com',
    tags: ['图像后期', '专业处理', '质量优化', '摄影工具'],
    pricing_type: 'paid'
  },
  {
    name: '如果相机',
    tagline: '仅需1张照片，快速生成AI写真照片',
    description: '如果相机是专业的AI写真生成工具。仅需一张照片即可快速生成高质量的AI写真照片。提供多种写真风格、效果优化、批量生成等服务。具备快速生成、效果专业、风格多样等特色功能。',
    website_url: 'https://ruguo.camera',
    tags: ['AI写真', '快速生成', '风格多样', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'ARC',
    tagline: '腾讯旗下ARC实验室推出的免费AI图片处理工具',
    description: 'ARC是腾讯ARC实验室推出的免费AI图片处理工具。提供图像编辑、效果增强、创意设计等服务。具备免费使用、技术先进、效果专业等特色功能，适合各类图像处理需求。',
    website_url: 'https://arc.tencent.com',
    tags: ['腾讯出品', '免费工具', '技术先进', '效果专业'],
    pricing_type: 'free'
  },
  {
    name: 'Cutout.Pro',
    tagline: 'AI在线处理图片',
    description: 'Cutout.Pro是专业的AI在线图片处理工具。提供背景移除、图像编辑、效果优化等服务。具备在线处理、批量操作、专业效果等特色功能，适合电商和设计使用。',
    website_url: 'https://cutout.pro',
    tags: ['在线处理', '背景移除', '批量操作', '电商工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'remove.bg',
    tagline: '强大的AI图片背景移除工具',
    description: 'remove.bg是全球知名的AI图片背景移除工具。提供专业级的背景移除服务，支持各种图片类型。具备高精度、快速处理、批量操作等特色功能，是背景处理的专业工具。',
    website_url: 'https://remove.bg',
    tags: ['背景移除', '高精度', '快速处理', '国际知名'],
    pricing_type: 'freemium'
  },
  {
    name: 'MagicStudio',
    tagline: '高颜值AI图像处理工具',
    description: 'MagicStudio是注重设计美感的AI图像处理工具。提供图像编辑、效果增强、创意设计等服务。具备界面美观、效果专业、操作便捷等特色功能，适合追求设计美感的用户。',
    website_url: 'https://magicstudio.com',
    tags: ['高颜值设计', '界面美观', '效果专业', '操作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: 'Booltool',
    tagline: '在线AI图像工具箱',
    description: 'Booltool是全面的在线AI图像工具箱。提供多种图像处理和编辑功能。具备功能丰富、在线使用、效果专业等特色功能，适合各类图像处理需求。',
    website_url: 'https://booltool.com',
    tags: ['工具箱', '多功能', '在线使用', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Faceswapper',
    tagline: 'AI在线换脸工具',
    description: 'Faceswapper是专业的AI在线换脸工具。提供人脸替换、效果优化、批量处理等服务。具备高精度、自然效果、快速处理等特色功能，适合娱乐和创作使用。',
    website_url: 'https://faceswapper.ai',
    tags: ['换脸工具', '高精度', '自然效果', '娱乐创作'],
    pricing_type: 'freemium'
  },
  {
    name: 'ClipDrop',
    tagline: 'Stability.ai推出的AI图片处理系列工具',
    description: 'ClipDrop是Stability.ai推出的专业AI图片处理工具系列。提供图像编辑、效果增强、创意设计等服务。具备技术先进、效果专业、功能丰富等特色功能，适合专业创作者使用。',
    website_url: 'https://clipdrop.com',
    tags: ['StabilityAI出品', '技术先进', '专业效果', '功能丰富'],
    pricing_type: 'freemium'
  },
  {
    name: 'Vmake AI',
    tagline: 'AI在线图像和视频编辑平台，专为电商、设计提供服务',
    description: 'Vmake AI是专为电商和设计行业服务的AI在线编辑平台。提供图像和视频的编辑、优化、创意设计等服务。具备行业定制、专业效果、批量处理等特色功能，适合电商和设计师使用。',
    website_url: 'https://vmake.ai',
    tags: ['电商服务', '设计工具', '行业定制', '批量处理'],
    pricing_type: 'freemium'
  },
  {
    name: 'Leonardo.ai',
    tagline: '免费的AI绘画和图像生成工具和社区',
    description: 'Leonardo.ai是知名的免费AI绘画和图像生成工具，同时也是活跃的创作者社区。提供高质量的图像生成服务和社区交流平台。具备免费使用、社区分享、模型丰富等特色功能。',
    website_url: 'https://leonardo.ai',
    tags: ['免费工具', '创作者社区', '模型丰富', '高质量生成'],
    pricing_type: 'free'
  },
  {
    name: 'DeepSwapper',
    tagline: '免费的在线AI换脸工具，支持图片、视频多种格式',
    description: 'DeepSwapper是免费的在线AI换脸工具，支持图片和视频多种格式。提供人脸替换、效果优化、批量处理等服务。具备免费使用、多格式支持、高质量效果等特色功能。',
    website_url: 'https://deepswapper.com',
    tags: ['免费换脸', '多格式支持', '高质量效果', '批量处理'],
    pricing_type: 'free'
  },
  {
    name: 'Kacha AI',
    tagline: '专业的AI写真工具，媲美专业摄影',
    description: 'Kacha AI是专业的AI写真工具，提供媲美专业摄影质量的写真生成服务。支持多种写真风格、效果优化、批量生成等服务。具备专业质量、风格多样、效果逼真等特色功能。',
    website_url: 'https://kacha.ai',
    tags: ['专业写真', '摄影质量', '风格多样', '效果逼真'],
    pricing_type: 'freemium'
  },
  {
    name: 'PicTech AI',
    tagline: '免费的在线图片翻译工具，支持一键抠图',
    description: 'PicTech AI是免费的在线图片翻译和抠图工具。提供图片翻译、背景移除、图像编辑等服务。具备免费使用、多语言支持、一键操作等特色功能，适合国际化内容创作。',
    website_url: 'https://pictech.ai',
    tags: ['图片翻译', '一键抠图', '多语言支持', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: 'Hotpot.ai',
    tagline: 'AI图片图像处理和生成工具',
    description: 'Hotpot.ai是全面的AI图片图像处理和生成工具。提供图像编辑、效果增强、创意生成等服务。具备功能丰富、效果专业、操作简单等特色功能，适合各类图像创作需求。',
    website_url: 'https://hotpot.ai',
    tags: ['图像处理', '创意生成', '功能丰富', '操作简单'],
    pricing_type: 'freemium'
  },
  {
    name: 'IconGen',
    tagline: '免费的icon图标AI生成器',
    description: 'IconGen是专业的免费icon图标AI生成器。提供图标设计、风格定制、批量生成等服务。具备免费使用、风格多样、专业质量等特色功能，适合设计师和开发者使用。',
    website_url: 'https://icongen.ai',
    tags: ['图标生成', '免费工具', '风格多样', '设计工具'],
    pricing_type: 'free'
  },
  {
    name: '言之画',
    tagline: 'AI图像内容创作平台，由出门问问推出',
    description: '言之画是出门问问推出的AI图像内容创作平台。提供图像生成、创意设计、内容创作等服务。具备技术先进、创意优化、内容适配等特色功能，依托出门问问的AI技术优势。',
    website_url: 'https://yanzhihua.com',
    tags: ['出门问问', '内容创作', '技术先进', '创意优化'],
    pricing_type: 'freemium'
  },
  {
    name: '百度智能云一念',
    tagline: '基于百度文心大模型的多模态内容创作平台',
    description: '百度智能云一念是基于百度文心大模型的多模态内容创作平台。提供图像生成、创意设计、内容创作等服务。具备大模型支持、多模态创作、技术先进等特色功能。',
    website_url: 'https://yinian.baidu.com',
    tags: ['百度出品', '文心大模型', '多模态创作', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '艾绘',
    tagline: '一键创作故事、绘画、配音，轻松创建高质量的绘本故事',
    description: '艾绘是专业的绘本故事创作工具。提供故事创作、绘画生成、配音制作等服务。具备一键创作、质量保证、多媒体支持等特色功能，适合绘本创作者使用。',
    website_url: 'https://aihui.com',
    tags: ['绘本创作', '故事生成', '多媒体支持', '一键创作'],
    pricing_type: 'freemium'
  },
  {
    name: 'Graviti Diffus',
    tagline: '开箱即用的 Stable Diffusion WebUI 在线图像生成服务',
    description: 'Graviti Diffus是开箱即用的Stable Diffusion WebUI在线服务。提供专业的图像生成、模型管理、工作流编辑等功能。具备在线使用、无需配置、专业功能等特色功能。',
    website_url: 'https://graviti.com/diffus',
    tags: ['Stable Diffusion', 'WebUI服务', '开箱即用', '无需配置'],
    pricing_type: 'freemium'
  },
  {
    name: '秘塔捉捉猫',
    tagline: '秘塔写作猫推出的AI文字到图像生成工具',
    description: '秘塔捉捉猫是秘塔写作猫推出的AI文字到图像生成工具。提供文本生成图像、创意设计、内容创作等服务。具备文本理解、图像生成、创意优化等特色功能。',
    website_url: 'https://zhuozhuomao.mita.cn',
    tags: ['秘塔出品', '文本生成图像', '创意设计', '内容创作'],
    pricing_type: 'freemium'
  },
  {
    name: '志设',
    tagline: 'AI图片生成平台',
    description: '志设是专业的AI图片生成平台。提供高质量图像生成、风格定制、批量创作等服务。具备效果专业、操作简单、功能丰富等特色功能，适合各类创作者使用。',
    website_url: 'https://zhishe.ai',
    tags: ['图片生成', '风格定制', '批量创作', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: '奇域AI',
    tagline: '中式审美国风AI绘画创作平台',
    description: '奇域AI是专注于中式审美的国风AI绘画创作平台。提供国风绘画、传统艺术、文化创作等服务。具备中式审美、文化特色、专业质量等特色功能。',
    website_url: 'https://qiyu.ai',
    tags: ['国风绘画', '中式审美', '文化创作', '传统艺术'],
    pricing_type: 'freemium'
  },
  {
    name: '触手AI绘画',
    tagline: '免费专业的AI绘画/模型/分享平台',
    description: '触手AI绘画是免费专业的AI绘画、模型分享平台。提供AI绘画创作、模型分享、作品展示等服务。具备免费使用、专业质量、社区活跃等特色功能。',
    website_url: 'https://chushou.ai',
    tags: ['免费绘画', '模型分享', '作品展示', '社区平台'],
    pricing_type: 'free'
  },
  {
    name: '造梦日记',
    tagline: 'AI一下，妙笔生画',
    description: '造梦日记是富有创意的AI绘画工具。提供艺术创作、风格绘画、创意设计等服务。具备创意特色、效果专业、操作简单等特色功能，适合艺术创作使用。',
    website_url: 'https://zaomengriji.com',
    tags: ['创意绘画', '艺术创作', '效果专业', '操作简单'],
    pricing_type: 'freemium'
  },
  {
    name: 'Canva AI图像生成',
    tagline: '在线设计工具Canva推出的AI图像生成工具',
    description: 'Canva AI图像生成是知名在线设计工具Canva推出的AI图像生成功能。提供图像创作、设计辅助、创意优化等服务。具备设计集成、模板丰富、操作便捷等特色功能。',
    website_url: 'https://canva.com/ai-image-generator',
    tags: ['Canva出品', '设计集成', '模板丰富', '操作便捷'],
    pricing_type: 'freemium'
  },
  {
    name: '超能画布',
    tagline: '百度网盘推出的AI创意图像写真创作平台',
    description: '超能画布是百度网盘推出的AI创意图像写真创作平台。提供写真生成、创意设计、图像优化等服务。具备网盘集成、创意优化、质量专业等特色功能。',
    website_url: 'https://chaonenghuabu.baidu.com',
    tags: ['百度网盘', '写真创作', '创意设计', '网盘集成'],
    pricing_type: 'freemium'
  },
  {
    name: 'Bing Image Creator',
    tagline: '微软必应推出的基于DALL·E的AI图像生成工具',
    description: 'Bing Image Creator是微软必应推出的基于DALL·E技术的AI图像生成工具。提供高质量图像生成、创意设计、内容创作等服务。具备技术先进、效果专业、免费使用等特色功能。',
    website_url: 'https://bing.com/create',
    tags: ['微软出品', 'DALL·E技术', '高质量生成', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: 'Adobe Firefly',
    tagline: 'Adobe最新推出的AI图片生成工具',
    description: 'Adobe Firefly是Adobe公司推出的专业AI图片生成工具。提供图像创作、设计辅助、创意优化等服务。具备专业质量、设计集成、效果先进等特色功能，适合专业设计师使用。',
    website_url: 'https://firefly.adobe.com',
    tags: ['Adobe出品', '专业质量', '设计集成', '效果先进'],
    pricing_type: 'freemium'
  },
  {
    name: '简单AI',
    tagline: '搜狐推出的AI图片生成平台',
    description: '简单AI是搜狐推出的AI图片生成平台。提供图像创作、设计辅助、内容创作等服务。具备操作简单、效果专业、免费使用等特色功能，适合普通用户使用。',
    website_url: 'https://ai.sohu.com',
    tags: ['搜狐出品', '操作简单', '效果专业', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: '摩笔马良',
    tagline: '摩尔线程推出的AI图像绘画创作平台',
    description: '摩笔马良是摩尔线程推出的AI图像绘画创作平台。提供图像生成、艺术创作、设计辅助等服务。具备技术先进、效果专业、创作优化等特色功能。',
    website_url: 'https://mobimalang.com',
    tags: ['摩尔线程', '技术先进', '艺术创作', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Exactly.ai',
    tagline: '专业的AI绘画和艺术创作平台',
    description: 'Exactly.ai是专业的AI绘画和艺术创作平台。提供高质量图像生成、艺术创作、设计辅助等服务。具备专业质量、艺术风格、创作优化等特色功能，适合艺术家使用。',
    website_url: 'https://exactly.ai',
    tags: ['专业绘画', '艺术创作', '高质量生成', '艺术家工具'],
    pricing_type: 'paid'
  },
  {
    name: '画宇宙',
    tagline: '人工智能AI作画网站',
    description: '画宇宙是专业的人工智能AI作画网站。提供图像生成、艺术创作、设计辅助等服务。具备AI技术、艺术风格、创作优化等特色功能，适合各类创作者使用。',
    website_url: 'https://huayuzhou.com',
    tags: ['AI作画', '艺术创作', '设计辅助', '创作优化'],
    pricing_type: 'freemium'
  },
  {
    name: '6pen Art',
    tagline: '面包多团队推出的从文本描述生成绘画艺术作品',
    description: '6pen Art是面包多团队推出的文本生成绘画艺术作品工具。提供文本生成图像、艺术创作、设计辅助等服务。具备文本理解、艺术风格、创作优化等特色功能。',
    website_url: 'https://6pen.art',
    tags: ['文本生成', '艺术作品', '面包多出品', '创作优化'],
    pricing_type: 'freemium'
  },
  {
    name: '创客贴AI画匠',
    tagline: '创客贴推出的AI艺术画生成工具',
    description: '创客贴AI画匠是创客贴推出的AI艺术画生成工具。提供艺术创作、设计辅助、图像生成等服务。具备设计集成、艺术风格、质量专业等特色功能。',
    website_url: 'https://chuangkit.com/ai-huajiang',
    tags: ['创客贴出品', '艺术创作', '设计集成', '质量专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Visual Electric',
    tagline: '专业的高质量AI图像创作工具',
    description: 'Visual Electric是专业的高质量AI图像创作工具。提供专业级图像生成、艺术创作、设计辅助等服务。具备高质量输出、专业功能、创作优化等特色功能，适合专业创作者使用。',
    website_url: 'https://visualelectric.com',
    tags: ['高质量创作', '专业工具', '艺术创作', '输出优化'],
    pricing_type: 'paid'
  },
  {
    name: '360智绘',
    tagline: '360推出的AI图片和绘画生成工具',
    description: '360智绘是360推出的AI图片和绘画生成工具。提供图像创作、艺术绘画、设计辅助等服务。具备技术先进、效果专业、功能丰富等特色功能，适合各类创作者使用。',
    website_url: 'https://zhihui.360.com',
    tags: ['360出品', '图片生成', '艺术绘画', '技术先进'],
    pricing_type: 'freemium'
  },
  {
    name: '网易AI创意工坊',
    tagline: '网易云课堂推出的AI作画平台，在线使用Stable Diffusion出图',
    description: '网易AI创意工坊是网易云课堂推出的AI作画平台，提供在线Stable Diffusion出图服务。具备在线使用、技术先进、效果专业等特色功能，适合各类创作者使用。',
    website_url: 'https://ai.study.163.com',
    tags: ['网易出品', 'Stable Diffusion', '在线使用', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Imagine with Meta',
    tagline: 'Meta最新推出的在线AI图像生成器',
    description: 'Imagine with Meta是Meta公司最新推出的在线AI图像生成器。提供高质量图像生成、创意设计、内容创作等服务。具备技术先进、效果专业、免费使用等特色功能。',
    website_url: 'https://imagine.meta.com',
    tags: ['Meta出品', '技术先进', '高质量生成', '免费使用'],
    pricing_type: 'free'
  },
  {
    name: 'Freepik AI Image Generator',
    tagline: 'Freepik最新推出的AI图片生成工具',
    description: 'Freepik AI Image Generator是知名素材平台Freepik推出的AI图片生成工具。提供图像创作、设计辅助、素材生成等服务。具备素材集成、质量专业、设计友好等特色功能。',
    website_url: 'https://freepik.com/ai-image-generator',
    tags: ['Freepik出品', '素材集成', '质量专业', '设计友好'],
    pricing_type: 'freemium'
  },
  {
    name: 'Stockimg AI',
    tagline: 'AI生成各种类型的图像和插画',
    description: 'Stockimg AI是专业的AI图像和插画生成工具。提供多种类型的图像生成、插画创作、设计辅助等服务。具备类型丰富、质量专业、批量生成等特色功能。',
    website_url: 'https://stockimg.ai',
    tags: ['图像生成', '插画创作', '类型丰富', '批量生成'],
    pricing_type: 'freemium'
  },
  {
    name: 'Stable Doodle',
    tagline: 'StabilityAI最新推出的将手绘草图转换成精美图像的工具',
    description: 'Stable Doodle是StabilityAI推出的手绘草图转换工具。能将手绘草图转换成精美图像。具备草图识别、效果优化、风格转换等特色功能，适合设计师和艺术家使用。',
    website_url: 'https://stabledoodle.ai',
    tags: ['StabilityAI出品', '草图转换', '效果优化', '风格转换'],
    pricing_type: 'freemium'
  },
  {
    name: '175FUN',
    tagline: '免费AI绘画社区，国货之光',
    description: '175FUN是免费的AI绘画社区，被誉为国货之光。提供AI绘画创作、作品分享、社区交流等服务。具备免费使用、社区活跃、质量专业等特色功能。',
    website_url: 'https://175fun.com',
    tags: ['免费社区', '国货之光', '作品分享', '社区活跃'],
    pricing_type: 'free'
  },
  {
    name: '行者AI美术',
    tagline: 'AI图片生成和美术创作工具箱',
    description: '行者AI美术是专业的AI图片生成和美术创作工具箱。提供图像生成、美术创作、设计辅助等服务。具备功能丰富、效果专业、创作优化等特色功能，适合美术创作者使用。',
    website_url: 'https://xingzai.ai',
    tags: ['美术创作', '工具箱', '功能丰富', '效果专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Skybox AI',
    tagline: 'AI生成和合成360°全景图像插画',
    description: 'Skybox AI是专业的360°全景图像生成和合成工具。提供全景创作、图像合成、VR内容等服务。具备全景技术、效果专业、VR适配等特色功能，适合全景内容创作。',
    website_url: 'https://skybox.ai',
    tags: ['全景图像', '360度创作', 'VR内容', '图像合成'],
    pricing_type: 'freemium'
  },
  {
    name: 'Facet',
    tagline: 'AI图片修图和优化工具',
    description: 'Facet是专业的AI图片修图和优化工具。提供图像修复、效果优化、质量提升等服务。具备专业修图、智能优化、质量把控等特色功能，适合专业摄影师使用。',
    website_url: 'https://facet.ai',
    tags: ['图片修图', '效果优化', '质量提升', '专业工具'],
    pricing_type: 'freemium'
  },
  {
    name: 'Relight',
    tagline: 'ClipDrop推出的AI图像打光工具',
    description: 'Relight是ClipDrop推出的专业AI图像打光工具。提供智能打光、光影优化、效果增强等服务。具备智能打光、自然效果、专业质量等特色功能，适合摄影和设计使用。',
    website_url: 'https://relight.clipdrop.com',
    tags: ['ClipDrop出品', '智能打光', '光影优化', '专业质量'],
    pricing_type: 'freemium'
  }
]

async function insertImageTools() {
  console.log('开始插入AI图像工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    
    for (const tool of imageTools) {
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
    
    console.log(`\n🎉 AI图像工具插入完成！`)
    console.log(`✅ 成功: ${successCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计: ${imageTools.length} 个`)
  } catch (error) {
    console.error('插入过程中发生错误:', error)
  }
}

// 执行插入
insertImageTools()
