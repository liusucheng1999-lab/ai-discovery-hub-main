// scheduler/scheduler.js
// AI审核定时任务调度器

import cron from 'node-cron';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 加载环境变量
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// 初始化Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const deepSeekApiKey = process.env.VITE_DEEPSEEK_API_KEY;

if (!supabaseUrl || !supabaseKey || !deepSeekApiKey) {
  console.error('缺少必要的环境变量，请检查配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 调用DeepSeek API
 */
async function callDeepSeek(messages) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepSeekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.3,
        max_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    throw error;
  }
}

/**
 * 获取现有工具列表用于重复检测
 */
async function getExistingTools() {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('id, name, website_url, tagline, category')
      .eq('status', 'active');

    if (error) {
      console.error('获取现有工具失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取现有工具异常:', error);
    return [];
  }
}

/**
 * AI审核单个工具
 */
async function reviewTool(tool, existingTools) {
  try {
    const systemPrompt = `你是一个专业的AI工具审核专家，负责评估用户提交的AI工具。你需要从以下三个维度进行评估：

1. **成熟度和趣味性评估**：
   - 评估工具是否成熟（功能完整、用户基数、稳定性等）
   - 评估工具是否有趣（创新性、实用性、独特性等）
   - 给出0-10的评分

2. **重复检测**：
   - 与现有工具列表进行对比
   - 从名称、功能、目标URL等多维度判断是否重复
   - 给出相似度评分和具体原因

3. **内容优化**：
   - 优化工具名称，使其更吸引人
   - 重写简介，使其更简洁有力
   - 生成详细的工具描述
   - 建议合适的标签
   - 提供图标优化建议

请以JSON格式返回审核结果，格式如下：
{
  "is_mature": true/false,
  "is_interesting": true/false,
  "maturity_score": 0-10,
  "interest_score": 0-10,
  "quality_assessment": "详细的质量评估说明",
  "is_duplicate": true/false,
  "duplicate_tools": [
    {
      "id": "工具ID",
      "name": "工具名称",
      "similarity": 0-1,
      "similarity_reason": "相似原因"
    }
  ],
  "optimized_name": "优化后的名称",
  "optimized_tagline": "优化后的简介",
  "optimized_description": "优化后的详细描述",
  "suggested_tags": ["标签1", "标签2"],
  "icon_suggestions": "图标优化建议",
  "recommendation": "approve/reject/manual_review",
  "confidence": 0-1,
  "reasoning": "详细的推理过程"
}

现有工具列表：${JSON.stringify(existingTools, null, 2)}`;

    const userPrompt = `请审核以下AI工具：

工具名称：${tool.name}
网站地址：${tool.website_url}
简介：${tool.tagline}
分类：${tool.category}
价格类型：${tool.pricing_type}
中国可用：${tool.is_china_available}
备注：${tool.note}

请按照要求进行全面的AI审核。`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const aiResponse = await callDeepSeek(messages);
    
    try {
      // 清理响应中的markdown代码块标记
      let cleanedResponse = aiResponse.trim();
      
      // 移除可能的markdown代码块标记
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '');
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
      }
      
      // 移除可能的markdown代码块标记（其他格式）
      if (cleanedResponse.startsWith('```')) {
        const lines = cleanedResponse.split('\n');
        // 移除第一行的```标记，保留最后一行之前的所有内容
        if (lines.length > 1) {
          lines.shift(); // 移除第一行
          if (lines[lines.length - 1].trim() === '```') {
            lines.pop(); // 移除最后一行的```
          }
          cleanedResponse = lines.join('\n').trim();
        }
      }
      
      console.log('清理后的响应:', cleanedResponse);
      
      const result = JSON.parse(cleanedResponse);
      return result;
    } catch (parseError) {
      console.error('AI响应解析失败:', parseError);
      console.error('原始响应:', aiResponse);
      console.error('清理后响应:', cleanedResponse);
      return {
        is_mature: false,
        is_interesting: false,
        maturity_score: 5,
        interest_score: 5,
        quality_assessment: 'AI响应解析失败，需要人工审核',
        is_duplicate: false,
        duplicate_tools: [],
        recommendation: 'manual_review',
        confidence: 0,
        reasoning: `AI响应解析失败: ${parseError}。原始响应: ${aiResponse}`
      };
    }
  } catch (error) {
    console.error('AI审核失败:', error);
    return {
      is_mature: false,
      is_interesting: false,
      maturity_score: 5,
      interest_score: 5,
      quality_assessment: 'AI审核失败，需要人工审核',
      is_duplicate: false,
      duplicate_tools: [],
      recommendation: 'manual_review',
      confidence: 0,
      reasoning: `AI审核异常: ${error}`
    };
  }
}

/**
 * 生成审核摘要
 */
function generateReviewSummary(results, totalTools) {
  const approvedCount = results.filter(r => r.ai_recommendation === 'approve').length;
  const rejectedCount = results.filter(r => r.ai_recommendation === 'reject').length;
  const manualReviewCount = results.filter(r => r.ai_recommendation === 'manual_review').length;
  const duplicateCount = results.filter(r => r.is_duplicate).length;
  
  const highQualityTools = results.filter(r => 
    r.maturity_score >= 7 && r.interest_score >= 7
  ).length;

  let summary = `AI自动审核报告\n`;
  summary += `================\n\n`;
  summary += `📊 审核统计:\n`;
  summary += `- 总工具数: ${totalTools}\n`;
  summary += `- 建议通过: ${approvedCount} (${(approvedCount/totalTools*100).toFixed(1)}%)\n`;
  summary += `- 建议拒绝: ${rejectedCount} (${(rejectedCount/totalTools*100).toFixed(1)}%)\n`;
  summary += `- 需人工审核: ${manualReviewCount} (${(manualReviewCount/totalTools*100).toFixed(1)}%)\n`;
  summary += `- 发现重复: ${duplicateCount} (${(duplicateCount/totalTools*100).toFixed(1)}%)\n`;
  summary += `- 高质量工具: ${highQualityTools} (${(highQualityTools/totalTools*100).toFixed(1)}%)\n\n`;

  // 推荐通过的优质工具
  const approvedHighQuality = results.filter(r => 
    r.ai_recommendation === 'approve' && 
    r.maturity_score >= 7 && 
    r.interest_score >= 7 &&
    !r.is_duplicate
  );
  
  if (approvedHighQuality.length > 0) {
    summary += `⭐ 推荐通过的优质工具:\n`;
    approvedHighQuality.slice(0, 5).forEach((tool, index) => {
      summary += `${index + 1}. ${tool.tool_name} (成熟度:${tool.maturity_score}/10, 有趣度:${tool.interest_score}/10)\n`;
    });
    if (approvedHighQuality.length > 5) {
      summary += `   ... 还有 ${approvedHighQuality.length - 5} 个优质工具\n`;
    }
    summary += `\n`;
  }

  // 需要关注的工具
  const needsAttention = results.filter(r => 
    r.ai_recommendation === 'manual_review' || 
    r.is_duplicate || 
    r.confidence < 0.7
  );
  
  if (needsAttention.length > 0) {
    summary += `⚠️ 需要关注的工具:\n`;
    needsAttention.slice(0, 5).forEach((tool, index) => {
      let reason = '';
      if (tool.is_duplicate) reason = '[重复] ';
      if (tool.confidence < 0.7) reason = '[低置信度] ';
      if (tool.ai_recommendation === 'manual_review') reason = '[需人工] ';
      summary += `${index + 1}. ${reason}${tool.tool_name}\n`;
    });
    if (needsAttention.length > 5) {
      summary += `   ... 还有 ${needsAttention.length - 5} 个需要关注的工具\n`;
    }
  }

  summary += `\n🤖 AI建议: `;
  if (approvedCount > totalTools * 0.6) {
    summary += '本次提交的工具质量较高，建议优先处理推荐通过的工具。';
  } else if (rejectedCount > totalTools * 0.5) {
    summary += '本次提交的工具质量较低，建议提高审核标准。';
  } else {
    summary += '本次提交的工具质量一般，建议仔细评估每个工具。';
  }

  return summary;
}

/**
 * 执行自动AI审核
 */
async function performAutoReview() {
  try {
    console.log('开始执行自动AI审核...');
    
    // 获取所有待审核工具
    const { data: pendingTools, error: fetchError } = await supabase
      .from('tool_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('获取待审核工具失败:', fetchError);
      return;
    }

    if (!pendingTools || pendingTools.length === 0) {
      console.log('没有待审核的工具');
      return;
    }

    console.log(`找到 ${pendingTools.length} 个待审核工具`);

    // 获取现有工具进行重复检测
    const existingTools = await getExistingTools();
    
    // 批量AI审核
    const reviewResults = [];
    
    for (const tool of pendingTools) {
      console.log(`正在审核工具: ${tool.name}`);
      const result = await reviewTool(tool, existingTools);
      
      reviewResults.push({
        tool_id: tool.id,
        tool_name: tool.name,
        ai_recommendation: result.recommendation,
        confidence: result.confidence,
        maturity_score: result.maturity_score,
        interest_score: result.interest_score,
        is_duplicate: result.is_duplicate,
        reasoning: result.reasoning,
        optimized_name: result.optimized_name,
        optimized_tagline: result.optimized_tagline
      });
      
      // 添加延迟避免API限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 统计结果
    let approvedCount = 0;
    let rejectedCount = 0;
    let manualReviewCount = 0;
    
    reviewResults.forEach(result => {
      switch (result.ai_recommendation) {
        case 'approve':
          approvedCount++;
          break;
        case 'reject':
          rejectedCount++;
          break;
        case 'manual_review':
          manualReviewCount++;
          break;
      }
    });

    // 生成审核摘要
    const summary = generateReviewSummary(reviewResults, pendingTools.length);

    // 创建审核日志
    const { data: reviewLog, error: insertError } = await supabase
      .from('ai_review_logs')
      .insert({
        review_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD格式
        total_tools: pendingTools.length,
        approved_count: approvedCount,
        rejected_count: rejectedCount,
        manual_review_count: manualReviewCount,
        review_results: reviewResults,
        summary: summary,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('创建审核日志失败:', insertError);
      return;
    }

    console.log('自动AI审核完成，日志ID:', reviewLog.id);
    
    // 发送通知
    await sendReviewNotification(reviewLog);

    return reviewLog;
  } catch (error) {
    console.error('自动AI审核失败:', error);
  }
}

/**
 * 发送审核通知
 */
async function sendReviewNotification(reviewLog) {
  try {
    console.log('发送审核通知:', {
      logId: reviewLog.id,
      totalTools: reviewLog.total_tools,
      approvedCount: reviewLog.approved_count,
      rejectedCount: reviewLog.rejected_count,
      summary: reviewLog.summary
    });

    // 这里可以集成邮件服务、webhook、或其他通知方式
    // 示例：发送到webhook
    // await fetch('https://your-webhook-url.com/notify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: 'ai_review_completed',
    //     data: reviewLog
    //   })
    // });

  } catch (error) {
    console.error('发送审核通知失败:', error);
  }
}

/**
 * 确认并执行审核结果
 */
async function confirmAndExecuteReview(logId) {
  try {
    console.log('确认并执行审核结果:', logId);

    // 获取审核日志
    const { data: reviewLog, error: fetchError } = await supabase
      .from('ai_review_logs')
      .select('*')
      .eq('id', logId)
      .single();

    if (fetchError || !reviewLog) {
      console.error('获取审核日志失败:', fetchError);
      return false;
    }

    if (reviewLog.status !== 'pending') {
      console.log('审核日志已处理，状态:', reviewLog.status);
      return false;
    }

    // 更新状态为已确认
    const { error: updateError } = await supabase
      .from('ai_review_logs')
      .update({ 
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', logId);

    if (updateError) {
      console.error('更新审核日志状态失败:', updateError);
      return false;
    }

    // 执行审核结果
    const success = await executeReviewResults(reviewLog.review_results);

    if (success) {
      // 更新状态为已执行
      await supabase
        .from('ai_review_logs')
        .update({ 
          status: 'executed',
          executed_at: new Date().toISOString()
        })
        .eq('id', logId);

      console.log('审核结果执行完成');
      return true;
    }

    return false;
  } catch (error) {
    console.error('确认并执行审核失败:', error);
    return false;
  }
}

/**
 * 执行具体的审核结果
 */
async function executeReviewResults(reviewResults) {
  try {
    let successCount = 0;
    let errorCount = 0;

    for (const result of reviewResults) {
      try {
        if (result.ai_recommendation === 'approve') {
          // 通过审核，插入到主表
          const { data: tool, error: fetchError } = await supabase
            .from('tool_submissions')
            .select('*')
            .eq('id', result.tool_id)
            .single();

          if (fetchError || !tool) {
            console.error(`获取工具 ${result.tool_id} 失败:`, fetchError);
            errorCount++;
            continue;
          }

          const toolToInsert = {
            name: result.optimized_name || tool.name,
            tagline: result.optimized_tagline || tool.tagline,
            description: tool.tagline,
            website_url: tool.website_url,
            category: tool.category,
            tags: [tool.category],
            pricing_type: tool.pricing_type,
            is_china_available: tool.is_china_available,
            is_chinese_supported: tool.note?.includes('支持中文: true') || false,
            rating: 0,
            rating_count: 0,
            view_count: 0,
            screenshots: [],
            status: 'active',
            created_at: new Date().toISOString(),
            // 添加AI质量评估字段
            ai_quality_score: ((result.maturity_score || 5) + (result.interest_score || 5)) / 2, // 计算综合评分
            ai_quality_review: JSON.stringify({
              maturity_score: result.maturity_score || 5,
              interest_score: result.interest_score || 5,
              quality_assessment: result.quality_assessment || 'AI审核中未提供质量评估',
              reasoning: result.reasoning || '',
              confidence: result.confidence || 0,
              recommendation: result.ai_recommendation || 'manual_review'
            }),
            ai_review_date: new Date().toISOString(),
            ai_review_notes: `AI审核建议: ${result.ai_recommendation}。${result.quality_assessment ? ' 质量评估: ' + result.quality_assessment : ''}`
          };

          const { error: insertError } = await supabase
            .from('tools')
            .insert(toolToInsert);

          if (insertError) {
            console.error(`插入工具 ${result.tool_id} 失败:`, insertError);
            errorCount++;
          } else {
            // 更新待审核表状态
            await supabase
              .from('tool_submissions')
              .update({ status: 'approved' })
              .eq('id', result.tool_id);
            
            successCount++;
          }
        } else if (result.ai_recommendation === 'reject') {
          // 拒绝审核
          const { error } = await supabase
            .from('tool_submissions')
            .update({ status: 'rejected' })
            .eq('id', result.tool_id);

          if (error) {
            console.error(`拒绝工具 ${result.tool_id} 失败:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        }
        // manual_review 的工具保持 pending 状态
      } catch (error) {
        console.error(`处理工具 ${result.tool_id} 失败:`, error);
        errorCount++;
      }
    }

    console.log(`审核结果执行完成: 成功 ${successCount}, 失败 ${errorCount}`);
    return errorCount === 0;
  } catch (error) {
    console.error('执行审核结果失败:', error);
    return false;
  }
}

// 启动定时任务
console.log('AI审核定时任务调度器启动...');

// 每天上午9点执行自动审核
cron.schedule('0 9 * * *', async () => {
  console.log('开始执行定时AI审核任务...');
  await performAutoReview();
});

// 每周一上午9点执行自动审核（确保不会遗漏）
cron.schedule('0 9 * * 1', async () => {
  console.log('开始执行周度AI审核任务...');
  await performAutoReview();
});

// 立即执行一次（用于测试）
console.log('执行初始AI审核...');
await performAutoReview();

console.log('定时任务调度器已启动，等待下次执行...');
