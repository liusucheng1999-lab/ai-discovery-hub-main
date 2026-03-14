import { useState } from "react";
import { Eye, Star, ExternalLink, Info, Sparkles } from "lucide-react";
import { type Tool, categoryColorMap, categories, pricingLabels } from "@/lib/mock-data";
import { getToolLogo } from "@/lib/logo-utils";
import ToolDetailModal from "./ToolDetailModal";

const pricingColorMap: Record<string, string> = {
  free: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  freemium: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  paid: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  opensource: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
};

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

interface ToolCardProps {
  tool: Tool;
  searchQuery?: string;
  small?: boolean;
}

export default function ToolCard({ tool, searchQuery = "", small = false }: ToolCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const cat = categories.find((c) => c.id === tool.category);
  const bgColor = categoryColorMap[tool.category] || "hsl(0,0%,60%)";
  const logoSize = small ? "h-10 w-10 text-lg" : "h-12 w-12 text-xl";
  
  // 优先使用数据库中的logo_url，如果没有则动态计算
  const logoUrl = tool.logoUrl || getToolLogo(tool.websiteUrl);
  
  // AI搜索匹配度信息
  const aiMatchScore = (tool as any).ai_match_score;
  const aiMatchReason = (tool as any).ai_match_reason;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // 处理访问官网按钮点击
  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(tool.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  // 处理详情按钮点击
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="group rounded-xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
        <div className="flex items-start gap-2.5">
          <div className={`${logoSize} shrink-0 rounded-lg flex items-center justify-center relative overflow-hidden`}>
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
                className={`${logoSize} shrink-0 rounded-lg flex items-center justify-center font-bold text-white`}
                style={{ backgroundColor: bgColor }}
              >
                {tool.name[0]}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold truncate ${small ? "text-sm" : "text-base"}`}>
                <HighlightText text={tool.name} query={searchQuery} />
              </h3>
              {/* AI搜索匹配度显示 */}
              {aiMatchScore && (
                <div className="flex items-center gap-1 shrink-0">
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {Math.round(aiMatchScore * 100)}%
                  </span>
                </div>
              )}
            </div>
            <p className={`mt-1 text-muted-foreground line-clamp-2 ${small ? "text-xs" : "text-sm"}`}>
              <HighlightText text={tool.tagline} query={searchQuery} />
            </p>
            {/* AI匹配原因 */}
            {aiMatchReason && (
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400 line-clamp-2">
                {aiMatchReason}
              </p>
            )}
          </div>
        </div>

        {/* 悬浮时显示的详细信息 - 覆盖整个卡片 */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* 简洁的文字按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleVisitWebsite}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              访问
            </button>
            <button
              onClick={handleViewDetails}
              className="px-4 py-2 text-sm font-medium border border-border bg-muted/80 hover:bg-muted rounded-lg transition-all duration-200"
            >
              详情
            </button>
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      <ToolDetailModal
        tool={tool}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
}
