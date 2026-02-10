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
