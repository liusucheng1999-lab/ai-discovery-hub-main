// src/components/EnhancedSearch.tsx
// 增强搜索组件 - 支持关键词搜索和AI智能搜索

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function EnhancedSearch({ 
  onSearch, 
  placeholder = "搜索AI工具...",
  className 
}: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // 立即触发父组件的搜索，显示关键词匹配结果
    if (query.trim()) {
      onSearch(query); // 这会触发关键词匹配
    } else {
      onSearch(""); // 清空搜索
    }
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    console.log('关键词搜索:', query);
    setIsSearching(true);
    setSearchStatus("正在搜索...");

    // 立即触发关键词搜索
    onSearch(query);
    
    // 模拟搜索状态
    setTimeout(() => {
      setIsSearching(false);
      setSearchStatus("");
    }, 500);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchQuery);
    }
  };

  // 清除搜索
  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("w-full mx-auto relative", className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-20 h-12 text-base"
        />

        {/* 搜索按钮和清除按钮 */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            onClick={() => handleSearch(searchQuery)}
            disabled={!searchQuery.trim() || isSearching}
            size="sm"
            className="h-8"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 搜索状态提示 */}
      {isSearching && searchStatus && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{searchStatus}</span>
        </div>
      )}
    </div>
  );
}
