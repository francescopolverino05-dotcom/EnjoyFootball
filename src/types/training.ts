import type { Localized } from '../i18n/translations';
import type { AnalysisVideo, VideoClip } from './match';

export type TrainingStatus = 'draft' | 'in-review' | 'published';

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
  video?: {
    /** Primary / highlight URL (optional if `parts` is set) */
    fullSession?: string;
    /** Session recordings shown on the Full Session tab */
    parts?: AnalysisVideo[];
    notes?: Localized;
  };
  clips: VideoClip[];
  /** Coach docs / post-session analysis (PDF, markdown, analysis video) */
  analysisVideos: AnalysisVideo[];
  /**
   * Session plan / CamScanner sheets for the Training Design tab
   * (same entry shape as analysisVideos).
   */
  trainingDesign?: AnalysisVideo[];
  vimeo?: {
    folderId?: string;
    folderUrl?: string;
    lastSyncedAt?: string;
  };
}

export interface TrainingSummary {
  id: string;
  slug: string;
  date: string;
  title: Localized;
  focus?: Localized;
  status: TrainingStatus;
}
