import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { categories as mockCategories, categoryColorMap, pricingLabels } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { getToolLogo } from "@/lib/logo-utils";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Eye, ExternalLink, Share2, ChevronLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ToolDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [tool, setTool] = useState<any>(null);
  const [categoryList, setCategoryList] = useState(mockCategories);
  const [relatedTools, setRelatedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [shareText, setShareText] = useState("📤 分享");

  const logoUrl = tool ? getToolLogo(tool.websiteUrl) : '';

  // 从 Supabase 加载数据
  useEffect(() => {
    async function loadTool() {
      setLoading(true);
      try {
        console.log('详情页：正在从Supabase加载工具', id);
        
        // 同时获取工具详情和分类数据
        const [toolResult, categoriesResult] = await Promise.all([
          supabase
            .from('tools')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('categories')
            .select('*')
            .order('sort_order')
        ]);
        
        if (toolResult.error || !toolResult.data) {
          console.log('详情页：未找到工具', toolResult.error?.message);
          setTool(null);
        } else {
          console.log('详情页：加载成功', toolResult.data.name);
          
          // 转换字段名
          const formattedTool = {
            id: toolResult.data.id,
            name: toolResult.data.name,
            tagline: toolResult.data.tagline,
            description: toolResult.data.description || toolResult.data.tagline,
            websiteUrl: toolResult.data.website_url,
            category: toolResult.data.category,
            tags: toolResult.data.tags || [],
            pricingType: toolResult.data.pricing_type,
            isChinaAvailable: toolResult.data.is_china_available,
            isChineseSupported: toolResult.data.is_chinese_supported || false,
            rating: toolResult.data.rating || 0,
            ratingCount: toolResult.data.rating_count || 0,
            viewCount: (toolResult.data.view_count || 0) + 1,
            screenshots: toolResult.data.screenshots || [],
            createdAt: toolResult.data.created_at || new Date().toISOString().split('T')[0],
            // AI质量评估字段
            aiQualityScore: toolResult.data.ai_quality_score,
            aiQualityReview: toolResult.data.ai_quality_review,
            aiReviewDate: toolResult.data.ai_review_date,
            aiReviewNotes: toolResult.data.ai_review_notes
          };
          
          setTool(formattedTool);
          
          // 更新浏览量
          const updateResult = await supabase
            .from('tools')
            .update({ view_count: (toolResult.data.view_count || 0) + 1 })
            .eq('id', id);
            
          if (updateResult.error) {
            console.log('浏览量更新失败', updateResult.error);
          } else {
            console.log('浏览量更新成功');
          }
          
          // 获取相关工具
          if (toolResult.data.category) {
            const relatedResult = await supabase
              .from('tools')
              .select('*')
              .eq('status', 'active')
              .eq('category', toolResult.data.category)
              .neq('id', id)
              .limit(4);
            
            if (!relatedResult.error && relatedResult.data) {
              const convertedRelated = relatedResult.data.map((t: any) => ({
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
                createdAt: t.created_at || new Date().toISOString().split('T')[0]
              }));
              setRelatedTools(convertedRelated);
            }
          }
          
          // 更新分类数据
          if (!categoriesResult.error && categoriesResult.data) {
            setCategoryList(categoriesResult.data as any);
          }
        }
      } catch (err) {
        console.log('详情页：连接失败', err);
        setTool(null);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadTool();
    }
  }, [id]);

  // 加载中
  if (loading) {
    return (
      <main className="mx-auto max-w-[960px] px-6 pt-24 pb-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </main>
    );
  }

  // 工具不存在
  if (!tool) {
    return (
      <main className="mx-auto max-w-[960px] px-6 pt-24 pb-12 text-center">
        <h1 className="text-2xl font-bold mb-4">工具不存在</h1>
        <p className="text-muted-foreground mb-6">没有找到ID为 "{id}" 的工具</p>
        <Link to="/">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </main>
    );
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("✅ 已复制");
    setTimeout(() => setShareText("📤 分享"), 2000);
  };

  const handleRate = async (r: number) => {
    setUserRating(r);
  
    try {
      // 计算新的平均分
      const newRatingCount = (tool.ratingCount || 0) + 1;
      const newRating = ((tool.rating || 0) * (tool.ratingCount || 0) + r) / newRatingCount;
      
      // 更新数据库
      await supabase
        .from('tools')
        .update({ 
          rating: Math.round(newRating * 10) / 10,  // 保留1位小数
          rating_count: newRatingCount 
        })
        .eq('id', tool.id);
      
      // 更新本地状态
      setTool({
        ...tool,
        rating: Math.round(newRating * 10) / 10,
        ratingCount: newRatingCount
      });
      
      toast({ title: "感谢评分！", description: `你给了 ${r} 星` });
    } catch (err) {
      console.log('评分保存失败', err);
      toast({ title: "评分失败", description: "请稍后重试" });
    }
  };

  // Simple markdown-like rendering
  const renderDescription = (md: string) => {
    return md.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-6 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold mt-4 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-sm text-muted-foreground">{line.slice(2)}</li>;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-sm text-muted-foreground">{line}</p>;
    });
  };

  const cat = categoryList.find((c) => c.id === tool.category);
  const bgColor = categoryColorMap[tool.category] || "hsl(0,0%,60%)";

  return (
    <>
      <Helmet>
        <title>{tool.name} - AI创客</title>
        <meta name="description" content={`${tool.name} - ${tool.tagline}`} />
      </Helmet>
      <main className="mx-auto max-w-[960px] px-6 pt-20 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">AI导航</Link>
          <span>/</span>
          <span className="text-foreground">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="flex gap-6 items-start">
          <div className="h-20 w-20 shrink-0 rounded-2xl flex items-center justify-center relative overflow-hidden">
            {!imageError && logoUrl && (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                <img
                  src={logoUrl}
                  alt={`${tool.name} logo`}
                  className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </>
            )}
            {(imageError || !logoUrl) && (
              <div
                className="h-20 w-20 shrink-0 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
                style={{ backgroundColor: bgColor }}
              >
                {tool.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{tool.name}</h1>
            <p className="text-muted-foreground mt-1">{tool.tagline}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {tool.rating} ({tool.ratingCount.toLocaleString()}人评分)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {tool.viewCount.toLocaleString()}次浏览
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {cat && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {cat.icon} {cat.name}
                </span>
              )}
              <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                {pricingLabels[tool.pricingType]}
              </span>
              {tool.isChinaAvailable && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                  🇨🇳 国内可用
                </span>
              )}
              {tool.isChineseSupported && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                  支持中文
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-primary text-white">
                  <ExternalLink className="h-4 w-4 mr-1" /> 访问官网
                </Button>
              </a>
              <Button variant="outline" onClick={handleShare}>
                {shareText}
              </Button>
            </div>
          </div>
        </div>

        {/* Tool Info & Description */}
        <Card className="mt-8">
          <CardHeader><CardTitle className="text-base">📋 工具信息</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-muted-foreground">分类</div>
              <div>{cat?.icon} {cat?.name}</div>
              <div className="text-muted-foreground">收费类型</div>
              <div>{pricingLabels[tool.pricingType]}</div>
              <div className="text-muted-foreground">国内可用</div>
              <div>{tool.isChinaAvailable ? "✅ 可直接访问" : "❌ 需翻墙"}</div>
              <div className="text-muted-foreground">中文支持</div>
              <div>{tool.isChineseSupported ? "✅ 支持中文" : "❌ 暂不支持"}</div>
              <div className="text-muted-foreground">官网</div>
              <div>
                <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {tool.websiteUrl}
                </a>
              </div>
              <div className="text-muted-foreground">标签</div>
              <div className="flex flex-wrap gap-1">
                {tool.tags.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* AI质量评估 */}
            {tool.aiQualityScore && (
              <>
                {/* 分隔线 */}
                <div className="border-t border-border"></div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    🤖 AI质量评估
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs">
                      评分: {tool.aiQualityScore.toFixed(1)}/10
                    </span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="text-muted-foreground">AI评分</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${(tool.aiQualityScore / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{tool.aiQualityScore.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    {tool.aiReviewDate && (
                      <>
                        <div className="text-muted-foreground">审核时间</div>
                        <div>{new Date(tool.aiReviewDate).toLocaleDateString('zh-CN')}</div>
                      </>
                    )}
                    
                    {tool.aiReviewNotes && (
                      <>
                        <div className="text-muted-foreground">AI备注</div>
                        <div className="text-muted-foreground italic">{tool.aiReviewNotes}</div>
                      </>
                    )}
                  </div>
                  
                  {tool.aiQualityReview && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <h5 className="font-medium text-sm mb-2">详细评估结果</h5>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {typeof tool.aiQualityReview === 'string' 
                          ? tool.aiQualityReview 
                          : JSON.stringify(tool.aiQualityReview, null, 2)
                        }
                      </pre>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* 分隔线 */}
            <div className="border-t border-border"></div>
            
            {/* 详细介绍 */}
            <div>
              <h3 className="text-base font-medium mb-3">📖 详细介绍</h3>
              <div className="text-sm text-muted-foreground">
                {renderDescription(tool.description)}
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Rating */}
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-base">⭐ 为这个工具评分</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onMouseEnter={() => setHoverRating(r)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRate(r)}
                  className="text-2xl transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      r <= (hoverRating || userRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              当前平均 {tool.rating} 分，共 {tool.ratingCount.toLocaleString()} 人评分
            </p>
          </CardContent>
        </Card>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">🔗 同类工具推荐</h2>
            <div className="grid grid-cols-4 gap-4">
              {relatedTools.map((t) => (
                <ToolCard key={t.id} tool={t} small />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}