// src/pages/Login.tsx
// 统一的登录 / 注册页面

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");

  // 登录表单
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 注册表单
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfter = () => {
    const saved = (location.state as any)?.from;
    const from = saved ? `${saved.pathname || ''}${saved.search || ''}` : "/published-apps";
    navigate(from, { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await login(email, password);
      if (result.success) {
        redirectAfter();
      } else {
        setError(result.error || "邮箱或密码错误");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (regPassword.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }
    if (regPassword !== regPassword2) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const result = await register(regEmail, regPassword);
      if (result.success) {
        redirectAfter();
      } else {
        // 注册成功但需邮箱验证的情况也走这里（result.error 为提示文案）
        setMessage(result.error || "");
        if (!result.error) setError("注册失败，请重试");
        else setError("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>登录 / 注册 - AI创客</title>
        <meta name="description" content="登录或注册 AI创客账号，发布你的 AI 作品" />
      </Helmet>

      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">欢迎来到 AI创客</CardTitle>
              <p className="text-muted-foreground">登录或注册，发布你的 AI 作品</p>
            </CardHeader>
            <CardContent>
              {(error || message) && (
                <Alert variant={error ? "destructive" : "default"} className="mb-4">
                  <AlertDescription>{error || message}</AlertDescription>
                </Alert>
              )}

              <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setError(""); setMessage(""); }}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">登录</TabsTrigger>
                  <TabsTrigger value="register">注册</TabsTrigger>
                </TabsList>

                {/* 登录 */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
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
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "登录中..." : "登录"}
                    </Button>
                  </form>
                </TabsContent>

                {/* 注册 */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">邮箱</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">密码</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="至少 6 位"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password2">确认密码</Label>
                      <Input
                        id="reg-password2"
                        type="password"
                        placeholder="再次输入密码"
                        value={regPassword2}
                        onChange={(e) => setRegPassword2(e.target.value)}
                        required
                        minLength={6}
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "注册中..." : "注册"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      注册即成为普通用户，可提交应用（提交后需管理员审核）
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
