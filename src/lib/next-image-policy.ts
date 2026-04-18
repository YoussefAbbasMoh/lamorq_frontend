/**
 * Use `next/image` only for same-origin / public paths. Remote http(s) URLs use `<img>` so we
 * never depend on `images.remotePatterns` matching every CDN (avoids runtime errors if config
 * is missed or Next’s matcher differs). Local assets still get optimization.
 */
export function shouldOptimizeRemoteImage(src: string): boolean {
  return !/^https?:\/\//i.test(src);
}
