import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function fixAudioTranscription() {
  try {
    console.log('=== 修复音频转录工具分类 ===');
    
    // 需要修复的工具
    const toolsToFix = [
      'Nafy AI',
      '多维视界', 
      'TurboScribe',
      'NotebookLM',
      '简单听记',
      'Airgram'
    ];
    
    let fixCount = 0;
    
    for (const toolName of toolsToFix) {
      // 查找工具
      const { data: tools, error: fetchError } = await supabase
        .from('tools')
        .select('id, name, sub_category')
        .eq('name', toolName)
        .in('status', ['approved', 'active']);
      
      if (fetchError) {
        console.error(`查找工具 ${toolName} 失败:`, fetchError.message);
        continue;
      }
      
      if (tools && tools.length > 0) {
        for (const tool of tools) {
          // 更新子分类为正确的audio_transcribe
          const { error: updateError } = await supabase
            .from('tools')
            .update({ sub_category: 'audio_transcribe' })
            .eq('id', tool.id);
          
          if (updateError) {
            console.error(`更新工具 ${tool.name} 失败:`, updateError.message);
          } else {
            fixCount++;
            console.log(`✅ 修复工具: ${tool.name} -> audio_transcribe`);
          }
        }
      } else {
        console.log(`⚠️ 未找到工具: ${toolName}`);
      }
    }
    
    console.log(`\n成功修复 ${fixCount} 个工具的子分类`);
    
    // 验证修复结果
    console.log('\n=== 验证音频分类 ===');
    const { data: audioStats } = await supabase
      .from('tools')
      .select('sub_category')
      .eq('main_category', 'audio')
      .in('status', ['approved', 'active']);
    
    const audioSubStats = {};
    audioStats?.forEach(tool => {
      if (!audioSubStats[tool.sub_category]) {
        audioSubStats[tool.sub_category] = 0;
      }
      audioSubStats[tool.sub_category]++;
    });
    
    console.log('音频子分类统计:');
    Object.keys(audioSubStats).forEach(subCat => {
      console.log(`  - ${subCat}: ${audioSubStats[subCat]} 个工具`);
    });
    
    console.log('\n✅ 音频转录分类修复完成！');
    
  } catch (error) {
    console.error('修复失败:', error.message);
  }
}

fixAudioTranscription();
