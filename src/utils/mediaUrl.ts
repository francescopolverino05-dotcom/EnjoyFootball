/**
 * Resolve a media path for the app.
 * - Absolute http(s) URLs are used as-is (GitHub Releases, CDN, etc.)
 * - Relative paths are served from /matches/<slug>/...
 */
export function mediaUrl(slug: string, ...parts: string[]): string {
  const absolute = parts.find((p) => /^https?:\/\//i.test(p));
  if (absolute) return absolute;

  const encoded = parts
    .flatMap((p) => p.split('/'))
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `/matches/${slug}/${encoded}`;
}
