/**
 * 修复CHECK约束问题
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function fixConstraint() {
  try {
    console.log('=== 修复CHECK约束问题 ===');
    
    // 1. 检查当前约束
    console.log('1. 检查当前约束...');
    
    // 尝试查看约束定义
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('status')
        .limit(1);
      
      if (error) {
        console.error('查询tools表失败:', error);
        return;
      }
      
      console.log('tools表可以正常查询');
      
    } catch (err) {
      console.error('查询异常:', err);
    }
    
    // 2. 删除可能有问题的约束
    console.log('\n2. 删除可能有问题的CHECK约束...');
    console.log('请在Supabase SQL编辑器中执行以下SQL:');
    console.log('-- 删除status字段的CHECK约束');
    console.log('ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_status_check;');
    
    // 3. 重新添加更宽松的约束
    console.log('\n3. 重新添加更宽松的约束...');
    console.log('-- 添加更宽松的约束，包含所有可能的状态');
    console.log('ALTER TABLE tools ADD CONSTRAINT tools_status_check CHECK (status IN (\'pending\', \'approved\', \'rejected\', \'active\', \'inactive\', \'draft\', \'archived\'));');
    
    // 4. 或者暂时不添加约束
    console.log('\n4. 或者暂时不添加约束（推荐）');
    console.log('-- 如果上面的SQL还有问题，可以暂时不添加CHECK约束');
    console.log('-- 先让数据迁移成功，后续再考虑添加约束');
    
    // 5. 检查现有数据的状态值
    console.log('\n5. 检查tool_submissions中的状态值...');
    const { data: submissions, error: statusError } = await supabase
      .from('tool_submissions')
      .select('status')
      .not('status', 'is', null);
    
    if (statusError) {
      console.error('查询状态失败:', statusError);
      return;
    }
    
    const uniqueStatuses = [...new Set(submissions?.map(s => s.status) || [])];
    console.log('tool_submissions中的所有状态值:', uniqueStatuses);
    
    // 6. 提供修复建议
    console.log('\n6. 修复建议:');
    console.log('方案A（推荐）: 删除约束，先完成迁移');
    console.log('```sql');
    console.log('ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_status_check;');
    console.log('-- 然后重新运行迁移脚本');
    console.log('```');
    
    console.log('\n方案B: 修改约束以包含所有状态值');
    if (uniqueStatuses.length > 0) {
      const allStatuses = ['pending', 'approved', 'rejected', 'active', ...uniqueStatuses];
      const uniqueAllStatuses = [...new Set(allStatuses)];
      const statusList = uniqueAllStatuses.map(s => `'${s}'`).join(', ');
      
      console.log('```sql');
      console.log('ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_status_check;');
      console.log(`ALTER TABLE tools ADD CONSTRAINT tools_status_check CHECK (status IN (${statusList}));`);
      console.log('```');
    }
    
    console.log('\n方案C: 暂时移除所有约束');
    console.log('```sql');
    console.log('-- 查看所有约束');
    console.log('SELECT conname, contype FROM pg_constraint WHERE conrelid = \'tools\'::regclass;');
    console.log('-- 删除所有约束（谨慎使用）');
    console.log('ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_status_check;');
    console.log('```');
    
    // 7. 提供测试脚本
    console.log('\n7. 测试插入脚本...');
    console.log('执行完SQL修复后，运行以下脚本测试:');
    console.log('node scripts/test-insert.js');
    
  } catch (error) {
    console.error('修复约束失败:', error);
  }
}

// 创建测试插入脚本
const testInsertScript = `
/**
 * 测试插入功能
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function testInsert() {
  try {
    console.log('=== 测试插入功能 ===');
    
    // 测试各种状态值
    const testStatuses = ['pending', 'approved', 'rejected', 'active'];
    
    for (const status of testStatuses) {
      console.log(\`测试状态: \${status}\`);
      
      const testData = {
        name: \`测试工具-\${status}\`,
        tagline: '测试简介',
        description: '测试描述',
        website_url: \`https://example.com/\${status}\`,
        category: 'test',
        tags: ['test'],
        pricing_type: 'free',
        is_china_available: false,
        is_chinese_supported: false,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        screenshots: [],
        status: status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        note: null,
        ai_review_result: null,
        ai_review_date: null
      };
      
      const { error } = await supabase
        .from('tools')
        .insert(testData);
      
      if (error) {
        console.error(\`  ❌ 状态 \${status} 插入失败: \${error.message}\`);
      } else {
        console.log(\`  ✅ 状态 \${status} 插入成功\`);
        
        // 删除测试数据
        await supabase
          .from('tools')
          .delete()
          .eq('name', \`测试工具-\${status}\`);
      }
    }
    
    console.log('\\n测试完成');
    
  } catch (error) {
    console.error('测试插入失败:', error);
  }
}

testInsert();
`;

// 写入测试脚本
import fs from 'fs';
fs.writeFileSync('/Users/stellaliu/Documents/ai-discovery-hub-main/scripts/test-insert.js', testInsertScript);
console.log('已创建测试脚本: scripts/test-insert.js');

// 执行修复
fixConstraint();
