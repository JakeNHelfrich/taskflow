# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow is an Akiflow-clone productivity app built with:
- **Frontend**: TypeScript, React 19, TanStack Start (metaframework)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand for UI state, TanStack Query for server state

## Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Preview production build
```

## Mock Mode (Local Development)

Run the app without external services by setting `VITE_USE_MOCKS=true` in `.env.local`:

```bash
# .env.local
VITE_USE_MOCKS=true
```

This enables:
- In-memory database (`src/lib/mock/in-memory-db.ts`)
- Mock Supabase client (`src/lib/mock/mock-supabase.ts`)
- Mock authentication (`src/lib/mock/mock-auth.ts`)

Use `getClient()` from `@/lib/mock` to get the appropriate database client.

## Architecture

### Routing (TanStack Start)

File-based routing in `src/routes/`:
- `__root.tsx` - Root layout with providers (AuthProvider, QueryClientProvider)
- `_authenticated/route.tsx` - Protected route wrapper with auth check
- `_authenticated/{inbox,today,calendar,habits,focus,projects,settings}/` - App views
- `sign-in/`, `sign-up/` - Auth pages

The router is configured in `src/router.tsx` and must export `getRouter()`.

### Feature Modules

Each feature in `src/features/` follows this structure:
```
features/{feature}/
├── api/          # Server functions & queries
├── components/   # Feature-specific components
├── hooks/        # Custom hooks
├── types/        # TypeScript types
└── utils/        # Helper functions
```

Features: `tasks`, `calendar`, `projects`, `labels`, `habits`, `focus`, `recurring`

### Key Files

- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client
- `src/lib/clerk/server-auth.ts` - Server-side auth helpers
- `src/hooks/useAuth.ts` - Unified auth hook (works with both Clerk and mock)
- `src/types/database.types.ts` - Supabase database types
- `src/stores/` - Zustand stores for UI state

### Database Schema

Tables defined in `supabase/migrations/`:
- `profiles` - User profiles (synced from Clerk)
- `projects` - Task organization
- `labels` - Task tags
- `tasks` - Main task table with scheduling, priority, recurrence
- `task_labels` - Many-to-many tasks↔labels
- `time_blocks` - Calendar time slots
- `time_block_tasks` - Tasks assigned to time blocks
- `habits` - Habit definitions
- `habit_completions` - Daily habit check-ins
- `focus_sessions` - Pomodoro-style focus tracking

All tables use RLS policies with Clerk JWT integration via `auth.clerk_user_id()`.

### UI Components

- `src/components/ui/` - shadcn/ui components (Button, Card, Dialog, etc.)
- `src/components/layout/` - App shell (Sidebar, Header, AppShell)
- `src/components/providers/` - Context providers

## Environment Variables

Required in production (see `.env.example`):
- `VITE_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `ZAPIER_WEBHOOK_SECRET`

## TypeScript

Path alias `@/*` maps to `src/*`. Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`.
