/**
 * 深度检查首页显示问题
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function deepCheckHomepage() {
  try {
    console.log('=== 深度检查首页显示问题 ===');
    
    // 1. 模拟首页查询
    console.log('1. 模拟首页查询（与Index.tsx相同逻辑）:');
    const { data: homepageData, error: homepageError } = await supabase
      .from('tools')
      .select('*')
      .in('status', ['approved', 'active'])
      .order('view_count', { ascending: false });
    
    if (homepageError) {
      console.error('首页查询失败:', homepageError);
      return;
    }
    
    console.log(`首页查询结果: ${homepageData?.length || 0} 个工具`);
    
    // 2. 检查这些工具的详细信息
    if (homepageData && homepageData.length > 0) {
      console.log('\n2. 检查首页工具的详细信息:');
      
      // 按状态分组
      const byStatus = {};
      homepageData.forEach(tool => {
        if (!byStatus[tool.status]) {
          byStatus[tool.status] = [];
        }
        byStatus[tool.status].push(tool);
      });
      
      Object.entries(byStatus).forEach(([status, tools]) => {
        console.log(`${status} 状态: ${tools.length} 个工具`);
        tools.slice(0, 5).forEach((tool, index) => {
          console.log(`  ${index + 1}. ${tool.name}`);
          console.log(`     分类: ${tool.category}`);
          console.log(`     浏览量: ${tool.view_count || 0}`);
          console.log(`     AI审核: ${tool.ai_review_result ? '有' : '无'}`);
          console.log(`     创建时间: ${tool.created_at}`);
        });
      });
    }
    
    // 3. 检查是否有approved状态的工具
    console.log('\n3. 专门检查approved状态的工具:');
    const { data: approvedTools, error: approvedError } = await supabase
      .from('tools')
      .select('id, name, category, view_count, created_at, ai_review_result')
      .eq('status', 'approved')
      .order('view_count', { ascending: false })
      .limit(10);
    
    if (approvedError) {
      console.error('查询approved工具失败:', approvedError);
    } else {
      console.log(`approved状态工具: ${approvedTools?.length || 0} 个`);
      
      if (approvedTools && approvedTools.length > 0) {
        approvedTools.forEach((tool, index) => {
          console.log(`${index + 1}. ${tool.name}`);
          console.log(`   分类: ${tool.category}`);
          console.log(`   浏览量: ${tool.view_count || 0}`);
          console.log(`   创建时间: ${tool.created_at}`);
          console.log(`   AI审核: ${tool.ai_review_result ? '有' : '无'}`);
          
          // 检查是否在首页结果中
          const inHomepage = homepageData?.some(hp => hp.id === tool.id);
          console.log(`   在首页: ${inHomepage ? '✅' : '❌'}`);
          
          if (!inHomepage) {
            console.log(`   ⚠️ 问题: approved工具不在首页显示！`);
          }
        });
      }
    }
    
    // 4. 检查查询条件是否正确
    console.log('\n4. 测试不同的查询条件:');
    
    // 测试只查approved
    const { data: onlyApproved, error: onlyApprovedError } = await supabase
      .from('tools')
      .select('id, name, status')
      .eq('status', 'approved');
    
    if (onlyApprovedError) {
      console.error('查询only approved失败:', onlyApprovedError);
    } else {
      console.log(`只查询approved: ${onlyApproved?.length || 0} 个`);
    }
    
    // 测试只查active
    const { data: onlyActive, error: onlyActiveError } = await supabase
      .from('tools')
      .select('id, name, status')
      .eq('status', 'active');
    
    if (onlyActiveError) {
      console.error('查询only active失败:', onlyActiveError);
    } else {
      console.log(`只查询active: ${onlyActive?.length || 0} 个`);
    }
    
    // 测试IN查询
    const { data: inQuery, error: inError } = await supabase
      .from('tools')
      .select('id, name, status')
      .in('status', ['approved', 'active']);
    
    if (inError) {
      console.error('查询IN条件失败:', inError);
    } else {
      console.log(`查询IN条件: ${inQuery?.length || 0} 个`);
    }
    
    // 5. 检查是否有数据类型问题
    console.log('\n5. 检查数据类型问题:');
    const { data: typeCheck, error: typeError } = await supabase
      .from('tools')
      .select('id, name, status, typeof(status) as status_type')
      .in('status', ['approved', 'active'])
      .limit(5);
    
    if (typeError) {
      console.log('类型检查失败（可能不支持typeof）:', typeError.message);
    } else {
      console.log('数据类型检查结果:');
      typeCheck?.forEach(item => {
        console.log(`${item.name}: "${item.status}" (类型: ${item.status_type || '未知'})`);
      });
    }
    
    // 6. 检查是否有空格或其他字符问题
    console.log('\n6. 检查状态字段是否有异常字符:');
    const { data: charCheck, error: charError } = await supabase
      .from('tools')
      .select('id, name, status, length(status) as status_length')
      .in('status', ['approved', 'active'])
      .limit(5);
    
    if (charError) {
      console.error('字符检查失败:', charError);
    } else {
      console.log('状态字段字符检查:');
      charCheck?.forEach(item => {
        console.log(`${item.name}: "${item.status}" (长度: ${item.status_length})`);
        
        if (item.status_length !== 7 && item.status_length !== 6) { // approved=7, active=6
          console.log(`  ⚠️ 长度异常，可能有空格或特殊字符`);
        }
      });
    }
    
    // 7. 总结和诊断
    console.log('\n7. 诊断总结:');
    const totalHomepage = homepageData?.length || 0;
    const totalApproved = onlyApproved?.length || 0;
    const totalActive = onlyActive?.length || 0;
    const expectedTotal = totalApproved + totalActive;
    
    console.log(`首页显示: ${totalHomepage} 个工具`);
    console.log(`approved状态: ${totalApproved} 个工具`);
    console.log(`active状态: ${totalActive} 个工具`);
    console.log(`预期总数: ${expectedTotal} 个工具`);
    
    if (totalHomepage === expectedTotal) {
      console.log('✅ 查询逻辑正确，数据完整');
    } else {
      console.log(`❌ 数据不匹配，差值: ${expectedTotal - totalHomepage}`);
    }
    
    if (totalHomepage === 0) {
      console.log('❌ 首页没有显示任何工具，可能的原因:');
      console.log('- 查询条件错误');
      console.log('- 数据类型不匹配');
      console.log('- 权限问题');
      console.log('- 缓存问题');
    }
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('深度检查首页显示失败:', error);
  }
}

deepCheckHomepage();
