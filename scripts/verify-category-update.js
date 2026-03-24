#!/usr/bin/env node

/**
 * 验证分类更新脚本
 * 检查分类更新后的数据一致性和网站显示效果
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase配置
const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co';
const supabaseKey = 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 获取分类统计数据
 */
async function getCategoryStats() {
  console.log('📊 获取分类统计数据...');
  
  const { data: stats, error } = await supabase
    .from('tools')
    .select('main_category, sub_category, status')
    .in('status', ['approved', 'active']);
  
  if (error) {
    console.error('❌ 获取统计失败:', error);
    return null;
  }
  
  const totalTools = stats.length;
  const categoryStats = {};
  const subCategoryStats = {};
  const statusStats = {};
  
  stats.forEach(tool => {
    // 状态统计
    statusStats[tool.status] = (statusStats[tool.status] || 0) + 1;
    
    // 主分类统计
    const mainCat = tool.main_category || '未分类';
    categoryStats[mainCat] = (categoryStats[mainCat] || 0) + 1;
    
    // 子分类统计
    if (tool.main_category && tool.sub_category) {
      const subCat = `${tool.main_category}_${tool.sub_category}`;
      subCategoryStats[subCat] = (subCategoryStats[subCat] || 0) + 1;
    }
  });
  
  return {
    totalTools,
    categoryStats,
    subCategoryStats,
    statusStats,
    categorizedTools: totalTools - (categoryStats['未分类'] || 0),
    uncategorizedTools: categoryStats['未分类'] || 0
  };
}

/**
 * 检查分类完整性
 */
async function checkCategoryIntegrity() {
  console.log('🔍 检查分类完整性...');
  
  // 获取主分类定义
  const { data: mainCategories, error: mainError } = await supabase
    .from('main_categories')
    .select('*')
    .order('sort_order');
  
  if (mainError) {
    console.error('❌ 获取主分类失败:', mainError);
    return null;
  }
  
  // 获取子分类定义
  const { data: subCategories, error: subError } = await supabase
    .from('sub_categories')
    .select('*')
    .order('main_category_id, sort_order');
  
  if (subError) {
    console.error('❌ 获取子分类失败:', subError);
    return null;
  }
  
  // 检查工具分类是否都在定义范围内
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('id, name, main_category, sub_category')
    .in('status', ['approved', 'active']);
  
  if (toolsError) {
    console.error('❌ 获取工具数据失败:', toolsError);
    return null;
  }
  
  const mainCategoryIds = mainCategories.map(cat => cat.id);
  const subCategoryIds = subCategories.map(cat => cat.id);
  
  const integrityIssues = {
    invalidMainCategories: [],
    invalidSubCategories: [],
    orphanedSubCategories: [],
    missingSubCategories: []
  };
  
  tools.forEach(tool => {
    // 检查主分类
    if (tool.main_category && !mainCategoryIds.includes(tool.main_category)) {
      integrityIssues.invalidMainCategories.push({
        id: tool.id,
        name: tool.name,
        invalidCategory: tool.main_category
      });
    }
    
    // 检查子分类
    if (tool.sub_category && !subCategoryIds.includes(tool.sub_category)) {
      integrityIssues.invalidSubCategories.push({
        id: tool.id,
        name: tool.name,
        invalidSubCategory: tool.sub_category
      });
    }
    
    // 检查孤立子分类（有主分类但无子分类）
    if (tool.main_category && !tool.sub_category) {
      integrityIssues.missingSubCategories.push({
        id: tool.id,
        name: tool.name,
        mainCategory: tool.main_category
      });
    }
    
    // 检查子分类是否属于正确的主分类
    if (tool.main_category && tool.sub_category) {
      const subCategory = subCategories.find(cat => cat.id === tool.sub_category);
      if (subCategory && subCategory.main_category_id !== tool.main_category) {
        integrityIssues.orphanedSubCategories.push({
          id: tool.id,
          name: tool.name,
          mainCategory: tool.main_category,
          subCategory: tool.sub_category,
          expectedMainCategory: subCategory.main_category_id
        });
      }
    }
  });
  
  return {
    mainCategories: mainCategories.length,
    subCategories: subCategories.length,
    integrityIssues,
    totalTools: tools.length
  };
}

/**
 * 检查分类分布合理性
 */
async function checkCategoryDistribution() {
  console.log('📈 分析分类分布合理性...');
  
  const { data: tools, error } = await supabase
    .from('tools')
    .select('main_category, sub_category, view_count')
    .in('status', ['approved', 'active'])
    .order('view_count', { ascending: false });
  
  if (error) {
    console.error('❌ 获取工具数据失败:', error);
    return null;
  }
  
  const distribution = {};
  const viewDistribution = {};
  
  tools.forEach(tool => {
    const key = `${tool.main_category}_${tool.sub_category}`;
    distribution[key] = (distribution[key] || 0) + 1;
    viewDistribution[key] = (viewDistribution[key] || 0) + (tool.view_count || 0);
  });
  
  // 分析分布情况
  const analysis = {
    totalTools: tools.length,
    categoryDistribution: distribution,
    viewDistribution,
    emptyCategories: Object.entries(distribution)
      .filter(([key, count]) => count === 0)
      .map(([key]) => key),
    sparseCategories: Object.entries(distribution)
      .filter(([key, count]) => count > 0 && count < 3)
      .map(([key, count]) => ({ category: key, count })),
    popularCategories: Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([key, count]) => ({ category: key, count })),
    highViewCategories: Object.entries(viewDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([key, views]) => ({ category: key, views }))
  };
  
  return analysis;
}

/**
 * 生成验证报告
 */
function generateVerificationReport(stats, integrity, distribution) {
  const report = {
    metadata: {
      verificationTime: new Date().toISOString(),
      operation: 'category_update_verification'
    },
    summary: {
      totalTools: stats.totalTools,
      categorizedTools: stats.categorizedTools,
      categorizationRate: ((stats.categorizedTools / stats.totalTools) * 100).toFixed(1),
      uncategorizedTools: stats.uncategorizedTools
    },
    categoryStats: stats.categoryStats,
    subCategoryStats: stats.subCategoryStats,
    integrity: {
      totalIssues: Object.values(integrity.integrityIssues)
        .reduce((sum, issues) => sum + issues.length, 0),
      issues: integrity.integrityIssues
    },
    distribution: distribution,
    recommendations: generateRecommendations(stats, integrity, distribution)
  };
  
  return report;
}

/**
 * 生成改进建议
 */
function generateRecommendations(stats, integrity, distribution) {
  const recommendations = [];
  
  // 分类覆盖率建议
  const categorizationRate = (stats.categorizedTools / stats.totalTools) * 100;
  if (categorizationRate < 95) {
    recommendations.push({
      priority: 'high',
      type: 'coverage',
      message: `分类覆盖率仅为${categorizationRate.toFixed(1)}%，建议对剩余${stats.uncategorizedTools}个工具进行分类`
    });
  }
  
  // 完整性问题建议
  const totalIssues = Object.values(integrity.integrityIssues)
    .reduce((sum, issues) => sum + issues.length, 0);
  
  if (integrity.integrityIssues.invalidMainCategories.length > 0) {
    recommendations.push({
      priority: 'high',
      type: 'integrity',
      message: `发现${integrity.integrityIssues.invalidMainCategories.length}个无效主分类，需要修正`
    });
  }
  
  if (integrity.integrityIssues.invalidSubCategories.length > 0) {
    recommendations.push({
      priority: 'high',
      type: 'integrity',
      message: `发现${integrity.integrityIssues.invalidSubCategories.length}个无效子分类，需要修正`
    });
  }
  
  if (integrity.integrityIssues.missingSubCategories.length > 0) {
    recommendations.push({
      priority: 'medium',
      type: 'integrity',
      message: `发现${integrity.integrityIssues.missingSubCategories.length}个工具缺少子分类，建议补充`
    });
  }
  
  // 分布均衡性建议
  if (distribution.sparseCategories.length > 0) {
    recommendations.push({
      priority: 'low',
      type: 'distribution',
      message: `发现${distribution.sparseCategories.length}个稀疏分类（少于3个工具），考虑合并或重新分类`
    });
  }
  
  // 空分类建议
  if (distribution.emptyCategories.length > 0) {
    recommendations.push({
      priority: 'medium',
      type: 'distribution',
      message: `发现${distribution.emptyCategories.length}个空分类，考虑删除或重新分配工具`
    });
  }
  
  return recommendations;
}

/**
 * 保存验证报告
 */
function saveVerificationReport(report) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(__dirname, 'outputs', `verification_report_${timestamp}.json`);
  
  if (!fs.existsSync(path.dirname(reportFile))) {
    fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  }
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`💾 验证报告已保存: ${reportFile}`);
  
  return reportFile;
}

/**
 * 显示验证结果
 */
function displayVerificationResults(report) {
  console.log('\n🎯 分类更新验证结果');
  console.log('='.repeat(50));
  
  // 基本统计
  console.log('\n📊 基本统计:');
  console.log(`📦 总工具数: ${report.summary.totalTools}`);
  console.log(`✅ 已分类: ${report.summary.categorizedTools} (${report.summary.categorizationRate}%)`);
  console.log(`⚠️ 未分类: ${report.summary.uncategorizedTools}`);
  
  // 分类分布
  console.log('\n🏷️ 主分类分布:');
  Object.entries(report.categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([category, count]) => {
      const percentage = ((count / report.summary.totalTools) * 100).toFixed(1);
      console.log(`  ${category}: ${count} (${percentage}%)`);
    });
  
  // 完整性检查
  console.log('\n🔍 完整性检查:');
  console.log(`❌ 总问题数: ${report.integrity.totalIssues}`);
  
  if (report.integrity.issues.invalidMainCategories.length > 0) {
    console.log(`  - 无效主分类: ${report.integrity.issues.invalidMainCategories.length} 个`);
  }
  
  if (report.integrity.issues.invalidSubCategories.length > 0) {
    console.log(`  - 无效子分类: ${report.integrity.issues.invalidSubCategories.length} 个`);
  }
  
  if (report.integrity.issues.missingSubCategories.length > 0) {
    console.log(`  - 缺少子分类: ${report.integrity.issues.missingSubCategories.length} 个`);
  }
  
  // 分布分析
  console.log('\n📈 分布分析:');
  console.log(`🏆 热门分类 (前5):`);
  report.distribution.popularCategories.slice(0, 5).forEach(cat => {
    console.log(`  ${cat.category}: ${cat.count} 个工具`);
  });
  
  if (report.distribution.sparseCategories.length > 0) {
    console.log(`⚠️ 稀疏分类: ${report.distribution.sparseCategories.length} 个`);
  }
  
  // 改进建议
  if (report.recommendations.length > 0) {
    console.log('\n💡 改进建议:');
    report.recommendations.forEach(rec => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`  ${priority} [${rec.type.toUpperCase()}] ${rec.message}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🎯 开始分类更新验证任务...\n');
    
    // 1. 获取分类统计
    const stats = await getCategoryStats();
    if (!stats) {
      console.error('❌ 无法获取分类统计数据');
      process.exit(1);
    }
    
    // 2. 检查分类完整性
    const integrity = await checkCategoryIntegrity();
    if (!integrity) {
      console.error('❌ 无法检查分类完整性');
      process.exit(1);
    }
    
    // 3. 分析分类分布
    const distribution = await checkCategoryDistribution();
    if (!distribution) {
      console.error('❌ 无法分析分类分布');
      process.exit(1);
    }
    
    // 4. 生成验证报告
    const report = generateVerificationReport(stats, integrity, distribution);
    
    // 5. 显示验证结果
    displayVerificationResults(report);
    
    // 6. 保存验证报告
    const reportFile = saveVerificationReport(report);
    
    console.log('\n🎉 验证完成！');
    console.log(`📁 验证报告: ${reportFile}`);
    
    // 7. 根据验证结果给出下一步建议
    console.log('\n📋 下一步操作建议:');
    
    if (report.summary.categorizationRate < 95) {
      console.log('1. 对未分类工具进行手动分类');
    }
    
    if (report.integrity.totalIssues > 0) {
      console.log('2. 修复分类完整性问题');
    }
    
    if (report.distribution.sparseCategories.length > 0) {
      console.log('3. 优化稀疏分类的分布');
    }
    
    console.log('4. 启动开发服务器检查网站显示: npm run dev');
    console.log('5. 测试分类筛选和导航功能');
    
  } catch (error) {
    console.error('❌ 验证失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
