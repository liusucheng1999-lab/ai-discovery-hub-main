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
  X,
  Pencil,
} from "lucide-react";
import { supabase, supabaseWithAuth } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  course_id?: string | null;
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
}

const EMPTY_LESSON_FORM: LessonFormState = {
  title: "",
  section_label: "",
  description: "",
  doc_embed_url: "",
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

  const validateDocUrl = (url: string, setError: (value: string) => void) => {
    if (!url.trim()) {
      setError("");
      return;
    }
    if (url.includes("feishu.cn") || url.includes("larksuite.com")) {
      setError("");
    } else {
      setError("请输入有效的飞书文档链接");
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
    const groups: Record<string, Lesson[]> = {};
    lessons.forEach((lesson) => {
      const section = lesson.section_label || "其他";
      if (!groups[section]) groups[section] = [];
      groups[section].push(lesson);
    });
    return groups;
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

  return (
    <>
      <Helmet>
        <title>{course.title} - AI创客</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回课程中心
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>

        <div className="flex gap-6 items-start">
          <aside
            className={`flex-shrink-0 transition-all duration-300 ${
              sidebarOpen ? "w-72" : "w-0 overflow-hidden"
            }`}
          >
            <div className="sticky top-24 w-72">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">
                  课程目录
                </h2>
                <div className="flex items-center gap-1">
                  {isLoggedIn && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setNewLessonOpen((prev) => !prev)}
                      aria-label="新增课节"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="收起目录"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-280px)] pr-2">
                <div className="space-y-1">
                  {Object.entries(groupedLessons).map(([section, sectionLessons]) => (
                    <Collapsible key={section} defaultOpen>
                      <CollapsibleTrigger className="group w-full flex items-center justify-between gap-2 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                          {section}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="mt-0.5 ml-2 space-y-0.5 border-l border-border pl-3">
                          {sectionLessons.map((lesson) => {
                            const isActive = activeLesson?.id === lesson.id;
                            return (
                              <button
                                key={lesson.id}
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
                                  <div className="min-w-0">
                                    <div className="leading-snug break-words">{lesson.title}</div>
                                    {lesson.description && (
                                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 break-words">
                                        {lesson.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>

              {isLoggedIn && newLessonOpen && (
                <div className="mt-4 rounded-lg border bg-card p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">新增课节</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => setNewLessonOpen(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <FormField label="课节名称">
                    <input
                      type="text"
                      value={newLessonForm.title}
                      onChange={(e) =>
                        setNewLessonForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="请输入课节名称"
                    />
                  </FormField>

                  <FormField label="所属章节">
                    <input
                      type="text"
                      value={newLessonForm.section_label}
                      onChange={(e) =>
                        setNewLessonForm((prev) => ({ ...prev, section_label: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="请输入章节名称"
                    />
                  </FormField>

                  <FormField label="课节描述">
                    <textarea
                      value={newLessonForm.description}
                      onChange={(e) =>
                        setNewLessonForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className={`${inputClass} min-h-[72px] resize-none`}
                      placeholder="简短描述本课节内容"
                    />
                  </FormField>

                  <FormField label="飞书文档链接" error={newLessonDocUrlError}>
                    <input
                      type="text"
                      value={newLessonForm.doc_embed_url}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewLessonForm((prev) => ({ ...prev, doc_embed_url: value }));
                        validateDocUrl(value, setNewLessonDocUrlError);
                      }}
                      className={inputClass}
                      placeholder="https://..."
                    />
                  </FormField>

                  <Button
                    onClick={createLesson}
                    disabled={creatingLesson}
                    size="sm"
                    className="w-full"
                  >
                    {creatingLesson ? "创建中..." : "创建课节"}
                  </Button>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {!sidebarOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="mb-4 gap-2"
              >
                <PanelLeftOpen className="h-4 w-4" />
                展开目录
              </Button>
            )}

            {activeLesson ? (
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold leading-snug">{activeLesson.title}</h2>
                    {activeLesson.description && (
                      <p className="text-muted-foreground text-sm mt-1">
                        {activeLesson.description}
                      </p>
                    )}
                  </div>
                  {isLoggedIn && (
                    <Button
                      variant={editPanelOpen ? "secondary" : "outline"}
                      size="sm"
                      className="flex-shrink-0 gap-1.5"
                      onClick={() => setEditPanelOpen((prev) => !prev)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {editPanelOpen ? "关闭编辑" : "编辑"}
                    </Button>
                  )}
                </div>

                {isLoggedIn && editPanelOpen && (
                  <div className="border-b bg-muted/30 px-6 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                      <FormField label="课节名称">
                        <input
                          type="text"
                          value={lessonForm.title}
                          onChange={(e) =>
                            setLessonForm((prev) => ({ ...prev, title: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="课节名称"
                        />
                      </FormField>

                      <FormField label="所属章节">
                        <input
                          type="text"
                          value={lessonForm.section_label}
                          onChange={(e) =>
                            setLessonForm((prev) => ({
                              ...prev,
                              section_label: e.target.value,
                            }))
                          }
                          className={inputClass}
                          placeholder="所属章节"
                        />
                      </FormField>

                      <div className="sm:col-span-2">
                        <FormField label="课节描述">
                          <textarea
                            value={lessonForm.description}
                            onChange={(e) =>
                              setLessonForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className={`${inputClass} min-h-[72px] resize-none`}
                            placeholder="简短描述本课节内容"
                          />
                        </FormField>
                      </div>

                      <div className="sm:col-span-2">
                        <FormField label="飞书文档链接" error={docUrlError}>
                          <input
                            type="text"
                            value={lessonForm.doc_embed_url}
                            onChange={(e) => {
                              const value = e.target.value;
                              setLessonForm((prev) => ({ ...prev, doc_embed_url: value }));
                              validateDocUrl(value, setDocUrlError);
                            }}
                            className={inputClass}
                            placeholder="https://..."
                          />
                        </FormField>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={saveLesson}
                        disabled={savingLesson || Boolean(docUrlError)}
                        className="gap-1.5"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {savingLesson ? "保存中..." : "保存更改"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          syncLessonForm(activeLesson);
                          setEditPanelOpen(false);
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                )}

                {activeLesson.video_embed_url && (
                  <div className="px-6 pt-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={activeLesson.video_embed_url}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {lessonForm.doc_embed_url ? (
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border">
                      <iframe
                        src={lessonForm.doc_embed_url}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-lg border flex items-center justify-center bg-muted/40">
                      <div className="text-center">
                        <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">暂无文档内容</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-16 text-center">
                <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-1">该课程还没有课节</h3>
                <p className="text-sm text-muted-foreground">请先为这个课程配置对应的课节数据</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
