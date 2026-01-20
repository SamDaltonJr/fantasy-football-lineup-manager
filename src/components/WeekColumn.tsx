import { Player, RosterSlot, WeekLineup } from '../types';
import { PlayerCard } from './PlayerCard';

interface WeekColumnProps {
  week: number | 'draft';
  rosterSlots: RosterSlot[];
  weekLineup: WeekLineup;
  players: Player[];
  onSlotClick: (week: number | 'draft', slotId: string) => void;
  selectedSlot: { week: number | 'draft'; slotId: string } | null;
}

export function WeekColumn({
  week,
  rosterSlots,
  weekLineup,
  players,
  onSlotClick,
  selectedSlot,
}: WeekColumnProps) {
  const getPlayerById = (playerId: string | null) => {
    if (!playerId) return null;
    return players.find((p) => p.id === playerId) || null;
  };

  const starterSlots = rosterSlots.filter(
    (slot) => slot.position !== 'BENCH' && slot.position !== 'IR'
  );
  const benchSlots = rosterSlots.filter((slot) => slot.position === 'BENCH');
  const irSlots = rosterSlots.filter((slot) => slot.position === 'IR');

  const isDraft = week === 'draft';
  const displayWeek = isDraft ? 'Draft' : `Week ${week}`;

  return (
    <div className={`min-w-[320px] flex-shrink-0 rounded-lg shadow-sm border-2 p-4 ${
      isDraft ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl font-bold mb-4 text-center sticky top-0 pb-2 border-b-2 ${
        isDraft ? 'text-green-900 bg-green-50 border-green-300' : 'text-gray-900 bg-white border-gray-200'
      }`}>
        {displayWeek}
      </h2>

      <div className="space-y-4">
        {/* Starters */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Starters</h3>
          <div className="space-y-2">
            {starterSlots.map((slot) => {
              const playerId = weekLineup.assignments[slot.id];
              const player = getPlayerById(playerId);
              const isSelected =
                selectedSlot?.week === week && selectedSlot?.slotId === slot.id;

              // Check if player is on bye this week (not applicable for draft)
              const isOnBye = !isDraft && player?.byeWeek === week;

              return (
                <div key={slot.id} className={isOnBye ? 'opacity-50 border-2 border-red-400 rounded-lg' : ''}>
                  <PlayerCard
                    player={player}
                    slotLabel={slot.label}
                    slotPosition={slot.position}
                    onClick={() => onSlotClick(week, slot.id)}
                    isSelected={isSelected}
                  />
                  {isOnBye && (
                    <div className="text-xs text-red-600 font-bold text-center mt-1">
                      BYE WEEK
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bench */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Bench</h3>
          <div className="space-y-2">
            {benchSlots.map((slot, idx) => {
              const playerId = weekLineup.assignments[slot.id];
              const player = getPlayerById(playerId);
              const isSelected =
                selectedSlot?.week === week && selectedSlot?.slotId === slot.id;

              return (
                <PlayerCard
                  key={slot.id}
                  player={player}
                  slotLabel={`Bench ${idx + 1}`}
                  slotPosition={slot.position}
                  onClick={() => onSlotClick(week, slot.id)}
                  isSelected={isSelected}
                />
              );
            })}
          </div>
        </div>

        {/* IR */}
        {irSlots.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">IR</h3>
            <div className="space-y-2">
              {irSlots.map((slot) => {
                const playerId = weekLineup.assignments[slot.id];
                const player = getPlayerById(playerId);
                const isSelected =
                  selectedSlot?.week === week && selectedSlot?.slotId === slot.id;

                return (
                  <PlayerCard
                    key={slot.id}
                    player={player}
                    slotLabel={slot.label}
                    slotPosition={slot.position}
                    onClick={() => onSlotClick(week, slot.id)}
                    isSelected={isSelected}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
