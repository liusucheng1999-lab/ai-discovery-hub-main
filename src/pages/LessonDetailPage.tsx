import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, FileText, List } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_embed_url: string | null;
  doc_embed_url: string | null;
  week_title: string | null;
  section_label: string | null;
  lesson_code: string | null;
  sort_order: number;
  status: string;
  is_free: boolean;
  slug: string | null;
  cover: string | null;
  video_provider: string | null;
  doc_provider: string | null;
  updated_at: string;
  created_at: string;
}

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [draftDocUrl, setDraftDocUrl] = useState<string>("");

  const [docUrlError, setDocUrlError] = useState<string>("");
  const [resourcePanelOpen, setResourcePanelOpen] = useState(false);

  const validateDocUrl = (url: string) => {
    if (!url) {
      setDocUrlError("");
      return;
    }
    // 支持飞书文档、HTML 文件路径（/xxx.html）及 https 链接
    if (
      url.includes("feishu.cn") ||
      url.includes("larksuite.com") ||
      url.startsWith("/") ||
      url.startsWith("https://")
    ) {
      setDocUrlError("");
    } else {
      setDocUrlError("请使用飞书文档链接、HTTPS 链接或以 / 开头的本地 HTML 路径");
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchLessons = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("knowledge_lessons")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("加载课程失败", error);
      } else {
        setLessons(data || []);
        const target = data?.find((l) => l.id === id) || data?.[0] || null;
        setActiveLesson(target);
        setDraftDocUrl(target?.doc_embed_url || "");
      }
      setLoading(false);
    };

    fetchLessons();
  }, [id]);

  useEffect(() => {
    if (activeLesson) {
      setDraftDocUrl(activeLesson.doc_embed_url || "");
    }
  }, [activeLesson]);

  const groupedLessons = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons.forEach((l) => {
      const key = l.week_title || "未分组";
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return map;
  }, [lessons]);

  const hasValidationError = Boolean(docUrlError);

  const saveResources = async () => {
    if (!isLoggedIn || !activeLesson) return;
    try {
      const { error } = await supabase
        .from("knowledge_lessons")
        .update({
          doc_embed_url: draftDocUrl.trim(),
        })
        .eq("id", activeLesson.id);

      if (error) {
        console.error("保存失败", error);
        alert("保存失败：" + error.message);
      } else {
        alert("保存成功");
        // 重新加载
        const { data: fresh } = await supabase
          .from("knowledge_lessons")
          .select("*")
          .order("sort_order", { ascending: true });
        if (fresh) {
          setLessons(fresh);
          const target = fresh.find((l) => l.id === activeLesson.id) || fresh[0];
          setActiveLesson(target || null);
        }
      }
    } catch (e) {
      console.error("保存异常", e);
      alert("保存异常");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </main>
    );
  }

  if (!activeLesson) {
    return (
      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="text-center text-muted-foreground">未找到课程</div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{activeLesson.title} - AI创客</title>
        <meta name="description" content={activeLesson.description || "AI课程"} />
      </Helmet>

      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12 flex flex-col" style={{ minHeight: '100vh' }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">打工人进化论</h1>
          <p className="mt-3 text-lg text-muted-foreground">用 AI 把你从「执行者」变成「决策者」</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[252px_minmax(0,1fr)] items-start">
          <aside className="order-2 rounded-2xl border bg-card/95 p-3 shadow-sm lg:order-1 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <List className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">课程目录</div>
                  <div className="text-xs text-muted-foreground">{lessons.length} 节内容</div>
                </div>
              </div>
            </div>

            <ScrollArea className="mt-3 h-[320px] pr-2 lg:h-[calc(100%-48px)]">
              <div className="space-y-4">
                {Object.entries(groupedLessons).map(([weekTitle, items]) => (
                  <div key={weekTitle} className="space-y-2">
                    <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {weekTitle}
                    </div>
                    <div className="space-y-1">
                      {items.map((l) => {
                        const isActive = l.id === activeLesson.id;
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => navigate(`/knowledge/lesson/${l.id}`)}
                            className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                              isActive
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-transparent bg-background hover:border-border hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-sm font-medium leading-5">
                                  {l.lesson_code ? `${l.lesson_code} · ` : ""}
                                  {l.title}
                                </div>
                                {l.section_label && (
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {l.section_label}
                                  </div>
                                )}
                              </div>
                              {l.status === "draft" && (
                                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                                  草稿
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <section className="order-1 min-w-0 lg:order-2 flex flex-col gap-4">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">当前课程</div>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">{activeLesson.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {activeLesson.description || "当前课时暂无补充说明。"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {activeLesson.lesson_code && (
                    <span className="rounded-full bg-muted px-3 py-1">{activeLesson.lesson_code}</span>
                  )}
                  {activeLesson.week_title && (
                    <span className="rounded-full bg-muted px-3 py-1">{activeLesson.week_title}</span>
                  )}
                  <span className="rounded-full bg-muted px-3 py-1">
                    {activeLesson.is_free ? "免费试看" : "正式内容"}
                  </span>
                </div>
              </div>
            </div>

            {isLoggedIn && (
              <Collapsible
                open={resourcePanelOpen}
                onOpenChange={setResourcePanelOpen}
                className="rounded-2xl border bg-card shadow-sm"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <div>
                    <div className="text-sm font-semibold">资源配置</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      管理员可在这里更新文档的嵌入链接
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      resourcePanelOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent className="border-t px-5 py-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">文档链接</label>
                        <span className={`text-[11px] rounded-full px-2 py-0.5 font-medium ${
                          draftDocUrl.startsWith("/") || draftDocUrl.includes(".html")
                            ? "bg-teal-100 text-teal-700"
                            : draftDocUrl.includes("feishu") || draftDocUrl.includes("larksuite")
                            ? "bg-blue-100 text-blue-700"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {draftDocUrl.startsWith("/") || draftDocUrl.includes(".html")
                            ? "HTML 文件"
                            : draftDocUrl.includes("feishu") || draftDocUrl.includes("larksuite")
                            ? "飞书文档"
                            : "未配置"}
                        </span>
                      </div>
                      <input
                        value={draftDocUrl}
                        onChange={(e) => {
                          setDraftDocUrl(e.target.value);
                          validateDocUrl(e.target.value);
                        }}
                        placeholder="HTML 路径（如 /lesson1.html）或飞书文档链接，有 HTML 优先使用"
                        className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                          docUrlError ? "border-destructive" : ""
                        }`}
                      />
                      {docUrlError && <p className="text-xs text-destructive">{docUrlError}</p>}
                      <p className="text-xs text-muted-foreground">
                        填 <code className="bg-muted px-1 rounded">/lesson1.html</code> 用本地 HTML · 填飞书链接用飞书预览
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      保存后立即生效。
                    </p>
                    <button
                      type="button"
                      onClick={saveResources}
                      disabled={hasValidationError}
                      className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      保存资源
                    </button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            <div className="rounded-2xl border bg-card p-3 shadow-sm flex-1 flex flex-col min-h-0">
              {/* 文档阅读区 */}
              <div className="flex flex-col overflow-hidden rounded-[20px] border bg-background shadow-sm flex-1 min-h-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="text-sm font-semibold">文档阅读区</div>
                    {draftDocUrl && (
                      <span className={`text-[11px] rounded-full px-2 py-0.5 font-medium ${
                        draftDocUrl.startsWith("/") || draftDocUrl.includes(".html")
                          ? "bg-teal-100 text-teal-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {draftDocUrl.startsWith("/") || draftDocUrl.includes(".html") ? "HTML" : "飞书"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="lg:hidden">可继续向下滑动查看内容</span>
                    <span className="hidden lg:inline">在下方区域直接滚动阅读</span>
                  </div>
                </div>
                <div className="overflow-hidden bg-muted/30" style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}>
                  <iframe
                    src="/lesson1.html"
                    className="h-full w-full border-0"
                    title="课程文档"
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
