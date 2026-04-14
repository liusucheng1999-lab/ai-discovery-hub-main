import type { Tool } from "@/lib/mock-data";
import type { CategoryWithSubCategories } from "@/lib/types";

const CACHE_KEY = "ai-discovery-hub-home-v4";
const TTL_MS = 15 * 60 * 1000;

export interface HomeCachePayload {
  savedAt: number;
  tools: Tool[];
  categories: unknown[];
  categoryData: CategoryWithSubCategories[];
}

export function readHomeCache(): HomeCachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HomeCachePayload;
    if (!parsed || typeof parsed.savedAt !== "number" || !Array.isArray(parsed.tools)) {
      return null;
    }
    // 不把「空列表」当有效缓存（避免一次失败请求把空数据写死）
    if (parsed.tools.length === 0) {
      return null;
    }
    if (Date.now() - parsed.savedAt > TTL_MS) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeHomeCache(
  payload: Omit<HomeCachePayload, "savedAt">
): void {
  try {
    const full: HomeCachePayload = { ...payload, savedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(full));
  } catch {
    // quota / private mode — ignore
  }
}
