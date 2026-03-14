// 分类系统类型定义
export interface MainCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  name: string;
  main_category_id: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithSubCategories extends MainCategory {
  sub_categories: SubCategory[];
}

// 扩展工具类型以支持二级分类
export interface ToolWithCategories {
  // 原有字段...
  id: string;
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  category: string; // 保持向后兼容
  tags: string[];
  pricingType: string;
  isChinaAvailable: boolean;
  isChineseSupported: boolean;
  rating: number;
  ratingCount: number;
  viewCount: number;
  screenshots: string[];
  createdAt: string;
  logoUrl?: string;
  aiQualityScore?: number;
  aiQualityReview?: string;
  aiReviewDate?: string;
  aiReviewNotes?: string;
  
  // 新增分类字段
  main_category?: string;
  sub_category?: string;
}
