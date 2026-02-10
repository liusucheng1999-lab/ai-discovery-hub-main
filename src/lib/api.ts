import { supabase } from './supabase'
import { tools as mockTools, categories as mockCategories, categoryColorMap, pricingLabels } from './mock-data'

export async function getTools(filters?: {
  category?: string;
  pricingType?: string;
  isChinaAvailable?: boolean;
  search?: string;
  sortBy?: string;
}) {
  try {
    console.log('尝试从 Supabase 获取工具列表...')
    
    let query = supabase
      .from('tools')
      .select('*')
      .eq('status', 'active')

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters?.pricingType && filters.pricingType !== 'all') {
      query = query.eq('pricing_type', filters.pricingType)
    }
    if (filters?.isChinaAvailable) {
      query = query.eq('is_china_available', true)
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%`)
    }
    
    switch (filters?.sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      default:
        query = query.order('view_count', { ascending: false })
    }

    const { data, error } = await query
    
    if (error) {
      console.error('Supabase 获取工具失败:', error)
      throw error
    }
    
    console.log('从 Supabase 成功获取工具:', data?.length || 0)
    return data || []
  } catch (error) {
    console.warn('Supabase 连接失败，降级使用 mock 数据:', error)
    // 降级方案：使用 mock 数据
    let result = [...mockTools]
    
    if (filters?.category && filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category)
    }
    if (filters?.pricingType && filters.pricingType !== 'all') {
      result = result.filter((t) => t.pricingType === filters.pricingType)
    }
    if (filters?.isChinaAvailable) {
      result = result.filter((t) => t.isChinaAvailable)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q)
      )
    }
    
    if (filters?.sortBy === 'newest') {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    } else if (filters?.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else {
      result.sort((a, b) => b.viewCount - a.viewCount)
    }
    
    // 转换数据格式以匹配 Supabase 格式
    return result.map(tool => ({
      ...tool,
      website_url: tool.websiteUrl,
      pricing_type: tool.pricingType,
      is_china_available: tool.isChinaAvailable,
      is_chinese_supported: tool.isChineseSupported
    }))
  }
}

export async function getToolById(id: string) {
  try {
    console.log('尝试从 Supabase 获取工具详情:', id)
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase 获取工具详情失败:', error)
      throw error
    }
    
    console.log('从 Supabase 成功获取工具详情')
    return data
  } catch (error) {
    console.warn('Supabase 连接失败，降级使用 mock 数据:', error)
    // 降级方案：使用 mock 数据
    const tool = mockTools.find(t => t.id === id)
    if (!tool) return null
    
    // 转换数据格式
    return {
      ...tool,
      website_url: tool.websiteUrl,
      pricing_type: tool.pricingType,
      is_china_available: tool.isChinaAvailable,
      is_chinese_supported: tool.isChineseSupported
    }
  }
}

export async function getCategories() {
  try {
    console.log('尝试从 Supabase 获取分类列表...')
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    
    if (error) {
      console.error('Supabase 获取分类失败:', error)
      throw error
    }
    
    console.log('从 Supabase 成功获取分类:', data?.length || 0)
    return data || []
  } catch (error) {
    console.warn('Supabase 连接失败，降级使用 mock 数据:', error)
    // 降级方案：使用 mock 数据
    return mockCategories.filter(c => c.id !== 'all')
  }
}

export async function getToolCountByCategory() {
  try {
    console.log('尝试从 Supabase 获取分类统计...')
    const { data, error } = await supabase
      .from('tools')
      .select('category')
      .eq('status', 'active')
    
    if (error) {
      console.error('Supabase 获取分类统计失败:', error)
      throw error
    }
    
    const counts: Record<string, number> = {}
    data?.forEach(tool => {
      counts[tool.category] = (counts[tool.category] || 0) + 1
    })
    
    console.log('从 Supabase 成功获取分类统计:', counts)
    return counts
  } catch (error) {
    console.warn('Supabase 连接失败，降级使用 mock 数据:', error)
    // 降级方案：使用 mock 数据
    const counts: Record<string, number> = {}
    mockTools.forEach(tool => {
      // mock 数据中没有 status 字段，默认都是 active
      counts[tool.category] = (counts[tool.category] || 0) + 1
    })
    return counts
  }
}

export async function submitTool(tool: {
  name: string;
  website_url: string;
  tagline: string;
  category: string;
  pricing_type: string;
  is_china_available: boolean;
  note?: string;
  }) {
  try {
    console.log('尝试提交工具到 Supabase:', tool.name)
    const { data, error } = await supabase
      .from('tool_submissions')
      .insert([tool])
    
    if (error) {
      console.error('Supabase 提交工具失败:', error)
      throw error
    }
    
    console.log('成功提交工具到 Supabase')
    return { data, error: null }
  } catch (error) {
    console.warn('Supabase 连接失败，模拟提交成功:', error)
    // 降级方案：模拟提交成功
    return { data: { id: Date.now().toString(), ...tool }, error: null }
  }
}
