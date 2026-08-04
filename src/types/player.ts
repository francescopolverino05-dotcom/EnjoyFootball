export type PlayerSquad = 'Primavera' | 'U18';

export type PlayerFoot = 'Left' | 'Right' | 'Both';

export interface Player {
  slug: string;
  displayName: string;
  positionShort: string;
  /** Null when TBD (pending Excel / TM enrichment) */
  age: number | null;
  /** Display birth date as DD/MM/YYYY from source data; null when TBD */
  birthDate: string | null;
  foot: PlayerFoot | string | null;
  heightCm: number | null;
  weightKg: number | null;
  bmi: number | null;
  squad: PlayerSquad | string | null;
  photoPath: string | null;
}

export interface PlayersRoster {
  players: Player[];
}
