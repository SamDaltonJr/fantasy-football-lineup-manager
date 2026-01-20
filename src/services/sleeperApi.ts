// Sleeper API integration for NFL player data
// API docs: https://docs.sleeper.com/

export interface SleeperPlayer {
  player_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  position: string;
  team: string | null;
  fantasy_positions: string[];
  search_full_name: string;
  status: string;
}

const SLEEPER_API_BASE = 'https://api.sleeper.app/v1';

// Cache for player data
let playersCache: Record<string, SleeperPlayer> | null = null;

export async function fetchAllPlayers(): Promise<Record<string, SleeperPlayer>> {
  if (playersCache) {
    return playersCache;
  }

  try {
    const response = await fetch(`${SLEEPER_API_BASE}/players/nfl`);
    if (!response.ok) {
      throw new Error('Failed to fetch players from Sleeper API');
    }
    playersCache = await response.json();
    return playersCache!;
  } catch (error) {
    console.error('Error fetching Sleeper players:', error);
    throw error;
  }
}

export async function searchPlayers(query: string): Promise<SleeperPlayer[]> {
  const allPlayers = await fetchAllPlayers();
  const searchTerm = query.toLowerCase();

  const results = Object.values(allPlayers)
    .filter((player) => {
      if (!player.fantasy_positions || player.fantasy_positions.length === 0) {
        return false;
      }
      const fullName = player.full_name?.toLowerCase() || '';
      const searchFullName = player.search_full_name?.toLowerCase() || '';
      return fullName.includes(searchTerm) || searchFullName.includes(searchTerm);
    })
    .filter((player) => player.status === 'Active')
    .slice(0, 50); // Limit results

  return results;
}

// 2025 NFL bye weeks (these are actual 2025 schedule bye weeks)
export const BYE_WEEKS_2025: Record<string, number> = {
  // Week 5
  DET: 5,
  LAR: 5,
  PHI: 5,
  TEN: 5,

  // Week 6
  KC: 6,
  LAC: 6,
  MIA: 6,
  MIN: 6,

  // Week 7
  CHI: 7,
  DAL: 7,

  // Week 9
  CLE: 9,
  GB: 9,
  LV: 9,
  PIT: 9,
  SF: 9,
  SEA: 9,

  // Week 10
  ARI: 10,
  CAR: 10,
  NYG: 10,
  TB: 10,

  // Week 11
  BAL: 11,
  DEN: 11,
  HOU: 11,
  IND: 11,
  NE: 11,
  WAS: 11,

  // Week 12
  ATL: 12,
  BUF: 12,
  CIN: 12,
  JAX: 12,
  NO: 12,
  NYJ: 12,
};

export function getByeWeek(team: string | null): number {
  if (!team) return 14; // Default bye week
  return BYE_WEEKS_2025[team.toUpperCase()] || 14;
}
