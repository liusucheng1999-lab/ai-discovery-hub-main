-- 优化 tools 表查询性能
-- 为常用查询条件添加索引

-- 索引 1: status + view_count 复合索引（首页查询使用）
CREATE INDEX IF NOT EXISTS idx_tools_status_view_count 
ON tools(status, view_count DESC, id ASC);

-- 索引 2: status + main_category 复合索引（分类页查询使用）
CREATE INDEX IF NOT EXISTS idx_tools_status_main_category 
ON tools(status, main_category, view_count DESC);

-- 索引 3: 单独的 status 索引（通用筛选）
CREATE INDEX IF NOT EXISTS idx_tools_status 
ON tools(status);
