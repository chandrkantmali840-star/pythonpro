# PythonPro

**Learn • Practice • Master**

PythonPro is a modular React + Flask learning platform. Demo mode is fully interactive with centralized local persistence. API mode provides JWT/bcrypt authentication and stores each student's complete learning state in MySQL. Server-side code execution is deliberately disabled: the execution service returns safe test previews until an isolated judge is connected.

## Run the frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Create an account in the UI. Without API mode, progress stays in this browser only. Local demo passwords use a salted PBKDF2 hash and are never stored as plain text.

The current production frontend is fully usable without the Flask API. It uses centralized browser persistence and a safe educational code runner. Set `VITE_API_URL` only when a separately hosted API is available.

## Production frontend

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run test
pnpm run build
```

Vercel should use `frontend` as the project root. The included `vercel.json` provides SPA route fallback, and the production output is `frontend/dist`.

## Run the API

```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt
set JWT_SECRET_KEY=<a-long-random-value>
set DATABASE_URL=mysql+pymysql://user:password@localhost/pythonpro
python run.py
```

Apply `database/schema.sql` and `database/seed.sql` for a native MySQL setup. SQLite is supported for local API smoke testing. Set `VITE_API_URL` in the frontend deployment to the public API URL to enable accounts that work across devices.

## GitHub Codespaces

The repository includes `.devcontainer` configuration with React, Flask, and MySQL. Create a Codespace from the repository and wait for setup to finish. The frontend and backend start automatically, and the Vite development server proxies `/api` to Flask. MySQL data uses a Docker volume inside the Codespace.

Codespaces is for development and testing, not permanent public hosting. It stops after inactivity and can be deleted. Production accounts require the Flask API and MySQL database to be deployed on persistent services.

## Data validation

```bash
python tools/validate_questions.py
```

The checked-in bank contains 1,000 records: 300 concept MCQs, 200 output prediction, 150 debugging, 150 code understanding, 100 syntax, and 100 best-practice/interview questions.

## Interactive learning engine

Lessons use an eight-step loop: micro concept, output prediction, editable code, fill-code, Bug Hunter, accessible code rearrangement, mini challenge, and quick quiz. Activity results, one-time XP rewards, levels, daily challenges, boss battles, mission paths, revision queues, and playground snippets persist through the centralized state service. The playground and lesson editors use clearly labelled safe demo output and never execute arbitrary Python in Flask.

## Security

- Passwords are bcrypt hashes in the API.
- JWT secrets are required environment variables.
- CORS is allow-listed through `CORS_ORIGINS`.
- Student code is never evaluated inside Flask.
- Demo authentication is local-only and uses a salted PBKDF2 hash; API mode is required for multi-device accounts.
