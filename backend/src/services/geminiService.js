import { GoogleGenerativeAI } from '@google/generative-ai';

const reviewSchema = {
  score: 0,
  bugs: [],
  security: [],
  performance: [],
  bestPractices: [],
  optimizations: [],
  summary: '',
  correctedCode: ''
};

const clampScore = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return 0;
  }
  return Math.max(0, Math.min(10, Math.round(numeric)));
};

const ensureStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
};

const normalizeReview = (payload) => ({
  score: clampScore(payload?.score),
  bugs: ensureStringArray(payload?.bugs),
  security: ensureStringArray(payload?.security),
  performance: ensureStringArray(payload?.performance),
  bestPractices: ensureStringArray(payload?.bestPractices),
  optimizations: ensureStringArray(payload?.optimizations),
  summary: typeof payload?.summary === 'string' ? payload.summary.trim() : '',
  correctedCode: typeof payload?.correctedCode === 'string' ? payload.correctedCode.trim() : ''
});

const stripCodeFences = (text) => text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

const parseModelResponse = (text) => {
  const cleaned = stripCodeFences(text);

  try {
    return JSON.parse(cleaned);
  } catch (_error) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }

    throw new Error('Gemini returned an invalid JSON response.');
  }
};

const isApiKeyError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  const details = JSON.stringify(error?.response?.data || error?.cause || {}).toLowerCase();

  return (
    message.includes('api key') ||
    message.includes('api_key_invalid') ||
    details.includes('api_key_invalid') ||
    details.includes('api key not valid')
  );
};

const isGeminiFallbackWorthyError = (error) => {
  const message = String(error?.message || '').toLowerCase();

  return (
    isApiKeyError(error) ||
    message.includes('429') ||
    message.includes('quota') ||
    message.includes('not found') ||
    message.includes('unsupported')
  );
};

const formatProviderError = (provider, error) => {
  const message = String(error?.message || 'Unknown error');

  if (provider === 'Gemini') {
    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      return 'Gemini is temporarily unavailable because the quota was exceeded.';
    }

    if (message.toLowerCase().includes('api key')) {
      return 'Gemini API key is missing or invalid.';
    }

    return `Gemini failed: ${message}`;
  }

  if (provider === 'DeepSeek') {
    if (message.includes('402') || message.toLowerCase().includes('insufficient balance')) {
      return 'DeepSeek fallback failed because the account has insufficient balance.';
    }

    if (message.toLowerCase().includes('api key')) {
      return 'DeepSeek API key is missing or invalid.';
    }

    return `DeepSeek failed: ${message}`;
  }

  return message;
};

const buildReviewPrompt = ({ language, code }) => `You are a Senior Software Engineer and Expert Code Reviewer.

Analyze the provided source code and return ONLY valid JSON.

Return response in this exact format:

{
  "score": 0,
  "bugs": [],
  "security": [],
  "performance": [],
  "bestPractices": [],
  "optimizations": [],
  "summary": "",
  "correctedCode": ""
}

Review Criteria:
1. Code Quality Score out of 10
2. Logic Errors
3. Potential Bugs
4. Security Vulnerabilities
5. Performance Bottlenecks
6. Code Smells
7. Best Practices
8. Optimization Opportunities
9. Maintainability
10. Readability
11. Provide a corrected and more efficient version of the submitted code in correctedCode.

Language:
${language}

Code:
${code}

IMPORTANT:
Return ONLY valid JSON.
Do not return markdown.
Do not return code blocks.
Do not return explanations outside JSON.`;

const createGeminiModel = (apiKey, modelName) => {
  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  });
};

const runGeminiReview = async ({ language, code }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('Gemini API key is not configured.');
  }

  const model = createGeminiModel(apiKey, modelName);
  const result = await model.generateContent(buildReviewPrompt({ language, code }));
  const responseText = result.response.text();
  const parsed = parseModelResponse(responseText);

  return normalizeReview({ ...reviewSchema, ...parsed });
};

const buildGroqMessages = ({ language, code }) => [
  {
    role: 'system',
    content:
      'You are a Senior Software Engineer and Expert Code Reviewer. Return only valid JSON matching the requested schema.'
  },
  {
    role: 'user',
    content: `Analyze the provided source code and return ONLY valid JSON in this exact format:\n\n{\n  "score": 0,\n  "bugs": [],\n  "security": [],\n  "performance": [],\n  "bestPractices": [],\n  "optimizations": [],\n  "summary": "",\n  "correctedCode": ""\n}\n\nReview Criteria:\n1. Code Quality Score out of 10\n2. Logic Errors\n3. Potential Bugs\n4. Security Vulnerabilities\n5. Performance Bottlenecks\n6. Code Smells\n7. Best Practices\n8. Optimization Opportunities\n9. Maintainability\n10. Readability\n11. Provide a corrected and more efficient version of the submitted code in correctedCode.\n\nLanguage:\n${language}\n\nCode:\n${code}\n\nIMPORTANT:\nReturn ONLY valid JSON. Do not return markdown. Do not return code blocks. Do not return explanations outside JSON.`
  }
];

const runGroqReview = async ({ language, code }) => {
  const apiKey = process.env.GROQ_API_KEY;
  const configuredModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const modelCandidates = [configuredModel, 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile'];

  if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') {
    throw new Error('Groq API key is not configured.');
  }

  let lastError = null;

  for (const modelName of modelCandidates) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: buildGroqMessages({ language, code }),
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if (response.ok) {
      const payload = await response.json();
      const content = payload?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Groq returned an empty response.');
      }

      const parsed = typeof content === 'string' ? parseModelResponse(content) : content;

      return normalizeReview({ ...reviewSchema, ...parsed });
    }

    const errorText = await response.text();
    lastError = new Error(`Groq request failed with status ${response.status}: ${errorText}`);

    if (!String(errorText).toLowerCase().includes('model_decommissioned')) {
      break;
    }
  }

  throw lastError || new Error('Groq request failed.');
};

export const generateCodeReview = async ({ language, code }) => {
  try {
    return await runGeminiReview({ language, code });
  } catch (error) {
    if (isGeminiFallbackWorthyError(error)) {
      try {
        return await runGroqReview({ language, code });
      } catch (groqError) {
        throw new Error(
          `${formatProviderError('Gemini', error)} Groq fallback failed: ${formatProviderError('Groq', groqError)}`
        );
      }
    }

    throw error;
  }
};
