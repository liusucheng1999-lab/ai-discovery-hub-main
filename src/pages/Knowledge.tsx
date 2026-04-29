import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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

export default function Knowledge() {
  const { isLoggedIn } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    video_embed_url: "",
    doc_embed_url: "",
    week_title: "",
    section_label: "",
    lesson_code: "",
    sort_order: 0,
    status: "draft",
    is_free: true,
  });

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
      }
      setLoading(false);
    };

    fetchLessons();
  }, []);

  const openEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditForm({
      title: lesson.title,
      description: lesson.description || "",
      video_embed_url: lesson.video_embed_url || "",
      doc_embed_url: lesson.doc_embed_url || "",
      week_title: lesson.week_title || "",
      section_label: lesson.section_label || "",
      lesson_code: lesson.lesson_code || "",
      sort_order: lesson.sort_order,
      status: lesson.status,
      is_free: lesson.is_free,
    });
  };

  const closeEdit = () => {
    setEditingLesson(null);
  };

  const saveEdit = async () => {
    if (!editingLesson) return;
    try {
      const { error } = await supabase
        .from("knowledge_lessons")
        .update({
          title: editForm.title,
          description: editForm.description,
          video_embed_url: editForm.video_embed_url.trim(),
          doc_embed_url: editForm.doc_embed_url.trim(),
          week_title: editForm.week_title,
          section_label: editForm.section_label,
          lesson_code: editForm.lesson_code,
          sort_order: editForm.sort_order,
          status: editForm.status,
          is_free: editForm.is_free,
        })
        .eq("id", editingLesson.id);

      if (error) {
        console.error("保存失败", error);
        alert("保存失败：" + error.message);
      } else {
        alert("保存成功");
        closeEdit();
        // 重新加载
        const { data: fresh } = await supabase
          .from("knowledge_lessons")
          .select("*")
          .order("sort_order", { ascending: true });
        if (fresh) setLessons(fresh);
      }
    } catch (e) {
      console.error("保存异常", e);
      alert("保存异常");
    }
  };

  const createNew = () => {
    const newLesson: Lesson = {
      id: "",
      title: "",
      description: "",
      video_embed_url: null,
      doc_embed_url: null,
      week_title: "",
      section_label: "",
      lesson_code: "",
      sort_order: lessons.length + 1,
      status: "draft",
      is_free: true,
      slug: null,
      cover: null,
      video_provider: null,
      doc_provider: null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setEditingLesson(newLesson);
    setEditForm({
      title: "",
      description: "",
      video_embed_url: "",
      doc_embed_url: "",
      week_title: "",
      section_label: "",
      lesson_code: "",
      sort_order: lessons.length + 1,
      status: "draft",
      is_free: true,
    });
  };

  const saveNew = async () => {
    try {
      const { error } = await supabase.from("knowledge_lessons").insert({
        title: editForm.title,
        description: editForm.description,
        video_embed_url: editForm.video_embed_url.trim(),
        doc_embed_url: editForm.doc_embed_url.trim(),
        week_title: editForm.week_title,
        section_label: editForm.section_label,
        lesson_code: editForm.lesson_code,
        sort_order: editForm.sort_order,
        status: editForm.status,
        is_free: editForm.is_free,
      });

      if (error) {
        console.error("创建失败", error);
        alert("创建失败：" + error.message);
      } else {
        alert("创建成功");
        closeEdit();
        // 重新加载
        const { data: fresh } = await supabase
          .from("knowledge_lessons")
          .select("*")
          .order("sort_order", { ascending: true });
        if (fresh) setLessons(fresh);
      }
    } catch (e) {
      console.error("创建异常", e);
      alert("创建异常");
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm("确定删除此课程吗？")) return;
    try {
      const { error } = await supabase.from("knowledge_lessons").delete().eq("id", id);
      if (error) {
        console.error("删除失败", error);
        alert("删除失败：" + error.message);
      } else {
        alert("删除成功");
        setLessons(lessons.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error("删除异常", e);
      alert("删除异常");
    }
  };

  const groupedLessons = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons.forEach((l) => {
      const key = l.week_title || "未分组";
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return map;
  }, [lessons]);

  return (
    <>
      <Helmet>
        <title>知识 - AI创客</title>
        <meta name="description" content="打工人进化论：用 AI 把你从「执行者」变成「决策者」。课程大纲与32节课结构化学习路径。" />
        <link rel="canonical" href="https://aimakerbox.com/knowledge" />
      </Helmet>

      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">打工人进化论</h1>
            <p className="mt-3 text-lg text-muted-foreground">用 AI 把你从「执行者」变成「决策者」</p>
          </div>
          {isLoggedIn && (
            <button
              type="button"
              onClick={createNew}
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              新建课程
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg">暂无课程数据</p>
            <p className="text-sm mt-2">请联系管理员配置课程</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLessons).map(([weekTitle, items]) => (
              <section key={weekTitle} className="rounded-xl border bg-card p-6">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground">{weekTitle}</div>
                  <h2 className="text-xl font-semibold">{weekTitle}</h2>
                </div>

                <div className="mt-6 space-y-4">
                  {items.map((l) => (
                    <div
                      key={l.id}
                      className="rounded-lg border bg-background p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link to={`/knowledge/lesson/${l.id}`} className="flex-1">
                          <div className="flex items-center gap-2">
                            {l.lesson_code && (
                              <span className="text-xs font-medium text-muted-foreground">
                                {l.lesson_code}
                              </span>
                            )}
                            <div className="text-sm font-medium leading-5">{l.title}</div>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-6">
                            {l.description}
                          </div>
                        </Link>
                        <div className="flex items-center gap-2">
                          {l.status === "draft" && (
                            <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800">
                              草稿
                            </span>
                          )}
                          {l.is_free && (
                            <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-800">
                              免费
                            </span>
                          )}
                          {isLoggedIn && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEdit(l)}
                                className="h-8 rounded-md border px-3 text-xs font-medium hover:bg-muted"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLesson(l.id)}
                                className="h-8 rounded-md border px-3 text-xs font-medium text-destructive hover:bg-destructive/10"
                              >
                                删除
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* 编辑对话框 */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingLesson.id ? "编辑课程" : "新建课程"}
              </h3>
              <button
                type="button"
                onClick={closeEdit}
                className="h-8 w-8 rounded-md hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">课程标题</label>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">课程编号（如 L1）</label>
                  <input
                    value={editForm.lesson_code}
                    onChange={(e) => setEditForm({ ...editForm, lesson_code: e.target.value })}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">课程描述</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">周标题</label>
                  <input
                    value={editForm.week_title}
                    onChange={(e) => setEditForm({ ...editForm, week_title: e.target.value })}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">章节标签</label>
                  <input
                    value={editForm.section_label}
                    onChange={(e) => setEditForm({ ...editForm, section_label: e.target.value })}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">视频嵌入链接（B站/飞书）</label>
                <input
                  value={editForm.video_embed_url}
                  onChange={(e) => {
                    setEditForm({ ...editForm, video_embed_url: e.target.value });
                    validateVideoUrl(e.target.value);
                  }}
                  placeholder="https://player.bilibili.com/player.html?bvid=..."
                  className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                    videoUrlError ? "border-destructive" : ""
                  }`}
                />
                {videoUrlError && (
                  <p className="text-xs text-destructive">{videoUrlError}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">文档嵌入链接（飞书）</label>
                <input
                  value={editForm.doc_embed_url}
                  onChange={(e) => {
                    setEditForm({ ...editForm, doc_embed_url: e.target.value });
                    validateDocUrl(e.target.value);
                  }}
                  placeholder="https://xxx.feishu.cn/doc/..."
                  className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${
                    docUrlError ? "border-destructive" : ""
                  }`}
                />
                {docUrlError && (
                  <p className="text-xs text-destructive">{docUrlError}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">排序</label>
                  <input
                    type="number"
                    value={editForm.sort_order}
                    onChange={(e) => setEditForm({ ...editForm, sort_order: Number(e.target.value) })}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">状态</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">是否免费</label>
                  <select
                    value={editForm.is_free.toString()}
                    onChange={(e) => setEditForm({ ...editForm, is_free: e.target.value === "true" })}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="true">免费</option>
                    <option value="false">付费</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEdit}
                className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted"
              >
                取消
              </button>
              <button
                type="button"
                onClick={editingLesson.id ? saveEdit : saveNew}
                className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                {editingLesson.id ? "保存" : "创建"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
