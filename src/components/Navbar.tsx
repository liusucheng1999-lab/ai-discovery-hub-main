import { Search, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-4 px-6">
        <Link to="/" className="text-xl font-bold text-gradient shrink-0">
          AI创客
        </Link>

        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索AI工具..."
            className="pl-9 rounded-lg"
          />
        </div>

        <div className="flex-grow" />

        <Link
          to="/tools/submit"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          提交工具
        </Link>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
