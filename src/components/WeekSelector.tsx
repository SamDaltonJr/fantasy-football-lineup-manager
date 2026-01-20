import { NFL_WEEKS } from '../types';

interface WeekSelectorProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

export function WeekSelector({ currentWeek, onWeekChange }: WeekSelectorProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => onWeekChange(Math.max(1, currentWeek - 1))}
        disabled={currentWeek === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
      >
        Previous
      </button>

      <div className="flex gap-2 overflow-x-auto flex-1">
        {Array.from({ length: NFL_WEEKS }, (_, i) => i + 1).map((week) => (
          <button
            key={week}
            onClick={() => onWeekChange(week)}
            className={`px-3 py-2 rounded min-w-[60px] ${
              week === currentWeek
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      <button
        onClick={() => onWeekChange(Math.min(NFL_WEEKS, currentWeek + 1))}
        disabled={currentWeek === NFL_WEEKS}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  );
}
