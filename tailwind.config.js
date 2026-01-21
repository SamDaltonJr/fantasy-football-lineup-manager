/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Position colors
    'bg-red-100', 'border-red-300', 'text-red-900',
    'bg-cyan-100', 'border-cyan-300', 'text-cyan-900',
    'bg-blue-100', 'border-blue-300', 'text-blue-900',
    'bg-yellow-100', 'border-yellow-300', 'text-yellow-900',
    'bg-purple-100', 'border-purple-300', 'text-purple-900',
    'bg-orange-100', 'border-orange-300', 'text-orange-900',
    'bg-pink-100', 'border-pink-300', 'text-pink-900',
    'bg-gray-100', 'border-gray-300', 'text-gray-900',
    'bg-slate-100', 'border-slate-300', 'text-slate-900',
    // Dark mode backgrounds
    'bg-gradient-to-br', 'from-gray-900', 'via-slate-800', 'to-gray-900',
    'from-slate-50', 'via-blue-50', 'to-indigo-50',
    'from-indigo-800', 'via-purple-800', 'to-pink-800',
    'from-indigo-600', 'via-purple-600', 'to-pink-600',
    'bg-gradient-to-r',
    // Dark mode borders
    'border-gray-600', 'border-gray-300', 'border-slate-600', 'border-slate-300',
    'border-slate-200', 'border-slate-700', 'border-slate-400',
    'border-green-600', 'border-green-400',
    // Dark mode text
    'text-gray-400', 'text-gray-500', 'text-blue-300', 'text-blue-900',
    'text-blue-200', 'text-blue-800',
    // Dark mode grid colors
    'bg-slate-800', 'bg-white', 'border-gray-200',
    'bg-gradient-to-b', 'from-slate-700', 'to-slate-800', 'from-slate-100', 'to-slate-50',
    'from-slate-800', 'to-slate-900', 'from-slate-600', 'to-slate-700',
    'from-green-900', 'to-emerald-900', 'from-green-50', 'to-emerald-50',
    'from-green-700', 'to-emerald-700', 'from-green-600', 'to-emerald-600',
    'from-white', 'to-gray-50',
    'border-b-slate-700', 'border-b-slate-200',
    'border-r-green-600', 'border-r-green-400', 'border-r-slate-600', 'border-r-slate-300',
    'bg-red-900/30', 'bg-red-50',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
