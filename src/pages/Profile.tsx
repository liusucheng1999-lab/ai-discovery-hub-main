import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AccountAvatar } from '@/components/AccountAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setName(user?.user_metadata?.display_name || user?.user_metadata?.full_name || '');
    setBio(user?.user_metadata?.bio || '');
    setAvatar(user?.user_metadata?.avatar_url || '');
  }, [user]);
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function chooseFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(selected.type) || selected.size > 2 * 1024 * 1024) {
      setError('请选择 2MB 以内的 JPG、PNG 或 WebP 图片');
      return;
    }
    setError('');
    setFile(selected);
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!user || saving) return;
    if (!name.trim() || name.trim().length > 30 || bio.trim().length > 200) { setError('姓名需为 1–30 字，简介最多 200 字'); return; }
    setSaving(true);
    setError('');
    let uploadedPath: string | null = null;
    try {
      let avatarUrl = avatar;
      if (file) {
        const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.type];
        uploadedPath = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(uploadedPath, file);
        if (uploadError) throw uploadError;
        avatarUrl = supabase.storage.from('avatars').getPublicUrl(uploadedPath).data.publicUrl;
      }
      const { error: saveError } = await supabase.auth.updateUser({ data: { display_name: name.trim(), bio: bio.trim(), avatar_url: avatarUrl || null } });
      if (saveError) throw saveError;
      setFile(null);
      setAvatar(avatarUrl);
      toast.success('已保存');
    } catch {
      if (uploadedPath) await supabase.storage.from('avatars').remove([uploadedPath]);
      setError('保存失败，请重试');
    } finally { setSaving(false); }
  }
  return <main className="min-h-[80vh] bg-background px-4 pb-16 pt-28">
    <Helmet><title>个人资料 - AI创客</title></Helmet>
    <section className="mx-auto max-w-lg rounded-2xl border bg-card p-6 sm:p-8">
      <h1 className="mb-8 text-xl font-semibold">个人资料</h1>
      <form onSubmit={save} className="space-y-6">
        <div className="flex items-center gap-5">
          <AccountAvatar name={name || '用户'} url={avatar} className="h-20 w-20 text-2xl" />
          <div className="flex gap-2">
            <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="上传头像" onChange={chooseFile} className="hidden" disabled={saving} />
            <Button type="button" variant="outline" disabled={saving} onClick={() => fileInput.current?.click()}>更换头像</Button>
            {avatar && <Button type="button" variant="ghost" disabled={saving} onClick={() => { setFile(null); setAvatar(''); }}>移除</Button>}
          </div>
        </div>
        <div className="space-y-2"><Label htmlFor="profile-name">姓名</Label><Input id="profile-name" maxLength={30} required value={name} onChange={event => setName(event.target.value)} disabled={saving} /></div>
        <div className="space-y-2"><Label htmlFor="profile-bio">简介</Label><textarea id="profile-bio" maxLength={200} value={bio} onChange={event => setBio(event.target.value)} disabled={saving} className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-primary" /><p className="text-right text-xs text-muted-foreground">{bio.length}/200</p></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={saving || !name.trim()} className="w-full">{saving ? '保存中…' : '保存'}</Button>
      </form>
    </section>
  </main>;
}
