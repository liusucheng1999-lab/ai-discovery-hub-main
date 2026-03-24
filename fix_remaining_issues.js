import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function fixRemainingIssues() {
  try {
    console.log('=== 修复剩余问题 ===');
    
    // 1. 删除剩余的video主分类
    console.log('1. 删除旧的video主分类...');
    const { error: deleteVideoError } = await supabase
      .from('main_categories')
      .delete()
      .eq('id', 'video');
    
    if (deleteVideoError) {
      console.error('删除video分类失败:', deleteVideoError.message);
    } else {
      console.log('✅ 删除video分类成功');
    }
    
    // 2. 将video分类下的工具迁移到visual分类
    console.log('\n2. 迁移video分类下的工具到visual...');
    const { data: videoTools, error: fetchVideoError } = await supabase
      .from('tools')
      .select('id, name, main_category, sub_category')
      .eq('main_category', 'video')
      .in('status', ['approved', 'active']);
    
    if (fetchVideoError) throw fetchVideoError;
    
    console.log(`找到 ${videoTools.length} 个video分类的工具需要迁移`);
    
    let migrateCount = 0;
    for (const tool of videoTools) {
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          main_category: 'visual',
          sub_category: 'visual_video'
        })
        .eq('id', tool.id);
      
      if (updateError) {
        console.error(`迁移工具 ${tool.name} 失败:`, updateError.message);
      } else {
        migrateCount++;
        console.log(`✅ 迁移工具: ${tool.name}`);
      }
    }
    
    console.log(`成功迁移 ${migrateCount} 个工具`);
    
    // 3. 检查并修复其他不匹配的分类
    console.log('\n3. 检查其他分类问题...');
    
    // 获取所有工具及其分类
    const { data: allTools, error: fetchAllError } = await supabase
      .from('tools')
      .select('id, name, main_category, sub_category')
      .in('status', ['approved', 'active']);
    
    if (fetchAllError) throw fetchAllError;
    
    // 检查是否有使用旧分类ID的工具
    const issues = [];
    const validMainCategories = ['chat', 'writing', 'visual', 'audio', 'coding', 'office', 'tools', 'career'];
    const validSubCategories = [
      'chat_domestic', 'chat_overseas', 'chat_general', 'chat_fun',
      'writing_copy', 'writing_academic', 'writing_novel', 'writing_document',
      'visual_image_gen', 'visual_image_process', 'visual_creative', 'visual_video',
      'audio_music', 'audio_voice', 'audio_transcribe', 'audio_edit',
      'coding_code', 'coding_ai', 'coding_dev', 'coding_agent',
      'office_ppt', 'office_doc', 'office_data', 'office_mind',
      'tools_search', 'tools_efficiency', 'tools_learn', 'tools_niche',
      'career_job', 'career_legal', 'career_work'
    ];
    
    allTools?.forEach(tool => {
      if (!validMainCategories.includes(tool.main_category)) {
        issues.push({ tool: tool.name, issue: '无效主分类', current: tool.main_category });
      }
      if (!validSubCategories.includes(tool.sub_category)) {
        issues.push({ tool: tool.name, issue: '无效子分类', current: tool.sub_category });
      }
    });
    
    if (issues.length > 0) {
      console.log(`发现 ${issues.length} 个分类问题:`);
      issues.forEach(issue => {
        console.log(`  - ${issue.tool}: ${issue.issue} (${issue.current})`);
      });
    } else {
      console.log('✅ 所有工具分类都正确');
    }
    
    // 4. 最终验证
    console.log('\n4. 最终验证...');
    const { data: finalStats } = await supabase
      .from('tools')
      .select('main_category, sub_category')
      .in('status', ['approved', 'active']);
    
    const { data: finalCategories } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    const stats = {};
    finalStats?.forEach(tool => {
      if (!stats[tool.main_category]) {
        stats[tool.main_category] = {};
      }
      if (!stats[tool.main_category][tool.sub_category]) {
        stats[tool.main_category][tool.sub_category] = 0;
      }
      stats[tool.main_category][tool.sub_category]++;
    });
    
    console.log('\n最终统计:');
    Object.keys(stats).forEach(mainCat => {
      const mainCatName = finalCategories?.find(c => c.id === mainCat)?.name || mainCat;
      const total = Object.values(stats[mainCat]).reduce((a, b) => a + b, 0);
      console.log(`${mainCatName}: ${total} 个工具`);
    });
    
    console.log(`\n总工具数: ${finalStats?.length || 0}`);
    console.log('\n✅ 修复完成！');
    
  } catch (error) {
    console.error('修复失败:', error.message);
  }
}

fixRemainingIssues();
