import { supabase } from "@/lib/supabase";

const VISITOR_ID_KEY = "site-visitor-id";
const LAST_VISIT_AT_KEY = "site-last-visit-at";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const EXCLUDED_PATHS = new Set(["/admin", "/login", "/setup-admin", "/create-admin"]);

export interface DailyVisitStat {
  date: string;
  visits: number;
}

export interface SiteAnalyticsSummary {
  today: number;
  yesterday: number;
  last7Days: number;
  last30Days: number;
  daily: DailyVisitStat[];
}

function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(VISITOR_ID_KEY, nextId);
  return nextId;
}

function shouldSkipTracking(pathname: string) {
  return EXCLUDED_PATHS.has(pathname) || pathname.startsWith("/admin/");
}

export async function trackSiteVisit(pathname: string) {
  if (typeof window === "undefined" || shouldSkipTracking(pathname)) {
    return;
  }

  const now = Date.now();
  const lastVisitAt = Number(localStorage.getItem(LAST_VISIT_AT_KEY) || "0");

  if (lastVisitAt && now - lastVisitAt < SESSION_TIMEOUT_MS) {
    return;
  }

  const visitorId = getVisitorId();
  const payload = {
    visitor_id: visitorId,
    session_id: `${visitorId}-${now}`,
    entry_path: pathname,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent || null,
  };

  const { error } = await supabase.from("site_visits").insert(payload);

  if (error) {
    console.error("记录站点访问失败:", error);
    return;
  }

  localStorage.setItem(LAST_VISIT_AT_KEY, String(now));
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildDateRange(days: number) {
  const result: string[] = [];
  const today = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    result.push(formatDateKey(date));
  }

  return result;
}

export async function fetchSiteAnalyticsSummary(): Promise<SiteAnalyticsSummary> {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("site_visits")
    .select("visit_date")
    .gte("visit_date", formatDateKey(since))
    .order("visit_date", { ascending: true });

  if (error) {
    throw error;
  }

  const counts = new Map<string, number>();
  (data || []).forEach((row) => {
    const key = row.visit_date as string;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const last30DaysDates = buildDateRange(30);
  const daily = last30DaysDates.map((date) => ({
    date,
    visits: counts.get(date) || 0,
  }));

  const today = daily[daily.length - 1]?.visits || 0;
  const yesterday = daily[daily.length - 2]?.visits || 0;
  const last7Days = daily.slice(-7).reduce((sum, item) => sum + item.visits, 0);
  const last30Days = daily.reduce((sum, item) => sum + item.visits, 0);

  return {
    today,
    yesterday,
    last7Days,
    last30Days,
    daily,
  };
}
