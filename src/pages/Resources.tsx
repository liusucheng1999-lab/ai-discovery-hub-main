import { Helmet } from "react-helmet-async";
import { useEffect, useState, useMemo } from "react";
import { supabase, supabaseWithAuth } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Download, BookOpen, Plus, Edit2, Trash2, Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  name: string;
  description: string;
  keywords: string;
  cover_url: string | null;
  sort_order: number;
  status: string;
}

const SITE_URL = "https://aimakerbox.com";
const QR_CODE_URL = import.meta.env.VITE_WECHAT_QR_CODE || "/qrcode.jpg";

export default function Resources() {
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isQROpen, setIsQROpen] = useState(false);

  // 编辑状态
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    keywords: "",
    cover_url: "",
    status: "published",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const query = isAdmin
        ? supabaseWithAuth.from("ai_resources").select("*").eq("is_deleted", false)
        : supabase.from("ai_resources").select("*").eq("status", "published").eq("is_deleted", false);

      const { data, error } = await query.order("sort_order", { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (resource: Resource) => {
    setSelectedResource(resource);
    setIsQROpen(true);
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;

    setUploading(true);
    try {
      await supabaseWithAuth.storage.createBucket("course-assets", { public: true });

      const fileExt = coverFile.name.split(".").pop();
      const fileName = `resource-cover-${Date.now()}.${fileExt}`;
      const filePath = `resource-covers/${fileName}`;

      const { error: uploadError } = await supabaseWithAuth.storage
        .from("course-assets")
        .upload(filePath, coverFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseWithAuth.storage
        .from("course-assets")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_url: publicUrl }));
      setCoverFile(null);
    } catch (err: any) {
      alert("上传失败：" + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      alert("请填写资源名称和简介");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabaseWithAuth
          .from("ai_resources")
          .update({
            name: formData.name,
            description: formData.description,
            keywords: formData.keywords,
            cover_url: formData.cover_url,
            status: formData.status,
          })
          .eq("id", editingId);

        if (error) throw error;
        alert("资源更新成功！");
      } else {
        const { error } = await supabaseWithAuth
          .from("ai_resources")
          .insert([
            {
              name: formData.name,
              description: formData.description,
              keywords: formData.keywords,
              cover_url: formData.cover_url,
              sort_order: resources.length,
              status: formData.status,
            },
          ]);

        if (error) throw error;
        alert("资源创建成功！");
      }

      setEditingId(null);
      setIsCreating(false);
      setFormData({
        name: "",
        description: "",
        keywords: "",
        cover_url: "",
        status: "published",
      });
      setCoverFile(null);
      loadResources();
    } catch (err: any) {
      alert("保存失败：" + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个资源吗？")) return;

    try {
      const { error } = await supabaseWithAuth
        .from("ai_resources")
        .update({ is_deleted: true })
        .eq("id", id);

      if (error) throw error;
      alert("资源已删除！");
      loadResources();
    } catch (err: any) {
      alert("删除失败：" + err.message);
    }
  };

  const structuredData = useMemo(() => {
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "AI创客",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "AI资源",
          item: `${SITE_URL}/resources`,
        },
      ],
    };

    const collectionData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "AI资源",
      description: "精选AI学习资源，包含书籍简介和学习指南，帮助你系统学习AI知识。",
      url: `${SITE_URL}/resources`,
      mainEntity: resources.map((resource) => ({
        "@type": "ScholarlyArticle",
        headline: resource.name,
        description: resource.description,
        keywords: resource.keywords,
        image: resource.cover_url,
        datePublished: "2024-01-01",
      })),
    };

    return [breadcrumbData, collectionData];
  }, [resources]);

  return (
    <>
      <Helmet>
        <title>AI资源 - AI创客</title>
        <meta
          name="description"
          content="精选AI学习资源，包含书籍简介和学习指南，帮助你系统学习AI知识。"
        />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={`${SITE_URL}/resources`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI资源 - AI创客" />
        <meta
          property="og:description"
          content="精选AI学习资源，包含书籍简介和学习指南。"
        />
        <meta property="og:url" content={`${SITE_URL}/resources`} />
        {structuredData.map((item, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(item)}
          </script>
        ))}
      </Helmet>

      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <BookOpen className="w-10 h-10" />
              AI资源
            </h1>
            <p className="text-lg text-muted-foreground">
              精选AI学习资源，包含书籍简介和学习指南，帮助你系统学习AI知识。
            </p>
          </div>
          {isAdmin && !editingId && !isCreating && (
            <Button
              onClick={() => {
                setIsCreating(true);
                setFormData({
                  name: "",
                  description: "",
                  keywords: "",
                  cover_url: "",
                  status: "published",
                });
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              添加资源
            </Button>
          )}
        </div>

        {/* 创建/编辑表单 */}
        {(editingId || isCreating) && isAdmin && (
          <div className="mb-8 p-6 border rounded-lg bg-card space-y-4">
            <h2 className="text-lg font-semibold">
              {editingId ? "编辑资源" : "添加新资源"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">资源名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  placeholder="输入资源名称"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">关键词（逗号分隔）</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  placeholder="如：AI,书籍,学习"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">资源简介</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none"
                placeholder="输入资源简介"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">封面图片</label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-40 rounded-lg border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.cover_url ? (
                    <img
                      src={formData.cover_url}
                      alt="封面"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <BookOpen className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-xs">暂无封面</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground"
                  />
                  {coverFile && (
                    <Button
                      onClick={handleCoverUpload}
                      disabled={uploading}
                      size="sm"
                      variant="outline"
                    >
                      {uploading ? "上传中..." : "上传封面"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setIsCreating(false);
                  setFormData({
                    name: "",
                    description: "",
                    keywords: "",
                    cover_url: "",
                    status: "published",
                  });
                }}
              >
                取消
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        )}

        {/* 资源列表 */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : resources.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">暂无资源</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {resources.map((resource) => (
              <Link
                key={resource.id}
                to={`/resources/${resource.id}`}
                className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-stretch h-48 gap-4">
                  {/* Cover Image */}
                  <div className="w-48 h-48 flex-shrink-0 bg-muted overflow-hidden">
                    {resource.cover_url ? (
                      <img
                        src={resource.cover_url}
                        alt={resource.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {resource.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto" onClick={(e) => e.preventDefault()}>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(resource);
                        }}
                        variant="default"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        获取资源
                      </Button>

                      {isAdmin && (
                        <>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingId(resource.id);
                              setFormData({
                                name: resource.name,
                                description: resource.description,
                                keywords: resource.keywords,
                                cover_url: resource.cover_url || "",
                                status: resource.status,
                              });
                            }}
                            size="icon"
                            variant="outline"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(resource.id);
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>获取资源</DialogTitle>
            <DialogDescription>
              扫描二维码关注公众号，输入关键词获取资源
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* QR Code Image */}
            <div className="flex justify-center">
              <img
                src={QR_CODE_URL}
                alt="公众号二维码"
                className="w-48 h-48 border rounded-lg"
              />
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-sm font-medium mb-2">
                扫码关注，输入以下关键词获取资源：
              </p>
              {selectedResource && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedResource.keywords
                    .split(",")
                    .map((keyword, idx) => (
                      <Badge key={idx} variant="outline">
                        {keyword.trim()}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            {/* Steps */}
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <p className="font-medium">获取步骤：</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>扫描上方二维码</li>
                <li>关注我们的公众号</li>
                <li>在公众号中输入关键词</li>
                <li>获取资源链接</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
