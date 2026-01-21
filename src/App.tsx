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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    console.log('Dark mode changed:', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with gradient */}
        <header className="mb-8">
          <div className={`rounded-2xl shadow-xl p-8 text-white relative ${
            darkMode
              ? 'bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
          }`}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="absolute top-4 right-4 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
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
                <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center">
                <span className={`px-3 text-sm ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-400'
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-500'
                }`}>or</span>
              </div>
            </div>

            <AddPlayerForm onAddPlayer={handleAddPlayer} />

            <PlayerList
              players={state.players}
              onSelectPlayer={handlePlayerSelect}
              selectedPlayerId={selectedPlayerId}
            />

            <div className={`p-5 rounded-xl border shadow-md ${
              darkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <h3 className={`font-bold mb-3 text-base flex items-center gap-2 ${
                darkMode ? 'text-blue-300' : 'text-blue-900'
              }`}>
                <span>💡</span> How to use
              </h3>
              <ul className={`text-sm space-y-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
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
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
