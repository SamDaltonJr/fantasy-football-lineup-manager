import { useState, useEffect } from 'react';
import { AppState, Player } from './types';
import { getInitialState, loadState, saveState } from './utils/storage';
import { LineupGrid } from './components/LineupGrid';
import { PlayerList } from './components/PlayerList';
import { PlayerSearch } from './components/PlayerSearch';
import { AddPlayerForm } from './components/AddPlayerForm';

function App() {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState();
    return loaded || getInitialState();
  });

  const [selectedSlot, setSelectedSlot] = useState<{ week: number | 'draft'; slotId: string } | null>(
    null
  );
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleSlotClick = (week: number | 'draft', slotId: string) => {
    if (selectedPlayerId) {
      assignPlayerToSlot(selectedPlayerId, week, slotId);
      setSelectedPlayerId(null);
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ week, slotId });
    }
  };

  const handlePlayerSelect = (player: Player) => {
    if (selectedSlot) {
      assignPlayerToSlot(player.id, selectedSlot.week, selectedSlot.slotId);
      setSelectedSlot(null);
      setSelectedPlayerId(null);
    } else {
      setSelectedPlayerId(player.id);
    }
  };

  const assignPlayerToSlot = (playerId: string, week: number | 'draft', slotId: string) => {
    setState((prev) => {
      const newWeekLineups = prev.weekLineups.map((wl) =>
        wl.week === week
          ? {
              ...wl,
              assignments: {
                ...wl.assignments,
                [slotId]: playerId,
              },
            }
          : wl
      );
      return { ...prev, weekLineups: newWeekLineups };
    });
  };

  const handleAddPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}-${Math.random()}`,
    };
    setState((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  };

  const handleRemovePlayer = (playerId: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
      weekLineups: prev.weekLineups.map((wl) => ({
        ...wl,
        assignments: Object.fromEntries(
          Object.entries(wl.assignments).map(([slotId, pid]) => [
            slotId,
            pid === playerId ? null : pid,
          ])
        ),
      })),
    }));
    setSelectedPlayerId(null);
  };

  const handleClearSlot = () => {
    if (selectedSlot) {
      setState((prev) => {
        const newWeekLineups = prev.weekLineups.map((wl) =>
          wl.week === selectedSlot.week
            ? {
                ...wl,
                assignments: {
                  ...wl.assignments,
                  [selectedSlot.slotId]: null,
                },
              }
            : wl
        );
        return { ...prev, weekLineups: newWeekLineups };
      });
      setSelectedSlot(null);
    }
  };

  const handleCopyDraftToAllWeeks = () => {
    const draftLineup = state.weekLineups.find((wl) => wl.week === 'draft');
    if (draftLineup) {
      setState((prev) => {
        const newWeekLineups = prev.weekLineups.map((wl) =>
          wl.week === 'draft' ? wl : { ...wl, assignments: { ...draftLineup.assignments } }
        );
        return { ...prev, weekLineups: newWeekLineups };
      });
    }
  };

  const handleDragDrop = (
    fromWeek: number | 'draft',
    fromSlot: string,
    toWeek: number | 'draft',
    toSlot: string
  ) => {
    setState((prev) => {
      const fromLineup = prev.weekLineups.find((wl) => wl.week === fromWeek)!;
      const toLineup = prev.weekLineups.find((wl) => wl.week === toWeek)!;

      const fromPlayerId = fromLineup.assignments[fromSlot];
      const toPlayerId = toLineup.assignments[toSlot];

      // Swap players
      const newWeekLineups = prev.weekLineups.map((wl) => {
        // If dragging within the same week, update both slots in one operation
        if (fromWeek === toWeek && wl.week === fromWeek) {
          return {
            ...wl,
            assignments: {
              ...wl.assignments,
              [fromSlot]: toPlayerId,
              [toSlot]: fromPlayerId,
            },
          };
        }

        // Otherwise handle separate weeks
        if (wl.week === fromWeek) {
          return {
            ...wl,
            assignments: {
              ...wl.assignments,
              [fromSlot]: toPlayerId,
            },
          };
        }
        if (wl.week === toWeek) {
          return {
            ...wl,
            assignments: {
              ...wl.assignments,
              [toSlot]: fromPlayerId,
            },
          };
        }
        return wl;
      });

      return { ...prev, weekLineups: newWeekLineups };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with gradient */}
        <header className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">
              🏈 Fantasy Football Lineup Manager
            </h1>
            <p className="text-indigo-100 text-lg">
              Plan your lineup for every week • Drag & drop to optimize • 2025 NFL Season
            </p>
          </div>
        </header>

        {/* Action Buttons with better styling */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={handleCopyDraftToAllWeeks}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm flex items-center gap-2"
          >
            <span>📋</span> Copy Draft to All Weeks
          </button>

          {selectedSlot && (
            <button
              onClick={handleClearSlot}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm flex items-center gap-2"
            >
              <span>🗑️</span> Clear Slot ({selectedSlot.week === 'draft' ? 'Draft' : `Week ${selectedSlot.week}`})
            </button>
          )}

          {selectedPlayerId && (
            <button
              onClick={() => handleRemovePlayer(selectedPlayerId)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm flex items-center gap-2"
            >
              <span>❌</span> Remove Selected Player
            </button>
          )}
        </div>

        <div className="flex gap-6 items-start">
          {/* Player Management Sidebar with enhanced styling */}
          <div className="w-80 flex-shrink-0 space-y-4 sticky top-6">
            <PlayerSearch onAddPlayer={handleAddPlayer} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-3 text-sm text-gray-500">or</span>
              </div>
            </div>

            <AddPlayerForm onAddPlayer={handleAddPlayer} />

            <PlayerList
              players={state.players}
              onSelectPlayer={handlePlayerSelect}
              selectedPlayerId={selectedPlayerId}
            />

            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-md">
              <h3 className="font-bold text-blue-900 mb-3 text-base flex items-center gap-2">
                <span>💡</span> How to use
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Search for players with 2025 NFL data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Set up your Draft column (green)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Click "Copy Draft to All Weeks"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>Drag & drop players between slots</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span>Scroll right to see all 18 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Red highlights = bye weeks</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Lineup Grid with enhanced shadow */}
          <div className="flex-1 min-w-0">
            <LineupGrid
              state={state}
              onSlotClick={handleSlotClick}
              onDragDrop={handleDragDrop}
              selectedSlot={selectedSlot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
