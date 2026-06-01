import ThemeToggle from './ThemeToggle';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-glow backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="mb-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
          AI Code Reviewer
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
          AI Code Reviewer
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
          Analyze and improve your code with AI-powered reviews
        </p>
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
