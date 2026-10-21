import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { MessageSquare, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { AccountAvatar } from './AccountAvatar';
import { Button } from '@/components/ui/button';
import type { HostedApp } from '@/types/app';

interface Comment { id: string; author_name: string; author_avatar_url?: string | null; content: string; created_at: string }
const PAGE_SIZE = 30;
const date = (value: string) => new Date(value).toLocaleString('zh-CN', { hour12: false });

export function AppComments({ app }: { app: HostedApp }) {
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (cursor?: Comment) => {
    setLoading(true);
    setError('');
    try {
      let query = supabase.from('app_comments').select('id,author_name,author_avatar_url,content,created_at').eq('app_id', app.id).order('created_at', { ascending: false }).order('id', { ascending: false }).limit(PAGE_SIZE);
      if (cursor) {
        const last = cursor;
        query = query.or(`created_at.lt.${last.created_at},and(created_at.eq.${last.created_at},id.lt.${last.id})`);
      }
      const { data, error: failure } = await query;
      if (failure) throw failure;
      setComments(previous => cursor ? [...previous, ...data] : data);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      setError('评论加载失败，请重试');
    } finally { setLoading(false); }
  }, [app.id]);

  useEffect(() => { if (open) void load(); }, [open, load]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending || !content.trim()) return;
    setSending(true);
    setError('');
    try {
      const { data, error: failure } = await supabase.from('app_comments').insert({ app_id: app.id, content: content.trim() }).select('id,author_name,author_avatar_url,content,created_at').single();
      if (failure) throw failure;
      setComments(previous => [data, ...previous]);
      setContent('');
    } catch { setError('评论发送失败，请重试'); }
    finally { setSending(false); }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="fixed right-0 top-1/2 z-[110] -translate-y-1/2 flex items-center gap-2 rounded-l-xl border border-r-0 bg-white px-3 py-3 text-sm text-gray-800 shadow-lg hover:bg-gray-100" aria-label="展开评论" aria-expanded={open}>
          <MessageSquare className="h-4 w-4" />评论
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[140] bg-black/20" />
        <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 right-0 z-[150] flex w-full max-w-sm flex-col border-l bg-background shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          <header className="border-b p-5 pr-12">
            <Dialog.Title className="font-semibold">评论</Dialog.Title>
            <p className="mt-3 truncate text-sm font-medium">{app.name}</p>
            <div className="mt-2 flex items-center gap-2"><AccountAvatar name={app.publisher_name || '用户'} url={app.publisher_avatar_url} className="h-6 w-6 text-xs" /><p className="text-xs text-muted-foreground truncate">发布人：{app.publisher_name || '未知'}</p></div>
            <p className="mt-1 text-xs text-muted-foreground">上传时间：{date(app.created_at)}</p>
            <Dialog.Close className="absolute right-4 top-4 rounded p-1 hover:bg-muted" aria-label="收起评论"><X className="h-5 w-5" /></Dialog.Close>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-5" aria-busy={loading}>
            {!loading && !error && comments.length === 0 && <p className="text-sm text-muted-foreground">暂无评论</p>}
            <ul className="space-y-5">
              {comments.map(comment => <li key={comment.id} className="border-b pb-4">
                <div className="flex items-center gap-2"><AccountAvatar name={comment.author_name} url={comment.author_avatar_url} className="h-7 w-7 text-xs" /><p className="text-sm font-medium break-words">{comment.author_name}</p></div>
                <time dateTime={comment.created_at} className="text-xs text-muted-foreground">{date(comment.created_at)}</time>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm">{comment.content}</p>
              </li>)}
            </ul>
            {loading && <p role="status" className="py-3 text-sm text-muted-foreground">加载中…</p>}
            {hasMore && !loading && <Button variant="ghost" className="mt-3 w-full" onClick={() => void load(comments[comments.length - 1])}>加载更多</Button>}
          </div>
          <div className="border-t p-4">
            {error && <div role="alert" className="mb-3 text-sm text-destructive">{error}{error.includes('加载') && <button className="ml-2 underline" onClick={() => void load()}>重试</button>}</div>}
            {isLoggedIn ? <form onSubmit={submit} className="space-y-2">
              <textarea aria-label="评论内容" placeholder="写评论" maxLength={1000} value={content} onChange={event => setContent(event.target.value)} className="min-h-24 w-full resize-y rounded-lg border bg-background p-3 text-sm focus-visible:outline-primary" />
              <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{content.length}/1000</span><Button type="submit" disabled={sending || loading || !content.trim()}>{sending ? '发送中…' : '发表评论'}</Button></div>
            </form> : <Button asChild className="w-full"><Link to="/login">登录后评论</Link></Button>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
