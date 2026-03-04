/**
 * 修复Admin.tsx中的表引用问题
 */

import fs from 'fs';

function fixAdminTableReferences() {
  try {
    console.log('=== 修复Admin.tsx中的表引用问题 ===');
    
    const adminFilePath = '/Users/stellaliu/Documents/ai-discovery-hub-main/src/pages/Admin.tsx';
    
    // 读取文件
    let content = fs.readFileSync(adminFilePath, 'utf8');
    
    console.log('1. 替换tool_submissions为tools...');
    
    // 替换所有tool_submissions为tools（除了注释）
    content = content.replace(/\.from\('tool_submissions'\)/g, ".from('tools')");
    content = content.replace(/tool_submissions\./g, 'tools.');
    content = content.replace(/'tool_submissions'/g, "'tools'");
    
    console.log('2. 检查并修复相关的状态更新逻辑...');
    
    // 修复状态更新逻辑 - 现在应该直接更新tools表的状态而不是插入到tool_submissions
    content = content.replace(
      /const \{ error: submissionError \} = await supabase\s*\.from\('tools'\)\s*\.update\(\{\s*ai_review_result: result,\s*ai_review_date: new Date\(\)\.toISOString\(\)\s*\}\)\s*\.eq\('id', tool\.id\);/g,
      `// AI审核结果已经通过batch-review-service保存到tools表
      // 这里不需要重复保存，因为状态已经在executeTask中更新了`
    );
    
    console.log('3. 修复批量拒绝功能...');
    
    // 修复批量拒绝 - 现在应该更新tools表状态
    content = content.replace(
      /const \{ error \} = await supabase\s*\.from\('tools'\)\s*\.update\(\{ status: 'rejected' \}\)\s*\.in\('id', selectedIds\);/g,
      `const { error } = await supabase
        .from('tools')
        .update({ status: 'rejected' })
        .in('id', selectedIds);`
    );
    
    console.log('4. 修复数据重新加载逻辑...');
    
    // 修复数据重新加载 - 现在应该从tools表加载
    content = content.replace(
      /const \{ data: refreshedData \} = await supabase\s*\.from\('tools'\)\s*\.select\('\*'\)\s*\.order\('created_at', \{ ascending: false \}\);/g,
      `const { data: refreshedData } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['pending', 'approved', 'rejected'])
        .order('created_at', { ascending: false });`
    );
    
    console.log('5. 清理多余的代码...');
    
    // 移除不再需要的代码段
    content = content.replace(
      /\/\/ 同时保存到tool_submissions表\s*const \{ error: submissionError \} = await supabase\s*\.from\('tools'\)\s*\.update\(\{\s*ai_review_result: result,\s*ai_review_date: new Date\(\)\.toISOString\(\)\s*\}\)\s*\.eq\('id', tool\.id\);\s*if \(submissionError\) \{\s*console\.error\('保存到tool_submissions失败:', submissionError\);\s*\} else \{\s*console\.log\(`已保存AI审核结果到tool_submissions: \$\{tool\.name\}`\);\s*\}/g,
      `// AI审核结果已通过batch-review-service保存`
    );
    
    console.log('6. 清理多余的空行...');
    
    // 清理多余的空行
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/^\s*\n/, '');
    content = content.replace(/\n\s*$/, '');
    
    console.log('7. 写入修复后的文件...');
    
    // 写入文件
    fs.writeFileSync(adminFilePath, content);
    
    console.log('✅ Admin.tsx表引用修复完成！');
    console.log('\n修复内容:');
    console.log('- 将所有tool_submissions引用改为tools');
    console.log('- 修复了状态更新逻辑');
    console.log('- 修复了数据加载逻辑');
    console.log('- 清理了多余的代码');
    
    console.log('\n现在批量AI审核功能应该正常工作：');
    console.log('- 从tools表获取待审核工具');
    console.log('- 使用batch-review-service处理审核');
    console.log('- 正确更新tools表状态');
    
  } catch (error) {
    console.error('修复Admin.tsx表引用失败:', error);
  }
}

fixAdminTableReferences();
