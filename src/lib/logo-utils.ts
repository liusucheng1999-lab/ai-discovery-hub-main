/**
 * 从 URL 提取域名
 */
function extractDomain(websiteUrl: string): string {
  try {
    const url = new URL(websiteUrl);
    let domain = url.hostname.replace(/^www\./, '');
    // 对于 chat.openai.com 这类三级域名，取后两段
    const parts = domain.split('.');
    if (parts.length > 2) {
      domain = parts.slice(-2).join('.');
    }
    return domain;
  } catch {
    return '';
  }
}

/**
 * 生成 icon.horse 图标 URL（国内可用）
 * @param websiteUrl - 网站 URL（如 "https://chat.openai.com"）
 * @returns icon.horse 图标 URL（如 "https://icon.horse/icon/openai.com"）
 */
export function getToolLogo(websiteUrl: string): string {
  const domain = extractDomain(websiteUrl);
  return domain ? `https://icon.horse/icon/${domain}` : '';
}

/**
 * 生成 favicon.im 降级 URL（国内可用）
 * @param websiteUrl - 网站 URL
 * @returns favicon.im 图标 URL
 */
export function getFallbackLogo(websiteUrl: string): string {
  const domain = extractDomain(websiteUrl);
  return domain ? `https://favicon.im/${domain}` : '';
}

/**
 * 按优先级生成图标候选 URL 列表
 * 优先级：Supabase Storage (logoUrl) → icon.horse → favicon.im
 * 
 * 当批量上传脚本执行后，logoUrl 会指向 Supabase Storage CDN，
 * 因此 Storage 图标天然具有最高优先级，无需额外逻辑。
 */
export function getLogoCandidateUrls(websiteUrl: string, logoUrl?: string | null): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (u: string) => {
    if (u && !seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  };
  // 1. 最高优先级：数据库中的 logoUrl（上传脚本执行后指向 Supabase Storage）
  if (logoUrl) add(logoUrl.trim());
  // 2. 降级：icon.horse 图标服务
  add(getToolLogo(websiteUrl));
  // 3. 最终降级：favicon.im 图标服务
  add(getFallbackLogo(websiteUrl));
  return out;
}
