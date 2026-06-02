import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const app = express();

// Configure CORS: support single origin, a comma-separated list, or a permissive fallback.
const rawOrigins = process.env.CORS_ORIGIN?.trim();
let corsOptions = { origin: '*', credentials: false };

if (rawOrigins && rawOrigins !== '*') {
  const allowed = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);
  corsOptions = {
    origin: (origin, cb) => {
      // allow requests with no origin like curl/postman
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error('CORS origin denied'));
    },
    credentials: false
  };
} else if (!rawOrigins) {
  console.warn('CORS_ORIGIN is not set; allowing requests from any origin.');
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Simple request logger to help debug deployed routing issues
app.use((req, _res, next) => {
  try {
    const bodySummary = req.body && Object.keys(req.body).length ? JSON.stringify(req.body).slice(0, 512) : '';
    console.log(`[req] ${req.method} ${req.originalUrl} ${bodySummary}`);
  } catch (e) {
    // ignore logging errors
  }
  next();
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Code Reviewer API is running'
  });
});

app.use('/api', reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
