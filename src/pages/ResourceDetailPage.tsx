import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase, supabaseWithAuth } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Download, Edit2, Trash2, Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function ResourceDetailPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

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
    loadResource();
  }, [resourceId]);

  const loadResource = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ai_resources")
        .select("*")
        .eq("id", resourceId)
        .eq("is_deleted", false)
        .single();

      if (error) throw error;
      setResource(data);
      setFormData({
        name: data.name,
        description: data.description,
        keywords: data.keywords,
        cover_url: data.cover_url || "",
        status: data.status,
      });
    } catch (err) {
      console.error("Failed to fetch resource:", err);
      navigate("/resources");
    } finally {
      setLoading(false);
    }
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
      const { error } = await supabaseWithAuth
        .from("ai_resources")
        .update({
          name: formData.name,
          description: formData.description,
          keywords: formData.keywords,
          cover_url: formData.cover_url,
          status: formData.status,
        })
        .eq("id", resourceId);

      if (error) throw error;
      alert("资源更新成功！");
      setIsEditing(false);
      loadResource();
    } catch (err: any) {
      alert("更新失败：" + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这个资源吗？")) return;

    try {
      const { error } = await supabaseWithAuth
        .from("ai_resources")
        .update({ is_deleted: true })
        .eq("id", resourceId);

      if (error) throw error;
      alert("资源已删除！");
      navigate("/resources");
    } catch (err: any) {
      alert("删除失败：" + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">资源不存在</p>
          <Link to="/resources" className="text-primary hover:underline">
            返回资源列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{resource.name} - AI创客</title>
        <meta name="description" content={resource.description.substring(0, 160)} />
        <link rel="canonical" href={`${SITE_URL}/resources/${resourceId}`} />
        <meta property="og:title" content={resource.name} />
        <meta property="og:description" content={resource.description.substring(0, 160)} />
        {resource.cover_url && <meta property="og:image" content={resource.cover_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            headline: resource.name,
            description: resource.description,
            keywords: resource.keywords,
            image: resource.cover_url,
          })}
        </script>
      </Helmet>

      <main className="mx-auto max-w-[1000px] px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/resources"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            返回资源列表
          </Link>

          {isLoggedIn && !isEditing && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </Button>
            </div>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && isLoggedIn && (
          <div className="mb-8 p-6 border rounded-lg bg-card space-y-4">
            <h2 className="text-lg font-semibold">编辑资源</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium block">资源名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">资源简介</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">关键词（逗号分隔）</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">封面图片</label>
              <div className="flex items-start gap-4">
                <div className="w-40 h-56 rounded-lg border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.cover_url ? (
                    <img
                      src={formData.cover_url}
                      alt="封面"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <span>暂无封面</span>
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
                  setIsEditing(false);
                  loadResource();
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

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Cover */}
          <div>
            {resource.cover_url && (
              <div className="rounded-lg overflow-hidden border sticky top-24">
                <img
                  src={resource.cover_url}
                  alt={resource.name}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Right - Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{resource.name}</h1>
              <div className="flex gap-2 items-center flex-wrap">
                <Badge
                  variant={resource.status === "published" ? "default" : "outline"}
                >
                  {resource.status === "published" ? "已发布" : "草稿"}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                {resource.description}
              </div>
            </div>

            {/* Keywords */}
            {resource.keywords && (
              <div>
                <h3 className="font-semibold mb-3">关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.keywords.split(",").map((keyword, idx) => (
                    <Badge key={idx} variant="secondary">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={() => setIsQROpen(true)}
                size="lg"
                className="w-full md:w-auto gap-2"
              >
                <Download className="w-5 h-5" />
                获取资源
              </Button>
            </div>
          </div>
        </div>
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
            <div className="flex justify-center">
              <img
                src={QR_CODE_URL}
                alt="公众号二维码"
                className="w-48 h-48 border rounded-lg"
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium mb-2">扫码关注，输入以下关键词获取资源：</p>
              {resource && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {resource.keywords.split(",").map((keyword, idx) => (
                    <Badge key={idx} variant="outline">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

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
