/**
 * 调试批量审核问题
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://enzduxajblrfbbdktieo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

// 模拟DeepSeek API调用
async function simulateDeepSeekCall(toolName) {
  console.log(`开始审核: ${toolName}`);
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // 模拟成功/失败
  if (Math.random() > 0.1) {
    console.log(`✅ 审核完成: ${toolName}`);
    return {
      is_mature: true,
      is_interesting: true,
      maturity_score: 7 + Math.floor(Math.random() * 3),
      interest_score: 7 + Math.floor(Math.random() * 3),
      quality_assessment: '质量良好',
      is_duplicate: false,
      duplicate_tools: [],
      recommendation: 'approve',
      confidence: 0.8 + Math.random() * 0.2,
      reasoning: '审核通过'
    };
  } else {
    console.log(`❌ 审核失败: ${toolName}`);
    throw new Error('API调用失败');
  }
}

// 批量审核测试
async function testBatchReview() {
  const tools = [
    { id: '1', name: '工具A' },
    { id: '2', name: '工具B' },
    { id: '3', name: '工具C' },
    { id: '4', name: '工具D' },
    { id: '5', name: '工具E' }
  ];
  
  console.log('=== 开始批量审核测试 ===');
  console.log(`工具数量: ${tools.length}`);
  console.log('预计时间: 每个工具2-5秒，总计10-25秒');
  console.log('');
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const currentTime = Date.now();
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    
    console.log(`[${i + 1}/${tools.length}] 进度: ${Math.floor((i / tools.length) * 100)}% | 已用时: ${elapsed}秒`);
    
    try {
      const result = await simulateDeepSeekCall(tool.name);
      results.push({ toolId: tool.id, result });
      
      // 添加延迟避免API限制
      if (i < tools.length - 1) {
        console.log('等待1秒后继续下一个...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`工具 ${tool.name} 审核失败:`, error.message);
      results.push({
        toolId: tool.id,
        result: {
          is_mature: false,
          is_interesting: false,
          maturity_score: 5,
          interest_score: 5,
          quality_assessment: '审核失败',
          is_duplicate: false,
          duplicate_tools: [],
          recommendation: 'manual_review',
          confidence: 0,
          reasoning: `审核异常: ${error.message}`
        }
      });
    }
  }
  
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  console.log('');
  console.log('=== 批量审核完成 ===');
  console.log(`总用时: ${totalTime}秒`);
  console.log(`成功: ${results.filter(r => r.result.recommendation !== 'manual_review').length}`);
  console.log(`失败: ${results.filter(r => r.result.recommendation === 'manual_review').length}`);
  console.log('');
  console.log('详细结果:');
  results.forEach(({ toolId, result }) => {
    const tool = tools.find(t => t.id === toolId);
    console.log(`- ${tool.name}: ${result.recommendation} (成熟度: ${result.maturity_score}, 有趣度: ${result.interest_score})`);
  });
}

// 运行测试
testBatchReview().catch(console.error);
