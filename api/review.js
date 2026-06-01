import { generateCodeReview } from '../backend/src/services/geminiService.js';

const allowedLanguages = new Set(['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'Go']);

const languageAliases = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  c: 'C',
  'c++': 'C++',
  cpp: 'C++',
  go: 'Go'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  try {
    const { language: rawLang, code } = req.body || {};

    let language = rawLang;
    if (language && typeof language === 'string') {
      const key = language.trim().toLowerCase();
      if (languageAliases[key]) language = languageAliases[key];
    }

    if (!language || typeof language !== 'string' || !allowedLanguages.has(language)) {
      return res.status(400).json({ success: false, message: 'A valid programming language is required.' });
    }

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Source code is required.' });
    }

    const review = await generateCodeReview({ language, code: code.trim() });

    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    const message = String(error?.message || 'Internal server error');
    return res.status(500).json({ success: false, message });
  }
}
