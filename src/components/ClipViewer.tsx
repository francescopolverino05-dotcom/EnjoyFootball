import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  closeClipViewer,
  stepClipViewer,
  useClipViewerState,
} from '../utils/clipViewerStore';
import { vimeoEmbedUrl } from '../utils/mediaUrl';

/**
 * Site-wide Vimeo clip viewer. A single wrapper element holds the iframe, the
 * prev/next buttons and the title/counter, so fullscreen is requested on OUR
 * container (not the iframe) and persists while the clip is swapped.
 * ArrowRight/ArrowLeft cycle through the clips of the current group.
 */
export default function ClipViewer() {
  const viewer = useClipViewerState();
  if (!viewer) return null;
  return <ClipViewerInner key="clip-viewer" />;
}

function ClipViewerInner() {
  const viewer = useClipViewerState();
  const { t } = useLanguage();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isFs, setIsFs] = useState(false);
  const clips = viewer?.clips ?? [];
  const index = viewer?.index ?? 0;
  const clip = clips[index];

  const focusWrap = useCallback(() => {
    wrapRef.current?.focus({ preventScroll: true });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => undefined);
    }
    focusWrap();
  }, [focusWrap]);

  // Keyboard: arrows cycle clips, Esc leaves fullscreen first, then closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepClipViewer(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepClipViewer(-1);
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) closeClipViewer();
      } else if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [toggleFullscreen]);

  // Vimeo's iframe takes keyboard focus when clicked; take it back so the
  // arrow keys keep reaching us (clicks inside the player still work).
  useEffect(() => {
    const onBlur = () => {
      window.setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME') focusWrap();
      }, 0);
    };
    window.addEventListener('blur', onBlur);
    const poll = window.setInterval(() => {
      if (document.activeElement?.tagName === 'IFRAME') focusWrap();
    }, 400);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.clearInterval(poll);
    };
  }, [focusWrap]);

  useEffect(() => {
    const onFs = () => {
      setIsFs(document.fullscreenElement === wrapRef.current);
      focusWrap();
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, [focusWrap]);

  // Lock page scroll while open; leave fullscreen on close.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    focusWrap();
    return () => {
      document.body.style.overflow = prev;
      if (document.fullscreenElement) void document.exitFullscreen();
    };
  }, [focusWrap]);

  if (!clip) return null;
  const embed = vimeoEmbedUrl(clip.src);
  let embedSrc = '';
  if (embed) {
    const u = new URL(embed);
    u.searchParams.set('autoplay', '1');
    u.searchParams.set('keyboard', '0');
    embedSrc = u.toString();
  }
  const multi = clips.length > 1;

  return (
    <div
      className="clip-viewer"
      ref={wrapRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={clip.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeClipViewer();
      }}
    >
      <div className="clip-viewer__bar">
        <div className="clip-viewer__title">
          <span className="clip-viewer__count">
            {index + 1}/{clips.length}
          </span>
          <span className="clip-viewer__name">{clip.title}</span>
        </div>
        <div className="clip-viewer__actions">
          <button type="button" onClick={toggleFullscreen}>
            {isFs ? t('clipViewerExitFullscreen') : t('clipViewerFullscreen')}
          </button>
          <button type="button" onClick={closeClipViewer}>
            {t('clipViewerClose')}
          </button>
        </div>
      </div>
      <div className="clip-viewer__stage">
        {multi ? (
          <button
            type="button"
            className="clip-viewer__nav clip-viewer__nav--prev"
            onClick={() => stepClipViewer(-1)}
            aria-label={t('clipViewerPrev')}
          >
            ‹
          </button>
        ) : null}
        <div className="clip-viewer__video">
          {embedSrc ? (
            <iframe
              key={clip.src}
              src={embedSrc}
              title={clip.title}
              allow="autoplay; picture-in-picture; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : null}
        </div>
        {multi ? (
          <button
            type="button"
            className="clip-viewer__nav clip-viewer__nav--next"
            onClick={() => stepClipViewer(1)}
            aria-label={t('clipViewerNext')}
          >
            ›
          </button>
        ) : null}
      </div>
      <div className="clip-viewer__hint">{t('clipViewerHint')}</div>
    </div>
  );
}
