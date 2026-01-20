import { AppState, NFL_WEEKS, Player } from '../types';
import { PlayerCard } from './PlayerCard';
import { getPositionColors } from '../utils/colors';

interface LineupTableProps {
  state: AppState;
  onSlotClick: (week: number | 'draft', slotId: string) => void;
  onDragDrop: (fromWeek: number | 'draft', fromSlot: string, toWeek: number | 'draft', toSlot: string) => void;
  selectedSlot: { week: number | 'draft'; slotId: string } | null;
}

export function LineupTable({ state, onSlotClick, onDragDrop, selectedSlot }: LineupTableProps) {
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
    if (!playerId) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ week, slotId, playerId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toWeek: number | 'draft', toSlotId: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    onDragDrop(data.week, data.slotId, toWeek, toSlotId);
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
      <div className="inline-block min-w-full">
        {/* Header Row */}
        <div className="flex border-b-4 border-gray-400 bg-gray-100 sticky top-0 z-20">
          <div className="w-28 flex-shrink-0 p-3 font-bold text-sm sticky left-0 bg-gray-100 border-r-4 border-gray-400 z-10">
            Position
          </div>
          {allWeeks.map((week, idx) => (
            <div
              key={week}
              className={`w-44 flex-shrink-0 p-3 text-center font-bold text-sm border-r-4 ${
                week === 'draft'
                  ? 'bg-green-100 border-green-400 text-green-900'
                  : 'bg-gray-100 border-gray-400'
              }`}
            >
              {week === 'draft' ? 'Draft' : `Week ${week}`}
            </div>
          ))}
        </div>

        {/* Roster Rows */}
        {allSlots.map((slot) => {
          const colors = getPositionColors(slot.position);
          const isBenchOrIR = slot.position === 'BENCH' || slot.position === 'IR';
          const label = isBenchOrIR
            ? slot.position === 'BENCH'
              ? `Bench ${benchSlots.indexOf(slot) + 1}`
              : 'IR'
            : slot.label;

          return (
            <div key={slot.id} className="flex border-b-2 border-gray-300 hover:bg-gray-50">
              {/* Position Label */}
              <div
                className={`w-28 flex-shrink-0 p-3 flex items-center justify-center font-bold text-sm sticky left-0 z-10 ${colors.bg} ${colors.text} border-r-4 border-gray-400`}
              >
                <div className="text-center leading-tight">
                  <div>{slot.position}</div>
                  {isBenchOrIR && slot.position === 'BENCH' && (
                    <div className="text-[10px] opacity-75 font-normal">
                      #{benchSlots.indexOf(slot) + 1}
                    </div>
                  )}
                </div>
              </div>

              {/* Week Cells */}
              {allWeeks.map((week) => {
                const weekLineup = state.weekLineups.find((wl) => wl.week === week)!;
                const playerId = weekLineup.assignments[slot.id];
                const player = getPlayerById(playerId);
                const isSelected = selectedSlot?.week === week && selectedSlot?.slotId === slot.id;
                const isOnBye = week !== 'draft' && player?.byeWeek === week;

                return (
                  <div
                    key={week}
                    className={`w-44 flex-shrink-0 p-2 border-r-4 ${
                      week === 'draft' ? 'border-green-400 bg-green-50' : 'border-gray-400'
                    } ${isOnBye ? 'bg-red-50' : ''}`}
                    draggable={!!playerId}
                    onDragStart={(e) => handleDragStart(e, week, slot.id, playerId)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, week, slot.id)}
                  >
                    <PlayerCard
                      player={player}
                      slotLabel={label}
                      slotPosition={slot.position}
                      onClick={() => onSlotClick(week, slot.id)}
                      isSelected={isSelected}
                    />
                    {isOnBye && (
                      <div className="text-[10px] text-red-700 font-bold text-center mt-1">
                        BYE
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
