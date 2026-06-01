const supportedLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'Go'];

export default function CodeEditor({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onClear,
  onSubmit,
  loading,
  charCount,
  lineCount,
  wordCount,
  isValid
}) {
  return (
    <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-glow backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Code Input</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Paste your source code, choose a language, and review in real time.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Programming Language</span>
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Select a language</option>
            {supportedLanguages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Source Code</span>
          <textarea
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="Paste your code here..."
            spellCheck="false"
            className="min-h-[420px] w-full resize-none rounded-[24px] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
          <div className="flex flex-wrap gap-4">
            <span>Characters: {charCount}</span>
            <span>Words: {wordCount}</span>
            <span>Lines: {lineCount}</span>
          </div>
          <span className={isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
            {isValid ? 'Ready for review' : 'Select a language and add code'}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !isValid}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Reviewing...' : 'Review Code'}
          </button>
        </div>
      </div>
    </section>
  );
}
