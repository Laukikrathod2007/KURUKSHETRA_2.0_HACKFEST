# Kurukshetra Demo Frontend

Plain static HTML/CSS/JS, no build step -- deploys to Vercel as-is.

## Local dev
Serve this folder with any static server (or just open `index.html` directly)
while `bash ../scripts/dev.sh` runs the backend on `http://127.0.0.1:8000`.

## Deploying to Vercel
1. Before deploying, edit `config.js` and set `window.KURUKSHETRA_API_BASE` to
   your deployed backend URL (Railway/GCP), e.g.
   `https://kurukshetra-backend.up.railway.app`.
2. `vercel --prod` from this directory, or connect the repo in the Vercel
   dashboard with **Root Directory** set to `kurukshetra-system/frontend` and
   framework preset **Other** (no build command needed).
3. Point your domain (e.g. midnightciphers.xyz) at the Vercel project in the
   Vercel dashboard's Domains tab.
4. In `src/main.py` on the backend, tighten `allow_origins` from `["*"]` to
   your actual Vercel/custom domain before treating this as production.

## What's in here
- `index.html` -- the whole demo UI (recipient lookup -> amount -> decision).
- `app.js` -- calls `/pay/initiate` and `/pay/confirm` on the backend, renders
  the GREEN/YELLOW/ORANGE/RED screens exactly per docs/00-council-verdict.md's
  demo flow, plus a "judge panel" showing every signal's REAL/SIMULATED/
  CONCEPTUAL label live (closing the observability gap in docs/08-observability.md).
- Four one-click scenario buttons load the exact beneficiaries seeded by
  `kurukshetra.seed` for a fast live demo.
