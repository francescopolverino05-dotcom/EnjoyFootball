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
    fullSession?: string;
    notes?: Localized;
  };
  clips: VideoClip[];
  analysisVideos: AnalysisVideo[];
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
