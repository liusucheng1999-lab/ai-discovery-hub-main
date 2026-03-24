import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tool } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft, Star, Users, Eye } from "lucide-react";

// 分类名称映射
const categoryNames: Record<string, string> = {
  'chat': '对话',
  'writing': '写作',
  'visual': '视觉',
  'audio': '音频',
  'coding': '编程',
  'office': '办公',
  'tools': '工具',
  'career': '职场'
};

// 子分类名称映射
const subCategoryNames: Record<string, string> = {
  // 对话类
  'chat_domestic': '国产模型',
  'chat_overseas': '海外模型',
  'chat_fun': '趣味聊天',
  
  // 写作类
  'writing_copy': '文案创作',
  'writing_academic': '论文学术',
  'writing_novel': '小说网文',
  'writing_document': '文档解析',
  
  // 视觉类
  'visual_image_gen': '图像生成',
  'visual_image_process': '图像处理',
  'visual_creative': '创意设计',
  'visual_video': '视频数字人',
  
  // 音频类
  'audio_music': '音乐生成',
  'audio_voice': '配音克隆',
  'audio_transcribe': '语音转写',
  'audio_edit': '音频编辑',
  
  // 编程类
  'coding_code': '代码编写',
  'coding_ai': 'AI工程',
  'coding_dev': '开发工具',
  'coding_agent': '智能体开发',
  
  // 办公类
  'office_ppt': 'PPT演示',
  'office_doc': '文档协同',
  'office_data': '数据表格',
  'office_mind': '思维导图',
  
  // 工具类
  'tools_search': '智能搜索',
  'tools_efficiency': '效率工具',
  'tools_learn': '学习科研',
  'tools_niche': '小众工具',
  
  // 职场类
  'career_job': '求职辅助',
  'career_legal': '法律合规',
  'career_work': '职场工具'
};

// 获取分类显示名称
function getCategoryDisplayName(mainCategory?: string, subCategory?: string): string {
  if (!mainCategory) return '未分类';
  
  const mainName = categoryNames[mainCategory] || mainCategory;
  const subName = subCategory ? subCategoryNames[subCategory] || subCategory : '';
  
  return subName ? `${mainName} - ${subName}` : mainName;
}

export default function ToolDetailPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToolDetails() {
      if (!toolId) return;

      setLoading(true);
      try {
        // 获取工具详情
        const { data: toolData, error: toolError } = await supabase
          .from('tools')
          .select('*')
          .eq('id', toolId)
          .single();

        if (toolError) throw toolError;

        if (toolData) {
          const transformedTool = {
            id: toolData.id,
            name: toolData.name,
            tagline: toolData.tagline,
            description: toolData.description,
            websiteUrl: toolData.website_url,
            category: toolData.category,
            tags: toolData.tags || [],
            pricingType: toolData.pricing_type,
            isChinaAvailable: toolData.is_china_available,
            isChineseSupported: toolData.is_chinese_supported,
            rating: toolData.rating || 0,
            ratingCount: toolData.rating_count || 0,
            viewCount: toolData.view_count || 0,
            screenshots: toolData.screenshots || [],
            createdAt: toolData.created_at,
            logoUrl: toolData.logo_url,
            main_category: toolData.main_category,
            sub_category: toolData.sub_category
          };

          setTool(transformedTool);

          // 获取相关工具（同分类的其他工具）
          const { data: relatedData, error: relatedError } = await supabase
            .from('tools')
            .select('*')
            .in('status', ['approved', 'active'])
            .eq('main_category', toolData.main_category)
            .neq('id', toolId)
            .order('view_count', { ascending: false })
            .limit(6);

          if (!relatedError && relatedData) {
            const transformedRelated = relatedData.map((item: any) => ({
              id: item.id,
              name: item.name,
              tagline: item.tagline,
              description: item.description,
              websiteUrl: item.website_url,
              category: item.category,
              tags: item.tags || [],
              pricingType: item.pricing_type,
              isChinaAvailable: item.is_china_available,
              isChineseSupported: item.is_chinese_supported,
              rating: item.rating || 0,
              ratingCount: item.rating_count || 0,
              viewCount: item.view_count || 0,
              screenshots: item.screenshots || [],
              createdAt: item.created_at,
              logoUrl: item.logo_url,
              main_category: item.main_category,
              sub_category: item.sub_category
            }));

            setRelatedTools(transformedRelated);
          }
        }
      } catch (error) {
        console.error('加载工具详情失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadToolDetails();
  }, [toolId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">工具不存在</h1>
          <Link to="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 生成工具简介（100-200字）
  const categoryDisplayName = getCategoryDisplayName(tool.main_category, tool.sub_category);
  const toolSummary = `${tool.name}是一款专业的${categoryDisplayName}工具，${tool.tagline}。该工具${tool.isChinaAvailable ? '支持国内使用' : '主要面向海外用户'}，${tool.isChineseSupported ? '提供中文界面和中文支持' : '主要以英文为主'}。凭借其${tool.tags.slice(0, 3).join('、')}等核心功能，${tool.name}在${categoryDisplayName}领域获得了${tool.rating}星的高评分，受到${tool.ratingCount}位用户的认可。`;

  return (
    <>
      <Helmet>
        <title>{tool.name} - {categoryDisplayName}工具 - AI创客</title>
        <meta name="description" content={toolSummary} />
        <meta name="keywords" content={`${tool.name},${categoryDisplayName},AI工具,${tool.tags.join(',')}`} />
        <link rel="canonical" href={`https://aimakerbox.com/tool/${tool.id}`} />
      </Helmet>

      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </div>

        {/* 工具详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 主要信息 */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              {tool.logoUrl && (
                <img 
                  src={tool.logoUrl} 
                  alt={`${tool.name} ${tool.category}工具`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{tool.tagline}</p>
                
                {/* 评分和统计 */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{tool.rating}</span>
                    <span>({tool.ratingCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{tool.viewCount.toLocaleString()} 浏览</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 工具简介 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">工具简介</h2>
              <p className="text-muted-foreground leading-relaxed">
                {toolSummary}
              </p>
            </div>

            {/* 详细描述 */}
            {tool.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">详细介绍</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>
            )}

            {/* 功能标签 */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">功能特点</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 访问按钮 */}
            <div className="flex gap-4">
              <Button asChild size="lg">
                <a 
                  href={tool.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  访问工具官网
                </a>
              </Button>
            </div>
          </div>

          {/* 侧边栏信息 */}
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">基本信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">分类</span>
                  <span>{categoryDisplayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">定价</span>
                  <span>{tool.pricingType === 'free' ? '免费' : tool.pricingType === 'paid' ? '付费' : tool.pricingType === 'freemium' ? '免费+付费' : '开源'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">国内可用</span>
                  <span>{tool.isChinaAvailable ? '是' : '否'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">中文支持</span>
                  <span>{tool.isChineseSupported ? '是' : '否'}</span>
                </div>
              </div>
            </div>

            {/* 截图 */}
            {tool.screenshots && tool.screenshots.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">工具截图</h3>
                <div className="space-y-3">
                  {tool.screenshots.map((screenshot, index) => (
                    <img 
                      key={index}
                      src={screenshot} 
                      alt={`${tool.name}截图${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 相关工具推荐 */}
        {relatedTools.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">相关工具推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool) => (
                <Link 
                  key={relatedTool.id} 
                  to={`/tool/${relatedTool.id}`}
                  className="block p-6 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {relatedTool.logoUrl && (
                      <img 
                        src={relatedTool.logoUrl} 
                        alt={`${relatedTool.name} ${relatedTool.category}工具`}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{relatedTool.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedTool.tagline}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{relatedTool.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{getCategoryDisplayName(relatedTool.main_category, relatedTool.sub_category)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
