import { useState } from "react";
import { X, ExternalLink, Star, Eye, Info, Edit } from "lucide-react";
import { type Tool, categoryColorMap, categories, pricingLabels } from "@/lib/mock-data";
import { getToolLogo } from "@/lib/logo-utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const pricingColorMap: Record<string, string> = {
  free: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  freemium: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  paid: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  opensource: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
};

interface ToolDetailModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolDetailModal({ tool, isOpen, onClose }: ToolDetailModalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Tool>>({});
  const { toast } = useToast();
  const { isLoggedIn, username } = useAuth();

  console.log('ToolDetailModal - AI审核数据检查:', {
    toolName: tool?.name,
    aiQualityScore: tool?.aiQualityScore,
    aiQualityReview: tool?.aiQualityReview,
    aiReviewDate: tool?.aiReviewDate,
    aiReviewNotes: tool?.aiReviewNotes
  });

  if (!tool || !isOpen) return null;

  const cat = categories.find((c) => c.id === tool.category);
  const bgColor = categoryColorMap[tool.category] || "hsl(0,0%,60%)";
  const logoUrl = getToolLogo(tool.websiteUrl);

  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setImageLoaded(true);

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
      tool.rating = Math.round(newRating * 10) / 10;
      tool.ratingCount = newRatingCount;
      
      toast({ title: "感谢评分！", description: `你给了 ${r} 星` });
    } catch (err) {
      console.log('评分保存失败', err);
      toast({ title: "评分失败", description: "请稍后重试" });
    }
  };

  const handleEdit = () => {
    setEditForm({
      name: tool.name,
      tagline: tool.tagline,
      description: tool.description,
      websiteUrl: tool.websiteUrl,
      category: tool.category,
      tags: tool.tags,
      pricingType: tool.pricingType,
      isChinaAvailable: tool.isChinaAvailable,
      isChineseSupported: tool.isChineseSupported
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('tools')
        .update({
          name: editForm.name,
          tagline: editForm.tagline,
          description: editForm.description,
          website_url: editForm.websiteUrl,
          category: editForm.category,
          tags: editForm.tags,
          pricing_type: editForm.pricingType,
          is_china_available: editForm.isChinaAvailable,
          is_chinese_supported: editForm.isChineseSupported,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id);

      if (error) {
        throw error;
      }

      // 更新本地工具数据
      Object.assign(tool, editForm);
      
      setIsEditing(false);
      toast({ title: "保存成功", description: "工具信息已更新" });
    } catch (err) {
      console.error('保存失败:', err);
      toast({ title: "保存失败", description: "请稍后重试" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleVisitWebsite = () => {
    window.open(tool.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-96 h-full bg-background border-l border-border shadow-2xl overflow-hidden ml-auto">
        {/* 工具详情内容 */}
        <div className="h-full overflow-y-auto">
          {/* 工具头部 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 shrink-0 rounded-xl flex items-center justify-center relative overflow-hidden">
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
                    className="h-16 w-16 shrink-0 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: bgColor }}
                  >
                    {tool.name[0]}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{tool.name}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-muted-foreground text-sm mt-1">{tool.tagline}</p>
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {cat && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {cat.icon} {cat.name}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${pricingColorMap[tool.pricingType]}`}>
                    {pricingLabels[tool.pricingType]}
                  </span>
                  {tool.isChinaAvailable && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                      🇨🇳 国内可用
                    </span>
                  )}
                  {tool.aiQualityScore && (
                    <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                      AI:{tool.aiQualityScore.toFixed(1)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {tool.rating} ({tool.ratingCount.toLocaleString()}人评分)
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {tool.viewCount.toLocaleString()}次浏览
                  </span>
                </div>
              </div>
            </div>

            {/* 详细介绍 */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-sm">📖 详细介绍</h3>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {tool.description}
              </div>
            </div>

            {/* 用户评分 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">为这个工具评分</h3>
                <span className="text-sm text-muted-foreground">{tool.rating} ({tool.ratingCount.toLocaleString()}人评分)</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <Star
                    key={r}
                    onMouseEnter={() => setHoverRating(r)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(r)}
                    className={`text-2xl transition-colors cursor-pointer ${
                      r <= (hoverRating || userRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
                {userRating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">你的评分: {userRating}星</span>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              {isLoggedIn && (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                  编辑
                </button>
              )}
              <button
                onClick={handleVisitWebsite}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ExternalLink className="h-4 w-4" />
                访问官网
              </button>
            </div>
          </div>

          {/* 编辑表单 */}
          {isEditing && (
            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-200/50 dark:border-blue-800/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Edit className="h-4 w-4" />
                编辑工具信息
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">工具名称</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">简介</label>
                  <input
                    type="text"
                    value={editForm.tagline || ''}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">官网地址</label>
                  <input
                    type="url"
                    value={editForm.websiteUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">分类</label>
                  <select
                    value={editForm.category || ''}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">收费类型</label>
                  <select
                    value={editForm.pricingType || ''}
                    onChange={(e) => setEditForm({ ...editForm, pricingType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="free">免费</option>
                    <option value="freemium">免费增值</option>
                    <option value="paid">付费</option>
                    <option value="opensource">开源</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editForm.isChinaAvailable || false}
                      onChange={(e) => setEditForm({ ...editForm, isChinaAvailable: e.target.checked })}
                      className="rounded border-border"
                    />
                    国内可用
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editForm.isChineseSupported || false}
                      onChange={(e) => setEditForm({ ...editForm, isChineseSupported: e.target.checked })}
                      className="rounded border-border"
                    />
                    支持中文
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">详细介绍</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    保存更改
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 text-sm font-medium border border-border bg-background hover:bg-muted rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 详细信息 */}
          <div className="p-6 space-y-6">
            {/* AI质量评估 */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                🤖 AI质量评估
                {tool.aiQualityScore && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs">
                    评分: {tool.aiQualityScore.toFixed(1)}/10
                  </span>
                )}
              </h3>
              
              <div className="space-y-3">
                {tool.aiQualityScore ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI评分</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${(tool.aiQualityScore / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-sm">{tool.aiQualityScore.toFixed(1)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI评分</span>
                    <span className="text-sm text-muted-foreground">暂无评分</span>
                  </div>
                )}
                
                {tool.aiReviewDate ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">审核时间</span>
                    <span className="text-sm">{new Date(tool.aiReviewDate).toLocaleDateString('zh-CN')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">审核时间</span>
                    <span className="text-sm text-muted-foreground">暂无审核记录</span>
                  </div>
                )}
                
                {tool.aiReviewNotes ? (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">AI备注</div>
                    <div className="text-sm text-muted-foreground italic">{tool.aiReviewNotes}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">AI备注</div>
                    <div className="text-sm text-muted-foreground italic">暂无备注信息</div>
                  </div>
                )}
              </div>
            </div>

            {/* 工具信息 */}
            <div className="p-4 bg-background rounded-xl border border-border">
              <h3 className="font-semibold mb-3 text-sm">📋 工具信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">分类</span>
                  <span>{cat?.icon} {cat?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">收费类型</span>
                  <span>{pricingLabels[tool.pricingType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">国内可用</span>
                  <span>{tool.isChinaAvailable ? "✅ 可直接访问" : "❌ 需翻墙"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">中文支持</span>
                  <span>{tool.isChineseSupported ? "✅ 支持中文" : "❌ 暂不支持"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">官网</span>
                  <a 
                    href={tool.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    {tool.websiteUrl}
                  </a>
                </div>
              </div>
            </div>

            {/* 标签 */}
            {tool.tags.length > 0 && (
              <div className="p-4 bg-background rounded-xl border border-border">
                <h3 className="font-semibold mb-3 text-sm">🏷️ 标签</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
