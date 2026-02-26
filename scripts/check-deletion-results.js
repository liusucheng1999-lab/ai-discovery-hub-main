import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDeletionResults() {
  try {
    console.log('🔍 检查删除操作的实际结果...')
    
    // 重新获取当前工具数量
    const { count: currentCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 当前 tools 表中共有 ${currentCount} 个工具`)
    
    // 检查被删除的工具是否还存在
    const deletedIds = [
      'c20a7757-1a44-42e2-8ed0-d41984276527', // OpenAI GPT
      'gemini', // Gemini
      'b2649834-eb5f-42a1-8c3a-b3b9182f60cb', // LALAL.AI
      '68cad286-4124-45ad-80a0-eb4699a8cb3d'  // 万相营造
    ]
    
    console.log('\n🔍 检查被删除的工具是否还存在:')
    
    for (const id of deletedIds) {
      const { data: tool, error } = await supabase
        .from('tools')
        .select('id, name')
        .eq('id', id)
        .single()
      
      if (error) {
        console.log(`✅ 工具 ${id} 已成功删除`)
      } else {
        console.log(`❌ 工具 ${id} 仍然存在: ${tool.name}`)
      }
    }
    
    // 获取所有工具列表，确认实际状态
    const { data: allTools, error: allError } = await supabase
      .from('tools')
      .select('id, name, website_url')
      .order('created_at', { ascending: false })
    
    if (allError) {
      console.error('获取所有工具失败:', allError)
      return
    }
    
    console.log(`\n📋 当前所有工具列表 (${allTools.length} 个):`)
    
    // 检查是否有OpenAI相关的工具
    const openaiTools = allTools.filter(tool => 
      tool.name.includes('OpenAI') || 
      tool.name.includes('ChatGPT') ||
      tool.website_url.includes('openai.com')
    )
    
    if (openaiTools.length > 0) {
      console.log('\n🔍 OpenAI相关工具:')
      openaiTools.forEach(tool => {
        console.log(`  - ${tool.name} (ID: ${tool.id})`)
        console.log(`    网站: ${tool.website_url}`)
      })
    }
    
    // 检查是否有Google相关的工具
    const googleTools = allTools.filter(tool => 
      tool.name.includes('Google') || 
      tool.name.includes('Bard') ||
      tool.name.includes('Gemini') ||
      tool.website_url.includes('google.com')
    )
    
    if (googleTools.length > 0) {
      console.log('\n🔍 Google相关工具:')
      googleTools.forEach(tool => {
        console.log(`  - ${tool.name} (ID: ${tool.id})`)
        console.log(`    网站: ${tool.website_url}`)
      })
    }
    
    // 检查是否有阿里相关的工具
    const alibabaTools = allTools.filter(tool => 
      tool.name.includes('万相') || 
      tool.name.includes('通义') ||
      tool.website_url.includes('aliyun.com')
    )
    
    if (alibabaTools.length > 0) {
      console.log('\n🔍 阿里相关工具:')
      alibabaTools.forEach(tool => {
        console.log(`  - ${tool.name} (ID: ${tool.id})`)
        console.log(`    网站: ${tool.website_url}`)
      })
    }
    
    // 强制刷新页面缓存
    console.log('\n💡 如果页面没有更新，请尝试:')
    console.log('1. 刷新浏览器页面 (Ctrl+F5 或 Cmd+Shift+R)')
    console.log('2. 清除浏览器缓存')
    console.log('3. 检查是否有其他缓存层')
    
  } catch (error) {
    console.error('检查失败:', error)
  }
}

checkDeletionResults()
