// src/pages/CreateAdmin.tsx
// 简单的管理员创建页面 - 直接使用 SQL

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function CreateAdmin() {
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
      // 1. 先尝试登录，看用户是否已存在
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError && !loginError.message.includes('Invalid login credentials')) {
        // 其他登录错误
        setError(`登录检查失败: ${loginError.message}`);
        return;
      }

      if (loginData.user) {
        // 用户已存在，检查是否有管理员权限
        const { data: roleData } = await supabase
          .from('admin_roles')
          .select('is_admin')
          .eq('user_id', loginData.user.id)
          .single();

        if (roleData?.is_admin) {
          setMessage('该用户已经是管理员！');
        } else {
          // 添加管理员权限
          const { error: roleError } = await supabase
            .from('admin_roles')
            .insert({ user_id: loginData.user.id, is_admin: true });

          if (roleError) {
            setError(`添加管理员权限失败: ${roleError.message}`);
          } else {
            setMessage('管理员权限添加成功！');
          }
        }
      } else {
        // 用户不存在，需要先创建
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`
          }
        });

        if (signUpError) {
          setError(`创建用户失败: ${signUpError.message}`);
          return;
        }

        if (signUpData.user) {
          // 使用 RPC 函数添加管理员权限（绕过 RLS）
          const { data, error } = await supabase.rpc('add_admin_role', {
            user_id: signUpData.user.id
          });

          if (error) {
            setError(`添加管理员权限失败: ${error.message}`);
          } else {
            setMessage(`管理员账号创建成功！邮箱: ${email}，密码: ${password}`);
          }
        }
      }
    } catch (err) {
      setError(`操作失败: ${err instanceof Error ? err.message : '未知错误'}`);
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
              <p className="text-muted-foreground">创建或升级管理员账号</p>
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
                  {loading ? "处理中..." : "创建/升级管理员"}
                </Button>
              </form>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>💡 如果用户已存在，将自动升级为管理员</p>
                <p>📧 如果是新用户，需要邮箱确认注册</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
