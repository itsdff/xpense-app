# Xpense — Personal Expense Tracker

A clean, fast personal expense tracker with Supabase persistence, light/dark mode, and password protection. Deployable to Vercel in under 10 minutes.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + CSS variables for theming
- **Supabase** (PostgreSQL) for data
- **next-themes** for light/dark toggle
- **Chart.js** + react-chartjs-2 for monthly summaries
- **Vercel** for deployment

---

## Setup — Step by step

### 1. Supabase

1. Go to https://supabase.com → Create a new project
2. Once created, go to **SQL Editor → New query**
3. Paste the contents of `supabase-schema.sql` and click **Run**
4. Go to **Project Settings → API**
5. Copy:
   - **Project URL** → NEXT_PUBLIC_SUPABASE_URL
   - **anon / public key** → NEXT_PUBLIC_SUPABASE_ANON_KEY

### 2. Environment variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
NEXT_PUBLIC_APP_PASSWORD=your_chosen_password
```

### 3. Run locally

```bash
npm install
npm run dev
```

---

## Deploy to Vercel

### Option A — GitHub (recommended)
1. Push to GitHub repo
2. vercel.com → Add New Project → import repo
3. Add your 3 env variables
4. Deploy — every git push auto-deploys

### Option B — CLI
```bash
npm i -g vercel && vercel
```

---

## Add to home screen (PWA)

- **Android Chrome**: three-dot menu → Add to Home screen
- **iOS Safari**: Share → Add to Home Screen

---

## Fingerprint auth (future upgrade)

The WebAuthn API supports passkeys with device biometric (fingerprint/Face ID).
Works on Android Chrome and iOS Safari 16+ with no third-party library.
Ask Claude to implement this when you are ready.

---

## Schema overview

```
categories   id, name
mediums      id, name
expenses     id, amount, category_id, medium_id, note, created_at
```
