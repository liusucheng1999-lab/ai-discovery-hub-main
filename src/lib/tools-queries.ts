import type { SupabaseClient } from "@supabase/supabase-js";
import { TOOL_LIST_COLUMNS } from "@/lib/tool-list-columns";

/** 与 Supabase 默认 max_rows 对齐；单次请求最多返回这么多条 */
const PAGE_SIZE = 1000;

type ToolsQueryResult = {
  data: unknown[] | null;
  error: { message: string } | null;
};

/**
 * 分页拉满：避免默认 1000 行上限导致列表条数被截断。
 * 排序加 id 作为第二键，保证翻页稳定。
 */
async function fetchAllToolsWithColumns(
  supabase: SupabaseClient,
  columns: string,
  options?: { mainCategory?: string }
): Promise<ToolsQueryResult> {
  const all: unknown[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("tools")
      .select(columns)
      .in("status", ["active", "approved"]);

    if (options?.mainCategory) {
      query = query.eq("main_category", options.mainCategory);
    }

    query = query
      .order("view_count", { ascending: false })
      .order("id", { ascending: true });

    const { data, error } = await query.range(from, to);

    if (error) {
      return { data: null, error };
    }
    if (!data?.length) {
      break;
    }
    all.push(...data);
    if (data.length < PAGE_SIZE) {
      break;
    }
    from += PAGE_SIZE;
  }

  return { data: all, error: null };
}

/** 首页列表：精简列失败时回退 select('*') */
export async function fetchHomeToolsList(supabase: SupabaseClient) {
  let res = await fetchAllToolsWithColumns(supabase, TOOL_LIST_COLUMNS);
  if (res.error) {
    console.warn(
      "tools 精简列查询失败，回退 select(*):",
      res.error.message ?? res.error
    );
    res = await fetchAllToolsWithColumns(supabase, "*");
  }
  return res;
}

/** 分类页：同上，带 main_category 条件 */
export async function fetchToolsByMainCategoryName(
  supabase: SupabaseClient,
  mainCategoryName: string
) {
  let res = await fetchAllToolsWithColumns(supabase, TOOL_LIST_COLUMNS, {
    mainCategory: mainCategoryName,
  });
  if (res.error) {
    console.warn(
      "tools 精简列查询失败，回退 select(*):",
      res.error.message ?? res.error
    );
    res = await fetchAllToolsWithColumns(supabase, "*", {
      mainCategory: mainCategoryName,
    });
  }
  return res;
}
