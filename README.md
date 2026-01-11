# Cloudflare Workers Real-time Chat Demo

[cloudflarebutton]

A production-ready full-stack chat application built with Cloudflare Workers, Durable Objects, and React. Demonstrates scalable, multi-tenant entity storage using a single Global Durable Object class, with indexed listing, CRUD operations, and real-time message handling.

## Features

- **Global Durable Objects**: Efficient multi-entity storage (Users, ChatBoards) in a single DO class with optimistic concurrency.
- **Indexed Entities**: Automatic indexing for paginated listing with cursors.
- **Real-time Chat**: Per-chat message storage with timestamps.
- **Modern UI**: React 18, TypeScript, Tailwind CSS, shadcn/ui components.
- **API-First**: Hono router with CORS, structured responses, and error handling.
- **Hot Reload**: Vite dev server with Workers integration.
- **Seed Data**: Mock users/chats/messages for instant demo.
- **Type-Safe**: Full TypeScript end-to-end, shared types between FE/BE.
- **Deployment-Ready**: One-command deploy to Cloudflare Workers.

## Tech Stack

- **Backend**: Cloudflare Workers, Durable Objects, Hono
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
- **State/UI**: Lucide icons, Sonner toasts, Framer Motion
- **Tools**: Bun (package manager), wrangler, ESLint, Prettier

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Cloudflare CLI (wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated (`wrangler login`)

### Installation

```bash
bun install
```

### Development

Start the dev server (proxies API to Workers):

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or your configured `PORT`).

### Generate Types

Regenerate Worker bindings:

```bash
bun cf-typegen
```

## Usage

### API Endpoints

All endpoints under `/api/`:

- `GET /api/users` - List users (paginated)
- `POST /api/users` - Create user `{ name: string }`
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/deleteMany` - Bulk delete `{ ids: string[] }`

- `GET /api/chats` - List chats (paginated)
- `POST /api/chats` - Create chat `{ title: string }`
- `GET /api/chats/:chatId/messages` - List messages
- `POST /api/chats/:chatId/messages` - Send message `{ userId: string, text: string }`
- `DELETE /api/chats/:id` - Delete chat
- `POST /api/chats/deleteMany` - Bulk delete

See `shared/types.ts` for response shapes.

### Frontend

Replace `src/pages/HomePage.tsx` with your app. Use `api-client.ts` for type-safe API calls:

```tsx
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';

const users = await api<User[]>('/api/users');
```

## Deployment

Deploy to Cloudflare Workers:

```bash
bun deploy
```

This runs `vite build` then `wrangler deploy`.

[cloudflarebutton]

Configure your production domain in `wrangler.jsonc`.

## Project Structure

```
├── src/              # React app (Vite)
├── worker/           # Cloudflare Worker (Hono + DOs)
├── shared/           # Shared types/mock data
└── ...               # Configs (tsconfig, tailwind, etc.)
```

## Customization

- **Entities**: Extend `IndexedEntity` in `worker/entities.ts`, add routes in `worker/user-routes.ts`.
- **UI**: Edit `src/pages/`, use shadcn components. Sidebar in `src/components/app-sidebar.tsx`.
- **Seeds**: Update `shared/mock-data.ts`, runs on first `list()`.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Build frontend |
| `bun lint` | Lint code |
| `bun preview` | Preview production build |
| `bun deploy` | Build + deploy |
| `bun cf-typegen` | Update Worker types |

## Contributing

1. Fork and clone
2. `bun install`
3. `bun dev`
4. Submit PR

## License

MIT. See [LICENSE](LICENSE) for details.