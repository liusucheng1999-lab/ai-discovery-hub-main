const ROOT_RELATIVE_URL = /\b(src|href|poster|action)=(['"])\/(?!\/)([^'"]*)\2/gi;
const ROOT_RELATIVE_CSS_URL = /url\(\s*(['"]?)\/(?!\/)([^)'"\s][^)]*?)\1\s*\)/gi;

/** Resolve URLs that would otherwise escape an app rendered through srcDoc. */
export function resolveHostedAppRootUrls(html: string, baseHref: string): string {
  const normalizedBase = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;

  return html
    .replace(ROOT_RELATIVE_URL, (_match, attribute: string, quote: string, path: string) => (
      `${attribute}=${quote}${normalizedBase}${path}${quote}`
    ))
    .replace(ROOT_RELATIVE_CSS_URL, (_match, quote: string, path: string) => (
      `url(${quote}${normalizedBase}${path}${quote})`
    ));
}

export function injectHostedAppBase(html: string, baseHref: string): string {
  if (/<base\s/i.test(html)) return html;

  const baseTag = `<base href="${baseHref}">`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}\n${baseTag}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (match) => `${match}\n<head>${baseTag}</head>`);
  }
  return `${baseTag}\n${html}`;
}

export function prepareHostedAppHtml(html: string, baseHref: string): string {
  return injectHostedAppBase(resolveHostedAppRootUrls(html, baseHref), baseHref);
}
