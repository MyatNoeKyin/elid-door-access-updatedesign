# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ELID Access Control Dashboard System (ELID DAS) - A web-based physical access control management platform built with Next.js 15 and React 19. The project is currently in early development with UI components in place but pending backend integration.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

**Important**: Uses pnpm as package manager. ESLint and TypeScript errors are ignored during builds (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`). No test framework configured yet.

## High-Level Architecture

### Core Stack
- **Frontend**: Next.js 15.2.4 (App Router), React 19
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand (installed but not yet implemented)
- **Backend**: Strapi CMS (planned, not integrated)
- **Database**: PostgreSQL (planned, not integrated)

### Project Structure Pattern
```
/app/dashboard/[module]/
  ├── page.tsx           # Main page component
  ├── loading.tsx        # Loading state (skeleton)
  └── [submodules]/      # Nested routes

/components/
  ├── ui/                # shadcn/ui components (30+)
  ├── [module]-form.tsx  # Form components
  ├── [module]-table.tsx # Table components
  └── phase[1-5]/        # Phased UI components
```

### Key Architectural Decisions
1. **Multi-tenant Architecture**: Built-in support for tenants/departments (UI only)
2. **Component Pattern**: Consistent form/table pattern for CRUD operations
3. **Real-time Monitoring**: WebSocket infrastructure planned but not implemented
4. **Access Control Model**: Time-based, holiday schedules, multiple credential types
5. **Integration Point**: SKTES Controller System API (per PRD)

## Current Implementation Status

**Completed**:
- Full UI component library with 30+ shadcn/ui components
- Dashboard navigation and routing structure
- Form validation schemas with Zod
- Dark mode support via next-themes
- Responsive layouts for all dashboard modules

**Not Implemented**:
- Backend API routes (`/app/api/*`)
- Authentication/authorization system
- Database models and migrations
- Real-time WebSocket connections
- Data fetching and state management
- Error boundaries and proper error handling
- Environment variable configuration
- Testing infrastructure

## Critical Context for Development

### When Implementing Features
1. **API Routes**: Create in `/app/api/[endpoint]/route.ts` following Next.js App Router conventions
2. **Type Safety**: Define shared types in a new `/lib/types/` directory based on PRD data models
3. **Authentication**: Implement using NextAuth.js or similar (auth routes not present)
4. **State Management**: Zustand is installed but not configured - create stores in `/lib/state/`
5. **Real-time**: WebSocket server needs to be implemented separately from Next.js

### PRD Requirements Summary
- **Users**: 10,000 concurrent users, 100,000 daily access events
- **Performance**: < 2s page load time requirement
- **Credentials**: Cards, PINs, fingerprints, temporary access
- **Integration**: Must sync with SKTES Controller System
- **Compliance**: Complete audit trail for all access events

### Missing Infrastructure Checklist
```
[ ] Create .env.local with required environment variables
[ ] Set up PostgreSQL database schema
[ ] Configure Strapi CMS instance
[ ] Implement authentication middleware
[ ] Create API route handlers
[ ] Set up WebSocket server for real-time updates
[ ] Configure proper TypeScript strict mode
[ ] Remove ESLint/TypeScript build ignores
[ ] Add error boundaries to dashboard routes
[ ] Implement data fetching with proper loading states
```

## Environment Variables (Required)
```bash
# Database
DATABASE_URL=postgresql://[connection_string]

# Strapi CMS
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=[token]

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[secret]

# SKTES Integration
SKTES_API_URL=[api_url]
SKTES_API_KEY=[api_key]

# WebSocket
WS_URL=ws://localhost:3001
```

## File Naming Conventions
- Forms: `[module]-form.tsx`
- Tables: `[module]-table.tsx`
- API Routes: `/app/api/[resource]/route.ts`
- Types: `/lib/types/[module].ts`
- Hooks: `/hooks/use-[functionality].ts`
- State: `/lib/state/[module]-store.ts`

## Development Workflow
1. UI components exist - focus on backend integration
2. Use existing form/table patterns when adding CRUD features
3. All forms have Zod schemas - extend for API validation
4. Skeleton loaders exist but need to be wired to async operations
5. Check `/components/phase[1-5]/` for phased UI implementations