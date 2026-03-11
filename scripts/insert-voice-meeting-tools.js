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

// AI语音和会议工具数据
const voiceMeetingTools = [
  {
    name: '听脑AI',
    tagline: 'AI语音录音记录助手',
    description: '听脑AI是AI语音录音记录助手。提供语音录音、AI记录、专业服务等功能。具备录音专业、AI便捷、记录智能等特色功能，适合语音记录使用。',
    website_url: 'https://tingnao.ai',
    tags: ['AI语音录音', '记录助手', 'AI便捷', '录音专业'],
    pricing_type: 'freemium'
  },
  {
    name: '简单听记',
    tagline: '百度网盘推出的AI语音转文字工具',
    description: '简单听记是百度网盘推出的AI语音转文字工具。提供语音转文字、百度技术、AI支持等服务。具备百度技术、转换专业、AI便捷等特色功能，适合语音转文字使用。',
    website_url: 'https://jiandan.baidu.com',
    tags: ['百度网盘', 'AI语音转文字', '转换专业', '百度技术'],
    pricing_type: 'freemium'
  },
  {
    name: '通义听悟',
    tagline: '阿里推出的AI会议转录工具，万语千言，心领神悟',
    description: '通义听悟是阿里推出的AI会议转录工具，万语千言，心领神悟。提供会议转录、阿里技术、AI支持等服务。具备阿里技术、转录专业、AI便捷等特色功能，适合会议转录使用。',
    website_url: 'https://tingwu.tongyi.ali.com',
    tags: ['阿里出品', 'AI会议转录', '转录专业', '阿里技术'],
    pricing_type: 'freemium'
  },
  {
    name: '讯飞会议',
    tagline: 'AI智能会议系统，实时字幕、实时翻译、自动生成会议记录',
    description: '讯飞会议是AI智能会议系统，实时字幕、实时翻译、自动生成会议记录。提供智能会议、讯飞技术、实时支持等服务。具备讯飞技术、会议专业、实时便捷等特色功能，适合智能会议使用。',
    website_url: 'https://meeting.xunfei.cn',
    tags: ['科大讯飞', 'AI智能会议', '实时字幕', '会议专业'],
    pricing_type: 'freemium'
  },
  {
    name: '飞书妙记',
    tagline: '飞书智能会议纪要和快捷语音识别转文字',
    description: '飞书妙记是飞书智能会议纪要和快捷语音识别转文字。提供会议纪要、飞书技术、语音识别等服务。具备飞书技术、纪要专业、识别便捷等特色功能，适合会议纪要使用。',
    website_url: 'https://miaoji.feishu.cn',
    tags: ['飞书出品', '智能会议纪要', '语音识别', '纪要专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Otter.ai',
    tagline: 'AI会议内容生成和实时转录',
    description: 'Otter.ai是AI会议内容生成和实时转录。提供会议生成、实时转录、AI支持等服务。具备实时转录、生成专业、AI便捷等特色功能，适合会议转录使用。',
    website_url: 'https://otter.ai',
    tags: ['国际知名', 'AI会议生成', '实时转录', '转录专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Ai好记',
    tagline: 'AI音视频转录与总结',
    description: 'Ai好记是AI音视频转录与总结。提供音视频转录、AI总结、专业服务等功能。具备转录专业、AI智能、总结便捷等特色功能，适合音视频转录使用。',
    website_url: 'https://aihaoji.com',
    tags: ['AI音视频转录', 'AI总结', '转录专业', '总结智能'],
    pricing_type: 'freemium'
  },
  {
    name: '腾讯会议AI小助手',
    tagline: '腾讯会议推出的AI会议内容助理',
    description: '腾讯会议AI小助手是腾讯会议推出的AI会议内容助理。提供会议助理、腾讯技术、AI支持等服务。具备腾讯技术、助理专业、AI便捷等特色功能，适合会议助理使用。',
    website_url: 'https://meeting.tencent.com/ai',
    tags: ['腾讯会议', 'AI会议助理', '助理专业', '腾讯技术'],
    pricing_type: 'freemium'
  },
  {
    name: 'Zoom Workplace',
    tagline: 'Zoom推出的AI办公协作和交流沟通平台',
    description: 'Zoom Workplace是Zoom推出的AI办公协作和交流沟通平台。提供办公协作、Zoom技术、AI支持等服务。具备Zoom技术、协作专业、沟通便捷等特色功能，适合办公协作使用。',
    website_url: 'https://zoom.ai',
    tags: ['Zoom出品', 'AI办公协作', '交流沟通', '协作专业'],
    pricing_type: 'freemium'
  },
  {
    name: '麦耳会记',
    tagline: '思必驰推出的AI会议助手，语音转文字、字幕同传、AI摘要',
    description: '麦耳会记是思必驰推出的AI会议助手，语音转文字、字幕同传、AI摘要。提供会议助手、思必驰技术、AI支持等服务。具备思必驰技术、会议专业、AI便捷等特色功能，适合会议助手使用。',
    website_url: 'https://maier.huiji.com',
    tags: ['思必驰', 'AI会议助手', '语音转文字', '会议专业'],
    pricing_type: 'freemium'
  },
  {
    name: 'Fireflies.ai',
    tagline: 'AI会议转录和会议纪要生成工具',
    description: 'Fireflies.ai是AI会议转录和会议纪要生成工具。提供会议转录、纪要生成、AI支持等服务。具备转录专业、生成智能、AI便捷等特色功能，适合会议转录使用。',
    website_url: 'https://fireflies.ai',
    tags: ['AI会议转录', '会议纪要生成', '转录专业', '生成智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Noty.ai',
    tagline: 'AI会议助手，自动转录会议内容',
    description: 'Noty.ai是AI会议助手，自动转录会议内容。提供会议助手、自动转录、AI支持等服务。具备自动转录、助手专业、AI便捷等特色功能，适合会议助手使用。',
    website_url: 'https://noty.ai',
    tags: ['AI会议助手', '自动转录', '助手专业', '转录智能'],
    pricing_type: 'freemium'
  },
  {
    name: 'Airgram',
    tagline: 'AI会议记录和转录工具',
    description: 'Airgram是AI会议记录和转录工具。提供会议记录、AI转录、专业服务等功能。具备记录专业、转录智能、服务全面等特色功能，适合会议记录使用。',
    website_url: 'https://airgram.ai',
    tags: ['AI会议记录', 'AI转录', '记录专业', '转录智能'],
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

async function insertVoiceMeetingTools() {
  console.log('开始检查并插入AI语音和会议工具...')
  
  try {
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const tool of voiceMeetingTools) {
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
          category: 'office',
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
    
    console.log(`\n🎉 AI语音和会议工具处理完成！`)
    console.log(`✅ 成功插入: ${successCount} 个`)
    console.log(`⏭️  跳过已存在: ${skipCount} 个`)
    console.log(`❌ 失败: ${failCount} 个`)
    console.log(`📊 总计处理: ${voiceMeetingTools.length} 个`)
  } catch (error) {
    console.error('处理过程中发生错误:', error)
  }
}

// 执行插入
insertVoiceMeetingTools()
