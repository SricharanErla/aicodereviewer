import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

// Require CORS origin for client access, but allow PORT to default for local/dev or be provided by the host.
if (!process.env.CORS_ORIGIN) {
  console.error('Missing required environment variable: CORS_ORIGIN');
  console.error('Please add CORS_ORIGIN to backend/.env (e.g. http://localhost:5173)');
  process.exit(1);
}

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`AI Code Reviewer backend running on port ${PORT}`);
});
