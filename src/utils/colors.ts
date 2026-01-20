import { Position } from '../types';

// Color scheme matching Sleeper app - using inline styles for reliability
export const POSITION_COLORS: Record<Position, { bg: string; border: string; text: string }> = {
  QB: {
    bg: '#ffc0cb', // Sleeper pink for QB
    border: '#ff9eae',
    text: '#8b0a50',
  },
  RB: {
    bg: '#7dd3c0', // Sleeper teal/cyan for RB
    border: '#5dbfab',
    text: '#0d5546',
  },
  WR: {
    bg: '#89cff0', // Sleeper blue for WR
    border: '#66b8e0',
    text: '#1a4d7a',
  },
  TE: {
    bg: '#f5c842', // Sleeper yellow/gold for TE
    border: '#e0b525',
    text: '#6b4e00',
  },
  FLEX: {
    bg: '#d4a5d8', // Sleeper purple for FLEX
    border: '#c287c7',
    text: '#5a2860',
  },
  DST: {
    bg: '#f4a460', // Sleeper orange for DEF
    border: '#e08d45',
    text: '#7a3800',
  },
  K: {
    bg: '#ff9edf', // Sleeper bright pink for K
    border: '#ff7cc9',
    text: '#8b004b',
  },
  BENCH: {
    bg: '#b8bcc4', // Sleeper gray for BENCH
    border: '#9ca1ab',
    text: '#3d4451',
  },
  IR: {
    bg: '#e8eaed', // Light gray for IR
    border: '#d1d5db',
    text: '#4b5563',
  },
};

export function getPositionColors(position: Position) {
  return POSITION_COLORS[position];
}
