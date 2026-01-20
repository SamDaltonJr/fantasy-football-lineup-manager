export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'DST' | 'K' | 'BENCH' | 'IR';

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: string;
  byeWeek: number;
}

export interface RosterSlot {
  id: string;
  position: Position;
  label: string;
  playerId: string | null;
}

export interface WeekLineup {
  week: number | 'draft';
  assignments: Record<string, string | null>; // slotId -> playerId
}

export interface LeagueFormat {
  slots: {
    position: Position;
    count: number;
    label?: string;
  }[];
}

export interface AppState {
  players: Player[];
  rosterSlots: RosterSlot[];
  weekLineups: WeekLineup[];
  leagueFormat: LeagueFormat;
  currentWeek: number;
}

export const DEFAULT_LEAGUE_FORMAT: LeagueFormat = {
  slots: [
    { position: 'QB', count: 1, label: 'Quarterback' },
    { position: 'RB', count: 2, label: 'Running Back' },
    { position: 'WR', count: 2, label: 'Wide Receiver' },
    { position: 'FLEX', count: 2, label: 'RB/WR/TE Flex' },
    { position: 'TE', count: 1, label: 'Tight End' },
    { position: 'DST', count: 1, label: 'Defense/Special Teams' },
    { position: 'BENCH', count: 5, label: 'Bench' },
    { position: 'IR', count: 1, label: 'Injured Reserve' },
  ],
};

export const NFL_WEEKS = 18;

// Check if a player's position is valid for a given slot position
export function isValidPlayerForSlot(playerPosition: Position, slotPosition: Position): boolean {
  // Bench and IR can hold any position
  if (slotPosition === 'BENCH' || slotPosition === 'IR') {
    return true;
  }

  // FLEX can hold RB, WR, or TE
  if (slotPosition === 'FLEX') {
    return playerPosition === 'RB' || playerPosition === 'WR' || playerPosition === 'TE';
  }

  // All other positions must match exactly
  return playerPosition === slotPosition;
}
