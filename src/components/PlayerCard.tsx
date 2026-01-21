import { Player, Position } from '../types';
import { getPositionColors } from '../utils/colors';
import { getOpponent } from '../utils/nflSchedule';

interface PlayerCardProps {
  player: Player | null;
  slotLabel: string;
  slotPosition: Position;
  onClick?: () => void;
  isSelected?: boolean;
  week?: number | 'draft'; // Current week to show opponent
}

export function PlayerCard({ player, slotLabel, slotPosition, onClick, isSelected, week }: PlayerCardProps) {
  // Use player's position for colors if player exists, otherwise use slot position
  const colors = getPositionColors(player ? player.position : slotPosition);

  if (!player) {
    return (
      <div
        className={`h-full border-0 rounded-[20px] p-3 text-center flex items-center justify-center transition-all ${
          onClick ? 'cursor-pointer hover:brightness-95' : ''
        }`}
        style={{
          backgroundColor: '#e5e7eb',
          color: '#9ca3af',
        }}
        onClick={onClick}
      >
        <div className="text-xs font-semibold">Empty</div>
      </div>
    );
  }

  // Get opponent for this week
  const opponent = week && week !== 'draft' ? getOpponent(player.team, week) : null;

  return (
    <div
      className={`h-full border-0 rounded-[20px] p-4 transition-all flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md ${
        isSelected ? 'ring-4 ring-blue-500 shadow-lg' : ''
      } ${onClick ? 'cursor-pointer hover:brightness-95' : ''}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
      onClick={onClick}
    >
      <div className="font-extrabold text-sm leading-tight truncate w-full">{player.name}</div>
      <div className="text-xs opacity-90 mt-1 font-semibold">
        {player.team} • {player.position}
      </div>
      {opponent && (
        <div className="text-xs opacity-85 mt-0.5 font-bold">vs {opponent}</div>
      )}
      <div className="text-xs opacity-80 mt-0.5 font-medium">Bye: {player.byeWeek}</div>
    </div>
  );
}
