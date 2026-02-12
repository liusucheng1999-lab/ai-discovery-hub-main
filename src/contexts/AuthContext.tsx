// src/contexts/AuthContext.tsx
// 认证上下文 - 使用简单验证

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 检查本地存储的登录状态
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    
    console.log('初始化认证状态:', { storedLoginStatus, storedUsername });
    
    if (storedLoginStatus === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      console.log('恢复登录状态成功');
    } else {
      console.log('未找到登录状态');
    }
    
    setIsInitialized(true);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // 实际验证用户名和密码
      const { data, error } = await supabase
        .from('admin_secure')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('数据库查询错误:', error);
        return { success: false, error: '用户名或密码错误' };
      }

      if (data) {
        // 使用新的复杂密码验证
        // 新密码：Admin@2024!AI#Discovery
        const isPasswordValid = password === 'Admin@2024!AI#Discovery';
        
        if (isPasswordValid && data.is_admin) {
          setIsLoggedIn(true);
          setUsername(username);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          
          console.log('登录成功:', username);
          return { success: true };
        } else {
          return { success: false, error: '用户名或密码错误' };
        }
      } else {
        return { success: false, error: '用户名或密码错误' };
      }
    } catch (err) {
      console.error('登录过程错误:', err);
      return { success: false, error: '登录失败，请重试' };
    }
  };

  const logout = () => {
    console.log('登出');
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  // 添加一个加载状态，避免在初始化完成前渲染
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="ml-3">加载中...</p>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
