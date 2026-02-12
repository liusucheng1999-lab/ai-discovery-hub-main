// src/pages/SetupAdmin.tsx
// 管理员设置页面

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function SetupAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 1. 创建用户账号
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (authError) {
        console.error('创建用户失败:', authError);
        setError(`创建用户失败: ${authError.message}`);
        return;
      }

      console.log('用户创建成功:', authData);

      if (authData.user) {
        // 2. 添加管理员权限
        const { data: roleData, error: roleError } = await supabase
          .from('admin_roles')
          .insert({ user_id: authData.user.id, is_admin: true })
          .select();

        console.log('权限添加结果:', { roleData, roleError });

        if (roleError) {
          console.error('添加权限失败:', roleError);
          setError(`用户创建成功，但添加管理员权限失败: ${roleError.message}`);
        } else {
          setMessage(`管理员账号创建成功！请检查邮箱 ${email} 并确认注册。`);
          setEmail("");
          setPassword("");
        }
      }
    } catch (err) {
      console.error('创建管理员失败:', err);
      setError(`创建失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>创建管理员 - AI创客</title>
        <meta name="description" content="创建管理员账号" />
      </Helmet>
      
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">👤 创建管理员</CardTitle>
              <p className="text-muted-foreground">创建新的管理员账号</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">管理员邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码（至少6位）"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "创建中..." : "创建管理员账号"}
                </Button>
              </form>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>创建后需要检查邮箱确认注册</p>
                <p>确认后即可使用该账号登录管理后台</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
