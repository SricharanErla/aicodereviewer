# AI Code Reviewer

AI Code Reviewer is a full-stack web app where users paste source code, choose a language, and get structured AI review feedback. The frontend is React + Vite + Tailwind, and the backend is Node.js + Express with Gemini as primary provider and Groq as fallback.

## What This Project Does

- Generates a code quality score (`0-10`)
- Returns categorized findings: bugs, security, performance, best practices, optimizations
- Returns summary text and improved code in `correctedCode`
- Supports manual review trigger from the UI (button click)
- Exposes health and review APIs for deployment checks

## Architecture

1. User enters code and language in the frontend.
2. Frontend sends `POST /api/review` to backend.
3. Backend validates input and requests AI review from Gemini.
4. If Gemini fails with fallback-worthy errors, backend retries via Groq.
5. Backend normalizes response and sends structured JSON to frontend.
6. Frontend renders score, findings, summary, and efficient corrected code.

## Project Structure

```text
ai-code-reviewer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Prerequisites

- Node.js `18+`
- npm `9+`
- Gemini API key
- Groq API key (recommended as fallback)

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.0-flash
GROQ_API_KEY=YOUR_GROQ_API_KEY
GROQ_MODEL=llama-3.1-8b-instant
CORS_ORIGIN=*
```

Notes:

- **`CORS_ORIGIN` is required**: set this to your frontend domain in production (e.g. `https://app.example.com`) or `http://localhost:5173` for local development.
- `PORT` is optional: many hosting platforms provide `PORT` at runtime. If not provided, the server will fall back to `5000` by default for local development.

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

In production this must point to your deployed backend URL.

## End-to-End Local Workflow

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Start backend

```bash
cd backend
npm run dev
```

Expected startup log:

```text
AI Code Reviewer backend running on port 5000
```

### 3. Verify backend health

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "AI Code Reviewer API is running"
}
```

### 4. Start frontend

```bash
cd frontend
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

### 5. Run a full review from UI

1. Select language.
2. Paste code snippet.
3. Click the review button.
4. Confirm score and sections update.
5. Confirm `Efficient Code` panel shows `correctedCode`.

### 6. Optional API smoke test (without UI)

```bash
curl -X POST http://localhost:5000/api/review \
  -H "Content-Type: application/json" \
  -d '{"language":"JavaScript","code":"function add(a,b){return a+b;}"}'
```

## API Contract

### `GET /api/health`

Returns API availability.

### `POST /api/review`

Request:

```json
{
  "language": "JavaScript",
  "code": "function add(a,b){return a+b;}"
}
```

Successful response:

```json
{
  "success": true,
  "data": {
    "score": 7,
    "bugs": [],
    "security": [],
    "performance": [],
    "bestPractices": [],
    "optimizations": [],
    "summary": "Function is simple but lacks input validation.",
    "correctedCode": "function add(a, b) { ... }"
  }
}
```

## Deployment Workflow (End-to-End)

This is the recommended production workflow using Render (backend) + Vercel (frontend).

### Phase A: Pre-deployment checks

Run these locally first:

```bash
cd backend
node --check src/server.js
node --check src/services/geminiService.js

cd ../frontend
npm run build
```

If frontend build passes and backend syntax checks pass, proceed.

### Phase B: Deploy backend (Render)

1. Push repository to GitHub.
2. In Render, create a new Web Service from this repo.
3. Set root directory to `backend`.
4. Configure:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables:
   - `PORT` (optional if Render auto-assigns)
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `GROQ_API_KEY`
   - `GROQ_MODEL`
   - `CORS_ORIGIN` (set to your Vercel frontend URL)
6. Deploy.
7. Verify health endpoint:

```bash
curl https://YOUR_RENDER_BACKEND_URL/api/health
```

### Phase C: Deploy frontend (Vercel)

1. In Vercel, import the same GitHub repo.
2. Set root directory to `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variable:
   - `VITE_API_BASE_URL=https://YOUR_RENDER_BACKEND_URL`
6. Deploy.

### Phase D: Post-deployment validation

1. Open deployed frontend URL.
2. Submit a sample review.
3. Confirm response renders score and corrected code.
4. Confirm no CORS errors in browser console.
5. Confirm backend logs show successful requests.

### Phase E: Production hardening checklist

- Set `CORS_ORIGIN` to exact frontend domain (not `*`).
- Rotate leaked/old API keys.
- Keep provider models configurable via env vars.
- Monitor Render logs for quota/model errors.
- Set alerts for backend downtime.

## Recommended Release Workflow

1. Create feature branch.
2. Make change and run local checks.
3. Open pull request.
4. Verify preview deployment if enabled.
5. Merge to main.
6. Let Render and Vercel auto-deploy.
7. Run post-deploy smoke test.

## Troubleshooting

### Backend does not start

- Verify `backend/.env` exists and has valid keys.
- Ensure no other process is already using `PORT`.
- Check Render logs for missing environment variables.

### Frontend cannot reach backend

- Verify `VITE_API_BASE_URL` is set correctly.
- Verify backend `/api/health` is reachable publicly.
- Verify `CORS_ORIGIN` includes frontend domain.

### AI provider errors

- Check Gemini quota/key validity.
- Confirm Groq fallback key and model are valid.
- Review backend logs for model deprecation/decommission messages.

## Notes

- No database is required.
- Reviews are real-time and not persisted.
- Backend response is normalized to stable JSON fields.
