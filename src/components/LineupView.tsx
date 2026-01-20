import { Player, RosterSlot, WeekLineup } from '../types';
import { PlayerCard } from './PlayerCard';

interface LineupViewProps {
  rosterSlots: RosterSlot[];
  weekLineup: WeekLineup;
  players: Player[];
  onSlotClick: (slotId: string) => void;
  selectedSlotId: string | null;
}

export function LineupView({
  rosterSlots,
  weekLineup,
  players,
  onSlotClick,
  selectedSlotId,
}: LineupViewProps) {
  const getPlayerById = (playerId: string | null) => {
    if (!playerId) return null;
    return players.find((p) => p.id === playerId) || null;
  };

  const starterSlots = rosterSlots.filter(
    (slot) => slot.position !== 'BENCH' && slot.position !== 'IR'
  );
  const benchSlots = rosterSlots.filter((slot) => slot.position === 'BENCH');
  const irSlots = rosterSlots.filter((slot) => slot.position === 'IR');

  return (
    <div className="space-y-6">
      {/* Starters */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Starting Lineup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {starterSlots.map((slot) => {
            const playerId = weekLineup.assignments[slot.id];
            const player = getPlayerById(playerId);
            return (
              <PlayerCard
                key={slot.id}
                player={player}
                slotLabel={slot.label}
                onClick={() => onSlotClick(slot.id)}
                isSelected={selectedSlotId === slot.id}
              />
            );
          })}
        </div>
      </div>

      {/* Bench */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Bench</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchSlots.map((slot) => {
            const playerId = weekLineup.assignments[slot.id];
            const player = getPlayerById(playerId);
            return (
              <PlayerCard
                key={slot.id}
                player={player}
                slotLabel={`${slot.label} ${benchSlots.indexOf(slot) + 1}`}
                onClick={() => onSlotClick(slot.id)}
                isSelected={selectedSlotId === slot.id}
              />
            );
          })}
        </div>
      </div>

      {/* IR */}
      {irSlots.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Injured Reserve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {irSlots.map((slot) => {
              const playerId = weekLineup.assignments[slot.id];
              const player = getPlayerById(playerId);
              return (
                <PlayerCard
                  key={slot.id}
                  player={player}
                  slotLabel={slot.label}
                  onClick={() => onSlotClick(slot.id)}
                  isSelected={selectedSlotId === slot.id}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
