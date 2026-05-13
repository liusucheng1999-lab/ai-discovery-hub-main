import { useState, useEffect } from "react";
import { Trash2, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  lesson_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface LessonCommentsProps {
  lessonId: string;
}

export default function LessonComments({ lessonId }: LessonCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from("lesson_comments")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;
      setComments(data || []);
    } catch (err: any) {
      console.error("加载评论失败", err);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async () => {
    if (!authorName.trim()) {
      setError("请输入昵称");
      return;
    }
    if (!commentText.trim()) {
      setError("请输入评论内容");
      return;
    }
    if (commentText.length > 500) {
      setError("评论内容不超过500字");
      return;
    }

    setPosting(true);
    setError("");
    try {
      const { data, error: insertError } = await supabase
        .from("lesson_comments")
        .insert({
          lesson_id: lessonId,
          author_name: authorName.trim(),
          content: commentText.trim(),
        })
        .select("*")
        .single();

      if (insertError) throw insertError;

      setComments((prev) => [data, ...prev]);
      setAuthorName("");
      setCommentText("");
    } catch (err: any) {
      console.error("发布评论失败", err);
      console.error("错误详情:", err.message, err.code);
      setError(err.message || "发布评论失败，请重试");
    } finally {
      setPosting(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm("确定删除这条评论吗？")) return;

    try {
      const { error: delError } = await supabase.from("lesson_comments").delete().eq("id", id);
      if (delError) throw delError;
      setComments((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      console.error("删除评论失败", err);
      alert("删除评论失败，请重试");
    }
  };

  useEffect(() => {
    setLoading(true);
    loadComments();
  }, [lessonId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // 确保时间戳为毫秒，修复可能的时区问题
    let diffMs = now.getTime() - date.getTime();

    // 如果差值为负数（时间在未来），说明可能是时区问题，取绝对值
    if (diffMs < 0) {
      diffMs = Math.abs(diffMs);
    }

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffSecs / 3600);
    const diffDays = Math.floor(diffSecs / 86400);

    if (diffSecs < 30) return "刚刚";
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="border-t bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h3 className="text-lg font-semibold mb-6">课节讨论</h3>

        {/* 评论输入框 */}
        <div className="mb-8 pb-6 border-b">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                昵称
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value.slice(0, 50))}
                placeholder="请输入你的昵称"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                maxLength={50}
              />
              <div className="text-xs text-muted-foreground mt-1">{authorName.length}/50</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                评论
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value.slice(0, 500))}
                placeholder="分享你的想法和问题..."
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-muted-foreground">{commentText.length}/500</div>
              </div>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={postComment}
                disabled={posting}
                className="gap-1.5"
              >
                <Send className="h-4 w-4" />
                {posting ? "发布中..." : "发布评论"}
              </Button>
            </div>
          </div>
        </div>

        {/* 评论列表 */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">暂无评论，快来成为第一个评论者吧！</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="pb-4 border-b last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    disabled={deleteId === comment.id}
                    className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="删除评论"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
