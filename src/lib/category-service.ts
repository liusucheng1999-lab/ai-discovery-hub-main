import { supabase } from './supabase';
import { MainCategory, SubCategory, CategoryWithSubCategories } from './types';

// 分类服务类 - 支持对话、写作、图像、视频、音频、编程、搜索、办公、资源、工具等10个主分类
export class CategoryService {
  // 获取所有主分类
  static async getMainCategories(): Promise<MainCategory[]> {
    const { data, error } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }

  // 获取所有子分类
  static async getSubCategories(): Promise<SubCategory[]> {
    const { data, error } = await supabase
      .from('sub_categories')
      .select('*')
      .order('main_category_id, sort_order');
    
    if (error) throw error;
    return data || [];
  }

  // 获取带子分类的主分类列表
  static async getCategoriesWithSubCategories(): Promise<CategoryWithSubCategories[]> {
    const [mainCategories, subCategories] = await Promise.all([
      this.getMainCategories(),
      this.getSubCategories()
    ]);

    return mainCategories.map(main => ({
      ...main,
      sub_categories: subCategories.filter(sub => sub.main_category_id === main.id)
    }));
  }

  // 根据主分类ID获取子分类
  static async getSubCategoriesByMain(mainCategoryId: string): Promise<SubCategory[]> {
    const { data, error } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('main_category_id', mainCategoryId)
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }

  // 获取单个主分类
  static async getMainCategory(id: string): Promise<MainCategory | null> {
    const { data, error } = await supabase
      .from('main_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // 获取单个子分类
  static async getSubCategory(id: string): Promise<SubCategory | null> {
    const { data, error } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // 创建主分类
  static async createMainCategory(category: Omit<MainCategory, 'id' | 'created_at' | 'updated_at'>): Promise<MainCategory> {
    const { data, error } = await supabase
      .from('main_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 创建子分类
  static async createSubCategory(category: Omit<SubCategory, 'id' | 'created_at' | 'updated_at'>): Promise<SubCategory> {
    const { data, error } = await supabase
      .from('sub_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 更新主分类
  static async updateMainCategory(id: string, updates: Partial<MainCategory>): Promise<MainCategory> {
    const { data, error } = await supabase
      .from('main_categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 更新子分类
  static async updateSubCategory(id: string, updates: Partial<SubCategory>): Promise<SubCategory> {
    const { data, error } = await supabase
      .from('sub_categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 删除主分类
  static async deleteMainCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('main_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // 删除子分类
  static async deleteSubCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('sub_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
