# replit.md

## Overview

This is a fintech trading portfolio application built as a mobile-first React SPA with an Express backend. The app displays trading performance data including portfolio value, profit/loss history, and trade records. It features a polished dark-themed UI with smooth animations and a password-protected login flow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (dark mode default)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with hot module replacement

The frontend follows a page-based structure with:
- Login page (password: `Ashu2008@`)
- Dashboard pages: Home, History, Profile, Settings
- Shared layout with bottom navigation for mobile-first design

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: Simple REST endpoints defined in `shared/routes.ts` with Zod validation
- **Development**: Vite dev server proxied through Express for HMR support

### Data Layer
- **Schema**: Single `trades` table storing trade records with date, amount, type, and status
- **Storage Pattern**: `DatabaseStorage` class in `server/storage.ts` abstracts database operations
- **Seeding**: Initial trade data is seeded on server startup if the database is empty

### Build Process
- Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client
- Server dependencies are selectively bundled to optimize cold start times
- Output: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations and schema push (`npm run db:push`)

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `wouter`: Client-side routing
- `zod`: Runtime type validation for API contracts
- Full shadcn/ui component set via Radix UI primitives

### Development Tools
- `tsx`: TypeScript execution for development
- `vite`: Frontend build and dev server
- Replit-specific plugins for development experience (`@replit/vite-plugin-*`)