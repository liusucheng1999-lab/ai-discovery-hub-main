import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { pricingLabels, Tool } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { CategoryWithSubCategories } from "@/lib/types";
import ToolCardWithButtons from "@/components/ToolCardWithButtons";
import ToolDetailModal from "@/components/ToolDetailModal";
import CategorySelector from "@/components/CategorySelector";
import EnhancedSearch from "@/components/EnhancedSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 100;

interface IndexPageProps {
  searchQuery?: string;
}

export default function IndexPage({ searchQuery: initialSearchQuery }: IndexPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  
  // 新的搜索状态
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");

  // 数据状态 - 添加缓存优化
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryWithSubCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // 添加数据加载状态标记

  // 分类URL映射 - 更新为最终标准分类体系
  const categoryUrlMap: Record<string, string> = {
    '对话': '/ai-chat',
    '写作': '/ai-writing',
    '视觉': '/ai-visual',
    '音频': '/ai-audio',
    '编程': '/ai-coding',
    '办公': '/ai-office',
    '工具': '/ai-tools',
    '职场': '/ai-career'
  };

  // 智能分页显示函数
  const getVisiblePages = (totalPages: number, currentPage: number) => {
    const delta = 2; // 当前页前后显示的页数
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // 从 Supabase 加载数据 - 优化版本
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        console.log('首页：正在从Supabase加载数据');

        // 优化：只查询必要的数据，避免重复查询
        const [categoriesResult, toolsResult, subCategoriesResult] = await Promise.all([
          supabase.from('main_categories').select('*').order('sort_order'),
          supabase.from('tools').select('*').in('status', ['approved', 'active']).neq('status', 'deleted').order('view_count', { ascending: false }),
          supabase.from('sub_categories').select('*').order('main_category_id, sort_order')
        ]);

        // 处理分类数据
        if (categoriesResult.data) {
          const allCategories = [
            { id: "all", name: "全部", icon: "" },
            ...categoriesResult.data.map(cat => ({
              ...cat,
              // 使用新的标准分类名称，无需额外映射
              name: cat.name
            }))
          ];
          setCategories(allCategories);
        }

        // 设置工具数据 - 优化转换逻辑
        if (toolsResult.data) {
          // 使用更高效的数据转换
          const transformedTools = toolsResult.data.map((tool: any) => ({
            id: tool.id,
            name: tool.name,
            tagline: tool.tagline,
            description: tool.description,
            websiteUrl: tool.website_url,
            category: tool.category,
            tags: tool.tags || [],
            pricingType: tool.pricing_type,
            isChinaAvailable: tool.is_china_available,
            isChineseSupported: tool.is_chinese_supported,
            rating: tool.rating || 0,
            ratingCount: tool.rating_count || 0,
            viewCount: tool.view_count || 0,
            screenshots: tool.screenshots || [],
            createdAt: tool.created_at,
            logoUrl: tool.logo_url,
            aiQualityScore: tool.ai_quality_score,
            aiQualityReview: tool.ai_quality_review,
            aiReviewDate: tool.ai_review_date,
            aiReviewNotes: tool.ai_review_notes,
            main_category: tool.main_category,
            sub_category: tool.sub_category
          }));
          
          setTools(transformedTools);
        }

        // 构建分类数据 - 避免重复查询
        if (categoriesResult.data && subCategoriesResult.data) {
          const categoryData = categoriesResult.data.map(main => ({
            ...main,
            sub_categories: subCategoriesResult.data.filter(sub => sub.main_category_id === main.id)
          }));
          setCategoryData(categoryData);
        }

      } catch (err) {
        console.log('首页：加载数据失败', err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // 处理搜索
  const handleSearch = (query: string) => {
    console.log('关键词搜索:', query);
    setSearchQuery(query);
    setPage(1); // 重置到第一页
  };

  // 计算分类数量（基于当前工具数据）
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach((t) => {
      // 优先使用新的main_category字段，如果没有则使用旧的category字段
      const category = t.main_category || t.category;
      counts[category] = (counts[category] || 0) + 1;
    });
    counts["all"] = tools.length;
    return counts;
  }, [tools]);

  const filtered = useMemo(() => {
    console.log('筛选逻辑执行:', { searchQuery });
    
    // 使用关键词匹配逻辑
    console.log('使用关键词匹配');
    let result = [...tools];

    // 按主分类筛选
    if (activeCategory !== "all") {
      result = result.filter((t) => {
        // 优先使用新的二级分类字段，如果没有则使用旧的单分类字段
        if (t.main_category) {
          return t.main_category === activeCategory;
        }
        return t.category === activeCategory;
      });
    }

    // 按子分类筛选
    if (selectedSubCategory) {
      result = result.filter((t) => t.sub_category === selectedSubCategory);
    }

    // 关键词精准匹配（优先级最高）
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => 
          t.name.toLowerCase().includes(q) || 
          t.tagline.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(q)))
      );
    }

    if (sortBy === "popular") result.sort((a, b) => b.viewCount - a.viewCount);
    else if (sortBy === "newest") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    console.log('关键词匹配结果:', result.length);
    return result;
  }, [tools, activeCategory, selectedSubCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => setPage(1), [activeCategory, selectedSubCategory, searchQuery, sortBy]);

  return (
    <>
      <Helmet>
        <title>AI创客 - 全网AI工具导航 | 免费AI工具大全</title>
        <meta name="description" content="AI创客是专业AI工具导航网站，收录AI写作、AI绘画、AI办公、AI剪辑、AI代码等优质工具，免费无广告，实时更新，一站式找到所有AI工具。" />
        <meta name="keywords" content="AI工具导航,免费AI工具,AI工具大全,AI工具汇总,AI写作工具,AI绘画工具,AI办公工具,AI剪辑工具,AI代码工具" />
        <link rel="canonical" href="https://aimakerbox.com" />
      </Helmet>
      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
      
      {/* 搜索组件 */}
      <div className="py-8 relative z-30">
        <div className="flex flex-col items-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI创客 - 发现全网好用的AI工具
          </h1>
          <p className="text-muted-foreground text-center mb-10 text-lg max-w-2xl">
            支持关键词搜索和AI智能搜索，精准匹配您的需求
          </p>
          <div className="w-full relative z-50 flex justify-center">
            <EnhancedSearch 
              onSearch={handleSearch}
              className="w-full max-w-2xl"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs - 吸顶 */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm -mx-6 px-6 py-0">
        <div className="flex gap-1 border-b border-border overflow-x-auto pb-0">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedSubCategory(""); // 重置子分类
                }}
                className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeCategory === cat.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.icon} {cat.name} ({categoryCounts[cat.id] || 0})
              </button>
            ))
          ) : (
            // 分类加载中的占位符
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="shrink-0 px-4 py-3 h-10 bg-muted/30 rounded-t-md animate-pulse"></div>
              ))}
            </div>
          )}
        </div>
        
        {/* 子分类选择器 */}
        {activeCategory !== "all" && (() => {
          const mainCategory = categoryData.find(cat => cat.id === activeCategory);
          if (!mainCategory || mainCategory.sub_categories.length === 0) return null;
          
          return (
            <div className="flex items-center gap-2 -mx-6 px-6 pt-4 pb-3">
              <div className="flex gap-1 overflow-x-auto">
                <button
                  onClick={() => setSelectedSubCategory("")}
                  className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full transition-colors border ${
                    !selectedSubCategory
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-muted/80"
                  }`}
                >
                  全部
                </button>
                {mainCategory.sub_categories.map((subCat) => (
                  <button
                    key={subCat.id}
                    onClick={() => setSelectedSubCategory(subCat.id)}
                    className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full transition-colors border ${
                      selectedSubCategory === subCat.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {subCat.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Results count & Sort */}
      <div className="flex items-center justify-between pt-3 pb-4 gap-4 flex-wrap -mx-6 px-6">
        <p className="text-sm text-muted-foreground">找到 {filtered.length} 个工具</p>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">最热门</SelectItem>
            <SelectItem value="newest">最新收录</SelectItem>
            <SelectItem value="rating">评分最高</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tool Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-4 gap-5">
          {paged.map((tool) => (
            <ToolCardWithButtons key={tool.id} tool={tool} searchQuery={searchQuery} />
          ))}
        </div>
      ) : loading ? (
        // 工具加载中的占位符
        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-muted/30 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">没有找到符合条件的工具</p>
          <p className="text-sm mt-1">试试其他筛选条件</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* 智能分页显示 */}
              {getVisiblePages(totalPages, page).map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum === "..." ? (
                    <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
                  ) : (
                    <PaginationLink
                      isActive={page === pageNum}
                      onClick={() => setPage(pageNum as number)}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      </main>
    </>
  );
}
