import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tool } from "@/lib/mock-data";
import ToolCardWithButtons from "@/components/ToolCardWithButtons";
import ToolDetailModal from "@/components/ToolDetailModal";
import { Button } from "@/components/ui/button";
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

// 分类配置映射
const categoryConfig = {
  'ai-writing': {
    name: 'AI写作工具',
    description: 'AI写作工具是利用人工智能技术辅助内容创作的智能应用，涵盖文案生成、文章写作、小说创作、翻译润色等多个领域。这些工具通过深度学习模型理解语言规律，能够快速生成高质量的文字内容，大幅提升写作效率。无论是营销文案、技术文档还是创意写作，AI写作工具都能为创作者提供灵感和支持，让写作变得更加轻松高效。',
    keywords: ['AI写作', '文案生成', '文章创作', '翻译润色', '内容创作', '智能写作']
  },
  'ai-drawing': {
    name: 'AI绘画工具',
    description: 'AI绘画工具是革命性的数字艺术创作平台，通过先进的图像生成技术，用户只需输入文字描述就能创造出精美的艺术作品。这些工具支持多种绘画风格，从写实照片到动漫插画，从油画水彩到数字艺术，满足不同创作需求。AI绘画工具不仅降低了艺术创作的门槛，还为专业艺术家提供了新的创作思路，让每个人都能成为数字艺术家。',
    keywords: ['AI绘画', '图像生成', '数字艺术', '插画创作', '视觉设计', '艺术创作']
  },
  'ai-office': {
    name: 'AI办公工具',
    description: 'AI办公工具是专为提升工作效率而设计的智能应用集合，涵盖文档处理、数据分析、会议记录、任务管理等多个办公场景。这些工具通过自动化处理和智能分析，帮助用户快速完成繁琐的重复性工作，让办公变得更加高效。从智能文档编辑到数据可视化，从会议纪要生成到项目进度跟踪，AI办公工具正在重新定义现代办公方式。',
    keywords: ['AI办公', '效率工具', '文档处理', '数据分析', '会议记录', '任务管理']
  },
  'ai-video': {
    name: 'AI视频工具',
    description: 'AI视频工具是视频内容创作领域的革新力量，集成了智能剪辑、自动生成、特效处理等多种功能。这些工具能够自动识别视频内容、智能剪辑片段、添加字幕配乐、生成视频特效，大幅降低视频制作的技术门槛。无论是短视频创作、营销视频制作还是专业影视后期，AI视频工具都能为创作者提供强大的技术支持，让视频制作变得更加简单高效。',
    keywords: ['AI视频', '视频剪辑', '内容创作', '特效处理', '字幕生成', '视频制作']
  },
  'ai-code': {
    name: 'AI代码工具',
    description: 'AI代码工具是程序员的智能助手，通过机器学习技术提供代码生成、错误检测、性能优化等开发支持。这些工具能够理解代码逻辑、自动补全代码、重构优化程序、发现潜在bug，显著提升开发效率。从代码编写到调试测试，从文档生成到性能分析，AI代码工具正在改变传统的软件开发模式，让编程变得更加智能高效。',
    keywords: ['AI编程', '代码生成', '开发工具', '错误检测', '性能优化', '智能编程']
  }
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const config = categoryConfig[category as keyof typeof categoryConfig];
  const categoryName = config?.name || '分类';
  const totalPages = Math.ceil(tools.length / ITEMS_PER_PAGE);
  const paged = tools.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    async function loadCategoryTools() {
      if (!category || !config) return;

      setLoading(true);
      try {
        // 根据分类获取工具
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .in('status', ['approved', 'active'])
          .eq('main_category', config.name)
          .order('view_count', { ascending: false });

        if (error) throw error;

        const transformedTools = data.map((tool: any) => ({
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
          main_category: tool.main_category,
          sub_category: tool.sub_category
        }));

        setTools(transformedTools);
      } catch (error) {
        console.error('加载分类工具失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryTools();
  }, [category, config]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
          <Link to="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{config.name}导航 - AI创客</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={config.keywords.join(',')} />
        <link rel="canonical" href={`https://aimakerbox.com/${category}`} />
      </Helmet>
      
      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        {/* 分类介绍 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{config.name}导航 - AI创客</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* 工具列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : tools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((tool) => (
                <ToolCardWithButtons
                  key={tool.id}
                  tool={tool}
                  onViewDetails={setSelectedTool}
                />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无{config.name}相关工具</p>
          </div>
        )}

        {/* 工具详情弹窗 */}
        {selectedTool && (
          <ToolDetailModal
            tool={selectedTool}
            isOpen={!!selectedTool}
            onClose={() => setSelectedTool(null)}
          />
        )}
      </main>
    </>
  );
}
