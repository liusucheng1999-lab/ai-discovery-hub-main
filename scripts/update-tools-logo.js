/**
 * 批量更新tools表的logo_url字段
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

// 获取工具头像的函数
function getToolLogo(websiteUrl) {
  if (!websiteUrl) return null;
  
  try {
    const domain = new URL(websiteUrl).hostname.replace('www.', '');
    
    // 常见网站的头像映射
    const logoMap = {
      'miaohua.sensetime.com': 'https://miaohua.sensetime.com/favicon.ico',
      'tongyi.aliyun.com': 'https://tongyi.aliyun.com/favicon.ico',
      'klingai.kuaishou.com': 'https://klingai.kuaishou.com/favicon.ico',
      'whee.meitu.com': 'https://whee.meitu.com/favicon.ico',
      'krea.ai': 'https://www.krea.ai/favicon.ico',
      'runninghub.cn': 'https://www.runninghub.cn/favicon.ico',
      'liblib.ai': 'https://www.liblib.ai/favicon.ico',
      'wanxiang.aliyun.com': 'https://wanxiang.aliyun.com/favicon.ico',
      
      // 其他工具
      'quark.cn': 'https://www.quark.cn/favicon.ico',
      'intern-ai.org': 'https://intern-ai.org/favicon.ico',
      'stepfun.com': 'https://www.stepfun.com/favicon.ico',
      'baichuan-ai.com': 'https://www.baichuan-ai.com/favicon.ico',
      'kunlunai.com': 'https://www.kunlunai.com/favicon.ico',
      'sensetime.com': 'https://www.sensetime.com/favicon.ico',
      'mindverse.ai': 'https://www.mindverse.ai/favicon.ico',
      'saylo.ai': 'https://www.saylo.ai/favicon.ico',
      'poe.com': 'https://poe.com/favicon.ico',
      'copilot.microsoft.com': 'https://copilot.microsoft.com/favicon.ico',
      'bytedance.com': 'https://www.bytedance.com/favicon.ico',
      'code.baidu.com': 'https://code.baidu.com/favicon.ico',
      'alibaba.com': 'https://www.alibaba.com/favicon.ico',
      'cursor.com': 'https://www.cursor.com/favicon.ico',
      'doubao.com': 'https://www.doubao.com/favicon.ico',
      'github.com': 'https://github.com/favicon.ico',
      'kilocode': 'https://github.com/kilocode/favicon.ico',
      'ai.google.dev': 'https://ai.google.dev/favicon.ico',
      'claude.ai': 'https://claude.ai/favicon.ico',
      'amazon.com': 'https://www.amazon.com/favicon.ico',
      'openai.com': 'https://openai.com/favicon.ico',
      'youware.dev': 'https://www.youware.dev/favicon.ico',
      'zhipuai.cn': 'https://zhipuai.cn/favicon.ico',
      'cloud.tencent.com': 'https://cloud.tencent.com/favicon.ico',
      'lovable.dev': 'https://www.lovable.dev/favicon.ico',
      'aigaitu.com': 'https://www.aigaitu.com/favicon.ico',
      'katuai.com': 'https://www.katuai.com/favicon.ico',
      'visionfactory.ai': 'https://www.visionfactory.ai/favicon.ico',
      'miaohui.ai': 'https://www.miaohui.ai/favicon.ico',
      'lumiai.ai': 'https://www.lumiai.ai/favicon.ico',
      'kira.ai': 'https://www.kira.ai/favicon.ico',
      'photoroom.com': 'https://www.photoroom.com/favicon.ico',
      'ribbet.com': 'https://www.ribbet.com/favicon.ico',
      'photosir.com': 'https://www.photosir.com/favicon.ico',
      'ai.360.cn': 'https://ai.360.cn/favicon.ico'
    };
    
    return logoMap[domain] || `https://${domain}/favicon.ico`;
  } catch (error) {
    console.log(`获取头像失败: ${websiteUrl}`, error.message);
    return null;
  }
}

async function updateToolsLogo() {
  try {
    console.log('=== 批量更新tools表的logo_url字段 ===');
    
    // 首先检查logo_url字段是否存在
    console.log('检查logo_url字段是否存在...');
    const { data: testData, error: testError } = await supabase
      .from('tools')
      .select('id, website_url')
      .limit(1);
    
    if (testError) {
      console.error('查询失败:', testError);
      return;
    }
    
    if (testData && testData.length > 0) {
      const fields = Object.keys(testData[0]);
      if (!fields.includes('logo_url')) {
        console.log('❌ logo_url字段不存在，请先添加字段');
        console.log('请在Supabase SQL编辑器中运行:');
        console.log('ALTER TABLE tools ADD COLUMN logo_url text;');
        return;
      }
    }
    
    // 获取所有工具
    console.log('获取所有工具...');
    const { data: tools, error: fetchError } = await supabase
      .from('tools')
      .select('id, name, website_url, logo_url')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('获取工具失败:', fetchError);
      return;
    }
    
    console.log(`找到 ${tools?.length || 0} 个工具`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const tool of tools || []) {
      try {
        // 如果已经有logo_url，跳过
        if (tool.logo_url) {
          console.log(`⏭️  跳过: ${tool.name} (已有logo_url)`);
          skippedCount++;
          continue;
        }
        
        // 获取logo_url
        const logoUrl = getToolLogo(tool.website_url);
        
        if (!logoUrl) {
          console.log(`⏭️  跳过: ${tool.name} (无法获取logo_url)`);
          skippedCount++;
          continue;
        }
        
        // 更新logo_url
        const { error: updateError } = await supabase
          .from('tools')
          .update({ logo_url: logoUrl })
          .eq('id', tool.id);
        
        if (updateError) {
          console.error(`❌ 更新失败: ${tool.name}`, updateError);
          errorCount++;
        } else {
          console.log(`✅ 更新成功: ${tool.name}`);
          console.log(`   logo_url: ${logoUrl}`);
          updatedCount++;
        }
        
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.error(`❌ 处理异常: ${tool.name}`, err);
        errorCount++;
      }
    }
    
    console.log('\n=== 更新完成 ===');
    console.log(`✅ 成功更新: ${updatedCount} 个`);
    console.log(`⏭️  跳过: ${skippedCount} 个`);
    console.log(`❌ 错误: ${errorCount} 个`);
    console.log(`📊 总计: ${tools?.length || 0} 个`);
    
  } catch (error) {
    console.error('批量更新失败:', error);
  }
}

updateToolsLogo();
