import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少环境变量：SUPABASE_URL 以及 SUPABASE_ANON_KEY（或 SUPABASE_SERVICE_ROLE_KEY）')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditExistingTools() {
  try {
    console.log('🔍 开始审核现有工具名称...')
    
    // 获取所有工具
    const { data: tools, error } = await supabase
      .from('tool_submissions')
      .select('id, name, website_url, category, status, created_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取工具失败:', error)
      return
    }
    
    console.log(`📊 找到 ${tools.length} 个工具`)
    
    // 按名称分组，查找重复
    const nameGroups = {}
    
    tools.forEach(tool => {
      const normalizedName = tool.name.trim().toLowerCase()
      if (!nameGroups[normalizedName]) {
        nameGroups[normalizedName] = []
      }
      nameGroups[normalizedName].push(tool)
    })
    
    // 找出重复的工具
    const duplicates = Object.entries(nameGroups).filter(([name, group]) => group.length > 1)
    
    console.log(`\n🔍 发现 ${duplicates.length} 组重复工具:`)
    
    duplicates.forEach(([normalizedName, group]) => {
      console.log(`\n📋 重复工具组: "${group[0].name}" (${group.length}个)`)
      group.forEach((tool, index) => {
        console.log(`  ${index + 1}. ID: ${tool.id}`)
        console.log(`     名称: ${tool.name}`)
        console.log(`     网站: ${tool.website_url}`)
        console.log(`     状态: ${tool.status}`)
        console.log(`     创建时间: ${tool.created_at}`)
      })
    })
    
    // 生成删除建议
    console.log(`\n💡 删除建议:`)
    duplicates.forEach(([normalizedName, group]) => {
      // 保留最早创建的，删除其他的
      const sortedByDate = group.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      
      const keep = sortedByDate[0]
      const deleteCandidates = sortedByDate.slice(1)
      
      console.log(`\n📋 工具: "${keep.name}"`)
      console.log(`✅ 保留: ID=${keep.id}, 创建时间=${keep.created_at}`)
      
      deleteCandidates.forEach(tool => {
        console.log(`🗑️  删除: ID=${tool.id}, 创建时间=${tool.created_at}`)
      })
    })
    
    // 生成删除SQL
    console.log(`\n🗑️ 删除SQL语句:`)
    const deleteIds = []
    
    duplicates.forEach(([normalizedName, group]) => {
      const sortedByDate = group.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      
      const deleteCandidates = sortedByDate.slice(1)
      deleteCandidates.forEach(tool => {
        deleteIds.push(tool.id)
      })
    })
    
    if (deleteIds.length > 0) {
      console.log(`\n-- 删除重复工具`)
      console.log(`DELETE FROM tool_submissions WHERE id IN ('${deleteIds.join("', '")}');`)
      console.log(`\n-- 将删除 ${deleteIds.length} 个重复工具`)
    } else {
      console.log('\n✅ 没有发现重复工具')
    }
    
  } catch (error) {
    console.error('审核失败:', error)
  }
}

auditExistingTools()
