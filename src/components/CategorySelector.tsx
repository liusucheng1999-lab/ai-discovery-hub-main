import { useState, useEffect } from 'react';
import { MainCategory, SubCategory, CategoryWithSubCategories } from '@/lib/types';
import { CategoryService } from '@/lib/category-service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CategorySelectorProps {
  value?: {
    mainCategory?: string;
    subCategory?: string;
  };
  onChange?: (value: { mainCategory?: string; subCategory?: string }) => void;
  placeholder?: string;
  className?: string;
}

export default function CategorySelector({ 
  value = {}, 
  onChange, 
  placeholder = "选择分类",
  className 
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryWithSubCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>(value.mainCategory || '');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (value.mainCategory !== selectedMainCategory) {
      setSelectedMainCategory(value.mainCategory || '');
    }
  }, [value.mainCategory]);

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getCategoriesWithSubCategories();
      setCategories(data);
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMainCategoryChange = (mainCategoryId: string) => {
    setSelectedMainCategory(mainCategoryId);
    onChange?.({ 
      mainCategory: mainCategoryId, 
      subCategory: undefined // 重置子分类
    });
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    onChange?.({ 
      mainCategory: selectedMainCategory, 
      subCategory: subCategoryId 
    });
  };

  const selectedMainCategoryData = categories.find(cat => cat.id === selectedMainCategory);
  const selectedSubCategoryData = selectedMainCategoryData?.sub_categories.find(
    sub => sub.id === value.subCategory
  );

  if (loading) {
    return <div className="animate-pulse">加载中...</div>;
  }

  return (
    <div className="space-y-2">
      {/* 主分类选择 */}
      <Select value={selectedMainCategory} onValueChange={handleMainCategoryChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 子分类选择 */}
      {selectedMainCategory && selectedMainCategoryData && (
        <Select 
          value={value.subCategory} 
          onValueChange={handleSubCategoryChange}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder="选择子分类" />
          </SelectTrigger>
          <SelectContent>
            {selectedMainCategoryData.sub_categories.map((subCategory) => (
              <SelectItem key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* 显示当前选择的分类 */}
      {selectedMainCategoryData && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedMainCategoryData.icon} {selectedMainCategoryData.name}
          </Badge>
          {selectedSubCategoryData && (
            <Badge variant="outline" className="text-xs">
              {selectedSubCategoryData.name}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
