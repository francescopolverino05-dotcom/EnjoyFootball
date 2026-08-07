import type { Localized } from '../i18n/translations';
import type { AnalysisVideo, VideoClip } from './match';

export type TrainingStatus = 'draft' | 'in-review' | 'published';

/** Team or GK media for Full Session / Clips / Design / Video Analysis tabs */
export interface TrainingMediaBlock {
  /** Primary / highlight URL (optional if `parts` is set) */
  fullSession?: string;
  /** Session recordings shown on the Full Session tab */
  parts?: AnalysisVideo[];
  notes?: Localized;
}

/**
 * Goalkeeper unit content for a session (mirrors team fields).
 * Empty blocks are fine until the GK coach uploads schede / videos.
 */
export interface TrainingGoalkeepersBlock {
  video?: TrainingMediaBlock;
  clips: VideoClip[];
  /** Session-plan / schede PDFs; null or [] = none yet */
  trainingDesign?: AnalysisVideo[] | null;
  analysisVideos: AnalysisVideo[];
}

export interface TrainingSession {
  id: string;
  slug: string;
  /** ISO date YYYY-MM-DD — primary label on the site */
  date: string;
  title: Localized;
  /** Optional theme / focus of the session */
  focus?: Localized;
  location?: Localized;
  status: TrainingStatus;
  notes?: Localized;
  video?: TrainingMediaBlock;
  clips: VideoClip[];
  /** Coach docs / post-session analysis (PDF, markdown, analysis video) */
  analysisVideos: AnalysisVideo[];
  /**
   * Session plan / CamScanner sheets for the Training Design tab
   * (same entry shape as analysisVideos).
   */
  trainingDesign?: AnalysisVideo[];
  /**
   * Goalkeepers mode content (Full Session / Clips / Training Design / Video Analysis).
   * No Physical Load — that stays Team-only.
   */
  goalkeepers?: TrainingGoalkeepersBlock;
  vimeo?: {
    folderId?: string;
    folderUrl?: string;
    lastSyncedAt?: string;
  };
}

/** Empty GK block applied to every session until coach content arrives */
export const EMPTY_TRAINING_GOALKEEPERS: TrainingGoalkeepersBlock = {
  video: { parts: [] },
  clips: [],
  trainingDesign: null,
  analysisVideos: [],
};

export interface TrainingSummary {
  id: string;
  slug: string;
  date: string;
  title: Localized;
  focus?: Localized;
  status: TrainingStatus;
}
