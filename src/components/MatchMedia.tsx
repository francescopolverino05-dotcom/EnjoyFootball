import { useState } from 'react';
import {
  sessionMediaUrl,
  isVimeoUrl,
  isPdfSrc,
  isMarkdownSrc,
  isDocxSrc,
  vimeoEmbedUrl,
  type MediaLibrary,
} from '../utils/mediaUrl';

interface MatchMediaProps {
  slug: string;
  library?: MediaLibrary;
  /** Relative path under clips/analysis/video, or absolute http(s) / Vimeo URL */
  src: string;
  /** Folder prefix when src is a relative local file */
  kind?: 'clips' | 'analysis' | 'video' | null;
  title?: string;
  unsupportedLabel: string;
  playLabel?: string;
  openPdfLabel?: string;
  downloadPdfLabel?: string;
  openReportLabel?: string;
  openDocLabel?: string;
  fullHeight?: boolean;
  /**
   * If false (default for grids), show a play button and only mount the Vimeo
   * iframe after click — avoids "having trouble" when many embeds load at once.
   */
  autoload?: boolean;
}

/** Renders a local/remote MP4, a Vimeo embed, or an analysis document. */
export default function MatchMedia({
  slug,
  library = 'matches',
  src,
  kind = null,
  title,
  unsupportedLabel,
  playLabel = 'Play',
  openPdfLabel = 'Open PDF',
  downloadPdfLabel = 'Download',
  openReportLabel = 'Open report',
  openDocLabel = 'Open Word document',
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

    const embedUrl = new URL(embed);
    embedUrl.searchParams.set('autoplay', '1');
    return (
      <div
        className={`video-player-wrap video-player-wrap--vimeo ${fullHeight ? 'video-player-wrap--full' : ''}`}
      >
        <iframe
          src={embedUrl.toString()}
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
      ? sessionMediaUrl(library, slug, kind, src)
      : sessionMediaUrl(library, slug, src);

  if (isPdfSrc(src)) {
    return (
      <div
        className={`video-player-wrap video-player-wrap--pdf ${fullHeight ? 'video-player-wrap--full' : ''}`}
      >
        <iframe src={resolved} title={title || 'PDF'} className="pdf-frame" />
        <div className="pdf-actions">
          <a
            className="pdf-action"
            href={resolved}
            target="_blank"
            rel="noopener noreferrer"
          >
            {openPdfLabel}
          </a>
          <a className="pdf-action pdf-action--secondary" href={resolved} download>
            {downloadPdfLabel}
          </a>
        </div>
      </div>
    );
  }

  if (isDocxSrc(src) || isMarkdownSrc(src)) {
    const openLabel = isDocxSrc(src) ? openDocLabel : openReportLabel;
    return (
      <div
        className={`video-player-wrap video-player-wrap--pdf video-player-wrap--doc ${fullHeight ? 'video-player-wrap--full' : ''}`}
      >
        <div className="doc-card-preview" aria-hidden>
          <span className="doc-card-icon">{isDocxSrc(src) ? 'DOCX' : 'MD'}</span>
          <span className="doc-card-title">{title || 'Report'}</span>
        </div>
        <div className="pdf-actions">
          <a
            className="pdf-action"
            href={resolved}
            target="_blank"
            rel="noopener noreferrer"
          >
            {openLabel}
          </a>
          <a className="pdf-action pdf-action--secondary" href={resolved} download>
            {downloadPdfLabel}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-player-wrap ${fullHeight ? 'video-player-wrap--full' : ''}`}>
      <video controls playsInline preload="metadata" src={resolved}>
        {unsupportedLabel}
      </video>
    </div>
  );
}
