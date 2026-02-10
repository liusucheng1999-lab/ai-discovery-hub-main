import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 text-sm text-muted-foreground">
        <span>AI创客 — 发现最好用的AI工具</span>
        <div className="flex items-center gap-3">
          <Link to="/tools/submit" className="hover:text-foreground transition-colors">
            提交工具
          </Link>
          <span>·</span>
          <a href="mailto:contact@aimaker.com" className="hover:text-foreground transition-colors">
            联系我们
          </a>
          <span>·</span>
          <span>© 2025 AI创客</span>
        </div>
      </div>
    </footer>
  );
}
