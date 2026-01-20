import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  selectedPlayerId: string | null;
}

export function PlayerList({ players, onSelectPlayer, selectedPlayerId }: PlayerListProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    const posOrder: Record<string, number> = { QB: 1, RB: 2, WR: 3, TE: 4, DST: 5, K: 6 };
    const aOrder = posOrder[a.position] || 99;
    const bOrder = posOrder[b.position] || 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Available Players</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedPlayers.length === 0 ? (
          <p className="text-gray-500 text-sm">No players added yet. Add players below.</p>
        ) : (
          sortedPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className={`p-3 rounded border-2 cursor-pointer transition-all ${
                selectedPlayerId === player.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-gray-900">{player.name}</div>
                  <div className="text-sm text-gray-600">
                    {player.team} - {player.position}
                  </div>
                </div>
                <div className="text-xs text-gray-500">Bye: Week {player.byeWeek}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
