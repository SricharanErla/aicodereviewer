export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
      aria-label="Toggle theme"
    >
      <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
    </button>
  );
}
