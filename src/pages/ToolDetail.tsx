import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { tools, categories, categoryColorMap, pricingLabels } from "@/lib/mock-data";
import { getToolLogo } from "@/lib/logo-utils";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Eye, ExternalLink, Share2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ToolDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const tool = tools.find((t) => t.id === id);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [shareText, setShareText] = useState("📤 分享");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const logoUrl = tool ? getToolLogo(tool.websiteUrl) : '';

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!tool) {
    return (
      <main className="mx-auto max-w-[960px] px-6 pt-24 pb-12 text-center">
        <p className="text-muted-foreground">工具未找到</p>
        <Link to="/" className="text-primary mt-4 inline-block">返回首页</Link>
      </main>
    );
  }

  const cat = categories.find((c) => c.id === tool.category);
  const bgColor = categoryColorMap[tool.category] || "hsl(0,0%,60%)";
  const relatedTools = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("✅ 已复制");
    setTimeout(() => setShareText("📤 分享"), 2000);
  };

  const handleRate = (r: number) => {
    setUserRating(r);
    toast({ title: "感谢评分！", description: `你给了 ${r} 星` });
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

      {/* Basic Info */}
      <Card className="mt-8">
        <CardHeader><CardTitle className="text-base">📋 基本信息</CardTitle></CardHeader>
        <CardContent>
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
              {tool.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">📖 详细介绍</CardTitle></CardHeader>
        <CardContent>{renderDescription(tool.description)}</CardContent>
      </Card>

      {/* Screenshots */}
      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">📸 截图展示</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {tool.screenshots.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/50 border border-border overflow-hidden hover:ring-2 ring-primary transition-all"
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  截图 {i + 1}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! - 1 + 3) % 3); }}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <div className="w-[800px] aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center text-muted-foreground"
            onClick={(e) => e.stopPropagation()}>
            截图 {lightboxIndex + 1}
          </div>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! + 1) % 3); }}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full">
            <ChevronRight className="h-8 w-8" />
          </button>
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

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
