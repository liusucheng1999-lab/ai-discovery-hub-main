import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { pricingLabels } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import ToolCardWithButtons from "@/components/ToolCardWithButtons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 20;

const pricingFilters = [
  { value: "all", label: "全部" },
  { value: "free", label: "免费" },
  { value: "freemium", label: "免费增值" },
  { value: "paid", label: "付费" },
  { value: "opensource", label: "开源" },
];

const chinaFilters = [
  { value: "all", label: "全部" },
  { value: "yes", label: " 国内可用" },
  { value: "no", label: "需翻墙" },
];

interface IndexPageProps {
  searchQuery?: string;
}

export default function IndexPage({ searchQuery }: IndexPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [chinaFilter, setChinaFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

  // 初始状态设为空数组，不要用 mock 数据
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从 Supabase 加载数据
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        console.log('首页：正在从Supabase加载数据');

        // 同时加载分类和工具
        const [categoriesResult, toolsResult] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order'),
          supabase.from('tools').select('*').eq('status', 'active').order('view_count', { ascending: false })
        ]);

        if (categoriesResult.data) {
          const allCategories = [
            { id: "all", name: "全部", icon: "" },
            ...categoriesResult.data
          ];
          setCategories(allCategories);
        }

        if (toolsResult.data) {
          console.log('首页：工具数据加载成功，检查AI审核字段');
          console.log('原始数据示例:', toolsResult.data[0]);
          
          // 转换字段名
          const formattedTools = toolsResult.data.map(t => {
            const aiScore = t.ai_quality_score;
            
            console.log(`工具 ${t.name} 的AI审核数据:`, {
              ai_quality_score: t.ai_quality_score,
              ai_quality_review: t.ai_quality_review,
              ai_review_date: t.ai_review_date,
              ai_review_notes: t.ai_review_notes
            });
            
            const formattedTool = {
              id: t.id,
              name: t.name,
              tagline: t.tagline,
              description: t.description || t.tagline,
              websiteUrl: t.website_url,
              category: t.category,
              tags: t.tags || [],
              pricingType: t.pricing_type,
              isChinaAvailable: t.is_china_available,
              isChineseSupported: t.is_chinese_supported || false,
              rating: t.rating || 0,
              ratingCount: t.rating_count || 0,
              viewCount: t.view_count || 0,
              screenshots: t.screenshots || [],
              createdAt: t.created_at || new Date().toISOString().split('T')[0],
              // AI质量评估字段
              aiQualityScore: aiScore,
              aiQualityReview: t.ai_quality_review,
              aiReviewDate: t.ai_review_date,
              aiReviewNotes: t.ai_review_notes
            };
            
            return formattedTool;
          });
          setTools(formattedTools);
        }
      } catch (err) {
        console.log('首页：加载数据失败', err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // 计算分类数量（基于当前工具数据）
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    counts["all"] = tools.length;
    return counts;
  }, [tools]);

  const filtered = useMemo(() => {
    let result = [...tools];

    if (activeCategory !== "all") result = result.filter((t) => t.category === activeCategory);
    if (pricingFilter !== "all") result = result.filter((t) => t.pricingType === pricingFilter);
    if (chinaFilter === "yes") result = result.filter((t) => t.isChinaAvailable);
    if (chinaFilter === "no") result = result.filter((t) => !t.isChinaAvailable);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q)
      );
    }

    if (sortBy === "popular") result.sort((a, b) => b.viewCount - a.viewCount);
    else if (sortBy === "newest") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [tools, activeCategory, pricingFilter, chinaFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => setPage(1), [activeCategory, pricingFilter, chinaFilter, searchQuery, sortBy]);

  // 加载中时显示 loading 状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">加载中...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI创客 - 发现最好用的AI工具</title>
        <meta name="description" content="AI创客 - 精选200+优质AI工具，帮你发现最好用的AI应用" />
      </Helmet>
      <main className="mx-auto max-w-[1280px] px-6 pt-20 pb-12">
      {/* Category Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto pb-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeCategory === cat.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.icon} {cat.name} ({categoryCounts[cat.id] || 0})
          </button>
        ))}
      </div>

      {/* Filters & Sort */}
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pricing chips */}
          {pricingFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setPricingFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                pricingFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="mx-2 h-4 w-px bg-border" />

          {/* China availability chips */}
          {chinaFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setChinaFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                chinaFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

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

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4">找到 {filtered.length} 个工具</p>
      </div>

      {/* Tool Grid */}
      {paged.length > 0 ? (
        <div className="grid grid-cols-4 gap-5">
          {paged.map((tool) => (
            <ToolCardWithButtons key={tool.id} tool={tool} searchQuery={searchQuery} />
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    isActive={page === n}
                    onClick={() => setPage(n)}
                    className="cursor-pointer"
                  >
                    {n}
                  </PaginationLink>
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
