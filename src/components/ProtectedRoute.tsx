// src/components/ProtectedRoute.tsx
// 受保护的路由组件

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin, adminLoaded } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: { pathname: window.location.pathname } }} replace />;
  }

  // 管理员身份是异步查询的：未查完前先显示 loading，避免误判把管理员弹走
  if (requireAdmin && !adminLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // 需要管理员权限但当前用户不是管理员 → 回首页
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
