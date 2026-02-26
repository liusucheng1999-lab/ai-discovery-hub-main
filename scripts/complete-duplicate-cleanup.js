/**
 * 🎯 完整重复工具清理脚本
 * 
 * 功能：AI智能分析 + 删除计划 + 自动执行
 * 
 * 使用场景：
 * - 日常重复工具清理
 * - 保持数据库整洁
 * - 批量处理重复数据
 * 
 * 特点：
 * - 🤖 AI智能分析所有工具
 * - 📋 生成详细的删除计划
 * - ⚡ 自动执行删除操作
 * - 📊 提供完整的操作日志
 * 
 * 使用方法：
 * node complete-duplicate-cleanup.js
 * 
 * 依赖：
 * - Supabase数据库
 * - DeepSeek AI API
 * - Node.js环境
 * 
 * 注意事项：
 * - 需要配置正确的API密钥
 * - 建议先备份数据
 * - 删除操作不可逆
 * 
 * 作者：AI创客团队
 * 创建时间：2026-02-12
 * 版本：v1.0.0
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function completeDuplicateCleanup() {
  try {
    console.log('🔍 开始完整的重复工具清理流程...')
    
    // 第一步：获取当前工具数量
    const { count: initialCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 当前 tools 表中共有 ${initialCount} 个工具`)
    
    // 第二步：获取所有工具详情
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, website_url, tagline, created_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取工具失败:', error)
      return
    }
    
    console.log(`📋 实际获取到 ${tools.length} 个工具`)
    
    // 第三步：AI分析重复工具
    console.log('🤖 正在调用AI分析重复工具...')
    
    const toolsList = tools.map((tool, index) => ({
      index: index + 1,
      id: tool.id,
      name: tool.name,
      website_url: tool.website_url,
      tagline: tool.tagline,
      created_at: tool.created_at
    }))
    
    const prompt = `请分析以下${tools.length}个AI工具，找出所有重复的工具。

工具列表：
${toolsList.map(tool => 
  `${tool.index}. 名称: ${tool.name}\n   网站: ${tool.website_url}\n   简介: ${tool.tagline}\n   ID: ${tool.id}\n   创建时间: ${tool.created_at}`
).join('\n\n')}

请仔细分析这些工具，找出重复的工具。重复工具的定义：
1. 网站地址完全相同或指向同一服务
2. 工具名称高度相似（只是加了AI、Bot、App等后缀）
3. 功能描述相同
4. 明显是同一个工具的不同提交
5. 域名高度相关（如 wanxiang.aliyun.com 和 tongyi.aliyun.com/wanxiang）

请严格按照以下JSON格式返回结果：
{
  "duplicate_groups": [
    {
      "group_id": 1,
      "tools": [
        {
          "index": 1,
          "id": "工具ID",
          "name": "工具名称",
          "reason": "重复原因"
        },
        {
          "index": 2,
          "id": "工具ID", 
          "name": "工具名称",
          "reason": "重复原因"
        }
      ],
      "confidence": 0.9,
      "analysis": "详细分析说明",
      "recommendation": "keep_earliest/keep_latest/keep_specific"
    }
  ],
  "total_duplicates": 2,
  "summary": "总共发现X组重复工具"
}

请只返回JSON，不要其他内容。`

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-7d4193f17b76468a874ce1cce218dfa4'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 4000
        })
      })

      if (!response.ok) {
        throw new Error(`AI分析失败: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('AI响应格式错误')
      }
      
      const result = JSON.parse(jsonMatch[0])
      
      console.log(`\n🔍 AI分析完成，发现 ${result.total_duplicates} 组重复工具:`)
      
      result.duplicate_groups.forEach((group, index) => {
        console.log(`\n📋 重复组 ${index + 1} (置信度: ${(group.confidence * 100).toFixed(1)}%):`)
        console.log(`   分析: ${group.analysis}`)
        console.log(`   建议: ${group.recommendation}`)
        
        group.tools.forEach(tool => {
          const originalTool = tools.find(t => t.id === tool.id)
          console.log(`   - ${tool.name} (ID: ${tool.id}, 创建: ${originalTool.created_at})`)
          console.log(`     原因: ${tool.reason}`)
        })
      })
      
      // 第四步：确认删除操作
      if (result.total_duplicates === 0) {
        console.log('\n✅ AI分析后没有发现重复工具，无需删除')
        return
      }
      
      console.log(`\n⚠️  即将删除 ${result.total_duplicates} 组重复工具中的重复项...`)
      
      // 第五步：生成删除计划
      const deletePlan = []
      
      result.duplicate_groups.forEach((group, index) => {
        let keepTool, deleteTools
        
        if (group.recommendation === 'keep_earliest') {
          keepTool = group.tools.reduce((earliest, current) => 
            new Date(tools.find(t => t.id === earliest.id).created_at) < 
            new Date(tools.find(t => t.id === current.id).created_at) ? earliest : current
          )
          deleteTools = group.tools.filter(t => t.id !== keepTool.id)
        } else if (group.recommendation === 'keep_latest') {
          keepTool = group.tools.reduce((latest, current) => 
            new Date(tools.find(t => t.id === latest.id).created_at) > 
            new Date(tools.find(t => t.id === current.id).created_at) ? latest : current
          )
          deleteTools = group.tools.filter(t => t.id !== keepTool.id)
        } else {
          // 默认保留最早创建的
          keepTool = group.tools.reduce((earliest, current) => 
            new Date(tools.find(t => t.id === earliest.id).created_at) < 
            new Date(tools.find(t => t.id === current.id).created_at) ? earliest : current
          )
          deleteTools = group.tools.filter(t => t.id !== keepTool.id)
        }
        
        console.log(`\n📋 重复组 ${index + 1} 删除计划:`)
        console.log(`✅ 保留: "${keepTool.name}" (ID: ${keepTool.id})`)
        deleteTools.forEach(tool => {
          console.log(`🗑️  删除: "${tool.name}" (ID: ${tool.id})`)
          deletePlan.push({
            id: tool.id,
            name: tool.name,
            groupId: index + 1
          })
        })
      })
      
      // 第六步：执行删除操作
      if (deletePlan.length > 0) {
        console.log(`\n🗑️ 开始执行删除操作...`)
        
        let successCount = 0
        let failCount = 0
        
        for (const tool of deletePlan) {
          console.log(`\n🗑️ 正在删除: "${tool.name}" (ID: ${tool.id})`)
          
          const { error: deleteError } = await supabase
            .from('tools')
            .delete()
            .eq('id', tool.id)
          
          if (deleteError) {
            console.error(`❌ 删除失败:`, deleteError)
            failCount++
          } else {
            console.log(`✅ 删除成功`)
            successCount++
          }
        }
        
        // 第七步：验证结果
        const { count: finalCount } = await supabase
          .from('tools')
          .select('*', { count: 'exact', head: true })
        
        console.log(`\n🎉 删除操作完成!`)
        console.log(`📊 删除前工具总数: ${initialCount}`)
        console.log(`📊 删除后工具总数: ${finalCount}`)
        console.log(`✅ 成功删除: ${successCount} 个`)
        console.log(`❌ 删除失败: ${failCount} 个`)
        console.log(`🗑️ 实际减少: ${initialCount - finalCount} 个`)
        
        if (successCount > 0) {
          console.log(`\n🎯 重复工具清理完成！数据库现在更加干净整洁。`)
        }
        
      } else {
        console.log('\n✅ 没有需要删除的工具')
      }
      
    } catch (error) {
      console.error('AI分析或删除过程失败:', error)
    }
    
  } catch (error) {
    console.error('完整清理流程失败:', error)
  }
}

// 执行完整的清理流程
completeDuplicateCleanup()
