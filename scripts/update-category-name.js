// 更新分类名称脚本：将"绘画"改为"图像"
import { createClient } from '@supabase/supabase-js';

// 从.env文件读取环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少环境变量：VITE_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateCategoryName() {
  try {
    console.log('正在更新分类名称...');

    // 更新"绘画"为"图像"
    const { data, error } = await supabase
      .from('categories')
      .update({ name: '图像' })
      .eq('name', '绘画');

    if (error) {
      console.error('更新失败:', error);
      return;
    }

    console.log('更新结果:', data);

    // 确保"图像"分类存在
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .upsert({
        id: 'image',
        name: '图像',
        icon: '🎨',
        sort_order: 4
      }, {
        onConflict: 'id'
      });

    if (insertError) {
      console.error('插入/更新失败:', insertError);
      return;
    }

    console.log('确保分类存在结果:', insertData);
    console.log('分类名称更新完成！');

  } catch (error) {
    console.error('执行失败:', error);
  }
}

updateCategoryName();
