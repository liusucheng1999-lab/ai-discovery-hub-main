import { Link } from "react-router-dom";
import { Eye, Star } from "lucide-react";
import { useState } from "react";
import { type Tool, categoryColorMap, categories, pricingLabels } from "@/lib/mock-data";
import { getToolLogo } from "@/lib/logo-utils";

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
  const cat = categories.find((c) => c.id === tool.category);
  const bgColor = categoryColorMap[tool.category] || "hsl(0,0%,60%)";
  const logoSize = small ? "h-10 w-10 text-lg" : "h-12 w-12 text-xl";
  const logoUrl = getToolLogo(tool.websiteUrl);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50"
    >
      <div className="flex items-start gap-3">
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
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{tool.rating}</span>
            {!small && <span>({tool.ratingCount.toLocaleString()}人评分)</span>}
          </div>
        </div>
      </div>

      <p className={`mt-2 text-muted-foreground line-clamp-2 ${small ? "text-xs" : "text-sm"}`}>
        <HighlightText text={tool.tagline} query={searchQuery} />
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {cat && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {cat.icon} {cat.name}
          </span>
        )}
        <span className={`rounded-full px-2 py-0.5 text-xs ${pricingColorMap[tool.pricingType]}`}>
          {pricingLabels[tool.pricingType]}
        </span>
        {tool.isChinaAvailable && (
          <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
            🇨🇳
          </span>
        )}
      </div>

      {!small && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="h-3 w-3" />
          <span>{tool.viewCount.toLocaleString()} 次浏览</span>
        </div>
      )}
    </Link>
  );
}
