import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少环境变量：SUPABASE_URL 以及 SUPABASE_ANON_KEY（或 SUPABASE_SERVICE_ROLE_KEY）')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditDuplicateTools() {
  try {
    console.log('🔍 开始审核重复工具（名称+网站）...')
    
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
    
    // 检查重复工具
    const duplicateGroups = []
    
    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        const tool1 = tools[i]
        const tool2 = tools[j]
        
        // 标准化网站URL进行比较
        const normalizeUrl = (url) => {
          try {
            const urlObj = new URL(url)
            return urlObj.hostname.toLowerCase() + urlObj.pathname.toLowerCase()
          } catch {
            return url.toLowerCase()
          }
        }
        
        const url1 = normalizeUrl(tool1.website_url)
        const url2 = normalizeUrl(tool2.website_url)
        
        // 检查是否为重复工具
        let isDuplicate = false
        let reason = ''
        
        // 1. 网站完全相同
        if (url1 === url2) {
          isDuplicate = true
          reason = '网站完全相同'
        }
        // 2. 域名相同（忽略协议和www）
        else {
          const domain1 = tool1.website_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0].toLowerCase()
          const domain2 = tool2.website_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0].toLowerCase()
          if (domain1 === domain2) {
            isDuplicate = true
            reason = '域名相同'
          }
        }
        
        // 3. 名称高度相似（去掉AI、Bot等后缀）
        if (!isDuplicate) {
          const cleanName1 = tool1.name.replace(/\s+(AI|Bot|App|Tool|Assistant|Chat)$/i, '').trim().toLowerCase()
          const cleanName2 = tool2.name.replace(/\s+(AI|Bot|App|Tool|Assistant|Chat)$/i, '').trim().toLowerCase()
          if (cleanName1 === cleanName2 && cleanName1.length > 0) {
            isDuplicate = true
            reason = '名称去掉后缀后相同'
          }
        }
        
        if (isDuplicate) {
          duplicateGroups.push({
            tool1,
            tool2,
            reason
          })
        }
      }
    }
    
    // 去重组
    const uniqueGroups = []
    const seen = new Set()
    
    duplicateGroups.forEach(group => {
      const key1 = `${group.tool1.id}-${group.tool2.id}`
      const key2 = `${group.tool2.id}-${group.tool1.id}`
      
      if (!seen.has(key1) && !seen.has(key2)) {
        seen.add(key1)
        uniqueGroups.push(group)
      }
    })
    
    console.log(`\n🔍 发现 ${uniqueGroups.length} 组重复工具:`)
    
    uniqueGroups.forEach((group, index) => {
      console.log(`\n📋 重复工具组 ${index + 1}:`)
      console.log(`   重复原因: ${group.reason}`)
      console.log(`   `)
      console.log(`   工具1: ${group.tool1.name}`)
      console.log(`   ID: ${group.tool1.id}`)
      console.log(`   网站: ${group.tool1.website_url}`)
      console.log(`   状态: ${group.tool1.status}`)
      console.log(`   创建时间: ${group.tool1.created_at}`)
      console.log(`   `)
      console.log(`   工具2: ${group.tool2.name}`)
      console.log(`   ID: ${group.tool2.id}`)
      console.log(`   网站: ${group.tool2.website_url}`)
      console.log(`   状态: ${group.tool2.status}`)
      console.log(`   创建时间: ${group.tool2.created_at}`)
    })
    
    // 生成删除建议
    if (uniqueGroups.length > 0) {
      console.log(`\n💡 删除建议 (保留最早创建的):`)
      const deleteIds = []
      
      uniqueGroups.forEach((group, index) => {
        // 保留最早创建的
        const keep = new Date(group.tool1.created_at) < new Date(group.tool2.created_at) ? group.tool1 : group.tool2
        const deleteCandidate = new Date(group.tool1.created_at) < new Date(group.tool2.created_at) ? group.tool2 : group.tool1
        
        console.log(`\n📋 重复组 ${index + 1}: ${group.reason}`)
        console.log(`✅ 保留: "${keep.name}" (ID: ${keep.id}, 创建: ${keep.created_at})`)
        console.log(`🗑️  删除: "${deleteCandidate.name}" (ID: ${deleteCandidate.id}, 创建: ${deleteCandidate.created_at})`)
        
        deleteIds.push(deleteCandidate.id)
      })
      
      // 生成删除SQL
      console.log(`\n🗑️ 删除SQL语句:`)
      console.log(`-- 删除重复工具`)
      console.log(`DELETE FROM tool_submissions WHERE id IN ('${deleteIds.join("', '")}');`)
      console.log(`\n-- 将删除 ${deleteIds.length} 个重复工具`)
      
      // 执行删除确认
      console.log(`\n⚠️  请确认是否要删除这 ${deleteIds.length} 个重复工具？`)
      console.log(`如需删除，请在Supabase控制台执行上述SQL语句`)
      console.log(`https://supabase.com/dashboard/project/enzduxajblrfbbdktieo/sql`)
      
    } else {
      console.log('\n✅ 没有发现重复工具')
    }
    
  } catch (error) {
    console.error('审核失败:', error)
  }
}

auditDuplicateTools()
