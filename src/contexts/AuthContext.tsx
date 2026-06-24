// src/contexts/AuthContext.tsx
// 认证上下文 - 基于 Supabase Auth 真实会话 + 管理员角色判定

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  username: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// 查询某用户是否为管理员
async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle();
    return data?.is_admin === true;
  } catch {
    return false;
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    // 异步加载管理员身份：用 setTimeout 推迟到认证锁释放之后再查库，
    // 避免在 getSession / onAuthStateChange 持锁期间调用 supabase 导致死锁
    const loadAdmin = (u: User | null) => {
      if (!u) {
        setIsAdmin(false);
        return;
      }
      setTimeout(async () => {
        if (!mounted) return;
        setIsAdmin(await checkIsAdmin(u.id));
      }, 0);
    };

    // 安全兜底：无论如何 3 秒后必须结束 loading，避免整站卡死
    const safety = setTimeout(() => {
      if (mounted) setIsInitialized(true);
    }, 3000);

    // 初始化：读取当前会话（拿到 session 后立即结束 loading，不等管理员查询）
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const u = session?.user ?? null;
      setUser(u);
      setIsInitialized(true);
      loadAdmin(u);
    });

    // 监听登录状态变化（回调里只做同步赋值，DB 查询推迟执行）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        const u = session?.user ?? null;
        setUser(u);
        loadAdmin(u);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safety);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      return { success: false, error: translateAuthError(error.message) };
    }
    if (data.user) {
      setUser(data.user);
      setIsAdmin(await checkIsAdmin(data.user.id));
      return { success: true };
    }
    return { success: false, error: '登录失败' };
  };

  const register = async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    if (error) {
      return { success: false, error: translateAuthError(error.message) };
    }
    // 关闭邮箱验证时 signUp 会直接返回 session 并自动登录
    if (data.session && data.user) {
      setUser(data.user);
      setIsAdmin(false); // 新注册用户均为普通用户
      return { success: true };
    }
    // 若开启了邮箱验证，则需用户去邮箱确认
    return {
      success: false,
      error: '注册成功，请前往邮箱点击验证链接后再登录',
    };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">加载中...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin,
        username: user?.email ?? null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 把 Supabase 英文报错翻译成中文提示
function translateAuthError(msg: string): string {
  if (/Invalid login credentials/i.test(msg)) return '邮箱或密码错误';
  if (/User already registered/i.test(msg)) return '该邮箱已注册，请直接登录';
  if (/Password should be at least/i.test(msg)) return '密码至少需要 6 位';
  if (/Unable to validate email address/i.test(msg)) return '邮箱格式不正确';
  if (/Email not confirmed/i.test(msg)) return '邮箱尚未验证，请先查收验证邮件';
  return msg || '操作失败，请重试';
}
