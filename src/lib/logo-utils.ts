/**
 * Extract domain from URL and generate DuckDuckGo icon URL
 * @param websiteUrl - The website URL (e.g., "https://chat.openai.com")
 * @returns DuckDuckGo icon URL (e.g., "https://icons.duckduckgo.com/ip3/openai.com.ico")
 */
export function getToolLogo(websiteUrl: string): string {
  try {
    // Remove protocol and www, extract domain
    const url = new URL(websiteUrl);
    let domain = url.hostname.replace(/^www\./, '');
    
    // For special cases like openai.com/chat -> openai.com
    const parts = domain.split('.');
    if (parts.length > 2) {
      // Keep the last two parts for domain (e.g., chat.openai.com -> openai.com)
      domain = parts.slice(-2).join('.');
    }
    
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch (error) {
    console.error('Invalid URL:', websiteUrl);
    return '';
  }
}

/**
 * Get fallback icon URL if primary fails
 * @param websiteUrl - The website URL
 * @returns Fallback icon URL
 */
export function getFallbackLogo(websiteUrl: string): string {
  try {
    const url = new URL(websiteUrl);
    const domain = url.hostname.replace(/^www\./, '');
    
    // Use Google favicon as fallback
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (error) {
    return '';
  }
}

/**
 * Ordered list of icon URLs to try (DB logo → DuckDuckGo → Google favicon).
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
  if (logoUrl) add(logoUrl.trim());
  add(getToolLogo(websiteUrl));
  add(getFallbackLogo(websiteUrl));
  return out;
}
