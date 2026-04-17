type CacheEntry<T> = { data: T; expiresAt: number };

const inflight = new Map<string, Promise<unknown>>();
const resultCache = new Map<string, CacheEntry<unknown>>();

/**
 * Coalesces concurrent calls and briefly reuses the last result so React Strict Mode
 * (double mount in dev) and rapid remounts do not duplicate identical network work.
 * Call `bustDedupeCache` after mutations so the next load always hits the server.
 */
export function dedupeAsync<T>(key: string, fn: () => Promise<T>, ttlMs: number = 2_500): Promise<T> {
  const now = Date.now();
  const cached = resultCache.get(key);
  if (cached && cached.expiresAt > now) {
    return Promise.resolve(cached.data as T);
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = fn()
    .then((data) => {
      inflight.delete(key);
      if (ttlMs > 0) {
        resultCache.set(key, { data, expiresAt: Date.now() + ttlMs });
      }
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise as Promise<T>;
}

export function bustDedupeCache(key: string) {
  inflight.delete(key);
  resultCache.delete(key);
}
