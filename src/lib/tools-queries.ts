import type { SupabaseClient } from "@supabase/supabase-js";
import { TOOL_LIST_COLUMNS } from "@/lib/tool-list-columns";

/** 首页初始加载条数 */
const INITIAL_PAGE_SIZE = 100;
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
  options?: { mainCategory?: string, initialOnly?: boolean }
): Promise<ToolsQueryResult> {
  const all: unknown[] = [];
  let from = 0;
  const pageSize = options?.initialOnly ? INITIAL_PAGE_SIZE : PAGE_SIZE;

  while (true) {
    const to = from + pageSize - 1;

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
    if (data.length < pageSize) {
      break;
    }
    from += pageSize;
    // 初始加载模式只加载一页
    if (options?.initialOnly) break;
  }

  return { data: all, error: null };
}

/** 首页列表：初始只加载 100 条，精简列失败时回退 select('*') */
export async function fetchHomeToolsList(supabase: SupabaseClient, initialOnly: boolean = true) {
  let res = await fetchAllToolsWithColumns(supabase, TOOL_LIST_COLUMNS, { initialOnly });
  if (res.error) {
    console.warn(
      "tools 精简列查询失败，回退 select(*):",
      res.error.message ?? res.error
    );
    res = await fetchAllToolsWithColumns(supabase, "*", { initialOnly });
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
