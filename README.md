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
2. Frontend sends `POST /api/review` through the shared API client.
3. The API client points to `/api` locally or to the deployed backend origin in production.
4. Backend validates input and requests AI review from Gemini.
5. If Gemini fails with fallback-worthy errors, backend retries via Groq.
6. Backend normalizes response and sends structured JSON to frontend.
7. Frontend renders score, findings, summary, and efficient corrected code.

## Project Structure

```text
ai-code-reviewer/
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
CORS_ORIGIN=http://localhost:5173
```

Notes:

- `CORS_ORIGIN` is optional but recommended in production. Set it to your frontend origin, or use a comma-separated list for multiple allowed origins.
- `PORT` is optional: many hosting platforms provide `PORT` at runtime. If not provided, the server falls back to `5000` for local development.

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=https://your-backend.example.com
```

Leave it unset for local development. When set, use the backend origin only; the client automatically adds `/api`.

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

## Deployment Roadmap

The recommended production setup is:

- Frontend: Vercel
- Backend: Render, Railway, Fly, or any Node host
- API contract: frontend calls the backend at `/api/review` and `/api/health`

### Step 1: Validate locally

Run the build and syntax checks before you deploy:

```bash
cd backend
node --check src/server.js
node --check src/services/geminiService.js

cd ../frontend
npm run build
```

If these pass, the code is ready for deployment.

### Step 2: Configure backend environment variables

Set these in `backend/.env` for local development and in your host’s env settings for production:

```env
PORT=5000
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.1-8b-instant
CORS_ORIGIN=http://localhost:5173
```

Rules:

- Use the deployed frontend URL for `CORS_ORIGIN` in production.
- Keep the model names configurable so you can switch providers without code changes.

### Step 3: Deploy the backend

Create a Node web service in your hosting platform:

1. Connect the GitHub repo.
2. Set the root directory to `backend`.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add the backend environment variables from Step 2.
6. Deploy the service.

After deployment, verify health:

```bash
curl https://YOUR_BACKEND_URL/api/health
```

Expected response:

```json
{ "success": true, "message": "AI Code Reviewer API is running" }
```

### Step 4: Configure the frontend for production

Set the frontend environment variable to the backend origin only:

```env
VITE_API_BASE_URL=https://YOUR_BACKEND_URL
```

Important:

- Do not include `/api` in `VITE_API_BASE_URL`.
- The client adds `/api` automatically.

### Step 5: Deploy the frontend

Create a static frontend deployment in Vercel:

1. Import the same GitHub repo.
2. Set the root directory to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add `VITE_API_BASE_URL=https://YOUR_BACKEND_URL`.
6. Deploy the site.

### Step 6: Smoke test the full flow

1. Open the frontend URL.
2. Paste a short code sample.
3. Select a programming language.
4. Click Review Code.
5. Confirm score, summary, and corrected code appear.
6. Confirm there are no CORS errors in the browser console.
7. Confirm the backend logs show the review request.

### Step 7: Production hardening

- Keep `CORS_ORIGIN` as the exact frontend origin.
- Keep API keys out of the repo.
- Monitor backend logs for quota or provider errors.
- Keep `VITE_API_BASE_URL` pointed at the backend origin only.
- Re-run the local build and health checks before every release.

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
