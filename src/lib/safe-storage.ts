// localStorage 在受限 iframe（sandbox 缺 allow-same-origin、第三方存储被拦截等）中会抛 SecurityError。
// 这里做读写降级：拿不到就退回内存 Map，保证当前会话内功能可用，只是不再跨刷新持久化。
const memoryFallback = new Map<string, string>();
let storageAvailable: boolean | null = null;

function isStorageAvailable(): boolean {
  if (storageAvailable !== null) return storageAvailable;
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  return storageAvailable;
}

export const safeStorage = {
  getItem(key: string): string | null {
    if (isStorageAvailable()) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // fall through to memory
      }
    }
    return memoryFallback.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    if (isStorageAvailable()) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // fall through to memory
      }
    }
    memoryFallback.set(key, value);
  },

  removeItem(key: string): void {
    if (isStorageAvailable()) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    memoryFallback.delete(key);
  },
};
