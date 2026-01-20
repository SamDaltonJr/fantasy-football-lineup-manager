import { AppState, DEFAULT_LEAGUE_FORMAT, NFL_WEEKS } from '../types';

const STORAGE_KEY = 'fantasy_lineup_manager';

export function generateRosterSlots(leagueFormat: AppState['leagueFormat']) {
  const slots = [];
  let slotId = 0;

  for (const slotConfig of leagueFormat.slots) {
    for (let i = 0; i < slotConfig.count; i++) {
      slots.push({
        id: `slot-${slotId++}`,
        position: slotConfig.position,
        label: slotConfig.label || slotConfig.position,
        playerId: null,
      });
    }
  }

  return slots;
}

export function generateWeekLineups(slotIds: string[]) {
  const lineups = [];

  // Add draft lineup first
  const draftAssignments: Record<string, string | null> = {};
  slotIds.forEach(slotId => {
    draftAssignments[slotId] = null;
  });
  lineups.push({
    week: 'draft' as const,
    assignments: draftAssignments,
  });

  // Then add all regular weeks
  for (let week = 1; week <= NFL_WEEKS; week++) {
    const assignments: Record<string, string | null> = {};
    slotIds.forEach(slotId => {
      assignments[slotId] = null;
    });

    lineups.push({
      week,
      assignments,
    });
  }

  return lineups;
}

export function getInitialState(): AppState {
  const rosterSlots = generateRosterSlots(DEFAULT_LEAGUE_FORMAT);
  const weekLineups = generateWeekLineups(rosterSlots.map(s => s.id));

  return {
    players: [],
    rosterSlots,
    weekLineups,
    leagueFormat: DEFAULT_LEAGUE_FORMAT,
    currentWeek: 1,
  };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export function loadState(): AppState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return null;
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
