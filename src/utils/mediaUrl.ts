/**
 * Resolve a media path for the app.
 * - Absolute http(s) URLs are used as-is (GitHub Releases, Vimeo, CDN, etc.)
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

/** Extract a numeric Vimeo video id from common Vimeo URL shapes. */
export function vimeoVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (!/(^|\.)vimeo\.com$/i.test(url.hostname)) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    // /video/123, /123, /manage/videos/123, /showcase/…/video/123
    for (let i = parts.length - 1; i >= 0; i--) {
      if (/^\d+$/.test(parts[i])) return parts[i];
    }
  } catch {
    // not a URL
  }

  const m = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return m?.[1] ?? null;
}

export function isVimeoUrl(input: string): boolean {
  return vimeoVideoId(input) != null || /vimeo\.com/i.test(input);
}

/** Player embed URL for an iframe. */
export function vimeoEmbedUrl(input: string): string | null {
  const id = vimeoVideoId(input);
  if (!id) return null;
  return `https://player.vimeo.com/video/${id}`;
}
