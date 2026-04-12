# Digital Diary

A premium private two-person diary built with Next.js App Router, TypeScript, Tailwind CSS, subtle React Three Fiber background effects, Framer Motion, and Supabase.

## Features

- Supabase email/password auth with a two-account allowlist
- First-time account creation for approved emails directly from the login page
- Private protected routes with persistent sessions
- Diary entry CRUD with markdown support, moods, and visibility controls
- Emoji reactions and comments
- Memory gallery backed by private Supabase Storage
- Voice note uploads and playback from private storage
- Future letters with unlock dates and countdowns
- Search and filter support for diary browsing
- Responsive glassmorphism UI with a subtle emotional particle background
- Zod + React Hook Form validation, loading states, empty states, and toast feedback

## Stack

- Next.js 15+ App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage

## Project Structure

```text
.
├─ app
│  ├─ (protected)
│  │  ├─ dashboard
│  │  ├─ diary
│  │  ├─ future-letters
│  │  ├─ gallery
│  │  ├─ profile
│  │  └─ voice-notes
│  ├─ login
│  ├─ error.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ loading.tsx
│  └─ not-found.tsx
├─ components
│  ├─ backgrounds
│  ├─ diary
│  ├─ forms
│  ├─ future-letters
│  ├─ gallery
│  ├─ layout
│  ├─ providers
│  ├─ shared
│  ├─ ui
│  └─ voice-notes
├─ hooks
├─ lib
│  ├─ actions
│  ├─ auth
│  ├─ data
│  ├─ supabase
│  ├─ validators
│  ├─ constants.ts
│  ├─ types.ts
│  └─ utils.ts
├─ supabase
│  └─ schema.sql
└─ middleware.ts
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill these in:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3005
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_ALLOWED_EMAILS=you@example.com,sister@example.com
```

`SUPABASE_ALLOWED_EMAILS` should match the seeded emails in `supabase/schema.sql`.

## Supabase Setup

1. Create a new Supabase project.
2. Open the SQL editor and run [`supabase/schema.sql`](./supabase/schema.sql).
3. Replace the example emails in `public.allowed_users` with the exact two real emails you want to allow.
4. Either create those two users in Supabase Auth manually, or use the in-app Create account flow with those exact two emails.
5. Copy the project URL and anon key into `.env.local`.
6. Leave the buckets private. The app generates signed URLs server-side for display and playback.

Notes:

- Profiles are created automatically on first successful login or signup.
- Both approved users can create diary entries, upload media, and write future letters.
- `shared` entries are visible to both people, while `private` entries stay visible only to the author.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3005`.

## Security Model

- App-level approved-email gate during login
- Server-side session checks in protected layouts and data loaders
- Row Level Security on all app tables
- `allowed_users` table to enforce the two approved emails at the database layer
- Private Supabase Storage buckets for gallery images and voice notes
- Signed URLs generated server-side for private media access
- Owner-scoped storage write/delete policies

## Deployment to Vercel

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables from `.env.local` into the Vercel project.
4. Ensure the seeded emails in Supabase still match the Vercel env values.
5. Deploy.

Recommended production checks:

- Disable open signups in Supabase Auth if you want the strictest two-user setup
- Confirm both storage buckets remain private
- Test both accounts after deployment
- Verify RLS with both approved member accounts

## Production Notes

- Images and audio paths are stored in the database, not public URLs
- Both approved users can upload their own gallery items, voice notes, and future letters
- Future letters unlock on the stored `unlock_date`; the UI reveals them automatically once the date passes
- Search/filtering is server-side so it stays consistent with RLS
