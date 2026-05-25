import { Sun, Moon, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import ContactDialog from "./ContactDialog";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [_, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { label: "首页", to: "/" },
    { label: "AI工具", to: "/tools" },
    { label: "AI课程", to: "/knowledge" },
    { label: "AI资源", to: "/resources" },
    { label: "应用库", to: "/published-apps" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-4 px-6">
        <Link to="/" className="text-xl font-bold text-gradient shrink-0">
          AI创客
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map((t) => {
            const isActive = location.pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-grow" />

        <div className="flex items-center gap-2">
          <ContactDialog />

          {isLoggedIn ? (
            <>
              <Link
                to="/admin"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                审核管理
              </Link>
              <Link
                to="/analytics"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                访问统计
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{username}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              管理员登录
            </Link>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
