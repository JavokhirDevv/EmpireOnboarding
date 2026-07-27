# Empire National — Dispatcher Onboarding Platform

An internal training and onboarding platform for new Empire National dispatchers: company/training modules, equipment knowledge, dispatch workflow, and safety & compliance content, each with a certification quiz. Dispatchers work through the modules and unlock a completion certificate once every quiz is passed. Admins manage content and track trainee progress.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Prisma 7** + **SQLite** (via the `better-sqlite3` driver adapter) for the database
- **Tailwind CSS v4** for styling
- Custom session auth — `bcryptjs` for password hashing, `jose` for signed session cookies (no third-party auth service required)
- `react-markdown` for rendering training content

There is no public sign-up. Admins create every dispatcher account from the admin panel.

## Getting started

1. **Install dependencies**

   ```powershell
   npm install
   ```

   This project uses native modules (`better-sqlite3`, Prisma's engines). If npm blocks install scripts, approve them once:

   ```powershell
   npm approve-scripts --allow-scripts-pending
   npm rebuild
   ```

2. **Environment variables** — a `.env` file is already included for local development with a `DATABASE_URL`, a `SESSION_SECRET`, and the seed admin credentials. **Generate your own `SESSION_SECRET` before deploying anywhere beyond your own machine**:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **Create the database and apply the schema**

   ```powershell
   npm run db:migrate
   ```

4. **Seed the database** with the training curriculum, an admin account, and a demo dispatcher account:

   ```powershell
   npm run db:seed
   ```

5. **Run the app**

   ```powershell
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Default accounts (from the seed script)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@empirenational.com` | `EmpireAdmin!2026` |
| Demo dispatcher | `demo.dispatcher@empirenational.com` | `Dispatcher!2026` |

Change these (or delete the demo account) before handing the platform to real users — see `.env` for `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` if you want the seed script to create a different admin.

## How it works

- **Dispatchers** (`/dashboard`) see every published training module grouped by category, with an overall progress bar. Opening a module shows its content; if it has no quiz, a "Mark as complete" button finishes it. If it has a quiz, the dispatcher must score at least the quiz's pass percentage to complete the module. Once every module is complete, `/certificate` unlocks a printable certificate. `/resources` is a document library of PDFs/images admins have shared (policies, forms, equipment photos).
- **Admins** (`/admin`) see platform-wide stats, manage training modules and their Markdown content, build quizzes (question + 4 answer options, one marked correct), create dispatcher accounts, and upload files to the resource library at `/admin/resources`. `/admin/trainees/[id]` shows a dispatcher's full module completion and quiz attempt history.

### Resource library (file uploads)

Admins can upload PDFs and images (PNG/JPG/WEBP/GIF, up to 20MB) at `/admin/resources` with a title, category, and optional description. Files are stored on disk in an `uploads/` folder at the project root (not inside `public/`, so they aren't reachable without signing in) and served through an authenticated route at `/api/resources/[id]`. Every signed-in dispatcher can browse and open them at `/resources`. Deleting a resource in the admin panel removes both the database record and the file on disk.

`uploads/` is git-ignored — back it up separately from your code if you deploy this for real use, since it holds the actual uploaded files.

## Content model

- A **Module** belongs to a **category** (shown as a section on the dashboard) and holds Markdown **content**.
- A Module can have one **Quiz**, made up of **Questions**, each with **Options** (one correct).
- A dispatcher's **ModuleProgress** row is created either by clicking "Mark as complete" (no-quiz modules) or automatically the first time they pass the module's quiz.
- Every quiz submission is recorded as a **QuizAttempt** (score, pass/fail, timestamp) — visible to admins per-dispatcher, even for failed attempts.

## Useful scripts

```powershell
npm run dev         # start the dev server
npm run build        # production build
npm run lint          # lint
npm run db:migrate   # create/apply a new Prisma migration
npm run db:seed       # re-run the seed script (safe to re-run — upserts)
npm run db:studio    # open Prisma Studio to browse the database
```

## Deploying beyond your own machine

The app is built to run anywhere Node.js runs (SQLite is a single file, `dev.db`, at the project root). For production:

- Set a strong, unique `SESSION_SECRET`.
- Point `DATABASE_URL` at a persistent file path (or swap the Prisma datasource/adapter for Postgres if you outgrow SQLite).
- Run `npm run build && npm run start` behind HTTPS — session cookies are marked `Secure` automatically outside of development.
