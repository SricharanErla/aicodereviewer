import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AI Code Reviewer backend running on port ${PORT}`);
});
