import { generateCodeReview } from '../services/geminiService.js';

const allowedLanguages = new Set(['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'Go']);

export const reviewCode = async (req, res, next) => {
  try {
    const { language, code } = req.body || {};

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
