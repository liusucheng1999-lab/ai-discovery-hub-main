import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少环境变量：SUPABASE_URL 以及 SUPABASE_ANON_KEY（或 SUPABASE_SERVICE_ROLE_KEY）')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditToolsTable() {
  try {
    console.log('🔍 开始检查 tools 表中的重复工具...')
    
    // 获取 tools 表中的所有工具
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, website_url, tagline, created_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取 tools 表失败:', error)
      return
    }
    
    console.log(`📊 tools 表中共有 ${tools.length} 个工具`)
    
    // 查找可能重复的工具
    const duplicates = []
    
    // 检查秒画相关
    const miaohuaTools = tools.filter(tool => 
      tool.name.includes('秒画') || tool.name.includes('miaohua')
    )
    
    if (miaohuaTools.length > 1) {
      console.log(`\n🔍 发现 ${miaohuaTools.length} 个"秒画"相关工具:`)
      miaohuaTools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} (ID: ${tool.id})`)
        console.log(`   网站: ${tool.website_url}`)
        console.log(`   创建时间: ${tool.created_at}`)
      })
      
      // 用AI分析这些工具
      const prompt = `请分析以下工具是否为重复工具：

${miaohuaTools.map((tool, index) => 
  `工具${index + 1}:\n- 名称: ${tool.name}\n- 网站: ${tool.website_url}\n- 简介: ${tool.tagline}\n- ID: ${tool.id}`
).join('\n\n')}

请判断这些工具是否为同一个工具的重复提交。

请严格按照以下JSON格式返回结果：
{
  "is_duplicate": true/false,
  "confidence": 0.0-1.0,
  "analysis": "详细分析说明",
  "recommendation": "keep_first/keep_second/keep_earliest/keep_latest/both_unique",
  "tools_to_delete": ["工具ID1", "工具ID2"]
}

请只返回JSON，不要其他内容。`

      try {
        const deepseekApiKey = process.env.DEEPSEEK_API_KEY
        if (!deepseekApiKey) {
          throw new Error('缺少环境变量：DEEPSEEK_API_KEY')
        }

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekApiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 1000
          })
        })

        if (!response.ok) {
          throw new Error(`AI分析失败: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0].message.content
        
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0])
          
          console.log(`\n🤖 AI分析结果:`)
          console.log(`是否重复: ${result.is_duplicate}`)
          console.log(`置信度: ${(result.confidence * 100).toFixed(1)}%`)
          console.log(`分析: ${result.analysis}`)
          console.log(`建议: ${result.recommendation}`)
          
          if (result.is_duplicate && result.tools_to_delete && result.tools_to_delete.length > 0) {
            console.log(`\n🗑️ 准备删除重复工具...`)
            
            // 执行删除
            for (const toolId of result.tools_to_delete) {
              const { error: deleteError } = await supabase
                .from('tools')
                .delete()
                .eq('id', toolId)
              
              if (deleteError) {
                console.error(`❌ 删除工具 ${toolId} 失败:`, deleteError)
              } else {
                console.log(`✅ 成功删除工具 ${toolId}`)
              }
            }
            
            // 验证删除结果
            const { count: newCount } = await supabase
              .from('tools')
              .select('*', { count: 'exact', head: true })
            
            console.log(`📊 删除后 tools 表工具总数: ${newCount}`)
          } else {
            console.log('\n✅ 不是重复工具，无需删除')
          }
        } else {
          console.log('❌ AI响应格式错误')
        }
      } catch (error) {
        console.error('AI分析失败:', error)
      }
    } else {
      console.log('\n✅ 只有一个"秒画"相关工具，无需分析')
    }
    
    // 检查万相相关
    const wanxiangTools = tools.filter(tool => 
      tool.name.includes('万相') || tool.name.includes('通义万相')
    )
    
    if (wanxiangTools.length > 1) {
      console.log(`\n🔍 发现 ${wanxiangTools.length} 个"万相"相关工具:`)
      wanxiangTools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} (ID: ${tool.id})`)
        console.log(`   网站: ${tool.website_url}`)
        console.log(`   创建时间: ${tool.created_at}`)
      })
      
      // 删除重复的万相营造
      const wanxiang = wanxiangTools.find(tool => tool.name === '万相营造')
      if (wanxiang) {
        console.log(`\n🗑️ 准备删除"万相营造"...`)
        
        const { error: deleteError } = await supabase
          .from('tools')
          .delete()
          .eq('id', wanxiang.id)
        
        if (deleteError) {
          console.error(`❌ 删除失败:`, deleteError)
        } else {
          console.log(`✅ 成功删除"万相营造"`)
          
          // 验证删除结果
          const { count: newCount } = await supabase
            .from('tools')
            .select('*', { count: 'exact', head: true })
          
          console.log(`📊 删除后 tools 表工具总数: ${newCount}`)
        }
      }
    }
    
  } catch (error) {
    console.error('审核失败:', error)
  }
}

auditToolsTable()
