// src/lib/deepseek-service.ts
// DeepSeek API 服务 - AI工具审核服务

interface ToolSubmission {
  id: string;
  name: string;
  website_url: string;
  tagline: string;
  category: string;
  pricing_type: string;
  is_china_available: boolean;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ExistingTool {
  id: string;
  name: string;
  website_url: string;
  tagline: string;
  category: string;
}

interface AIReviewResult {
  // 审核结果
  is_mature: boolean;          // 是否成熟
  is_interesting: boolean;      // 是否有趣
  maturity_score: number;       // 成熟度评分 (0-10)
  interest_score: number;       // 有趣度评分 (0-10)
  quality_assessment: string;   // 质量评估说明
  
  // 重复检测
  is_duplicate: boolean;        // 是否重复
  duplicate_tools: Array<{      // 重复的工具列表
    id: string;
    name: string;
    similarity: number;         // 相似度评分
    similarity_reason: string;  // 相似原因
  }>;
  
  // 内容优化
  optimized_name?: string;      // 优化后的名称
  optimized_tagline?: string;   // 优化后的简介
  optimized_description?: string; // 优化后的描述
  suggested_tags?: string[];    // 建议的标签
  icon_suggestions?: string;    // 图标建议
  
  // 总体建议
  recommendation: 'approve' | 'reject' | 'manual_review';  // 建议
  confidence: number;           // 建议置信度 (0-1)
  reasoning: string;           // 详细推理过程
}

class DeepSeekService {
  private apiKey: string;
  private baseUrl: string;
  private supabase: any;

  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    this.baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    
    if (!this.apiKey) {
      console.warn('DeepSeek API密钥未配置');
    }
    
    // 动态导入supabase避免循环依赖
    import('./supabase').then(({ supabase }) => {
      this.supabase = supabase;
    });
  }

  /**
   * 调用DeepSeek API（流式）
   */
  private async callDeepSeekStream(
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.3,
          max_tokens: 2000,
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API错误: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      return fullContent;
    } catch (error) {
      console.error('DeepSeek API流式调用失败:', error);
      throw error;
    }
  }

  /**
   * 调用DeepSeek API（非流式，保持兼容性）
   */
  private async callDeepSeek(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
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
  private async getExistingTools(): Promise<ExistingTool[]> {
    try {
      const { data, error } = await this.supabase
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
   * 审核单个工具（流式输出）
   */
  async reviewToolStream(
    tool: ToolSubmission, 
    existingTools: ToolSubmission[] = [],
    onChunk: (chunk: string) => void
  ): Promise<AIReviewResult> {
    const systemPrompt = `你是一个专业的AI工具审核专家，请对提交的AI工具进行全面、客观的评估。

审核标准：
1. 成熟度评估 (1-10分)：工具的完整性、稳定性、用户基础、开发团队实力
2. 有趣度评估 (1-10分)：创新性、实用性、技术先进性、解决实际问题的能力
3. 重复检测：只检查是否为完全相同的工具，不需要深入研究功能差异
4. 质量评估：整体质量、用户体验、文档完整性、社区活跃度
5. 内容优化：提供更好的简介、描述建议，但工具名称必须保持官方正式名称，不要随意修改

重要提醒：
- 重复检测：只要工具名称不完全相同，就视为不同工具，不需要深入分析功能差异
- 工具名称优化：只有在当前名称明显错误、不完整或非官方名称时才建议修改，建议的名称必须是官方正式名称且必须一模一样
- 如果当前名称已经是官方正式名称，则optimized_name字段应保持原名称不变
- 优先保持原有名称，避免不必要的名称修改

请严格按照以下JSON格式返回结果：
{
  "is_mature": true/false,
  "is_interesting": true/false,
  "maturity_score": 1-10,
  "interest_score": 1-10,
  "quality_assessment": "详细的质量评估描述",
  "is_duplicate": true/false,
  "duplicate_tools": [
    {
      "name": "相似工具名称",
      "similarity": 0.0-1.0,
      "similarity_reason": "相似原因说明"
    }
  ],
  "optimized_name": "优化后的工具名称",
  "optimized_tagline": "优化后的工具简介",
  "optimized_description": "优化后的工具详细描述",
  "suggested_tags": ["标签1", "标签2"],
  "recommendation": "approve/reject/manual_review",
  "confidence": 0.0-1.0,
  "reasoning": "详细的推理过程和依据"
}

注意：在进行重复检测时，请与以下现有工具名称进行对比：
${existingTools.map(t => t.name).join(', ')}`;

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

    try {
      const aiResponse = await this.callDeepSeekStream(messages, onChunk);
      
      // 解析AI响应
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
        
        // 如果整个响应被代码块包围
        if (cleanedResponse.startsWith('```')) {
          const lines = cleanedResponse.split('\n');
          lines.shift(); // 移除第一行 ```
          if (lines[lines.length - 1].trim() === '```') {
            lines.pop(); // 移除最后一行 ```
          }
          cleanedResponse = lines.join('\n').trim();
        }
        
        const result = JSON.parse(cleanedResponse) as AIReviewResult;
        return result;
      } catch (parseError) {
        console.error('AI响应解析失败:', parseError);
        console.error('原始响应:', aiResponse);
        
        // 返回默认结果
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
   * 审核单个工具
   */
  async reviewTool(tool: ToolSubmission): Promise<AIReviewResult> {
    try {
      // 获取现有工具进行重复检测
      const existingTools = await this.getExistingTools();
      
      // 构建AI提示词
      const systemPrompt = `你是一个专业的AI工具审核专家，负责评估用户提交的AI工具。你需要从以下三个维度进行评估：

1. **成熟度和趣味性评估**：
   - 评估工具是否成熟（功能完整、用户基数、稳定性等）
   - 评估工具是否有趣（创新性、实用性、独特性等）
   - 给出0-10的评分

2. **重复检测**：
   - 只检查是否为完全相同的工具，不需要深入研究功能差异
   - 只要工具名称不完全相同，就视为不同工具
   - 给出相似度评分和具体原因

3. **内容优化**：
   - 优化工具简介，使其更简洁有力
   - 生成详细的工具描述
   - 建议合适的标签
   - 提供图标优化建议
   - 工具名称优化：只有在当前名称明显错误、不完整或非官方名称时才建议修改，建议的名称必须是官方正式名称且必须一模一样
   - 如果当前名称已经是官方正式名称，则optimized_name字段应保持原名称不变
   - 优先保持原有名称，避免不必要的名称修改

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

      const aiResponse = await this.callDeepSeek(messages);
      
      // 解析AI响应
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
        
        const result = JSON.parse(cleanedResponse) as AIReviewResult;
        return result;
      } catch (parseError) {
        console.error('AI响应解析失败:', parseError);
        console.error('原始响应:', aiResponse);
        console.error('清理后响应:', cleanedResponse);
        
        // 返回默认结果
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
   * 批量审核工具
   */
  async reviewToolsBatch(
    tools: ToolSubmission[], 
    progressCallback?: (current: number, toolName: string) => void
  ): Promise<{ toolId: string; result: AIReviewResult }[]> {
    const results = [];
    
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      
      try {
        // 通知进度
        progressCallback?.(i + 1, tool.name);
        
        const result = await this.reviewTool(tool);
        results.push({ toolId: tool.id, result });
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`工具 ${tool.name} 审核失败:`, error);
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
            reasoning: `审核异常: ${error}`
          }
        });
      }
    }
    
    return results;
  }

  /**
   * 检查API是否可用
   */
  async checkApiAvailability(): Promise<boolean> {
    try {
      const testMessages = [
        { role: 'user', content: '测试连接' }
      ];
      
      await this.callDeepSeek(testMessages);
      return true;
    } catch (error) {
      console.error('DeepSeek API不可用:', error);
      return false;
    }
  }
}

export const deepSeekService = new DeepSeekService();
export type { AIReviewResult, ToolSubmission, ExistingTool };
