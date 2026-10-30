import { useSyncExternalStore } from 'react';

export interface ViewerClip {
  src: string;
  title: string;
}

interface ViewerState {
  clips: ViewerClip[];
  index: number;
}

let state: ViewerState | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openClipViewer(clips: ViewerClip[], index: number) {
  if (!clips.length) return;
  state = { clips, index: Math.min(Math.max(index, 0), clips.length - 1) };
  emit();
}

export function closeClipViewer() {
  if (!state) return;
  state = null;
  emit();
}

export function stepClipViewer(delta: number) {
  if (!state) return;
  const n = state.clips.length;
  state = { ...state, index: (state.index + delta + n) % n };
  emit();
}

export function useClipViewerState(): ViewerState | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

/**
 * Collect the playable Vimeo clips that sit in the same grid as `trigger`
 * (e.g. all Monopoli corner clips) so arrow keys can cycle through them.
 */
export function collectClipGroup(trigger: HTMLElement): {
  clips: ViewerClip[];
  index: number;
} {
  const scope =
    trigger.closest<HTMLElement>('[data-clip-group], .analysis-grid, .clip-grid') ??
    trigger.parentElement;
  const nodes = scope
    ? Array.from(scope.querySelectorAll<HTMLElement>('[data-clip-src]'))
    : [trigger];
  const list = nodes.length ? nodes : [trigger];
  const clips = list.map((n) => ({
    src: n.dataset.clipSrc ?? '',
    title: n.dataset.clipTitle ?? '',
  }));
  const index = Math.max(list.indexOf(trigger), 0);
  return { clips, index };
}
