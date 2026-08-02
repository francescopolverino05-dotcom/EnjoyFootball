import { mediaUrl, isVimeoUrl, vimeoEmbedUrl } from '../utils/mediaUrl';

interface MatchMediaProps {
  slug: string;
  /** Relative path under clips/analysis/video, or absolute http(s) / Vimeo URL */
  src: string;
  /** Folder prefix when src is a relative local file */
  kind?: 'clips' | 'analysis' | 'video' | null;
  title?: string;
  unsupportedLabel: string;
  fullHeight?: boolean;
}

/** Renders a local/remote MP4 or a Vimeo embed. */
export default function MatchMedia({
  slug,
  src,
  kind = null,
  title,
  unsupportedLabel,
  fullHeight = false,
}: MatchMediaProps) {
  if (isVimeoUrl(src)) {
    const embed = vimeoEmbedUrl(src);
    if (!embed) {
      return <div className="video-placeholder">{unsupportedLabel}</div>;
    }
    return (
      <div
        className={`video-player-wrap video-player-wrap--vimeo ${fullHeight ? 'video-player-wrap--full' : ''}`}
      >
        <iframe
          src={embed}
          title={title || 'Vimeo video'}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  const resolved =
    kind && !/^https?:\/\//i.test(src)
      ? mediaUrl(slug, kind, src)
      : mediaUrl(slug, src);

  return (
    <div className={`video-player-wrap ${fullHeight ? 'video-player-wrap--full' : ''}`}>
      <video controls playsInline preload="metadata" src={resolved}>
        {unsupportedLabel}
      </video>
    </div>
  );
}
