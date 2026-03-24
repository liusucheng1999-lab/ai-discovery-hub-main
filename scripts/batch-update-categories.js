#!/usr/bin/env node

/**
 * 批量更新数据表脚本
 * 执行AI分类结果到数据库的批量更新
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
 * 执行SQL文件
 */
async function executeSQLFile(sqlFilePath) {
  try {
    console.log(`📄 读取SQL文件: ${sqlFilePath}`);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // 分割SQL语句（简单分割，以分号结尾）
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 找到 ${statements.length} 条SQL语句`);
    
    const results = [];
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n🚀 执行第 ${i + 1}/${statements.length} 条SQL...`);
      console.log(`📄 SQL: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          console.error(`❌ SQL执行失败:`, error);
          results.push({ statement, success: false, error });
        } else {
          console.log(`✅ SQL执行成功`);
          results.push({ statement, success: false, data });
        }
      } catch (err) {
        console.error(`❌ SQL执行异常:`, err.message);
        results.push({ statement, success: false, error: err.message });
      }
    }
    
    return results;
  } catch (error) {
    console.error('❌ SQL文件读取失败:', error);
    throw error;
  }
}

/**
 * 直接更新工具分类（使用Supabase API）
 */
async function updateToolCategories(categorizationResults) {
  console.log(`🔄 开始批量更新 ${categorizationResults.length} 个工具的分类...\n`);
  
  const updateStats = {
    total: categorizationResults.length,
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };
  
  // 分批处理，避免请求过大
  const batchSize = 50;
  const batches = Math.ceil(categorizationResults.length / batchSize);
  
  for (let batch = 0; batch < batches; batch++) {
    const startIdx = batch * batchSize;
    const endIdx = Math.min(startIdx + batchSize, categorizationResults.length);
    const batchTools = categorizationResults.slice(startIdx, endIdx);
    
    console.log(`📦 处理第 ${batch + 1}/${batches} 批 (${startIdx + 1}-${endIdx})...`);
    
    for (const result of batchTools) {
      try {
        // 检查是否需要更新
        if (result.currentMainCategory === result.mainCategory && 
            result.currentSubCategory === result.subCategory) {
          console.log(`⏭️  跳过 ${result.name} - 分类未变更`);
          updateStats.skipped++;
          continue;
        }
        
        console.log(`🔄 更新 ${result.name}:`);
        console.log(`  主分类: ${result.currentMainCategory} → ${result.mainCategory}`);
        console.log(`  子分类: ${result.currentSubCategory} → ${result.subCategory}`);
        
        const { data, error } = await supabase
          .from('tools')
          .update({
            main_category: result.mainCategory,
            sub_category: result.subCategory,
            updated_at: new Date().toISOString()
          })
          .eq('id', result.id)
          .select();
        
        if (error) {
          console.error(`❌ 更新失败:`, error);
          updateStats.failed++;
          updateStats.errors.push({
            toolId: result.id,
            toolName: result.name,
            error: error.message
          });
        } else {
          console.log(`✅ 更新成功`);
          updateStats.success++;
        }
        
      } catch (error) {
        console.error(`❌ 更新异常 ${result.name}:`, error.message);
        updateStats.failed++;
        updateStats.errors.push({
          toolId: result.id,
          toolName: result.name,
          error: error.message
        });
      }
      
      // 请求间隔，避免频率限制
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ 第 ${batch + 1} 批完成，休息 1 秒...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return updateStats;
}

/**
 * 验证更新结果（分批查询避免HTTP头溢出）
 */
async function verifyUpdateResults(categorizationResults) {
  console.log('🔍 验证更新结果...');
  
  // 分批验证，每批50个工具
  const batchSize = 50;
  const allResults = categorizationResults;
  const batches = Math.ceil(allResults.length / batchSize);
  
  let totalVerified = 0;
  let totalCorrect = 0;
  let totalMismatches = [];
  let totalMissing = [];
  
  for (let batch = 0; batch < batches; batch++) {
    const startIdx = batch * batchSize;
    const endIdx = Math.min(startIdx + batchSize, allResults.length);
    const batchResults = allResults.slice(startIdx, endIdx);
    
    console.log(`📦 验证第 ${batch + 1}/${batches} 批 (${startIdx + 1}-${endIdx})...`);
    
    const toolIds = batchResults.map(r => r.id);
    const { data: updatedTools, error } = await supabase
      .from('tools')
      .select('id, name, main_category, sub_category, updated_at')
      .in('id', toolIds);
    
    if (error) {
      console.error(`❌ 第 ${batch + 1} 批验证查询失败:`, error.message);
      continue;
    }
    
    // 检查每个工具的更新情况
    batchResults.forEach(expected => {
      const actual = updatedTools.find(t => t.id === expected.id);
      
      if (!actual) {
        totalMissing.push(expected.id);
        return;
      }
      
      totalVerified++;
      
      if (actual.main_category === expected.mainCategory && 
          actual.sub_category === expected.subCategory) {
        totalCorrect++;
      } else {
        totalMismatches.push({
          id: expected.id,
          name: expected.name,
          expected: { main: expected.mainCategory, sub: expected.subCategory },
          actual: { main: actual.main_category, sub: actual.sub_category }
        });
      }
    });
    
    // 批次间休息
    if (batch < batches - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return {
    total: allResults.length,
    found: totalVerified,
    correctlyUpdated: totalCorrect,
    mismatches: totalMismatches,
    missingTools: totalMissing
  };
}

/**
 * 生成更新报告
 */
function generateUpdateReport(updateStats, verificationStats) {
  const report = {
    metadata: {
      updateTime: new Date().toISOString(),
      operation: 'batch_category_update'
    },
    updateStats,
    verificationStats,
    summary: {
      successRate: ((updateStats.success / updateStats.total) * 100).toFixed(1),
      verificationRate: verificationStats ? 
        ((verificationStats.correctlyUpdated / verificationStats.total) * 100).toFixed(1) : 
        'N/A'
    }
  };
  
  return report;
}

/**
 * 保存更新报告
 */
function saveUpdateReport(report) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(__dirname, 'outputs', `update_report_${timestamp}.json`);
  
  if (!fs.existsSync(path.dirname(reportFile))) {
    fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  }
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`💾 更新报告已保存: ${reportFile}`);
  
  return reportFile;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🎯 开始批量更新任务...\n');
    
    // 1. 查找最新的AI分类结果文件
    const outputsDir = path.join(__dirname, 'outputs');
    const resultFiles = fs.readdirSync(outputsDir).filter(f => 
      f.includes('ai_categorization_results_') && f.endsWith('.json')
    );
    
    if (resultFiles.length === 0) {
      console.error('❌ 未找到AI分类结果文件，请先运行 ai-smart-categorization.js');
      process.exit(1);
    }
    
    const latestResultFile = resultFiles.sort().reverse()[0];
    const categorizationData = JSON.parse(fs.readFileSync(path.join(outputsDir, latestResultFile), 'utf8'));
    const categorizationResults = categorizationData.results;
    
    console.log(`📚 加载了 ${categorizationResults.length} 个分类结果`);
    console.log(`📁 结果文件: ${latestResultFile}\n`);
    
    // 2. 执行批量更新
    console.log('🚀 开始批量更新数据库...');
    const updateStats = await updateToolCategories(categorizationResults);
    
    console.log('\n📊 更新统计:');
    console.log(`📦 总计: ${updateStats.total} 个工具`);
    console.log(`✅ 成功: ${updateStats.success} 个`);
    console.log(`❌ 失败: ${updateStats.failed} 个`);
    console.log(`⏭️ 跳过: ${updateStats.skipped} 个`);
    console.log(`📈 成功率: ${((updateStats.success / updateStats.total) * 100).toFixed(1)}%`);
    
    if (updateStats.errors.length > 0) {
      console.log('\n❌ 更新失败的工具:');
      updateStats.errors.forEach(err => {
        console.log(`  - ${err.toolName}: ${err.error}`);
      });
    }
    
    // 3. 验证更新结果（分批验证避免HTTP头溢出）
    if (updateStats.success > 0) {
      console.log('\n🔍 验证更新结果...');
      
      // 获取已更新的工具ID
      const updatedToolIds = categorizationResults
        .filter(r => r.currentMainCategory !== r.mainCategory || 
                   r.currentSubCategory !== r.subCategory)
        .map(r => r.id);
      
      const verificationStats = await verifyUpdateResults(categorizationResults);
      
      if (verificationStats) {
        console.log('\n📊 验证统计:');
        console.log(`📦 找到工具: ${verificationStats.found}/${verificationStats.total}`);
        console.log(`✅ 正确更新: ${verificationStats.correctlyUpdated}`);
        console.log(`❌ 不匹配: ${verificationStats.mismatches.length}`);
        console.log(`⚠️ 缺失: ${verificationStats.missingTools.length}`);
        
        if (verificationStats.mismatches.length > 0) {
          console.log('\n❌ 不匹配的工具:');
          verificationStats.mismatches.slice(0, 10).forEach(mismatch => {
            console.log(`  - ${mismatch.name}: 期望(${mismatch.expected.main}/${mismatch.expected.sub}) ≠ 实际(${mismatch.actual.main}/${mismatch.actual.sub})`);
          });
          if (verificationStats.mismatches.length > 10) {
            console.log(`  ... 还有 ${verificationStats.mismatches.length - 10} 个不匹配`);
          }
        }
      } else {
        console.log('⚠️ 验证查询失败，但更新操作已完成');
      }
    }
    
    // 4. 生成和保存报告
    const report = generateUpdateReport(updateStats, verificationStats || null);
    const reportFile = saveUpdateReport(report);
    
    console.log('\n🎉 批量更新完成！');
    console.log(`📊 成功更新 ${updateStats.success} 个工具的分类`);
    console.log(`📁 更新报告: ${reportFile}`);
    
    if (updateStats.failed > 0) {
      console.log('\n⚠️ 存在更新失败的工具，请检查错误信息并重试');
    }
    
    console.log('\n📋 下一步操作:');
    console.log('1. 查看更新报告: cat ' + reportFile);
    console.log('2. 验证分类效果: node verify-category-update.js');
    console.log('3. 检查网站显示: npm run dev');
    
  } catch (error) {
    console.error('❌ 批量更新失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
