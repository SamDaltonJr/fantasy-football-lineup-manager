import { AppState, NFL_WEEKS, Player, isValidPlayerForSlot } from '../types';
import { PlayerCard } from './PlayerCard';
import { getPositionColors } from '../utils/colors';

interface LineupGridProps {
  state: AppState;
  onSlotClick: (week: number | 'draft', slotId: string) => void;
  onDragDrop: (fromWeek: number | 'draft', fromSlot: string, toWeek: number | 'draft', toSlot: string) => void;
  selectedSlot: { week: number | 'draft'; slotId: string } | null;
}

export function LineupGrid({ state, onSlotClick, onDragDrop, selectedSlot }: LineupGridProps) {
  const getPlayerById = (playerId: string | null) => {
    if (!playerId) return null;
    return state.players.find((p) => p.id === playerId) || null;
  };

  const starterSlots = state.rosterSlots.filter(
    (slot) => slot.position !== 'BENCH' && slot.position !== 'IR'
  );
  const benchSlots = state.rosterSlots.filter((slot) => slot.position === 'BENCH');
  const irSlots = state.rosterSlots.filter((slot) => slot.position === 'IR');

  const allSlots = [...starterSlots, ...benchSlots, ...irSlots];
  const allWeeks = ['draft' as const, ...Array.from({ length: NFL_WEEKS }, (_, i) => i + 1)];

  const handleDragStart = (e: React.DragEvent, week: number | 'draft', slotId: string, playerId: string | null) => {
    if (!playerId) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ week, slotId, playerId }));
  };

  const handleDragOver = (e: React.DragEvent, targetWeek: number | 'draft') => {
    const data = e.dataTransfer.types.includes('application/json');
    if (!data) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toWeek: number | 'draft', toSlotId: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));

    // Only allow drops within the same week
    if (data.week !== toWeek) {
      return;
    }

    // Get the player being dragged and the target slot
    const draggedPlayer = getPlayerById(data.playerId);
    const targetSlot = state.rosterSlots.find((s) => s.id === toSlotId);

    // Validate that the player can be placed in the target slot
    if (draggedPlayer && targetSlot && !isValidPlayerForSlot(draggedPlayer.position, targetSlot.position)) {
      // Invalid drop - player position doesn't match slot requirements
      return;
    }

    onDragDrop(data.week, data.slotId, toWeek, toSlotId);
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Fixed Position Labels Column */}
      <div className="flex-shrink-0 w-36 bg-gradient-to-b from-slate-100 to-slate-50 border-r-4 border-slate-300 sticky left-0 z-20">
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold flex items-center justify-center border-b-4 border-slate-400 shadow-lg">
          <span className="text-lg">Position</span>
        </div>

        {/* Position Labels */}
        {allSlots.map((slot) => {
          const colors = getPositionColors(slot.position);
          const isBench = slot.position === 'BENCH';
          const benchNum = isBench ? benchSlots.indexOf(slot) + 1 : 0;

          return (
            <div
              key={slot.id}
              className="flex items-center justify-center border-b-2 border-slate-200 font-bold text-sm shadow-sm"
              style={{
                height: '104px',
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              <div className="text-center">
                <div className="text-xl font-extrabold">{slot.position}</div>
                {isBench && <div className="text-xs opacity-75 font-semibold">#{benchNum}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable Weeks Grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="inline-flex">
          {allWeeks.map((week) => (
            <div key={week} className={`flex-shrink-0 w-56 ${week === 'draft' ? 'bg-gradient-to-b from-green-50 to-emerald-50' : 'bg-gradient-to-b from-white to-gray-50'}`}>
              {/* Week Header */}
              <div className={`h-16 ${week === 'draft' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-slate-600 to-slate-700'} text-white font-bold flex items-center justify-center border-b-4 ${week === 'draft' ? 'border-green-400' : 'border-slate-400'} border-r-4 shadow-md`}>
                <span className="text-lg">{week === 'draft' ? '🏈 DRAFT' : `Week ${week}`}</span>
              </div>

              {/* Week Column - Player Slots */}
              {allSlots.map((slot) => {
                const weekLineup = state.weekLineups.find((wl) => wl.week === week)!;
                const playerId = weekLineup.assignments[slot.id];
                const player = getPlayerById(playerId);
                const isSelected = selectedSlot?.week === week && selectedSlot?.slotId === slot.id;
                const isOnBye = week !== 'draft' && player?.byeWeek === week;

                return (
                  <div
                    key={slot.id}
                    className={`p-2 border-b-2 border-slate-200 border-r-4 ${
                      week === 'draft' ? 'border-r-green-400' : 'border-r-slate-300'
                    } ${isOnBye ? 'bg-red-50' : ''} transition-colors duration-150`}
                    style={{ height: '104px' }}
                    draggable={!!playerId}
                    onDragStart={(e) => handleDragStart(e, week, slot.id, playerId)}
                    onDragOver={(e) => handleDragOver(e, week)}
                    onDrop={(e) => handleDrop(e, week, slot.id)}
                  >
                    <div className="h-full relative">
                      <PlayerCard
                        player={player}
                        slotLabel={slot.label}
                        slotPosition={slot.position}
                        onClick={() => onSlotClick(week, slot.id)}
                        isSelected={isSelected}
                      />
                      {isOnBye && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          BYE
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
