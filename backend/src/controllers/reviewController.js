import { generateCodeReview } from '../services/geminiService.js';

const allowedLanguages = new Set(['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'Go']);

// Map common, case-insensitive inputs to canonical language names
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

export const reviewCode = async (req, res, next) => {
  try {
    let { language, code } = req.body || {};

    if (language && typeof language === 'string') {
      const key = language.trim().toLowerCase();
      if (languageAliases[key]) language = languageAliases[key];
    }

    if (!language || typeof language !== 'string' || !allowedLanguages.has(language)) {
      return res.status(400).json({
        success: false,
        message: 'A valid programming language is required.'
      });
    }

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Source code is required.'
      });
    }

    const review = await generateCodeReview({ language, code: code.trim() });

    return res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    return next(error);
  }
};
