// 按照用户提供的分类体系重新更新应用分类
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

// 用户提供的分类映射
const userCategoryMapping = [
  // 国产模型
  { name: '通义千问', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '文心一言', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '豆包', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '讯飞星火', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '腾讯元宝', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '智谱清言', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'DeepSeek', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '书生大模型', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '百川大模型', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '阶跃AI', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '天工AI', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '百小应', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '商量SenseChat', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '华为小艺', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '百灵大模型', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'LongCat', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'Z.ai', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'Qwen Chat', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'MiniMax', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '千问', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'Grok', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '魔搭GPT（ModelScopeGPT）', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '即梦AI', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'NLUI', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '逗逗AI', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'Kimi智能助手', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: 'Flowith', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '通义灵眸', main_category: 'chat', sub_category: 'chat_domestic' },
  { name: '问小白', main_category: 'chat', sub_category: 'chat_domestic' },

  // 海外模型
  { name: 'ChatGPT', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Claude', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Gemini', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Google Bard', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Microsoft Copilot', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Mistral AI', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Cohere AI', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Meta AI', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'AI21 Labs', main_category: 'chat', sub_category: 'chat_overseas' },
  { name: 'Stability AI', main_category: 'chat', sub_category: 'chat_overseas' },

  // 通用对话
  { name: 'Kimi', main_category: 'chat', sub_category: 'chat_general' },
  { name: '豆包', main_category: 'chat', sub_category: 'chat_general' },
  { name: '讯飞星火', main_category: 'chat', sub_category: 'chat_general' },
  { name: '腾讯元宝', main_category: 'chat', sub_category: 'chat_general' },
  { name: '通义千问', main_category: 'chat', sub_category: 'chat_general' },
  { name: '文心一言', main_category: 'chat', sub_category: 'chat_general' },
  { name: '智谱清言', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'DeepSeek', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'ChatGPT', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'Claude', main_category: 'chat', sub_category: 'chat_general' },
  { name: 'Gemini', main_category: 'chat', sub_category: 'chat_general' },

  // 趣味聊天
  { name: 'Character.AI', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Bing新必应', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Poe', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '夸克AI', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '360智脑', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Replika', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Pi', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Inworld', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '钉钉·个人版', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Meta AI助手', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Koko AI', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '通义星尘', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'CueMe', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '造梦次元', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Museland', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '百度AI助手', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '小悟空', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '紫东太初', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '小黄蕉', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '冒泡鸭', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'J1 Assistant', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Cici', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Le Chat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '百度AI伙伴', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '超级助理', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Wanderboat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'MChat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Luca面壁露卡', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '元象XChat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'ChitChop', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Forefront', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'HuggingChat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'TigerBot', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Stable Chat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'ColossalChat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Jasper Chat', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'MOSS', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'YouChat AI', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'ChatSonic', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Whispr', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Open Assistant', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Neeva', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '对话写作猫', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '应事AI', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Me.bot', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'Saylo', main_category: 'chat', sub_category: 'chat_fun' },
  { name: 'TRAE', main_category: 'chat', sub_category: 'chat_fun' },
  { name: '秒哒', main_category: 'chat', sub_category: 'chat_fun' }
];

async function updateChatAppCategories() {
  console.log('开始按照用户要求更新对话类应用分类...');
  
  let successCount = 0;
  let failCount = 0;
  const notFoundApps = [];
  const updatedApps = [];
  
  for (const app of userCategoryMapping) {
    try {
      // 查找应用
      const { data: existingApp, error: findError } = await supabase
        .from('tools')
        .select('*')
        .eq('name', app.name)
        .single();
      
      if (findError || !existingApp) {
        console.log(`未找到应用: ${app.name}`);
        notFoundApps.push(app.name);
        failCount++;
        continue;
      }
      
      // 更新分类
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          main_category: app.main_category,
          sub_category: app.sub_category,
          updated_at: new Date().toISOString()
        })
        .eq('name', app.name);
      
      if (updateError) {
        console.error(`更新应用 ${app.name} 失败:`, updateError);
        failCount++;
      } else {
        console.log(`✓ 成功更新: ${app.name} -> ${app.sub_category}`);
        successCount++;
        updatedApps.push({
          name: app.name,
          main_category: app.main_category,
          sub_category: app.sub_category
        });
      }
      
    } catch (error) {
      console.error(`处理应用 ${app.name} 时出错:`, error);
      failCount++;
    }
  }
  
  console.log('\n=== 分类更新完成 ===');
  console.log(`成功更新: ${successCount} 个应用`);
  console.log(`更新失败: ${failCount} 个应用`);
  
  if (notFoundApps.length > 0) {
    console.log('\n未找到的应用:');
    notFoundApps.forEach(app => console.log(`- ${app}`));
  }
  
  // 显示各分类的应用数量
  console.log('\n=== 分类统计 ===');
  const categoryStats = {};
  updatedApps.forEach(app => {
    const key = app.sub_category;
    categoryStats[key] = (categoryStats[key] || 0) + 1;
  });
  
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`${category}: ${count} 个应用`);
  });
}

// 执行更新
updateChatAppCategories().catch(console.error);
