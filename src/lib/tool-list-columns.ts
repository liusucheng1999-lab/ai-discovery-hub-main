/** 列表/卡片用字段，不含 screenshots、ai_quality_review 等大字段；仅选各环境普遍存在的列，避免查询失败 */
export const TOOL_LIST_COLUMNS =
  "id, name, tagline, description, website_url, category, tags, pricing_type, is_china_available, is_chinese_supported, rating, rating_count, view_count, created_at, logo_url, main_category, sub_category";
