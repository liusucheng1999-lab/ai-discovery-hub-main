import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

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
  const { isLoggedIn } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [draftVideoUrl, setDraftVideoUrl] = useState<string>("");
  const [draftDocUrl, setDraftDocUrl] = useState<string>("");

  const [videoUrlError, setVideoUrlError] = useState<string>("");
  const [docUrlError, setDocUrlError] = useState<string>("");

  const validateVideoUrl = (url: string) => {
    if (!url) {
      setVideoUrlError("");
      return;
    }
    // B站嵌入链接格式：https://player.bilibili.com/player.html?bvid=...
    if (url.includes("player.bilibili.com")) {
      setVideoUrlError("");
    } else if (url.includes("bilibili.com/video")) {
      setVideoUrlError("请使用 B站嵌入链接，格式如：https://player.bilibili.com/player.html?bvid=...");
    } else if (url.includes("feishu.cn") || url.includes("larksuite.com")) {
      setVideoUrlError("");
    } else {
      setVideoUrlError("请使用 B站或飞书视频嵌入链接");
    }
  };

  const validateDocUrl = (url: string) => {
    if (!url) {
      setDocUrlError("");
      return;
    }
    // 飞书文档嵌入链接格式：https://xxx.feishu.cn/doc/... 或 https://xxx.feishu.cn/wiki/...
    if (url.includes("feishu.cn") || url.includes("larksuite.com")) {
      setDocUrlError("");
    } else {
      setDocUrlError("请使用飞书文档链接（支持嵌入预览）");
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
        setDraftVideoUrl(target?.video_embed_url || "");
        setDraftDocUrl(target?.doc_embed_url || "");
      }
      setLoading(false);
    };

    fetchLessons();
  }, [id]);

  useEffect(() => {
    if (activeLesson) {
      setDraftVideoUrl(activeLesson.video_embed_url || "");
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

  const saveResources = async () => {
    if (!isLoggedIn || !activeLesson) return;
    if (!supabaseAdmin) {
      alert("管理员客户端未配置，无法保存");
      return;
    }
    try {
      const { error } = await supabaseAdmin
        .from("knowledge_lessons")
        .update({
          video_embed_url: draftVideoUrl.trim(),
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

      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">打工人进化论</h1>
          <p className="mt-3 text-lg text-muted-foreground">用 AI 把你从「执行者」变成「决策者」</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-xl border bg-card p-4 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-auto">
            <div className="text-sm font-semibold">课程目录</div>
            <div className="mt-3 space-y-4">
              {Object.entries(groupedLessons).map(([weekTitle, items]) => (
                <div key={weekTitle} className="space-y-2">
                  <div className="text-xs font-medium tracking-wide text-muted-foreground">
                    {weekTitle}
                  </div>
                  <div className="space-y-1">
                    {items.map((l) => {
                      const isActive = l.id === activeLesson.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setActiveLesson(l)}
                          className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                            isActive
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium leading-5">
                                {l.lesson_code ? `${l.lesson_code} · ` : ""}
                                {l.title}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-5">
                                {l.description}
                              </div>
                            </div>
                            {l.status === "draft" && (
                              <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800">
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
          </aside>

          <section className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">当前课程</div>
                <h2 className="text-xl font-semibold">{activeLesson.title}</h2>
                <p className="text-sm text-muted-foreground">{activeLesson.description}</p>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold">视频</div>
                {isLoggedIn && (
                  <div className="text-xs text-muted-foreground">管理员：可配置视频链接</div>
                )}
              </div>

              {isLoggedIn && (
                <div className="mt-3 space-y-3">
                  <input
                    value={draftVideoUrl}
                    onChange={(e) => {
                      setDraftVideoUrl(e.target.value);
                      validateVideoUrl(e.target.value);
                    }}
                    placeholder="粘贴 B站/飞书视频可嵌入链接"
                    className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                      videoUrlError ? "border-destructive" : ""
                    }`}
                  />
                  {videoUrlError && (
                    <p className="text-xs text-destructive">{videoUrlError}</p>
                  )}
                  <button
                    type="button"
                    onClick={saveResources}
                    className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    保存
                  </button>
                </div>
              )}

              <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                {draftVideoUrl ? (
                  <iframe
                    src={draftVideoUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="课程视频"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    暂无视频，请由管理员配置
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold">文档</div>
                {isLoggedIn && (
                  <div className="text-xs text-muted-foreground">管理员：可配置飞书文档链接</div>
                )}
              </div>

              {isLoggedIn && (
                <div className="mt-3 space-y-3">
                  <input
                    value={draftDocUrl}
                    onChange={(e) => {
                      setDraftDocUrl(e.target.value);
                      validateDocUrl(e.target.value);
                    }}
                    placeholder="粘贴飞书文档可预览链接（必须可嵌入）"
                    className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                      docUrlError ? "border-destructive" : ""
                    }`}
                  />
                  {docUrlError && (
                    <p className="text-xs text-destructive">{docUrlError}</p>
                  )}
                  <button
                    type="button"
                    onClick={saveResources}
                    className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    保存
                  </button>
                </div>
              )}

              <div className="mt-4 h-[560px] w-full overflow-hidden rounded-lg border bg-muted">
                {draftDocUrl ? (
                  <iframe
                    src={draftDocUrl}
                    className="h-full w-full"
                    title="课程文档"
                    allow="clipboard-read; clipboard-write"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    暂无文档，请由管理员配置
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
