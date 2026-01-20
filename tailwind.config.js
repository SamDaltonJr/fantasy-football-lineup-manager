/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // QB - Red
    'bg-red-100', 'border-red-300', 'text-red-900',
    // RB - Cyan
    'bg-cyan-100', 'border-cyan-300', 'text-cyan-900',
    // WR - Blue
    'bg-blue-100', 'border-blue-300', 'text-blue-900',
    // TE - Yellow
    'bg-yellow-100', 'border-yellow-300', 'text-yellow-900',
    // FLEX - Purple
    'bg-purple-100', 'border-purple-300', 'text-purple-900',
    // DST - Orange
    'bg-orange-100', 'border-orange-300', 'text-orange-900',
    // K - Pink
    'bg-pink-100', 'border-pink-300', 'text-pink-900',
    // BENCH - Gray
    'bg-gray-100', 'border-gray-300', 'text-gray-900',
    // IR - Slate
    'bg-slate-100', 'border-slate-300', 'text-slate-900',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
