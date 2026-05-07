import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, FileText, List, ArrowLeft, Plus, Save } from "lucide-react";
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

    if (allLessonsError) {
      throw allLessonsError;
    }

    if (!courseTitle) {
      return allLessons || [];
    }

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
        const nextActive = lessonData?.find((lesson) => lesson.id === prev?.id) || lessonData?.[0] || null;
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

      if (error) {
        throw error;
      }

      const updatedActiveLesson: Lesson = {
        ...activeLesson,
        ...payload,
      };

      setLessons((prev) =>
        prev.map((lesson) => (lesson.id === activeLesson.id ? updatedActiveLesson : lesson))
      );
      setActiveLesson(updatedActiveLesson);
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

      if (error) {
        throw error;
      }

      const nextLessons = [...lessons, data as Lesson].sort((a, b) => a.sort_order - b.sort_order);
      setLessons(nextLessons);
      setActiveLesson(data as Lesson);
      syncLessonForm(data as Lesson);
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
      if (!groups[section]) {
        groups[section] = [];
      }
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
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              返回课程中心
            </button>
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
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回课程中心
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">课程目录</h2>
                </div>
                {isLoggedIn && (
                  <Button size="sm" variant="outline" onClick={() => setNewLessonOpen((prev) => !prev)}>
                    <Plus className="h-4 w-4 mr-1" />
                    新增
                  </Button>
                )}
              </div>

              <ScrollArea className="h-[420px] border rounded-lg p-4">
                <div className="space-y-2">
                  {Object.entries(groupedLessons).map(([section, sectionLessons]) => (
                    <Collapsible key={section} defaultOpen>
                      <CollapsibleTrigger className="w-full flex items-start justify-between gap-2 p-2 hover:bg-muted rounded text-left">
                        <span className="font-medium whitespace-normal break-words">{section}</span>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-2 space-y-1">
                          {sectionLessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className={`w-full text-left p-3 rounded transition-colors ${
                                activeLesson?.id === lesson.id
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium whitespace-normal break-words leading-6">
                                    {lesson.title}
                                  </div>
                                  {lesson.description && (
                                    <div className="text-sm opacity-70 whitespace-normal break-words line-clamp-2">
                                      {lesson.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>

              {isLoggedIn && newLessonOpen && (
                <div className="mt-4 border rounded-lg p-4 space-y-3">
                  <h3 className="font-medium">新增课节</h3>
                  <input
                    type="text"
                    value={newLessonForm.title}
                    onChange={(e) => setNewLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="课节名称"
                  />
                  <input
                    type="text"
                    value={newLessonForm.section_label}
                    onChange={(e) =>
                      setNewLessonForm((prev) => ({ ...prev, section_label: e.target.value }))
                    }
                    className="w-full p-2 border rounded text-sm"
                    placeholder="所属章节"
                  />
                  <textarea
                    value={newLessonForm.description}
                    onChange={(e) =>
                      setNewLessonForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full p-2 border rounded text-sm min-h-[96px]"
                    placeholder="课节描述"
                  />
                  <input
                    type="text"
                    value={newLessonForm.doc_embed_url}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewLessonForm((prev) => ({ ...prev, doc_embed_url: value }));
                      validateDocUrl(value, setNewLessonDocUrlError);
                    }}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="飞书文档链接"
                  />
                  {newLessonDocUrlError && (
                    <p className="text-xs text-destructive">{newLessonDocUrlError}</p>
                  )}
                  <Button onClick={createLesson} disabled={creatingLesson} className="w-full">
                    {creatingLesson ? "创建中..." : "创建课节"}
                  </Button>
                </div>
              )}

              {isLoggedIn && activeLesson && (
                <div className="mt-4 border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium">编辑课节</h3>
                    <Button size="sm" onClick={saveLesson} disabled={savingLesson || Boolean(docUrlError)}>
                      <Save className="h-4 w-4 mr-1" />
                      {savingLesson ? "保存中..." : "保存"}
                    </Button>
                  </div>

                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="课节名称"
                  />
                  <input
                    type="text"
                    value={lessonForm.section_label}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, section_label: e.target.value }))}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="所属章节"
                  />
                  <textarea
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded text-sm min-h-[96px]"
                    placeholder="课节描述"
                  />
                  <input
                    type="text"
                    value={lessonForm.doc_embed_url}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLessonForm((prev) => ({ ...prev, doc_embed_url: value }));
                      validateDocUrl(value, setDocUrlError);
                    }}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="飞书文档链接"
                  />
                  {docUrlError && <p className="text-xs text-destructive">{docUrlError}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeLesson ? (
              <div className="bg-card rounded-xl border">
                <div className="border-b p-6">
                  <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
                  {activeLesson.description && (
                    <p className="text-muted-foreground mt-2">{activeLesson.description}</p>
                  )}
                </div>

                {activeLesson.video_embed_url && (
                  <div className="p-6">
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

                {lessonForm.doc_embed_url ? (
                  <div className="p-6">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border">
                      <iframe src={lessonForm.doc_embed_url} className="w-full h-full" allowFullScreen />
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="aspect-[4/3] rounded-lg border flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">暂无文档内容</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-xl border p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">该课程还没有课节</h3>
                <p className="text-muted-foreground">请先为这个课程配置对应的课节数据</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
