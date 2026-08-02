import { useState } from 'react';
import { mediaUrl, isVimeoUrl, vimeoEmbedUrl } from '../utils/mediaUrl';

interface MatchMediaProps {
  slug: string;
  /** Relative path under clips/analysis/video, or absolute http(s) / Vimeo URL */
  src: string;
  /** Folder prefix when src is a relative local file */
  kind?: 'clips' | 'analysis' | 'video' | null;
  title?: string;
  unsupportedLabel: string;
  playLabel?: string;
  fullHeight?: boolean;
  /**
   * If false (default for grids), show a play button and only mount the Vimeo
   * iframe after click — avoids "having trouble" when many embeds load at once.
   */
  autoload?: boolean;
}

/** Renders a local/remote MP4 or a Vimeo embed. */
export default function MatchMedia({
  slug,
  src,
  kind = null,
  title,
  unsupportedLabel,
  playLabel = 'Play',
  fullHeight = false,
  autoload = false,
}: MatchMediaProps) {
  const [playing, setPlaying] = useState(autoload);

  if (isVimeoUrl(src)) {
    const embed = vimeoEmbedUrl(src);
    if (!embed) {
      return <div className="video-placeholder">{unsupportedLabel}</div>;
    }

    if (!playing) {
      return (
        <div
          className={`video-player-wrap video-player-wrap--vimeo video-player-wrap--poster ${fullHeight ? 'video-player-wrap--full' : ''}`}
        >
          <button
            type="button"
            className="vimeo-play-button"
            onClick={() => setPlaying(true)}
            aria-label={playLabel}
          >
            <span className="vimeo-poster vimeo-poster--empty" />
            <span className="vimeo-play-icon" aria-hidden />
            <span className="vimeo-play-text">{playLabel}</span>
          </button>
        </div>
      );
    }

    const embedSrc = `${embed}${embed.includes('?') ? '&' : '?'}autoplay=1`;
    return (
      <div
        className={`video-player-wrap video-player-wrap--vimeo ${fullHeight ? 'video-player-wrap--full' : ''}`}
      >
        <iframe
          src={embedSrc}
          title={title || 'Vimeo video'}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
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
