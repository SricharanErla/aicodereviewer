export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-8 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-cyan-400" />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-950 dark:text-white">Reviewing code with Gemini AI</p>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Please wait while the model analyzes bugs, security, performance, and best practices.
        </p>
      </div>
    </div>
  );
}
