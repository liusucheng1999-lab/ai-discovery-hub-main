import { Helmet } from "react-helmet-async";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseWithAuth } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Users, Plus, Edit2, Save, X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// 课程接口
interface Course {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  first_lesson_id: string | null;
  lesson_count: number;
  is_free: boolean;
  status: string;
}

interface LessonSummary {
  id: string;
  course_id?: string | null;
  week_title: string | null;
}

export default function Knowledge() {
  const { isLoggedIn } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 编辑状态
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const [saving, setSaving] = useState(false);
  
  // 新增课程
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<Course>>({
    title: "",
    description: "",
    cover_url: null,
    is_free: true,
    status: "published"
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 加载课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      
      // 从 course_settings 表获取课程基本信息
      const { data: courseSettings, error: courseError } = await supabase
        .from("course_settings")
        .select("*");

      if (courseError) {
        console.error("加载课程失败", courseError);
      }

      // 从 knowledge_lessons 按 week_title 分组统计课节数
      const { data: lessons, error: lessonError } = await supabase
        .from("knowledge_lessons")
        .select("id, course_id, week_title");

      if (lessonError) {
        console.error("加载课节失败", lessonError);
      }

      // 统计每个课程的课节数
      const lessonCountMap = new Map<string, number>();
      const firstLessonMap = new Map<string, string>();
      
      (lessons as LessonSummary[] | null)?.forEach((lesson) => {
        const courseKey = lesson.course_id || lesson.week_title || "未分类";
        lessonCountMap.set(courseKey, (lessonCountMap.get(courseKey) || 0) + 1);
        if (!firstLessonMap.has(courseKey)) {
          firstLessonMap.set(courseKey, lesson.id);
        }
      });

      // 组装课程数据
      const courseList: Course[] = [];
      
      // 如果有 course_settings 数据，使用它
      if (courseSettings && courseSettings.length > 0) {
        courseSettings.forEach((cs) => {
          const legacyKey = cs.title || "未分类";
          courseList.push({
            id: cs.id,
            title: cs.title,
            description: cs.description,
            cover_url: cs.cover_url,
            first_lesson_id: firstLessonMap.get(cs.id) || firstLessonMap.get(legacyKey) || null,
            lesson_count: lessonCountMap.get(cs.id) || lessonCountMap.get(legacyKey) || 0,
            is_free: true,
            status: "published"
          });
        });
      } else {
        // 默认显示打工人进化论
        const defaultTitle = "打工人进化论";
        courseList.push({
          id: "1",
          title: defaultTitle,
          description: "用 AI 把你从「执行者」变成「决策者」。系统化的 AI 实战课程，助你掌握 AI 工具，提升工作效率。",
          cover_url: null,
          first_lesson_id: firstLessonMap.get(defaultTitle) || lessons?.[0]?.id || null,
          lesson_count: lessonCountMap.get(defaultTitle) || lessons?.length || 0,
          is_free: true,
          status: "published"
        });
      }

      setCourses(courseList);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  // 开始编辑
  const handleEdit = (course: Course) => {
    setEditingCourse(course.id);
    setEditForm({ ...course });
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditForm({});
    setCoverFile(null);
  };

  // 保存编辑
  const handleSaveEdit = async (courseId: string) => {
    setSaving(true);
    try {
      const { error } = await supabaseWithAuth
        .from("course_settings")
        .upsert({
          id: courseId,
          title: editForm.title,
          description: editForm.description,
          cover_url: editForm.cover_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // 更新本地状态
      setCourses(prev => prev.map(c => 
        c.id === courseId 
          ? { ...c, ...editForm, id: courseId }
          : c
      ));
      setEditingCourse(null);
      alert("课程信息已保存！");
    } catch (err: any) {
      console.error("保存失败", err);
      alert("保存失败：" + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 上传封面
  const handleUploadCover = async (isCreate = false) => {
    if (!coverFile) return;
    
    setUploading(true);
    try {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `course-cover-${Date.now()}.${fileExt}`;
      const filePath = `course-covers/${fileName}`;

      const { error: uploadError } = await supabaseWithAuth.storage
        .from("course-assets")
        .upload(filePath, coverFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseWithAuth.storage
        .from("course-assets")
        .getPublicUrl(filePath);

      if (isCreate) {
        setCreateForm(prev => ({ ...prev, cover_url: publicUrl }));
      } else {
        setEditForm(prev => ({ ...prev, cover_url: publicUrl }));
      }
      setCoverFile(null);
      alert("封面上传成功！");
    } catch (err: any) {
      console.error("上传失败", err);
      alert("上传失败：" + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 创建新课程
  const handleCreateCourse = async () => {
    if (!createForm.title) {
      alert("请输入课程名称");
      return;
    }

    setSaving(true);
    try {
      // 生成新 ID
      const newId = Date.now().toString();
      
      const { error } = await supabaseWithAuth
        .from("course_settings")
        .insert({
          id: newId,
          title: createForm.title,
          description: createForm.description || "",
          cover_url: createForm.cover_url || null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // 添加到本地状态
      setCourses(prev => [...prev, {
        id: newId,
        title: createForm.title || "",
        description: createForm.description || "",
        cover_url: createForm.cover_url || null,
        first_lesson_id: null,
        lesson_count: 0,
        is_free: true,
        status: "published"
      }]);

      setIsCreating(false);
      setCreateForm({
        title: "",
        description: "",
        cover_url: null,
        is_free: true,
        status: "published"
      });
      alert("新课程创建成功！");
    } catch (err: any) {
      console.error("创建失败", err);
      alert("创建失败：" + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 渲染课程卡片
  const renderCourseCard = (course: Course) => {
    const isEditing = editingCourse === course.id;

    if (isEditing) {
      return (
        <div key={course.id} className="rounded-xl border bg-card overflow-hidden">
          {/* 编辑表单 */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">课程名称</label>
              <input
                type="text"
                value={editForm.title || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                placeholder="课程名称"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">课程描述</label>
              <textarea
                value={editForm.description || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm resize-none"
                placeholder="课程描述"
              />
            </div>

            {/* 封面上传 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">课程封面</label>
              <div className="flex items-start gap-4">
                <div className="w-32 aspect-video rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                  {editForm.cover_url ? (
                    <img src={editForm.cover_url} alt="封面" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                  />
                  {coverFile && (
                    <Button size="sm" onClick={() => handleUploadCover(false)} disabled={uploading}>
                      {uploading ? "上传中..." : "上传"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-1" />
                取消
              </Button>
              <Button size="sm" onClick={() => handleSaveEdit(course.id)} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // 正常展示模式
    return (
      <div key={course.id} className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* 编辑按钮（仅管理员可见） */}
        {isLoggedIn && (
          <button
            onClick={() => handleEdit(course)}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        <Link
          to={`/knowledge/course/${course.id}`}
          className="block"
        >
          {/* 课程封面 */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            {course.cover_url ? (
              <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="h-16 w-16 text-primary/40 group-hover:text-primary/60 transition-colors" />
            )}
          </div>

          {/* 课程信息 */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                {course.status === "published" ? "已发布" : "草稿"}
              </span>
              {course.is_free && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  免费
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {course.title}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {course.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{course.lesson_count} 节课</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>1000+ 学员</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>课程中心 - AI创客</title>
        <meta name="description" content="AI创客课程中心，提供AI实战课程。" />
        <link rel="canonical" href="https://aimakerbox.com/knowledge" />
      </Helmet>

      <main className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">课程中心</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              系统化的 AI 实战课程，助你从入门到精通
            </p>
          </div>
          
          {/* 新增课程按钮（仅管理员可见） */}
          {isLoggedIn && (
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              新增课程
            </Button>
          )}
        </div>

        {/* 新增课程表单 */}
        {isCreating && (
          <div className="mb-8 p-6 rounded-xl border bg-card">
            <h3 className="text-lg font-semibold mb-4">新增课程</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">课程名称 *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  placeholder="请输入课程名称"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">课程描述</label>
                <input
                  type="text"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  placeholder="请输入课程描述"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
              />
              {coverFile && (
                <Button size="sm" onClick={() => handleUploadCover(true)} disabled={uploading}>
                  {uploading ? "上传中..." : "上传封面"}
                </Button>
              )}
            </div>
            {createForm.cover_url && (
              <div className="mt-4 w-32 aspect-video rounded-lg border overflow-hidden">
                <img src={createForm.cover_url} alt="封面预览" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                取消
              </Button>
              <Button onClick={handleCreateCourse} disabled={saving}>
                {saving ? "创建中..." : "创建课程"}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(renderCourseCard)}
          </div>
        )}
      </main>
    </>
  );
}
