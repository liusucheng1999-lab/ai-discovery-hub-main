/**
 * 检查抓取的数据
 */

async function checkData() {
  try {
    const url = 'https://enzduxajblrfbbdktieo.supabase.co/rest/v1/tool_submissions?select=name,category,source&order=created_at.desc&limit=10';
    
    const response = await fetch(url, {
      headers: { 
        'apikey': 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k', 
        'Authorization': 'Bearer sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k' 
      }
    });
    
    if (!response.ok) {
      console.log('请求失败:', response.status);
      return;
    }
    
    const data = await response.json();
    console.log('响应数据:', data);
    
    if (!Array.isArray(data)) {
      console.log('数据不是数组格式');
      return;
    }
    
    console.log(`\n最新的${data.length}个工具提交:`);
    data.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (${tool.category}) - ${tool.source}`);
    });
    
    // 统计各分类数量
    const categoryCount = {};
    data.forEach(tool => {
      categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
    });
    
    console.log('\n分类统计:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`${category}: ${count}个`);
    });
    
  } catch (error) {
    console.error('检查失败:', error.message);
  }
}

checkData();
