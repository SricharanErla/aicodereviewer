export default function ScoreCard({ score }) {
  const normalizedScore = Number.isFinite(score) ? score : 0;
  const progressWidth = `${Math.max(0, Math.min(100, (normalizedScore / 10) * 100))}%`;

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Code Quality Score</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            {normalizedScore.toFixed(1)} / 10
          </h3>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-lg font-black text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
          {normalizedScore.toFixed(1)}
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-700"
          style={{ width: progressWidth }}
        />
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Higher scores indicate cleaner, safer, and more maintainable code.
      </p>
    </div>
  );
}
