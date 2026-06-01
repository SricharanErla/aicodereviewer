import express from 'express';
import cors from 'cors';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: false
  })
);
app.use(express.json({ limit: '1mb' }));

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
