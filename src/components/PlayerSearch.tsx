import { useState } from 'react';
import { searchPlayers, SleeperPlayer, getByeWeek } from '../services/sleeperApi';
import { Position } from '../types';

interface PlayerSearchProps {
  onAddPlayer: (player: {
    name: string;
    position: Position;
    team: string;
    byeWeek: number;
  }) => void;
}

const POSITION_MAP: Record<string, Position> = {
  QB: 'QB',
  RB: 'RB',
  WR: 'WR',
  TE: 'TE',
  K: 'K',
  DEF: 'DST',
};

export function PlayerSearch({ onAddPlayer }: PlayerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SleeperPlayer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchPlayers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlayer = (sleeperPlayer: SleeperPlayer) => {
    const primaryPosition = sleeperPlayer.fantasy_positions?.[0] || 'RB';
    const mappedPosition = POSITION_MAP[primaryPosition] || 'BENCH';

    onAddPlayer({
      name: sleeperPlayer.full_name,
      position: mappedPosition as Position,
      team: sleeperPlayer.team || 'FA',
      byeWeek: getByeWeek(sleeperPlayer.team),
    });

    setSearchQuery('');
    setSearchResults([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
      >
        + Search & Add Player (2025 NFL Data)
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">Search Players</h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        placeholder="Search by player name..."
        autoFocus
      />

      {isSearching && (
        <div className="text-sm text-gray-500 text-center py-4">Searching...</div>
      )}

      {searchResults.length > 0 && (
        <div className="max-h-96 overflow-y-auto space-y-1">
          {searchResults.map((player) => (
            <div
              key={player.player_id}
              onClick={() => handleSelectPlayer(player)}
              className="p-3 hover:bg-gray-100 cursor-pointer rounded border border-gray-200"
            >
              <div className="font-bold text-sm">{player.full_name}</div>
              <div className="text-xs text-gray-600">
                {player.team || 'FA'} - {player.fantasy_positions?.join(', ')}
                {player.team && ` - Bye: Week ${getByeWeek(player.team)}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-4">
          No players found. Try a different search.
        </div>
      )}
    </div>
  );
}
