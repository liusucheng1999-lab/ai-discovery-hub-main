import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function ConnectorAuthorize() {
  const [params] = useSearchParams();
  const code = (params.get('code') || '').toUpperCase();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setError(code ? '' : '缺少连接码，请从 Codex 重新发起连接。'), [code]);

  const approve = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('登录状态已失效，请重新登录');
      const response = await fetch('/api/v1/connector/approve', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_code: code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '授权失败');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '授权失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {success ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Link2 className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle>{success ? '连接成功' : '连接 Codex'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <Alert><AlertDescription>AI 创客账号已连接。现在可以关闭此页面并返回 Codex。</AlertDescription></Alert>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Codex 将获得以你的身份创建和更新 AI 创客应用的权限，不会获得你的登录密码。
              </p>
              <div className="rounded-lg bg-muted p-3 text-center font-mono text-lg tracking-widest">{code || '—'}</div>
              {user && <p className="text-xs text-muted-foreground">当前账号：{user.email}</p>}
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <Button className="w-full" onClick={approve} disabled={loading || !code}>
                {loading ? '正在授权…' : '确认连接'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
