-- 创建管理员插入工具的 RPC 函数
-- 绕过行级安全策略，允许管理员插入工具

CREATE OR REPLACE FUNCTION admin_insert_tool(tool_data json)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO tools (
    name,
    tagline,
    description,
    website_url,
    category,
    tags,
    pricing_type,
    is_china_available,
    is_chinese_supported,
    rating,
    rating_count,
    view_count,
    screenshots,
    status,
    created_at
  ) SELECT
    tool_data->>'name',
    tool_data->>'tagline',
    tool_data->>'description',
    tool_data->>'website_url',
    tool_data->>'category',
    tool_data->>'tags',
    tool_data->>'pricing_type',
    tool_data->>'is_china_available',
    tool_data->>'is_chinese_supported',
    tool_data->>'rating',
    tool_data->>'rating_count',
    tool_data->>'view_count',
    tool_data->>'screenshots',
    tool_data->>'status',
    tool_data->>'created_at';
END;
$$;
