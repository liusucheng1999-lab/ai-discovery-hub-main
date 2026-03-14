// src/lib/ai-search-service.ts
// AI智能搜索服务 - 基于自然语言需求的工具匹配

import { deepSeekService } from './deepseek-service';
import { supabase } from './supabase';
import { Tool } from './mock-data'; // 使用前端的Tool接口

interface AISearchResult {
  tool_id: string;
  match_score: number; // 匹配度评分 0-1
  match_reason: string; // 匹配原因说明
  confidence: number; // 置信度 0-1
}

interface AISearchResponse {
  query_understanding: string; // 对用户查询的理解
  search_intent: string; // 搜索意图
  results: AISearchResult[];
  summary: string; // 搜索结果摘要
}

class AISearchService {
  private deepSeekService: any;

  constructor() {
    // 检查环境变量
    const baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL;
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    console.log('环境变量检查:', {
      'VITE_DEEPSEEK_BASE_URL': baseUrl,
      'VITE_DEEPSEEK_API_KEY': apiKey ? apiKey.substring(0, 10) + '...' : 'undefined',
      '所有env变量': import.meta.env
    });
    
    // 初始化DeepSeek服务
    this.deepSeekService = {
      baseUrl: baseUrl || 'https://api.deepseek.com',
      apiKey: apiKey || ''
    };
    
    console.log('AISearchService初始化:', {
      baseUrl: this.deepSeekService.baseUrl,
      hasApiKey: !!this.deepSeekService.apiKey,
      apiKeyPrefix: this.deepSeekService.apiKey ? this.deepSeekService.apiKey.substring(0, 10) + '...' : 'none'
    });
    
    if (!this.deepSeekService.apiKey) {
      console.error('DeepSeek API密钥未配置！');
    }
  }

  /**
   * 执行AI搜索（流式）
   */
  async performAISearchStream(
    userQuery: string, 
    onChunk: (chunk: string) => void,
    onAnalysisUpdate: (analysis: any) => void,
    progressCallback?: (status: string) => void
  ): Promise<Tool[]> {
    try {
      progressCallback?.('正在获取工具数据...');

      // 获取工具数据
      const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('view_count', { ascending: false })
        .limit(50);

      if (error) {
        console.error('获取工具数据失败:', error);
        return [];
      }

      if (!tools || tools.length === 0) {
        console.log('没有找到可用的工具');
        return [];
      }

      progressCallback?.('正在AI智能匹配...');

      // 优化的AI提示词
      const systemPrompt = `你是一个专业的AI工具推荐专家。请根据用户的具体需求，从提供的工具列表中选择最相关的工具。

**重要要求：**
1. 仔细分析每个工具的名称、简介和详细描述
2. 理解用户的真实需求，不要局限于字面匹配
3. 如果找到相关工具，请推荐；如果找不到，请不要强行推荐
4. 匹配度应该基于功能相关性，不是工具的知名度

**评估标准：**
- 功能匹配度：工具的核心功能是否满足用户需求
- 应用场景：工具是否适用于用户描述的使用场景
- 相关性：工具与用户查询的关联程度

**匹配度指导：**
- 0.8-1.0：高度相关，功能完全匹配
- 0.6-0.7：中等相关，功能部分匹配（最低推荐标准）
- 0.0-0.5：不相关，不要推荐

请严格按照以下JSON格式返回：
{
  "query_understanding": "对用户查询的详细理解",
  "search_intent": "识别的搜索意图",
  "summary": "搜索过程和结果的总结",
  "results": [
    {
      "tool_id": "工具ID",
      "match_score": 0.0-1.0,
      "match_reason": "详细的匹配原因说明"
    }
  ]
}

**用户需求：** ${userQuery}

**可用工具列表：**
${tools.slice(0, 30).map(tool => `
ID: ${tool.id}
名称：${tool.name}
简介：${tool.tagline}
详细描述：${tool.description || '暂无详细描述'}
分类：${tool.category}
标签：${(tool.tags || []).join(', ')}
价格类型：${tool.pricing_type}
---`).join('\n')}

请仔细分析每个工具的功能，如果找不到相关度超过0.6的工具，可以返回空的结果数组。只推荐真正相关的工具，不要为了推荐而推荐不相关的工具。`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ];

      progressCallback?.('正在调用AI分析...');
      const aiResponse = await this.callDeepSeekStream(messages, onChunk);
      
      console.log('AI流式响应完成:', aiResponse);
      
      let searchResponse;
      try {
        searchResponse = JSON.parse(aiResponse);
        console.log('AI解析后的响应:', searchResponse);
      } catch (parseError) {
        console.error('AI搜索响应解析失败:', parseError);
        console.error('原始响应:', aiResponse);
        return [];
      }

      // 实时更新分析信息
      if (searchResponse.query_understanding || searchResponse.search_intent) {
        onAnalysisUpdate({
          query_understanding: searchResponse.query_understanding || '',
          search_intent: searchResponse.search_intent || '',
          summary: searchResponse.summary || '',
          total_analyzed: searchResponse.results?.length || 0,
          high_confidence_matches: 0
        });
      }

      // 处理AI搜索结果
      const matchedTools: Tool[] = [];
      
      if (searchResponse.results && Array.isArray(searchResponse.results)) {
        for (const result of searchResponse.results) {
          const tool = tools.find(t => t.id === result.tool_id);
          if (tool) {
            const matchScore = result.match_score || 0.5;
            // 提高匹配度阈值，只推荐真正相关的工具
            if (matchScore > 0.6) { // 调整回0.6，确保高相关性
              console.log(`匹配工具: ${tool.name}, 匹配度: ${matchScore}`);
              // 转换数据库字段格式为前端期望的格式
              const convertedTool: Tool = {
                id: tool.id,
                name: tool.name,
                tagline: tool.tagline,
                description: tool.description,
                websiteUrl: tool.website_url, // 转换字段名
                category: tool.category,
                tags: tool.tags || [],
                pricingType: tool.pricing_type, // 转换字段名
                isChinaAvailable: tool.is_china_available, // 转换字段名
                isChineseSupported: tool.is_chinese_supported, // 转换字段名
                rating: tool.rating || 0,
                ratingCount: tool.rating_count || 0, // 转换字段名
                viewCount: tool.view_count || 0, // 转换字段名
                screenshots: tool.screenshots || [],
                createdAt: tool.created_at, // 转换字段名
                logoUrl: tool.logo_url, // 转换字段名
                aiQualityScore: tool.ai_quality_score, // 转换字段名
                aiQualityReview: tool.ai_quality_review, // 转换字段名
                aiReviewDate: tool.ai_review_date, // 转换字段名
                aiReviewNotes: tool.ai_review_notes, // 转换字段名
                // AI搜索相关字段（这些字段不在Tool接口中，但用于显示）
                ai_match_score: matchScore,
                ai_match_reason: result.match_reason || 'AI推荐',
                ai_confidence: 0.5
              } as Tool & { // 使用类型断言来添加额外的AI搜索字段
                ai_match_score: number;
                ai_match_reason: string;
                ai_confidence: number;
              };
              
              matchedTools.push(convertedTool);
            } else {
              console.log(`工具匹配度过低，跳过: ${tool.name}, 匹配度: ${matchScore}`);
            }
          }
        }
      }

      // 如果没有匹配到任何工具，返回包含思维链的空结果
      if (matchedTools.length === 0) {
        console.log('没有找到高匹配度的工具，返回空结果但保留思维链');
        
        // 创建一个包含思维链的空结果对象
        const emptyResultWithAnalysis = {
          query_understanding: searchResponse.query_understanding || '未能理解查询意图',
          search_intent: searchResponse.search_intent || '未能识别搜索意图',
          summary: searchResponse.summary || '未找到匹配度超过60%的工具',
          total_analyzed: searchResponse.results?.length || 0,
          high_confidence_matches: 0,
          tools: []
        };
        
        // 更新最终分析结果
        onAnalysisUpdate(emptyResultWithAnalysis);
        
        // 返回一个虚拟工具对象，只包含分析信息
        return [{
          id: 'empty-analysis',
          name: '分析结果',
          tagline: '',
          description: '',
          websiteUrl: '',
          category: '',
          tags: [],
          pricingType: 'free' as const,
          isChinaAvailable: false,
          isChineseSupported: false,
          rating: 0,
          ratingCount: 0,
          viewCount: 0,
          screenshots: [],
          createdAt: new Date().toISOString(),
          logoUrl: '',
          ai_analysis: emptyResultWithAnalysis
        } as any];
      }

      // 按匹配度降序排序
      matchedTools.sort((a, b) => (b as any).ai_match_score - (a as any).ai_match_score);

      console.log(`AI搜索完成，找到 ${matchedTools.length} 个匹配工具`);

      // 为每个工具添加AI分析信息
      const resultsWithAnalysis = matchedTools.map(tool => ({
        ...tool,
        ai_analysis: {
          query_understanding: searchResponse.query_understanding || '',
          search_intent: searchResponse.search_intent || '',
          summary: searchResponse.summary || '',
          total_analyzed: searchResponse.results?.length || 0,
          high_confidence_matches: matchedTools.length
        }
      }));

      // 更新最终分析结果
      if (resultsWithAnalysis.length > 0) {
        onAnalysisUpdate((resultsWithAnalysis[0] as any).ai_analysis);
      }

      return resultsWithAnalysis;

    } catch (error) {
      console.error('AI搜索失败:', error);
      progressCallback?.('搜索失败，请重试');
      return [];
    }
  }

  /**
   * 调用DeepSeek API（流式）
   */
  private async callDeepSeekStream(
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    try {
      console.log('开始调用DeepSeek API:', {
        url: `${this.deepSeekService.baseUrl}/v1/chat/completions`,
        hasApiKey: !!this.deepSeekService.apiKey,
        messageCount: messages.length
      });

      const response = await fetch(`${this.deepSeekService.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepSeekService.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.3,
          max_tokens: 2000,
          stream: true
        }),
      });

      console.log('DeepSeek API响应状态:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API错误详情:', errorText);
        throw new Error(`DeepSeek API错误: ${response.status} ${response.statusText} - ${errorText}`);
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
  async performAISearch(userQuery: string, progressCallback?: (status: string) => void): Promise<Tool[]> {
    try {
      progressCallback?.('正在获取工具数据...');

      // 获取工具数据
      const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('view_count', { ascending: false })
        .limit(50); // 减少数量以加快处理速度

      if (error) {
        console.error('获取工具数据失败:', error);
        return [];
      }

      if (!tools || tools.length === 0) {
        console.log('没有找到可用的工具');
        return [];
      }

      progressCallback?.('正在AI智能匹配...');

      // 优化的AI提示词
      const systemPrompt = `你是一个专业的AI工具推荐专家。请根据用户的具体需求，从提供的工具列表中选择最相关的工具。

**重要要求：**
1. 仔细分析每个工具的名称、简介和详细描述
2. 理解用户的真实需求，不要局限于字面匹配
3. 如果找到相关工具，请推荐；如果找不到，请不要强行推荐
4. 匹配度应该基于功能相关性，不是工具的知名度

**评估标准：**
- 功能匹配度：工具的核心功能是否满足用户需求
- 应用场景：工具是否适用于用户描述的使用场景
- 相关性：工具与用户查询的关联程度

**匹配度指导：**
- 0.8-1.0：高度相关，功能完全匹配
- 0.6-0.7：中等相关，功能部分匹配（最低推荐标准）
- 0.0-0.5：不相关，不要推荐

请严格按照以下JSON格式返回：
{
  "query_understanding": "对用户查询的详细理解",
  "search_intent": "识别的搜索意图",
  "summary": "搜索过程和结果的总结",
  "results": [
    {
      "tool_id": "工具ID",
      "match_score": 0.0-1.0,
      "match_reason": "详细的匹配原因说明"
    }
  ]
}

**用户需求：** ${userQuery}

**可用工具列表：**
${tools.slice(0, 30).map(tool => `
ID: ${tool.id}
名称：${tool.name}
简介：${tool.tagline}
详细描述：${tool.description || '暂无详细描述'}
分类：${tool.category}
标签：${(tool.tags || []).join(', ')}
价格类型：${tool.pricing_type}
---`).join('\n')}

请仔细分析每个工具的功能，如果找不到相关度超过0.6的工具，可以返回空的结果数组。只推荐真正相关的工具，不要为了推荐而推荐不相关的工具。`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ];

      progressCallback?.('正在调用AI分析...');
      const aiResponse = await this.callDeepSeek(messages);
      
      console.log('AI原始响应:', aiResponse);
      
      let searchResponse;
      try {
        searchResponse = JSON.parse(aiResponse);
        console.log('AI解析后的响应:', searchResponse);
      } catch (parseError) {
        console.error('AI搜索响应解析失败:', parseError);
        console.error('原始响应:', aiResponse);
        // 如果解析失败，返回前5个工具
        return tools.slice(0, 5).map(tool => ({
          ...tool,
          ai_match_score: 0.5,
          ai_match_reason: 'AI推荐的相关工具',
          ai_confidence: 0.3
        } as any));
      }

      // 处理AI搜索结果
      const matchedTools: Tool[] = [];
      
      if (searchResponse.results && Array.isArray(searchResponse.results)) {
        for (const result of searchResponse.results) {
          const tool = tools.find(t => t.id === result.tool_id);
          if (tool) {
            const matchScore = result.match_score || 0.5;
            // 提高匹配度阈值，只推荐真正相关的工具
            if (matchScore > 0.6) { // 调整回0.6，确保高相关性
              console.log(`匹配工具: ${tool.name}, 匹配度: ${matchScore}`);
              // 转换数据库字段格式为前端期望的格式
              const convertedTool: Tool = {
                id: tool.id,
                name: tool.name,
                tagline: tool.tagline,
                description: tool.description,
                websiteUrl: tool.website_url, // 转换字段名
                category: tool.category,
                tags: tool.tags || [],
                pricingType: tool.pricing_type, // 转换字段名
                isChinaAvailable: tool.is_china_available, // 转换字段名
                isChineseSupported: tool.is_chinese_supported, // 转换字段名
                rating: tool.rating || 0,
                ratingCount: tool.rating_count || 0, // 转换字段名
                viewCount: tool.view_count || 0, // 转换字段名
                screenshots: tool.screenshots || [],
                createdAt: tool.created_at, // 转换字段名
                logoUrl: tool.logo_url, // 转换字段名
                aiQualityScore: tool.ai_quality_score, // 转换字段名
                aiQualityReview: tool.ai_quality_review, // 转换字段名
                aiReviewDate: tool.ai_review_date, // 转换字段名
                aiReviewNotes: tool.ai_review_notes, // 转换字段名
                // AI搜索相关字段（这些字段不在Tool接口中，但用于显示）
                ai_match_score: matchScore,
                ai_match_reason: result.match_reason || 'AI推荐',
                ai_confidence: 0.5
              } as Tool & { // 使用类型断言来添加额外的AI搜索字段
                ai_match_score: number;
                ai_match_reason: string;
                ai_confidence: number;
              };
              
              matchedTools.push(convertedTool);
            } else {
              console.log(`工具匹配度过低，跳过: ${tool.name}, 匹配度: ${matchScore}`);
            }
          }
        }
      }

      // 如果没有匹配到任何工具，返回包含思维链的空结果
      if (matchedTools.length === 0) {
        console.log('没有找到高匹配度的工具，返回空结果但保留思维链');
        
        // 创建一个包含思维链的空结果对象
        const emptyResultWithAnalysis = {
          query_understanding: searchResponse.query_understanding || '未能理解查询意图',
          search_intent: searchResponse.search_intent || '未能识别搜索意图',
          summary: searchResponse.summary || '未找到匹配度超过60%的工具',
          total_analyzed: searchResponse.results?.length || 0,
          high_confidence_matches: 0,
          tools: []
        };
        
        // 返回一个虚拟工具对象，只包含分析信息
        return [{
          id: 'empty-analysis',
          name: '分析结果',
          tagline: '',
          description: '',
          websiteUrl: '',
          category: '',
          tags: [],
          pricingType: 'free' as const,
          isChinaAvailable: false,
          isChineseSupported: false,
          rating: 0,
          ratingCount: 0,
          viewCount: 0,
          screenshots: [],
          createdAt: new Date().toISOString(),
          logoUrl: '',
          ai_analysis: emptyResultWithAnalysis
        } as any];
      }

      // 按匹配度降序排序
      matchedTools.sort((a, b) => (b as any).ai_match_score - (a as any).ai_match_score);

      console.log(`AI搜索完成，找到 ${matchedTools.length} 个匹配工具`);
      console.log('搜索理解:', searchResponse.query_understanding);
      console.log('搜索意图:', searchResponse.search_intent);
      console.log('搜索总结:', searchResponse.summary);

      // 为每个工具添加AI分析信息
      const resultsWithAnalysis = matchedTools.map(tool => ({
        ...tool,
        ai_analysis: {
          query_understanding: searchResponse.query_understanding || '',
          search_intent: searchResponse.search_intent || '',
          summary: searchResponse.summary || '',
          total_analyzed: searchResponse.results?.length || 0,
          high_confidence_matches: matchedTools.length
        }
      }));

      return resultsWithAnalysis;

    } catch (error) {
      console.error('AI搜索失败:', error);
      progressCallback?.('搜索失败，请重试');
      return [];
    }
  }

  /**
   * 调用DeepSeek API
   */
  private async callDeepSeek(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      const baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
      
      if (!apiKey) {
        throw new Error('DeepSeek API密钥未配置');
      }

      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.3,
          max_tokens: 3000,
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
   * 检查AI搜索服务是否可用
   */
  async checkServiceAvailability(): Promise<boolean> {
    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      const baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL;
      
      if (!apiKey) {
        console.warn('DeepSeek API密钥未配置，AI搜索功能不可用');
        return false;
      }

      // 简单检查：只要有API密钥和基础URL就认为可用
      // 不进行实际API调用，避免因网络问题导致误判
      if (baseUrl) {
        console.log('AI搜索服务配置检查通过');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('AI搜索服务检查失败:', error);
      return false;
    }
  }

  /**
   * 获取搜索建议
   */
  async getSearchSuggestions(partialQuery: string): Promise<string[]> {
    try {
      if (partialQuery.length < 2) {
        return [];
      }

      const systemPrompt = `根据用户输入的部分搜索内容，提供5个相关的搜索建议。建议应该是完整的、自然的用户需求描述。
      
请以JSON数组格式返回，例如：
["建议1", "建议2", "建议3", "建议4", "建议5"]`;

      const userPrompt = `用户输入：${partialQuery}

请提供相关的搜索建议：`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const response = await this.callDeepSeek(messages);
      
      try {
        let cleanedResponse = response.trim();
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '');
        }
        if (cleanedResponse.endsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
        }
        
        const suggestions = JSON.parse(cleanedResponse);
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : [];
      } catch (parseError) {
        console.error('搜索建议解析失败:', parseError);
        return [];
      }
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      return [];
    }
  }
}

export const aiSearchService = new AISearchService();
export type { AISearchResult, AISearchResponse, Tool };
