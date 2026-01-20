import { AppState, Player } from '../types';
import { PlayerCard } from './PlayerCard';
import { getPositionColors } from '../utils/colors';

interface WeekColumnTableProps {
  week: number | 'draft';
  state: AppState;
  onSlotClick: (week: number | 'draft', slotId: string) => void;
  onDragDrop: (fromWeek: number | 'draft', fromSlot: string, toWeek: number | 'draft', toSlot: string) => void;
  selectedSlot: { week: number | 'draft'; slotId: string } | null;
}

export function WeekColumnTable({ week, state, onSlotClick, onDragDrop, selectedSlot }: WeekColumnTableProps) {
  const getPlayerById = (playerId: string | null) => {
    if (!playerId) return null;
    return state.players.find((p) => p.id === playerId) || null;
  };

  const weekLineup = state.weekLineups.find((wl) => wl.week === week)!;

  const starterSlots = state.rosterSlots.filter(
    (slot) => slot.position !== 'BENCH' && slot.position !== 'IR'
  );
  const benchSlots = state.rosterSlots.filter((slot) => slot.position === 'BENCH');
  const irSlots = state.rosterSlots.filter((slot) => slot.position === 'IR');

  const allSlots = [...starterSlots, ...benchSlots, ...irSlots];

  const handleDragStart = (e: React.DragEvent, slotId: string, playerId: string | null) => {
    if (!playerId) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ week, slotId, playerId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toSlotId: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    onDragDrop(data.week, data.slotId, week, toSlotId);
  };

  const isDraft = week === 'draft';

  return (
    <div className={`flex-shrink-0 w-56 ${isDraft ? 'bg-green-50' : 'bg-white'} rounded-lg shadow-lg border-4 ${isDraft ? 'border-green-500' : 'border-gray-400'}`}>
      {/* Week Header */}
      <div className={`p-3 ${isDraft ? 'bg-green-600' : 'bg-gray-700'} text-white text-center font-bold rounded-t-md sticky top-0 z-10`}>
        {isDraft ? 'DRAFT' : `Week ${week}`}
      </div>

      {/* Player Slots */}
      <div className="p-2 space-y-2">
        {allSlots.map((slot, idx) => {
          const playerId = weekLineup.assignments[slot.id];
          const player = getPlayerById(playerId);
          const isSelected = selectedSlot?.week === week && selectedSlot?.slotId === slot.id;
          const isOnBye = !isDraft && player?.byeWeek === week;
          const colors = getPositionColors(slot.position);

          const isBenchOrIR = slot.position === 'BENCH' || slot.position === 'IR';
          const benchIndex = isBenchOrIR && slot.position === 'BENCH' ? state.rosterSlots.filter(s => s.position === 'BENCH').indexOf(slot) : -1;

          return (
            <div
              key={slot.id}
              className={`relative ${isOnBye ? 'ring-4 ring-red-500 rounded-lg' : ''}`}
              draggable={!!playerId}
              onDragStart={(e) => handleDragStart(e, slot.id, playerId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slot.id)}
            >
              {/* Position Label Badge */}
              <div className={`absolute -left-1 -top-1 z-10 px-2 py-0.5 rounded-md text-xs font-bold shadow-md ${colors.bg} ${colors.text} border-2 ${colors.border}`}>
                {slot.position}
                {isBenchOrIR && slot.position === 'BENCH' && benchIndex >= 0 && (
                  <span className="text-[9px] ml-0.5">#{benchIndex + 1}</span>
                )}
              </div>

              <PlayerCard
                player={player}
                slotLabel={slot.label}
                slotPosition={slot.position}
                onClick={() => onSlotClick(week, slot.id)}
                isSelected={isSelected}
              />

              {isOnBye && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg pointer-events-none flex items-center justify-center">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                    BYE
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
