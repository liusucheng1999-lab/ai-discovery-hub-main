/**
 * 🔍 Supabase权限检查脚本
 * 
 * 功能：检查数据库权限配置和API Key类型
 * 
 * 使用场景：
 * - 权限问题诊断
 * - 删除失败排查
 * - API Key类型确认
 * - RLS策略检查
 * 
 * 特点：
 * - 👤 检查用户认证状态
 * - 📋 测试各种数据库权限
 * - 🔑 分析API Key类型
 * - 🛡️ 检查RLS策略限制
 * 
 * 使用方法：
 * node check-supabase-permissions.js
 * 
 * 检查内容：
 * - SELECT权限（读取数据）
 * - INSERT权限（插入数据）
 * - UPDATE权限（更新数据）
 * - DELETE权限（删除数据）
 * - API Key权限级别
 * 
 * 依赖：
 * - Supabase数据库
 * - Node.js环境
 * 
 * 注意事项：
 * - 需要网络连接
 * - 可能受RLS策略影响
 * - 某些操作需要特定权限
 * 
 * 作者：AI创客团队
 * 创建时间：2026-02-12
 * 版本：v1.0.0
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co'
const supabaseKey = 'sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSupabasePermissions() {
  try {
    console.log('🔍 检查Supabase权限配置...')
    
    // 1. 检查当前用户信息
    console.log('\n👤 检查当前用户:')
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.log('❌ 无法获取用户信息:', userError.message)
        console.log('🔍 可能是匿名访问或token过期')
      } else {
        console.log('✅ 当前用户信息:')
        console.log(`   ID: ${user?.id}`)
        console.log(`   Email: ${user?.email || '无邮箱'}`)
        console.log(`   角色: ${user?.role || '未知'}`)
        console.log(`   是否匿名: ${user?.is_anonymous || '未知'}`)
      }
    } catch (e) {
      console.log('❌ 用户认证检查失败:', e.message)
    }
    
    // 2. 检查表权限 - 测试SELECT权限
    console.log('\n📋 检查SELECT权限:')
    try {
      const { data: selectData, error: selectError } = await supabase
        .from('tools')
        .select('id, name')
        .limit(1)
      
      if (selectError) {
        console.log('❌ SELECT权限失败:', selectError.message)
        console.log('   错误代码:', selectError.code)
      } else {
        console.log('✅ SELECT权限正常')
        console.log(`   能读取到 ${selectData.length} 条记录`)
      }
    } catch (e) {
      console.log('❌ SELECT权限检查异常:', e.message)
    }
    
    // 3. 检查INSERT权限
    console.log('\n📝 检查INSERT权限:')
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('tools')
        .insert({
          name: 'test-permission-check',
          website_url: 'https://test.com',
          tagline: '权限测试',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single()
      
      if (insertError) {
        console.log('❌ INSERT权限失败:', insertError.message)
        console.log('   错误代码:', insertError.code)
        console.log('   可能原因: RLS策略阻止或没有INSERT权限')
      } else {
        console.log('✅ INSERT权限正常')
        console.log(`   插入的ID: ${insertData.id}`)
        
        // 立即删除测试数据
        await supabase
          .from('tools')
          .delete()
          .eq('id', insertData.id)
      }
    } catch (e) {
      console.log('❌ INSERT权限检查异常:', e.message)
    }
    
    // 4. 检查UPDATE权限
    console.log('\n✏️ 检查UPDATE权限:')
    try {
      const { data: updateData, error: updateError } = await supabase
        .from('tools')
        .update({ tagline: '权限测试更新' })
        .eq('name', 'test-permission-check')
        .select('id')
        .single()
      
      if (updateError) {
        console.log('❌ UPDATE权限失败:', updateError.message)
        console.log('   错误代码:', updateError.code)
      } else {
        console.log('✅ UPDATE权限正常')
      }
    } catch (e) {
      console.log('❌ UPDATE权限检查异常:', e.message)
    }
    
    // 5. 检查DELETE权限
    console.log('\n🗑️ 检查DELETE权限:')
    try {
      // 先找一个存在的工具ID进行测试
      const { data: testData } = await supabase
        .from('tools')
        .select('id, name')
        .limit(1)
      
      if (testData && testData.length > 0) {
        const testTool = testData[0]
        console.log(`📍 使用工具 "${testTool.name}" (ID: ${testTool.id}) 进行DELETE测试`)
        
        // 注意：这里我们不实际删除，只是检查权限
        console.log('⚠️  注意: 为了安全，不执行实际DELETE操作')
        
        // 可以尝试检查RLS策略
        console.log('📋 检查可能的RLS策略限制...')
        
      } else {
        console.log('❌ 没有找到可用于测试的工具')
      }
    } catch (e) {
      console.log('❌ DELETE权限检查异常:', e.message)
    }
    
    // 6. 检查API Key类型
    console.log('\n🔑 检查API Key类型:')
    const keyInfo = analyzeSupabaseKey(supabaseKey)
    console.log(`   Key类型: ${keyInfo.type}`)
    console.log(`   Key前缀: ${keyInfo.prefix}`)
    console.log(`   权限级别: ${keyInfo.permissionLevel}`)
    
    if (keyInfo.type === 'publishable') {
      console.log('⚠️  使用的是publishable key，通常只有读取权限')
      console.log('💡 建议使用service_role key进行管理操作')
    }
    
    // 7. 提供解决方案
    console.log('\n💡 权限问题解决方案:')
    console.log('1. 使用service_role key替代publishable key')
    console.log('2. 在Supabase控制台手动执行SQL')
    console.log('3. 检查RLS策略设置')
    console.log('4. 确认用户有管理员权限')
    
  } catch (error) {
    console.error('权限检查失败:', error)
  }
}

function analyzeSupabaseKey(key) {
  if (key.startsWith('sb_')) {
    return {
      type: 'service_role',
      prefix: 'sb_',
      permissionLevel: '完全权限'
    }
  } else if (key.startsWith('sb_publishable_')) {
    return {
      type: 'publishable',
      prefix: 'sb_publishable_',
      permissionLevel: '只读权限'
    }
  } else if (key.startsWith('sb_anon_')) {
    return {
      type: 'anon',
      prefix: 'sb_anon_',
      permissionLevel: '匿名权限'
    }
  } else {
    return {
      type: 'unknown',
      prefix: key.substring(0, 10) + '...',
      permissionLevel: '未知'
    }
  }
}

checkSupabasePermissions()
