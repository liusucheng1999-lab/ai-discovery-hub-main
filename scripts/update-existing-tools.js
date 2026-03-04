/**
 * 将tools表中现有的工具状态更新为active（已通过）
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function updateExistingTools() {
  try {
    console.log('=== 更新现有工具状态 ===');
    
    // 1. 查看当前状态分布
    console.log('1. 查看当前状态分布:');
    const { data: currentStatus, error: statusError } = await supabase
      .from('tools')
      .select('status', { count: 'exact' });
    
    if (statusError) {
      console.error('查询状态失败:', statusError);
      return;
    }
    
    const statusCount = {};
    currentStatus?.forEach(tool => {
      statusCount[tool.status] = (statusCount[tool.status] || 0) + 1;
    });
    
    console.log('当前状态分布:');
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`- ${status}: ${count} 个`);
    });
    
    // 2. 将没有明确状态或状态为null的工具设为active
    console.log('\n2. 更新状态为null或空值的工具:');
    const { data: nullStatusTools, error: nullError } = await supabase
      .from('tools')
      .select('id, name, status')
      .is('status', null);
    
    if (nullError) {
      console.error('查询null状态工具失败:', nullError);
    } else if (nullStatusTools && nullStatusTools.length > 0) {
      console.log(`找到 ${nullStatusTools.length} 个状态为null的工具`);
      
      const { error: updateNullError } = await supabase
        .from('tools')
        .update({ status: 'active' })
        .is('status', null);
      
      if (updateNullError) {
        console.error('更新null状态失败:', updateNullError);
      } else {
        console.log(`✅ 成功将 ${nullStatusTools.length} 个工具状态设为active`);
      }
    } else {
      console.log('没有状态为null的工具');
    }
    
    // 3. 将状态为空字符串的工具设为active
    console.log('\n3. 更新状态为空字符串的工具:');
    const { data: emptyStatusTools, error: emptyError } = await supabase
      .from('tools')
      .select('id, name, status')
      .eq('status', '');
    
    if (emptyError) {
      console.error('查询空状态工具失败:', emptyError);
    } else if (emptyStatusTools && emptyStatusTools.length > 0) {
      console.log(`找到 ${emptyStatusTools.length} 个状态为空的工具`);
      
      const { error: updateEmptyError } = await supabase
        .from('tools')
        .update({ status: 'active' })
        .eq('status', '');
      
      if (updateEmptyError) {
        console.error('更新空状态失败:', updateEmptyError);
      } else {
        console.log(`✅ 成功将 ${emptyStatusTools.length} 个工具状态设为active`);
      }
    } else {
      console.log('没有状态为空的工具');
    }
    
    // 4. 将所有非pending、非approved、非rejected的工具设为active
    console.log('\n4. 将其他状态设为active:');
    const { data: otherStatusTools, error: otherError } = await supabase
      .from('tools')
      .select('id, name, status')
      .in('status', ['active']); // 只查询active状态的，因为其他状态应该已经是正确的
    
    if (otherError) {
      console.error('查询其他状态工具失败:', otherError);
    } else {
      console.log(`当前active状态工具: ${otherStatusTools?.length || 0} 个`);
      // 这些工具应该保持active状态，不需要更新
    }
    
    // 5. 验证最终结果
    console.log('\n5. 验证最终状态分布:');
    const { data: finalStatus, error: finalError } = await supabase
      .from('tools')
      .select('status', { count: 'exact' });
    
    if (finalError) {
      console.error('查询最终状态失败:', finalError);
    } else {
      const finalStatusCount = {};
      finalStatus?.forEach(tool => {
        finalStatusCount[tool.status] = (finalStatusCount[tool.status] || 0) + 1;
      });
      
      console.log('最终状态分布:');
      Object.entries(finalStatusCount).forEach(([status, count]) => {
        console.log(`- ${status}: ${count} 个`);
      });
      
      // 计算首页会显示的工具数量
      const homepageVisible = (finalStatusCount['approved'] || 0) + (finalStatusCount['active'] || 0);
      console.log(`\n📱 首页将显示: ${homepageVisible} 个工具`);
    }
    
    console.log('\n=== 更新完成 ===');
    
  } catch (error) {
    console.error('更新现有工具状态失败:', error);
  }
}

updateExistingTools();
