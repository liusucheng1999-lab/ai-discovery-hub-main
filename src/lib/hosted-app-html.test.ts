import { describe, expect, it } from 'vitest';
import { prepareHostedAppHtml, resolveHostedAppRootUrls } from './hosted-app-html';

const baseHref = 'https://storage.example.test/user/app/';

describe('hosted app HTML preparation', () => {
  it('resolves root-relative module, stylesheet and inline CSS URLs', () => {
    const html = `<!doctype html><html><head>
      <script type="module" src="/assets/app.js"></script>
      <link rel="stylesheet" href='/assets/app.css'>
      <style>.logo{background:url("/images/logo.png")}</style>
    </head></html>`;

    const result = prepareHostedAppHtml(html, baseHref);

    expect(result).toContain(`src="${baseHref}assets/app.js"`);
    expect(result).toContain(`href='${baseHref}assets/app.css'`);
    expect(result).toContain(`url("${baseHref}images/logo.png")`);
    expect(result).toContain(`<base href="${baseHref}">`);
  });

  it('leaves external, protocol-relative, data and fragment URLs untouched', () => {
    const html = '<script src="https://cdn.test/app.js"></script><img src="//cdn.test/a.png"><a href="#tab">Tab</a><img src="data:image/png;base64,a">';
    expect(resolveHostedAppRootUrls(html, baseHref)).toBe(html);
  });

  it('does not add a second base tag', () => {
    const html = '<html><head><base href="https://existing.test/"></head></html>';
    expect(prepareHostedAppHtml(html, baseHref).match(/<base\s/g)).toHaveLength(1);
  });
});
