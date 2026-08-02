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

export type VimeoRef = {
  id: string;
  /** Privacy hash required for unlisted embeds (`?h=`). */
  hash?: string;
};

/**
 * Parse a Vimeo watch/share URL into id + optional unlisted privacy hash.
 * Examples:
 *   https://vimeo.com/1214967818/66528e5705
 *   https://vimeo.com/1214967818?h=66528e5705
 *   https://player.vimeo.com/video/1214967818?h=66528e5705
 */
export function parseVimeoRef(input: string): VimeoRef | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return { id: trimmed };

  try {
    const url = new URL(trimmed);
    if (!/(^|\.)vimeo\.com$/i.test(url.hostname)) return null;

    const hashParam = url.searchParams.get('h') || undefined;
    const parts = url.pathname.split('/').filter(Boolean);

    // player.vimeo.com/video/ID
    const videoIdx = parts.findIndex((p) => p === 'video');
    if (videoIdx >= 0 && parts[videoIdx + 1] && /^\d+$/.test(parts[videoIdx + 1])) {
      return { id: parts[videoIdx + 1], hash: hashParam };
    }

    // vimeo.com/ID/HASH or vimeo.com/ID
    for (let i = 0; i < parts.length; i++) {
      if (/^\d+$/.test(parts[i])) {
        const next = parts[i + 1];
        const pathHash =
          next && /^[a-f0-9]{6,}$/i.test(next) ? next : undefined;
        return { id: parts[i], hash: hashParam || pathHash };
      }
    }
  } catch {
    // not a URL
  }

  const m = trimmed.match(
    /vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-f0-9]+))?/i
  );
  if (!m) return null;
  return { id: m[1], hash: m[2] };
}

/** Extract a numeric Vimeo video id from common Vimeo URL shapes. */
export function vimeoVideoId(input: string): string | null {
  return parseVimeoRef(input)?.id ?? null;
}

export function isVimeoUrl(input: string): boolean {
  return parseVimeoRef(input) != null || /vimeo\.com/i.test(input);
}

/** Player embed URL for an iframe (includes unlisted privacy hash when present). */
export function vimeoEmbedUrl(input: string): string | null {
  const ref = parseVimeoRef(input);
  if (!ref) return null;
  const params = new URLSearchParams();
  if (ref.hash) params.set('h', ref.hash);
  const qs = params.toString();
  return `https://player.vimeo.com/video/${ref.id}${qs ? `?${qs}` : ''}`;
}
