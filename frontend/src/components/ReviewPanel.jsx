import ScoreCard from './ScoreCard';

const sections = [
  { key: 'bugs', title: 'Bugs Found', accent: 'from-rose-500 to-red-500', empty: 'No bugs detected.' },
  { key: 'security', title: 'Security Issues', accent: 'from-amber-500 to-orange-500', empty: 'No security issues detected.' },
  { key: 'performance', title: 'Performance Suggestions', accent: 'from-blue-500 to-cyan-500', empty: 'No performance issues detected.' },
  { key: 'bestPractices', title: 'Best Practices', accent: 'from-emerald-500 to-teal-500', empty: 'No best-practice suggestions detected.' },
  { key: 'optimizations', title: 'Optimization Recommendations', accent: 'from-violet-500 to-fuchsia-500', empty: 'No optimization recommendations detected.' }
];

const formatReviewText = (review, language) => {
  const lines = [
    `AI Code Reviewer - ${language}`,
    `Score: ${review.score ?? 0}/10`,
    '',
    `Summary: ${review.summary || 'No summary provided.'}`,
    ''
  ];

  sections.forEach((section) => {
    lines.push(section.title);
    const items = review[section.key] || [];
    if (items.length === 0) {
      lines.push(`- ${section.empty}`);
    } else {
      items.forEach((item) => lines.push(`- ${item}`));
    }
    lines.push('');
  });

  lines.push('Efficient Code');
  lines.push(review.correctedCode || 'No corrected code was generated.');

  return lines.join('\n');
};

const SectionCard = ({ title, items, accent, empty }) => (
  <article className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
    <div className={`mb-4 inline-flex rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white`}>
      {title}
    </div>
    {items.length > 0 ? (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{empty}</p>
    )}
  </article>
);

export default function ReviewPanel({ review, loading, error, language, code, completionTime, onCopy, onDownload }) {
  const reviewText = review ? formatReviewText(review, language) : '';

  if (loading) {
    return (
      <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-glow backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-56 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-36 rounded-[24px] bg-slate-200 dark:bg-slate-800" />
            <div className="h-36 rounded-[24px] bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-32 rounded-[24px] bg-slate-200 dark:bg-slate-800" />
            <div className="h-32 rounded-[24px] bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
        <h2 className="text-xl font-bold">Review Error</h2>
        <p className="mt-2 text-sm leading-6">{error}</p>
      </section>
    );
  }

  if (!review) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-8 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="max-w-md">
          <p className="text-5xl">🧠</p>
          <h2 className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">Your AI review will appear here</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Submit code from the left panel to see structured feedback on quality, bugs, security, performance, best practices, and optimizations.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-glow backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Review Results</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time Gemini analysis for {language} code.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">Completion: {completionTime}s</span>
          <button
            type="button"
            onClick={() => onCopy(reviewText)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-indigo-300"
          >
            Copy Review
          </button>
          <button
            type="button"
            onClick={() => onDownload(reviewText)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-indigo-300"
          >
            Download TXT
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <ScoreCard score={review.score} />

        <article className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">AI Summary</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{review.summary || 'No summary provided.'}</p>
        </article>

        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((section) => (
            <SectionCard
              key={section.key}
              title={section.title}
              items={review[section.key] || []}
              accent={section.accent}
              empty={section.empty}
            />
          ))}
        </div>

        <article className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Efficient Code</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            AI-generated corrected code after reviewing the original submission.
          </p>
          <pre className="mt-3 max-h-64 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
            <code>{review.correctedCode || 'No corrected code was generated.'}</code>
          </pre>
        </article>
      </div>
    </section>
  );
}
