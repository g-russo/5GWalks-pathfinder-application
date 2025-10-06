# 5G Walks — Local Setup Guide

This file describes what you'll need to run this project locally, and provides step-by-step installation and run instructions for Windows PowerShell users.

## What's in this repo
- Frontend: a Vite + React app (scripts in `package.json`).
- Backend: a FastAPI app in the `backend/` folder (`main.py`).

## Prerequisites
- Node.js (LTS recommended: >= 18). This provides `node` and `npm`.
- Python 3.10+ (3.11 tested). Ensure `python` or `py` is on your PATH.
- Git (optional, but recommended).
- A MapQuest API key (used by the backend to fetch routes and geocoding). Get one at https://developer.mapquest.com/.

## Ports used (defaults)
- Frontend (Vite dev server): 5173
- Backend (uvicorn FastAPI dev server): 8000

## Environment variables
- `MAPQUEST_API_KEY` — required by the backend. The backend will also accept `VITE_MAPQUEST_API_KEY` if you prefer to set a front-end style env var name.

On PowerShell you can set it for the current session like this:

```powershell
# Temporarily for current session
$env:MAPQUEST_API_KEY = "your_mapquest_key_here"
```

To make it persistent for your Windows user, use `setx` (opens a new shell to take effect):

```powershell
# Persist for the current user (restart shell to pick up)
setx MAPQUEST_API_KEY "your_mapquest_key_here"
# Restart your terminal after running setx
```

## Backend — setup and run (PowerShell)
1. Open a PowerShell terminal and change to the project folder's `backend` directory:

```powershell
cd path\to\5g-walks\backend
# e.g. cd C:\Users\Rewind\Desktop\4th_yr\IT26210\ProjAct3\5g-walks\backend
```

2. Create and activate a Python virtual environment:

```powershell
python -m venv .venv
# If PowerShell execution policy blocks activate script, run this first in the same shell:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\.venv\Scripts\Activate.ps1
```

3. Install Python dependencies:

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

4. Ensure your MapQuest API key is available in the environment:

```powershell
$env:MAPQUEST_API_KEY = "YOUR_MAPQUEST_KEY"
```

5. Start the FastAPI backend (development mode):

```powershell
# run from backend folder
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. Quick test: open a browser or use PowerShell to hit the health endpoint:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/hello
# or visit http://127.0.0.1:8000/docs for interactive API docs (Swagger UI)
```

Notes:
- If `uvicorn` is not found, you can run it via `python -m uvicorn main:app --reload --port 8000`.

## Frontend — setup and run (PowerShell)
1. Open a new terminal (separate from the backend) and change to the project root (where `package.json` is):

```powershell
cd path\to\5g-walks
# e.g. cd C:\Users\Rewind\Desktop\4th_yr\IT26210\ProjAct3\5g-walks
```

2. Install Node dependencies:

```powershell
npm install
```

3. (Optional) If you want the frontend to have a build-time MapQuest key available via Vite, create a `.env.local` (or `.env`) in the project root and add:

```
VITE_MAPQUEST_API_KEY=your_mapquest_key_here
```

4. Run the dev server:

```powershell
npm run dev
```

5. Open the dev URL (usually http://localhost:5173). The frontend will call the backend endpoints (see below).

Notes:
- Vite is configured in `package.json` with `dev`, `build`, and `preview` scripts. `npm run build` produces a production build in `dist/`.

## Running both servers together
- Use two terminal windows/tabs: one to run the backend (`uvicorn ...`), the other to run the frontend (`npm run dev`).
- If the frontend and backend run on different hosts/ports, the backend includes permissive CORS settings for development.

## Example requests
- Route lookup (replace values):

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/api/route?from_addr=New+York,NY&to=Boston,MA&units=imperial"
```

- Place search (autocomplete):

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/api/search?q=Times+Square&maxResults=5"
```

## Production notes
- The current backend proxies to MapQuest — you must set a valid MapQuest key in the production environment.
- For production deployment, build the frontend (`npm run build`) and serve the static files via a web server (NGINX, GitHub Pages, static hosting) or configure the backend to serve the built files.
- Lock down CORS and disable debug/reload for production.

## Troubleshooting
- "Module not found" for uvicorn/fastapi: confirm you're in the activated venv and `pip install -r requirements.txt` succeeded.
- PowerShell blocks script execution when activating venv: run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` in the same shell (temporary) and then run `.\.venv\Scripts\Activate.ps1`.
- MapQuest errors: check the `MAPQUEST_API_KEY` environment variable and ensure the key is valid and has quota.

## Summary (quick checklist)
- [ ] Install Node.js and Python
- [ ] Create and activate Python venv, install backend deps
- [ ] npm install in project root
- [ ] Set `MAPQUEST_API_KEY` environment variable
- [ ] Start backend: `uvicorn main:app --reload --port 8000` (from `backend/`)
- [ ] Start frontend: `npm run dev` (from project root)

If you want, I can also:
- Add a `make`-style PowerShell script to start both servers together.
- Add a small `.env.example` or update the existing `README.md` with this content.
