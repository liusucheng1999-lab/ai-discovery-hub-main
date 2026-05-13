import { Helmet } from "react-helmet-async";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronDown,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Plus,
  Save,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Maximize2,
  ImagePlus,
  Eye,
  X,
} from "lucide-react";
import { supabase, supabaseWithAuth } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CodeMirror from "@uiw/react-codemirror";
import { html as cmHtmlLang } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";

interface Lesson {
  id: string;
  course_id?: string | null;
  title: string;
  description: string | null;
  video_embed_url: string | null;
  doc_embed_url: string | null;
  html_content: string | null;
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

interface Course {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
}

interface LessonFormState {
  title: string;
  section_label: string;
  description: string;
  doc_embed_url: string;
  html_content: string;
}

const EMPTY_LESSON_FORM: LessonFormState = {
  title: "",
  section_label: "",
  description: "",
  doc_embed_url: "",
  html_content: "",
};

function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 text-sm bg-background border border-border rounded-md " +
  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent " +
  "placeholder:text-muted-foreground transition-shadow";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { isLoggedIn } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonFormState>(EMPTY_LESSON_FORM);
  const [newLessonForm, setNewLessonForm] = useState<LessonFormState>(EMPTY_LESSON_FORM);
  const [docUrlError, setDocUrlError] = useState<string>("");
  const [newLessonDocUrlError, setNewLessonDocUrlError] = useState<string>("");
  const [savingLesson, setSavingLesson] = useState(false);
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [newLessonOpen, setNewLessonOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [movingSection, setMovingSection] = useState<string | null>(null);
  const [htmlEditorOpen, setHtmlEditorOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"split" | "code" | "preview">("split");
  const [uploadingImage, setUploadingImage] = useState(false);

  const validateDocUrl = (url: string, setError: (value: string) => void) => {
    if (!url.trim()) {
      setError("");
      return;
    }
    if (
      url.includes("feishu.cn") ||
      url.includes("larksuite.com") ||
      url.startsWith("/") ||
      url.startsWith("https://")
    ) {
      setError("");
    } else {
      setError("请输入飞书链接、HTTPS 链接或以 / 开头的本地 HTML 路径");
    }
  };

  const syncLessonForm = (lesson: Lesson | null) => {
    if (!lesson) {
      setLessonForm(EMPTY_LESSON_FORM);
      setDocUrlError("");
      return;
    }
    setLessonForm({
      title: lesson.title || "",
      section_label: lesson.section_label || "",
      description: lesson.description || "",
      doc_embed_url: lesson.doc_embed_url || "",
      html_content: lesson.html_content || "",
    });
    validateDocUrl(lesson.doc_embed_url || "", setDocUrlError);
  };

  const loadLessonsForCourse = async (currentCourseId: string, courseTitle?: string) => {
    const { data: lessonsByCourseId, error: lessonsByCourseIdError } = await supabase
      .from("knowledge_lessons")
      .select("*")
      .eq("course_id", currentCourseId)
      .order("sort_order", { ascending: true });

    if (!lessonsByCourseIdError && lessonsByCourseId && lessonsByCourseId.length > 0) {
      return lessonsByCourseId;
    }

    if (lessonsByCourseIdError) {
      console.warn("按 course_id 获取课节失败，回退到旧的课程匹配逻辑", lessonsByCourseIdError);
    } else {
      console.warn("按 course_id 未匹配到课节，回退到旧的课程匹配逻辑", {
        currentCourseId,
        courseTitle,
      });
    }

    const { data: allLessons, error: allLessonsError } = await supabase
      .from("knowledge_lessons")
      .select("*")
      .order("sort_order", { ascending: true });

    if (allLessonsError) throw allLessonsError;
    if (!courseTitle) return allLessons || [];

    const normalizedTitle = courseTitle.trim().toLowerCase();
    const matchedLessons = (allLessons || []).filter((lesson) => {
      const weekTitle = lesson.week_title?.trim().toLowerCase() || "";
      const sectionLabel = lesson.section_label?.trim().toLowerCase() || "";
      return weekTitle === normalizedTitle || sectionLabel === normalizedTitle;
    });

    return matchedLessons.length > 0 ? matchedLessons : [];
  };

  const refreshCourseData = async (currentCourseId: string) => {
    const { data: courseData, error: courseError } = await supabase
      .from("course_settings")
      .select("*")
      .eq("id", currentCourseId)
      .single();

    if (courseError) {
      console.error("获取课程信息失败", courseError);
      setCourse(null);
      setLessons([]);
      setActiveLesson(null);
      syncLessonForm(null);
      return;
    }

    setCourse(courseData);

    try {
      const lessonData = await loadLessonsForCourse(currentCourseId, courseData?.title);
      setLessons(lessonData || []);

      setActiveLesson((prev) => {
        const nextActive =
          lessonData?.find((lesson) => lesson.id === prev?.id) || lessonData?.[0] || null;
        syncLessonForm(nextActive);
        return nextActive;
      });
    } catch (lessonError) {
      console.error("获取课节失败", lessonError);
      setLessons([]);
      setActiveLesson(null);
      syncLessonForm(null);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!isLoggedIn) {
      alert("请先登录后再上传图片");
      return null;
    }
    setUploadingImage(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const filename = `lesson-images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabaseWithAuth.storage
        .from("course-assets")
        .upload(filename, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabaseWithAuth.storage.from("course-assets").getPublicUrl(filename);
      return data.publicUrl;
    } catch (e: any) {
      console.error("图片上传失败", e);
      alert(`图片上传失败：${e.message || e}`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) return;
    const tag = `<img src="${url}" alt="${file.name.replace(/\.[^.]+$/, "")}" style="max-width:100%;height:auto;" />`;
    setLessonForm((prev) => ({
      ...prev,
      html_content: prev.html_content ? `${prev.html_content}\n${tag}\n` : tag,
    }));
  };

  const saveLesson = async () => {
    if (!isLoggedIn || !activeLesson) return;
    if (!lessonForm.title.trim()) {
      alert("请输入课节名称");
      return;
    }
    if (docUrlError) {
      alert(docUrlError);
      return;
    }

    setSavingLesson(true);
    try {
      const payload = {
        title: lessonForm.title.trim(),
        section_label: lessonForm.section_label.trim() || null,
        description: lessonForm.description.trim() || null,
        doc_embed_url: lessonForm.doc_embed_url.trim() || null,
        html_content: lessonForm.html_content.trim() || null,
        week_title: activeLesson.week_title,
      };

      const { error } = await supabaseWithAuth
        .from("knowledge_lessons")
        .update(payload)
        .eq("id", activeLesson.id);

      if (error) throw error;

      const updatedActiveLesson: Lesson = {
        ...activeLesson,
        ...payload,
      };

      setLessons((prev) =>
        prev.map((lesson) => (lesson.id === activeLesson.id ? updatedActiveLesson : lesson))
      );
      setActiveLesson(updatedActiveLesson);
      setEditPanelOpen(false);
      alert("课节信息已保存");
    } catch (error: any) {
      console.error("保存课节失败", error);
      alert(`保存失败：${error.message}`);
    } finally {
      setSavingLesson(false);
    }
  };

  const createLesson = async () => {
    if (!isLoggedIn || !course) return;
    if (!newLessonForm.title.trim()) {
      alert("请输入课节名称");
      return;
    }
    if (newLessonDocUrlError) {
      alert(newLessonDocUrlError);
      return;
    }

    setCreatingLesson(true);
    try {
      const nextSortOrder =
        lessons.length > 0 ? Math.max(...lessons.map((lesson) => lesson.sort_order || 0)) + 1 : 1;

      const payload = {
        course_id: course.id,
        title: newLessonForm.title.trim(),
        section_label: newLessonForm.section_label.trim() || "未分组",
        description: newLessonForm.description.trim() || null,
        doc_embed_url: newLessonForm.doc_embed_url.trim() || null,
        week_title: course.title,
        sort_order: nextSortOrder,
        status: "published",
        is_free: true,
      };

      const { data, error } = await supabaseWithAuth
        .from("knowledge_lessons")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw error;

      const createdLesson = data as Lesson;
      const nextLessons = [...lessons, createdLesson].sort((a, b) => a.sort_order - b.sort_order);
      setLessons(nextLessons);
      setActiveLesson(createdLesson);
      syncLessonForm(createdLesson);
      setNewLessonForm(EMPTY_LESSON_FORM);
      setNewLessonDocUrlError("");
      setNewLessonOpen(false);
      alert("新课节创建成功");
    } catch (error: any) {
      console.error("创建课节失败", error);
      alert(`创建失败：${error.message}`);
    } finally {
      setCreatingLesson(false);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!isLoggedIn) return;
    if (!window.confirm("确定删除这节课？此操作不可恢复。")) return;
    try {
      const { error } = await supabaseWithAuth.from("knowledge_lessons").delete().eq("id", lessonId);
      if (error) throw error;
      const nextLessons = lessons.filter((l) => l.id !== lessonId);
      setLessons(nextLessons);
      if (activeLesson?.id === lessonId) {
        const next = nextLessons[0] || null;
        setActiveLesson(next);
        syncLessonForm(next);
      }
    } catch (error: any) {
      alert(`删除失败：${error.message}`);
    }
  };

  const moveLesson = async (lessonId: string, direction: "up" | "down") => {
    if (!isLoggedIn) return;
    const sorted = [...lessons].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((l) => l.id === lessonId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    const aOrder = a.sort_order;
    const bOrder = b.sort_order;

    try {
      await supabaseWithAuth.from("knowledge_lessons").update({ sort_order: bOrder }).eq("id", a.id);
      await supabaseWithAuth.from("knowledge_lessons").update({ sort_order: aOrder }).eq("id", b.id);
      setLessons((prev) =>
        prev.map((l) => {
          if (l.id === a.id) return { ...l, sort_order: bOrder };
          if (l.id === b.id) return { ...l, sort_order: aOrder };
          return l;
        })
      );
    } catch (error: any) {
      alert(`排序失败：${error.message}`);
    }
  };

  const moveSection = async (sectionName: string, direction: "up" | "down") => {
    if (!isLoggedIn) return;

    const sortedLessons = [...lessons].sort((a, b) => a.sort_order - b.sort_order);
    const sectionGroups = sortedLessons.reduce<Array<{ name: string; lessons: Lesson[] }>>((acc, lesson) => {
      const currentSectionName = lesson.section_label || "其他";
      const existingGroup = acc.find((group) => group.name === currentSectionName);

      if (existingGroup) {
        existingGroup.lessons.push(lesson);
      } else {
        acc.push({ name: currentSectionName, lessons: [lesson] });
      }

      return acc;
    }, []);

    const currentIndex = sectionGroups.findIndex((group) => group.name === sectionName);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex === -1 || targetIndex < 0 || targetIndex >= sectionGroups.length) return;

    const reorderedGroups = [...sectionGroups];
    const [currentGroup] = reorderedGroups.splice(currentIndex, 1);
    reorderedGroups.splice(targetIndex, 0, currentGroup);

    const nextLessons = reorderedGroups
      .flatMap((group) => group.lessons)
      .map((lesson, index) => ({ ...lesson, sort_order: index + 1 }));

    setMovingSection(sectionName);
    try {
      const updates = nextLessons
        .filter((lesson) => {
          const originalLesson = lessons.find((item) => item.id === lesson.id);
          return originalLesson?.sort_order !== lesson.sort_order;
        })
        .map((lesson) =>
          supabaseWithAuth
            .from("knowledge_lessons")
            .update({ sort_order: lesson.sort_order })
            .eq("id", lesson.id)
        );

      const results = await Promise.all(updates);
      const failedUpdate = results.find((result) => result.error);
      if (failedUpdate?.error) throw failedUpdate.error;

      setLessons(nextLessons);
    } catch (error: any) {
      console.error("更新章节排序失败", error);
      alert(`章节排序失败：${error.message}`);
    } finally {
      setMovingSection(null);
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      setLoading(true);
      await refreshCourseData(courseId);
      setLoading(false);
    };
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    syncLessonForm(activeLesson);
  }, [activeLesson]);

  const groupedLessons = useMemo(() => {
    const sortedLessons = [...lessons].sort((a, b) => a.sort_order - b.sort_order);
    return sortedLessons.reduce<Array<{ section: string; lessons: Lesson[] }>>((groups, lesson) => {
      const sectionName = lesson.section_label || "其他";
      const existingGroup = groups.find((group) => group.section === sectionName);

      if (existingGroup) {
        existingGroup.lessons.push(lesson);
      } else {
        groups.push({ section: sectionName, lessons: [lesson] });
      }

      return groups;
    }, []);
  }, [lessons]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">课程未找到</h1>
          <Link to="/knowledge">
            <Button>返回课程中心</Button>
          </Link>
        </div>
      </main>
    );
  }

  const isHtmlUrl = (url: string) => url.startsWith("/") || url.includes(".html");
  const isFirstLesson = lessons[0]?.id === activeLesson?.id;
  const effectiveDocUrl =
    isFirstLesson && !isHtmlUrl(lessonForm.doc_embed_url)
      ? "/lessons/w1l1.html"
      : lessonForm.doc_embed_url;
  const inlineHtml = activeLesson?.html_content?.trim() || "";
  const hasInlineHtml = inlineHtml.length > 0;

  return (
    <>
      <Helmet>
        <title>{course.title} - AI创客</title>
        <meta name="description" content={course.description} />
      </Helmet>

      {/* 全屏双栏布局，紧贴 navbar 下方 */}
      <div className="fixed inset-0 top-16 flex overflow-hidden">

        {/* 左侧目录 */}
        <aside
          className={`flex-shrink-0 flex flex-col border-r bg-card transition-all duration-300 overflow-hidden ${
            sidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b">
            <Link
              to="/knowledge"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回
            </Link>
            <div className="flex items-center gap-1">
              {isLoggedIn && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setNewLessonOpen((prev) => !prev)}
                  aria-label="新增课节"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setSidebarOpen(false)}
                aria-label="收起目录"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="px-4 py-3 border-b">
            <div className="text-sm font-semibold leading-snug">{course.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{lessons.length} 节</div>
          </div>

          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-1">
              {groupedLessons.map(({ section, lessons: sectionLessons }, sectionIndex) => (
                <Collapsible key={`${section}-${sectionIndex}`} defaultOpen>
                  <div className="group flex items-center gap-1">
                    <CollapsibleTrigger className="flex-1 w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-left">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                        {section}
                      </span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    {isLoggedIn && groupedLessons.length > 1 && (
                      <div className="hidden group-hover:flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveSection(section, "up")}
                          disabled={sectionIndex === 0 || movingSection !== null}
                          className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          title="章节上移"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(section, "down")}
                          disabled={sectionIndex === groupedLessons.length - 1 || movingSection !== null}
                          className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          title="章节下移"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <CollapsibleContent>
                    <div className="mt-0.5 ml-2 space-y-0.5 border-l border-border pl-3">
                      {sectionLessons.map((lesson) => {
                        const isActive = activeLesson?.id === lesson.id;
                        const sorted = [...lessons].sort((a, b) => a.sort_order - b.sort_order);
                        const globalIdx = sorted.findIndex((l) => l.id === lesson.id);
                        return (
                          <div key={lesson.id} className="group relative">
                            <button
                              onClick={() => {
                                setActiveLesson(lesson);
                                setEditPanelOpen(false);
                              }}
                              className={`w-full text-left px-2 py-2 rounded-md transition-colors text-sm ${
                                isActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <FileText
                                  className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${
                                    isActive ? "text-primary" : "text-muted-foreground"
                                  }`}
                                />
                                <div className="min-w-0 pr-6">
                                  <div className="leading-snug break-words text-sm">{lesson.title}</div>
                                  {lesson.description && (
                                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 break-words">
                                      {lesson.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                            {isLoggedIn && (
                              <div className="absolute right-1 top-1 hidden group-hover:flex flex-col gap-0.5">
                                <button
                                  onClick={(e) => { e.stopPropagation(); moveLesson(lesson.id, "up"); }}
                                  disabled={globalIdx === 0}
                                  className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="上移"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); moveLesson(lesson.id, "down"); }}
                                  disabled={globalIdx === sorted.length - 1}
                                  className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="下移"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteLesson(lesson.id); }}
                                  className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                  title="删除"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

          </ScrollArea>
        </aside>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* 顶部细条：课节标题 + 操作按钮 */}
          <div className="flex items-center gap-3 border-b bg-card px-4 py-2 flex-shrink-0">
            {!sidebarOpen && (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSidebarOpen(true)}>
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold truncate">{activeLesson?.title ?? course.title}</span>
              {activeLesson?.description && (
                <span className="ml-2 text-xs text-muted-foreground truncate hidden sm:inline">
                  {activeLesson.description}
                </span>
              )}
            </div>
            {isLoggedIn && activeLesson && (
              <Button
                variant={editPanelOpen ? "secondary" : "outline"}
                size="sm"
                className="flex-shrink-0 gap-1.5 h-7 text-xs"
                onClick={() => setEditPanelOpen((prev) => !prev)}
              >
                <Pencil className="h-3 w-3" />
                {editPanelOpen ? "关闭编辑" : "编辑"}
              </Button>
            )}
          </div>

          {/* 编辑面板（折叠） */}
          {isLoggedIn && editPanelOpen && activeLesson && (
            <div className="border-b bg-muted/40 px-4 py-3 flex-shrink-0">
              <div className="flex flex-wrap gap-3 max-w-3xl">
                <div className="flex-1 min-w-36">
                  <FormField label="课节名称">
                    <input type="text" value={lessonForm.title}
                      onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                      className={inputClass} placeholder="课节名称" />
                  </FormField>
                </div>
                <div className="flex-1 min-w-36">
                  <FormField label="所属章节">
                    <input type="text" value={lessonForm.section_label}
                      onChange={(e) => setLessonForm((prev) => ({ ...prev, section_label: e.target.value }))}
                      className={inputClass} placeholder="所属章节" />
                  </FormField>
                </div>
                <div className="w-full">
                  <FormField label="课节描述">
                    <textarea
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                      className={`${inputClass} min-h-[64px] resize-none`}
                      placeholder="简短描述本课节内容（选填）"
                    />
                  </FormField>
                </div>
                <div className="w-full">
                  <FormField label="文档链接（/lesson.html、飞书或 HTTPS）" error={docUrlError}>
                    <input type="text" value={lessonForm.doc_embed_url}
                      onChange={(e) => { setLessonForm((prev) => ({ ...prev, doc_embed_url: e.target.value })); validateDocUrl(e.target.value, setDocUrlError); }}
                      className={inputClass} placeholder="/lessons/w1l1.html 或 https://xxx.feishu.cn/..." />
                  </FormField>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      HTML 内容（填写后优先于文档链接）
                    </label>
                    <div className="flex gap-1.5">
                      <label className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded border bg-background hover:bg-muted cursor-pointer transition-colors">
                        <ImagePlus className="h-3 w-3" />
                        {uploadingImage ? "上传中..." : "插入图片"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-[11px] gap-1"
                        onClick={() => setHtmlEditorOpen(true)}
                      >
                        <Maximize2 className="h-3 w-3" />
                        全屏编辑
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded overflow-hidden">
                    <CodeMirror
                      value={lessonForm.html_content}
                      height="240px"
                      theme={oneDark}
                      extensions={[cmHtmlLang()]}
                      onChange={(v) => setLessonForm((prev) => ({ ...prev, html_content: v }))}
                      basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }}
                    />
                  </div>
                  {lessonForm.html_content.trim() && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      ✓ 内嵌 HTML 已启用（{lessonForm.html_content.length.toLocaleString()} 字符）。清空此字段后回退到文档链接。
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={saveLesson} disabled={savingLesson || Boolean(docUrlError)} className="gap-1.5 h-7 text-xs">
                  <Save className="h-3 w-3" />
                  {savingLesson ? "保存中..." : "保存"}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs"
                  onClick={() => { syncLessonForm(activeLesson); setEditPanelOpen(false); }}>
                  取消
                </Button>
              </div>
            </div>
          )}

          {/* iframe 全屏内容区 */}
          <div className="flex-1 overflow-hidden">
            {activeLesson ? (
              hasInlineHtml ? (
                <iframe
                  key={`inline-${activeLesson.id}-${activeLesson.updated_at}`}
                  srcDoc={inlineHtml}
                  className="w-full h-full border-0"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  allow="accelerometer; autoplay; clipboard-write; clipboard-read; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : effectiveDocUrl ? (
                <iframe
                  key={effectiveDocUrl}
                  src={effectiveDocUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; clipboard-read; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">暂无文档内容</p>
                    {isLoggedIn && (
                      <p className="text-xs text-muted-foreground mt-1">点击右上角「编辑」配置文档链接</p>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                  <h3 className="font-semibold mb-1">该课程还没有课节</h3>
                  <p className="text-sm text-muted-foreground">请先为这个课程配置对应的课节数据</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 新增课节弹窗 */}
      <Dialog open={newLessonOpen} onOpenChange={setNewLessonOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新增课节</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <FormField label="课节名称">
              <input
                type="text"
                value={newLessonForm.title}
                onChange={(e) => setNewLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                className={inputClass}
                placeholder="请输入课节名称"
                autoFocus
              />
            </FormField>
            <FormField label="所属章节">
              <input
                type="text"
                value={newLessonForm.section_label}
                onChange={(e) => setNewLessonForm((prev) => ({ ...prev, section_label: e.target.value }))}
                className={inputClass}
                placeholder="章节名称，如「第一章 · 心智重建」"
              />
            </FormField>
            <FormField label="课节描述">
              <textarea
                value={newLessonForm.description}
                onChange={(e) => setNewLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                className={`${inputClass} min-h-[72px] resize-none`}
                placeholder="简短描述本课节内容（选填）"
              />
            </FormField>
            <FormField label="文档链接" error={newLessonDocUrlError}>
              <input
                type="text"
                value={newLessonForm.doc_embed_url}
                onChange={(e) => {
                  setNewLessonForm((prev) => ({ ...prev, doc_embed_url: e.target.value }));
                  validateDocUrl(e.target.value, setNewLessonDocUrlError);
                }}
                className={inputClass}
                placeholder="/lesson1.html 或飞书文档链接"
              />
            </FormField>
            <div className="flex gap-2 pt-2">
              <Button onClick={createLesson} disabled={creatingLesson} className="flex-1">
                {creatingLesson ? "创建中..." : "创建课节"}
              </Button>
              <Button variant="outline" onClick={() => { setNewLessonOpen(false); setNewLessonForm(EMPTY_LESSON_FORM); setNewLessonDocUrlError(""); }}>
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 全屏 HTML 编辑器 */}
      <Dialog open={htmlEditorOpen} onOpenChange={setHtmlEditorOpen}>
        <DialogContent
          className="!max-w-none w-screen h-screen p-0 gap-0 border-0 rounded-none flex flex-col sm:rounded-none"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-sm font-semibold">编辑 HTML — {activeLesson?.title || ""}</DialogTitle>
              <div className="flex rounded border bg-background overflow-hidden">
                {(["split", "code", "preview"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPreviewMode(m)}
                    className={`px-2.5 py-1 text-[11px] transition-colors ${previewMode === m ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    {m === "split" ? "分屏" : m === "code" ? "仅代码" : "仅预览"}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">{lessonForm.html_content.length.toLocaleString()} 字符</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded border bg-background hover:bg-muted cursor-pointer transition-colors">
                <ImagePlus className="h-3 w-3" />
                {uploadingImage ? "上传中..." : "插入图片"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  await saveLesson();
                }}
                disabled={savingLesson}
                className="h-7 text-xs gap-1"
              >
                <Save className="h-3 w-3" />
                {savingLesson ? "保存中..." : "保存"}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setHtmlEditorOpen(false)}
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 flex overflow-hidden">
            {previewMode !== "preview" && (
              <div className={`${previewMode === "split" ? "w-1/2 border-r" : "w-full"} overflow-hidden bg-[#282c34]`}>
                <CodeMirror
                  value={lessonForm.html_content}
                  height="100%"
                  style={{ height: "100%" }}
                  theme={oneDark}
                  extensions={[cmHtmlLang()]}
                  onChange={(v) => setLessonForm((prev) => ({ ...prev, html_content: v }))}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    highlightActiveLine: true,
                    autocompletion: true,
                    bracketMatching: true,
                  }}
                  className="h-full text-[13px]"
                />
              </div>
            )}
            {previewMode !== "code" && (
              <div className={`${previewMode === "split" ? "w-1/2" : "w-full"} bg-white overflow-hidden flex flex-col`}>
                <div className="px-3 py-1.5 border-b text-[11px] text-muted-foreground flex items-center gap-1 bg-muted/30">
                  <Eye className="h-3 w-3" /> 实时预览
                </div>
                <iframe
                  key={`preview-${lessonForm.html_content.length}`}
                  srcDoc={lessonForm.html_content || "<p style='padding:24px;color:#999;font-family:sans-serif;'>暂无内容，请在左侧编辑。</p>"}
                  className="flex-1 w-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
