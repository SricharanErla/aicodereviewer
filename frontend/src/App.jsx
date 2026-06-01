import { useEffect, useState } from 'react';
import api from './services/api';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import ReviewPanel from './components/ReviewPanel';
import LoadingSpinner from './components/LoadingSpinner';

const defaultLanguage = 'JavaScript';
const defaultCode = '';

const getCodeStats = (value) => {
  const code = value || '';
  const trimmed = code.trim();

  return {
    charCount: code.length,
    wordCount: trimmed ? trimmed.split(/\s+/).length : 0,
    lineCount: code ? code.split('\n').length : 0
  };
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return window.localStorage.getItem('theme') || 'dark';
};

const formatCompletionTime = (startTime) => {
  if (!startTime) {
    return 0;
  }

  const duration = (Date.now() - startTime) / 1000;
  return Number(duration.toFixed(1));
};

const createNotification = (type, message) => ({
  id: crypto.randomUUID(),
  type,
  message
});

export default function App() {
  const [theme, setTheme] = useState(getStoredTheme);
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultCode);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completionTime, setCompletionTime] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const { charCount, wordCount, lineCount } = getCodeStats(code);
  const isFormValid = Boolean(language && code.trim());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (notifications.length === 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setNotifications((current) => current.slice(1));
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [notifications]);

  const pushNotification = (type, message) => {
    setNotifications((current) => [...current, createNotification(type, message)]);
  };

  const handleReview = async () => {
    if (!language || !code.trim()) {
      setError('Please select a programming language and paste some code before reviewing.');
      return;
    }

    setLoading(true);
    setError('');
    setReview(null);
    const startedAt = Date.now();

    try {
      const response = await api.post('/api/review', {
        language,
        code
      });

      setReview(response.data.data);
      setCompletionTime(formatCompletionTime(startedAt));
      pushNotification('success', 'Review completed successfully.');
    } catch (reviewError) {
      setError(reviewError.message || 'Unable to generate review.');
      pushNotification('error', 'Review request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setReview(null);
    setError('');
    setCompletionTime(0);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      pushNotification('success', 'Review copied to clipboard.');
    } catch (_error) {
      pushNotification('error', 'Unable to copy review text.');
    }
  };

  const handleDownload = (text) => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `ai-code-review-${language.toLowerCase().replace(/\+/g, 'plus').replace(/\s+/g, '-')}.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
      pushNotification('success', 'Review downloaded as TXT.');
    } catch (_error) {
      pushNotification('error', 'Unable to download review.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[length:44px_44px] opacity-40 dark:opacity-20" />
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 animate-float rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 animate-float rounded-full bg-cyan-400/20 blur-3xl [animation-delay:1s]" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8">
          <Header theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />

          <div className="grid gap-6 xl:grid-cols-2">
            <CodeEditor
              language={language}
              code={code}
              onLanguageChange={setLanguage}
              onCodeChange={setCode}
              onClear={handleClear}
              onSubmit={handleReview}
              loading={loading}
              charCount={charCount}
              lineCount={lineCount}
              wordCount={wordCount}
              isValid={isFormValid}
            />

            {loading ? (
              <LoadingSpinner />
            ) : (
              <ReviewPanel
                review={review}
                loading={loading}
                error={error}
                language={language}
                code={code}
                completionTime={completionTime}
                onCopy={handleCopy}
                onDownload={handleDownload}
              />
            )}
          </div>
        </div>

        <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col gap-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${
                notification.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200'
                  : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/80 dark:text-rose-200'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
