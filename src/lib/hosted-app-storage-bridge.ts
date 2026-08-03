// 托管应用跑在 srcDoc + sandbox（无 allow-same-origin）的 iframe 里，天生没有 origin，
// 拿不到真正的 localStorage —— 这是 Supabase Storage 对公开桶文件强制下发
// `Content-Security-Policy: sandbox` 导致的，改不了 iframe 的 src 也绕不开。
//
// 这里用 postMessage 搭一条桥：给 iframe 注入一段 shim，把 window.localStorage
// 换成一个内存里的 Map，读写都是同步的（跟真实 localStorage 行为一致），
// 每次写入再异步通知父页面持久化到父页面自己的 localStorage（按 appId 隔离，
// 不会碰到本站自己的 key，比如登录态）。效果类似"浏览器本地 cookie"——
// 存在访问者自己的浏览器里，不进数据库，只是换了个持久化的落地点。
const MESSAGE_TAG = "__hostedAppStorage";

export function storageKeyFor(appId: string): string {
  return `hosted-app-storage:${appId}`;
}

export function buildStorageShimScript(appId: string, initialData: Record<string, string>): string {
  // JSON.stringify 本身会转义引号，但 </script> 里的 "</" 得单独处理，
  // 否则值里如果含有这个子串会提前把注入的 <script> 标签截断。
  const safeAppId = JSON.stringify(appId).replace(/</g, "\\u003c");
  const safeInitialData = JSON.stringify(initialData).replace(/</g, "\\u003c");

  return `<script>(function(){
  var APP_ID = ${safeAppId};
  var store = Object.assign(Object.create(null), ${safeInitialData});
  function persist(){
    try {
      window.parent.postMessage({ ${JSON.stringify(MESSAGE_TAG)}: true, appId: APP_ID, data: store }, '*');
    } catch (e) {}
  }
  var shim = {
    getItem: function(k){ k = String(k); return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem: function(k, v){ store[String(k)] = String(v); persist(); },
    removeItem: function(k){ delete store[String(k)]; persist(); },
    clear: function(){ store = Object.create(null); persist(); },
    key: function(i){ var keys = Object.keys(store); return (i >= 0 && i < keys.length) ? keys[i] : null; },
    get length(){ return Object.keys(store).length; }
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: shim, configurable: true, writable: false });
  } catch (e) {}
})();</script>`;
}

export function injectStorageShim(html: string, appId: string, initialData: Record<string, string>): string {
  const shimTag = buildStorageShimScript(appId, initialData);
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => `${m}\n${shimTag}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (m) => `${m}\n<head>${shimTag}</head>`);
  }
  return `${shimTag}\n${html}`;
}

export interface HostedAppStorageMessage {
  appId: string;
  data: Record<string, string>;
}

export function readHostedAppStorageMessage(event: MessageEvent): HostedAppStorageMessage | null {
  const payload = event.data;
  if (!payload || typeof payload !== "object" || payload[MESSAGE_TAG] !== true) {
    return null;
  }
  if (typeof payload.appId !== "string" || typeof payload.data !== "object" || payload.data === null) {
    return null;
  }
  return { appId: payload.appId, data: payload.data as Record<string, string> };
}
