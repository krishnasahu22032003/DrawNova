<div align="center">

<br />

```
██████╗ ██████╗  █████╗ ██╗    ██╗███╗   ██╗ ██████╗ ██╗   ██╗ █████╗
██╔══██╗██╔══██╗██╔══██╗██║    ██║████╗  ██║██╔═══██╗██║   ██║██╔══██╗
██║  ██║██████╔╝███████║██║ █╗ ██║██╔██╗ ██║██║   ██║██║   ██║███████║
██║  ██║██╔══██╗██╔══██║██║███╗██║██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║
██████╔╝██║  ██║██║  ██║╚███╔███╔╝██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝
```

<br />

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?style=flat-square&logo=turborepo)

<br />

</div>

---

## What is DrawNova?

DrawNova is a full-stack, real-time collaborative whiteboard application built as a Turborepo monorepo. It lets multiple users join a shared room and draw simultaneously — every shape, cursor movement, and board action syncs instantly across all connected clients via WebSockets, with full persistence backed by Prisma and PostgreSQL.

Beyond rooms, every user also has a personal private board — a persistent canvas that auto-saves to the database with a debounced 2-second write, and falls back gracefully to a localStorage draft when the user is offline or the server is unreachable.

The project is architected with a strict separation of concerns across three independent apps inside the monorepo: a **Next.js 15 frontend** using the App Router, a **dedicated Express HTTP API** for auth, rooms, and board management, and a **standalone WebSocket server** for all real-time collaboration. These apps share common packages for the Prisma client, Zod validation schemas, TypeScript types, and environment config — all orchestrated by Turborepo for fast, parallel builds and dependency-aware task pipelines.

---

## Screenshots

> Add your screenshots to a `screenshots/` folder at the monorepo root and they will render here automatically.

### Dashboard

![Dashboard](./screenshots/dashboard.png)

> The main landing page after login. Lists all rooms you own or are a member of, provides access to your personal board, and exposes the Create Room modal.

---

### Collaborative Room

![Room](./screenshots/room.png)

> The live drawing room. Shows real-time cursors from all connected members, the member count badge, the sync status indicator, and the full canvas toolbar.

---

### Personal Board

![Personal Board](./screenshots/personal-board.png)

> Your private canvas. Auto-saves every 2 seconds after the last change, shows a five-state sync badge (loading → saving → saved → error → idle), and recovers from a localStorage draft if the DB save fails.

---

## Features

**Real-time collaboration**
Every shape drawn, updated, or deleted is broadcast to all clients in the room via WebSockets in under a frame. Cursor positions are tracked and rendered live for every connected member.

**Persistent boards**
Board state is saved to PostgreSQL via Prisma. On the WebSocket server, all shape mutations are debounced at 2 seconds to prevent write storms during fast drawing sessions. On the personal board, the frontend hook debounces its own save independently.

**Room system**
Users can create named rooms and share them. The RoomManager singleton on the WS server tracks which sockets are in which rooms using a two-way map, enabling O(1) broadcast and clean disconnect handling. Member join/leave events are broadcast to the room in real time.

**Personal board**
Every user gets a private persistent canvas isolated from any room. It loads from the API on mount, falls back to a localStorage draft if the API is unreachable, and pushes the draft back to the DB on the next successful connection.

**Shape operations**
The full set of collaborative operations — `DRAW`, `UPDATE_SHAPE`, `DELETE_SHAPE`, and `CLEAR_BOARD` — are all synced across the room via the WS server. The sender's local state is updated optimistically before the broadcast completes.

**JWT authentication**
JWTs are issued on login and stored as HTTP-only cookies. The WebSocket server reads the token directly from `req.headers.cookie` during the WS upgrade handshake — keeping the token out of URLs and server logs entirely.

**Sync indicator**
A `SyncBadge` component with five distinct states gives the user constant, accurate feedback on board persistence: `loading` on initial fetch, `saving` during the debounce window, `saved` on successful write, `error` on failure, and `idle` when no changes are pending.

**Dark mode**
System-aware theme support via Tailwind CSS. The theme is also stored as part of the board's `appState` in the database.

---

## Monorepo Structure

```
drawnova/
├── apps/
│   ├── web/                  # Next.js 15 frontend (App Router)
│   │   ├── app/              # Pages, layouts, route groups
│   │   ├── components/       # Canvas, ToolBar, SyncBadge, modals
│   │   ├── hooks/            # useRoomSync, useBoardSync
│   │   ├── contexts/         # WSContext — shared WS connection
│   │   ├── lib/              # boardApi.ts (Axios), ENV config
│   │   └── types/            # Shape, Tool types
│   │
│   ├── http-backend/         # Express HTTP API
│   │   ├── controllers/      # AuthController, RoomController, BoardController
│   │   ├── routes/           # Auth, Room, Board routers
│   │   ├── middleware/        # JWT auth middleware
│   │   └── schemas/          # Zod request validation schemas
│   │
│   └── ws-backend/           # Standalone WebSocket server
│       ├── handlers/         # roomHandler, shapeHandler, cursorHandler, removeSocket
│       ├── managers/         # RoomManager singleton
│       └── utils/            # ENV loader
│
├── packages/
│   ├── db/                   # Prisma client + schema (shared across apps)
│   ├── common/               # Shared Zod schemas + TypeScript types
│   └── typescript-config/    # Shared tsconfig base presets
│
├── turbo.json                # Turborepo pipeline config
└── package.json              # Root workspace config
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, Tailwind CSS |
| HTTP Backend | Express 4, Zod, JWT, bcrypt |
| WebSocket Server | `ws`, JWT, custom RoomManager singleton |
| Database ORM | Prisma 5 |
| Database | PostgreSQL |
| Monorepo Tooling | Turborepo, pnpm workspaces |
| Language | TypeScript 5 — end-to-end |
| Auth | JWT via HTTP-only cookie |
| Validation | Zod (shared schemas in `packages/common`) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Next.js)                   │
│                                                         │
│   WSContext ──── shared WebSocket connection            │
│       │                                                 │
│       ├──► useRoomSync ──► Canvas (room page)           │
│       │        └── addShape / updateShape / deleteShape │
│       │        └── sendCursor / resetBoard              │
│       │                                                 │
│   useBoardSync ──────────► Canvas (personal board)      │
│       └── persistShapes (debounced) / resetBoard        │
└──────────┬──────────────────────────────┬───────────────┘
           │ HTTP (Axios + withCredentials)│ WebSocket (cookie auth)
           ▼                              ▼
┌──────────────────────┐     ┌────────────────────────────┐
│   Express Backend    │     │     WebSocket Server       │
│   :3002              │     │     :8080                  │
│                      │     │                            │
│  POST /auth/login    │     │  RoomManager (singleton)   │
│  POST /auth/signup   │     │  ├─ rooms Map              │
│  GET  /rooms         │     │  │   roomId → Set<WS>      │
│  POST /rooms         │     │  └─ socketRoom Map         │
│  DELETE /rooms/:id   │     │      WS → Set<roomId>      │
│  GET  /board         │     │                            │
│  PATCH /board/update │     │  Handlers:                 │
│  PATCH /board/clear  │     │  ├─ JOIN_ROOM              │
│                      │     │  ├─ LEAVE_ROOM             │
│  Zod validation      │     │  ├─ DRAW                   │
│  JWT middleware       │     │  ├─ UPDATE_SHAPE          │
│  Prisma ORM          │     │  ├─ DELETE_SHAPE           │
└──────────┬───────────┘     │  ├─ CURSOR_MOVE            │
           │                 │  └─ CLEAR_BOARD            │
           │                 └──────────┬─────────────────┘
           └──────────┬─────────────────┘
                      ▼
            ┌──────────────────┐
            │    PostgreSQL    │
            │  (via Prisma)    │
            │                 │
            │  User           │
            │  Room           │
            │  Board          │
            │  RoomMember     │
            └──────────────────┘
```

### WebSocket Message Flow

```
Client A (sender)         WS Server                 Client B / C
       │                      │                           │
       │─── JOIN_ROOM ────────►│                           │
       │◄── JOINED ────────────│  (board elements +        │
       │    (board state)      │   appState + memberCount) │
       │                      │─── MEMBER_JOINED ─────────►│
       │                      │                           │
       │─── DRAW (shape) ─────►│                           │
       │                      │─── DRAW (shape) ──────────►│
       │                      │   (debounced DB save)      │
       │                      │                           │
       │─── UPDATE_SHAPE ─────►│                           │
       │                      │─── UPDATE_SHAPE ──────────►│
       │                      │                           │
       │─── DELETE_SHAPE ─────►│                           │
       │                      │─── DELETE_SHAPE ──────────►│
       │                      │                           │
       │─── CURSOR_MOVE ──────►│                           │
       │                      │─── CURSOR_MOVE ───────────►│
       │                      │                           │
       │─── CLEAR_BOARD ──────►│                           │
       │◄── CLEAR_BOARD ───────│  (broadcast to ALL        │
       │   setShapes([])       │   including sender)       │
       │                      │─── CLEAR_BOARD ───────────►│
       │                      │   setShapes([])            │
       │                      │                           │
       │─── LEAVE_ROOM ───────►│                           │
       │                      │─── MEMBER_LEFT ───────────►│
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted, e.g. Supabase, Neon, Railway)
- pnpm — `npm install -g pnpm`

### 1. Clone and install

```bash
git clone https://github.com/your-username/drawnova.git
cd drawnova
pnpm install
```

Turborepo will hoist shared dependencies and link internal packages automatically.

### 2. Configure environment variables

Create `.env` files in each app. All three must share the same `JWT_SECRET` and point to the same database.

**`apps/http-backend/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/drawnova
JWT_SECRET=your_jwt_secret_here
PORT=3002
```

**`apps/ws-backend/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/drawnova
JWT_SECRET=your_jwt_secret_here
PORT=8080
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_HTTP_URL=http://localhost:3002
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### 3. Set up the database

```bash
cd packages/db
pnpm prisma migrate dev --name init
pnpm prisma generate
```

This creates all tables and generates the typed Prisma client that both the HTTP and WS backends import from `@repo/db/client`.

### 4. Run the full stack

From the monorepo root:

```bash
pnpm dev
```

Turborepo resolves the dependency graph and starts all three apps in parallel with proper ordering:

| Service | URL |
|---|---|
| Web (Next.js) | http://localhost:3000 |
| HTTP Backend (Express) | http://localhost:3002 |
| WebSocket Server | ws://localhost:8080 |

---

## Key Implementation Details

### RoomManager

The `RoomManager` is a singleton on the WebSocket server that manages all room membership using two complementary maps:

```
rooms:      Map<roomId, Set<WebSocket>>   — room → every socket in it
socketRoom: Map<WebSocket, Set<roomId>>   — socket → every room it joined
```

This two-way structure allows O(1) lookup in both directions. When a client disconnects (even ungracefully), `removeSocket` walks the socket's room set, broadcasts `MEMBER_LEFT` to each room, and cleans up both maps — with no dangling references.

### Debounced Board Persistence

Shape saves on the WS server are debounced per `boardId` at 2 seconds. A single `Map<boardId, timer>` tracks pending saves — every shape mutation resets the timer. This means a user drawing rapidly fires only one DB write after they pause, not one per stroke. The same pattern is used independently in `useBoardSync` on the frontend for personal board saves.

### Frontend Sync Hooks

| Hook | Scope | Responsibility |
|---|---|---|
| `useRoomSync` | Room page | Manages the WS lifecycle, sends `JOIN_ROOM` / `LEAVE_ROOM`, handles all incoming message types, exposes `addShape`, `updateShape`, `deleteShape`, `sendCursor`, `resetBoard` |
| `useBoardSync` | Personal board | Loads board from API on mount, falls back to localStorage draft, debounces DB saves, exposes `updateShapes` and `resetBoard` |

### WSContext

A single `WSContext` holds one shared WebSocket connection for the entire app. Both the dashboard and the room page consume the same `ws` instance via `useWS()` — preventing duplicate connections when navigating between routes. The connection is established once on mount, and `useRoomSync` attaches its message listener on top of the existing socket.

### Authentication Flow

1. User logs in → Express issues a JWT → stored as an **HTTP-only cookie**
2. All Axios requests use `withCredentials: true` → cookie is sent automatically
3. WebSocket upgrade request also carries the cookie in `req.headers.cookie` → WS server verifies the JWT before accepting the connection
4. The verified `userId` is attached to the `ws` object as `(ws as any).userId` for use in room and shape handlers

---

## Database Schema (Prisma)

```prisma
model User {
  id        String       @id @default(cuid())
  email     String       @unique
  password  String
  board     Board?
  rooms     RoomMember[]
  ownedRooms Room[]      @relation("RoomOwner")
}

model Room {
  id       String       @id @default(cuid())
  name     String
  ownerId  String
  owner    User         @relation("RoomOwner", fields: [ownerId], references: [id])
  board    Board?
  members  RoomMember[]
}

model Board {
  id        String   @id @default(cuid())
  userId    String?  @unique   // set for personal boards
  roomId    String?  @unique   // set for room boards
  elements  Json     @default("[]")
  appState  Json?
  updatedAt DateTime @updatedAt
}

model RoomMember {
  userId String
  roomId String
  user   User   @relation(fields: [userId], references: [id])
  room   Room   @relation(fields: [roomId], references: [id])

  @@id([userId, roomId])
}
```

---

## Scripts

All scripts run from the monorepo root and are orchestrated by Turborepo:

```bash
pnpm dev          # Start all apps in watch/dev mode (parallel)
pnpm build        # Production build for all apps
pnpm lint         # ESLint across all workspaces
pnpm type-check   # tsc --noEmit across all packages
```

Target a single app without running the others:

```bash
pnpm --filter web dev
pnpm --filter http-backend dev
pnpm --filter ws-backend dev
```

---

## Roadmap

- [ ] Shape selection and multi-select
- [ ] Undo / redo history (per-client and collaborative)
- [ ] Image upload to canvas
- [ ] Room invite links with share codes
- [ ] Export board as PNG / SVG
- [ ] Presence avatars attached to live cursors
- [ ] Mobile touch and stylus support
- [ ] Optimistic locking to handle concurrent shape conflicts

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Made with ❤️ by **Krishna Sahu**

[krishna.sahu.work@gmail.com](mailto:krishna.sahu.work@gmail.com)

<br />

*Powered by Next.js · WebSockets · Turborepo · Prisma*

</div>