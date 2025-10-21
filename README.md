# offline-electron-app

## Data Flow Diagram
             ┌─────────────┐
             │   Server    │
             │ (API CRUD)  │
             └─────┬──────┘
                   │
           Pull Delta Changes
                   │
                   ▼
           ┌─────────────┐
           │  SyncService │
           │ pullServer   │
           │ syncPending  │
           └─────┬───────┘
                 │
    Conflict Resolution / Merge
                 │
                 ▼
           ┌─────────────┐
           │ IndexedDB   │
           │  (Dexie)    │
           │ items table │
           └─────┬───────┘
                 │
                 │ Local Reads
                 ▼
          ┌─────────────┐
          │ React Query │
          │  useItems   │
          └─────┬───────┘
                 │
                 │ Provides data to
                 ▼
           ┌─────────────┐
           │ UI (React)  │
           │ Table/Form  │
           └─────────────┘

------------------------------------------------
Offline Mutation Flow (Queued Actions)
------------------------------------------------
           ┌─────────────┐
           │ UI (React)  │
           │ ItemForm    │
           └─────┬───────┘
                 │
       Add / Update / Delete
                 ▼
           ┌─────────────┐
           │ useMutateItem│
           │  Optimistic │
           └─────┬───────┘
                 │
          Writes to Local DB
                 │
          Adds to Queue Table
                 ▼
           ┌─────────────┐
           │ mutationQueue│
           │  (Dexie)    │
           └─────┬───────┘
                 │
           SyncService periodically
                 │
           Push mutations to Server
                 ▼
             ┌─────────────┐
             │   Server    │
             │ (API CRUD)  │
             └─────────────┘

## Explanation

1. Local Reads

- UI components (Table/Form) always read from IndexedDB via React Query (useItems).

- Ensures offline-first rendering.

2. Offline Mutations

- Any create/update/delete in the UI goes through useMutateItem.

- It updates IndexedDB immediately (optimistic update) and queues the mutation for later sync.

3. Sync Service

- useDataSync periodically:

   - Pushes queued mutations to the server.

   - Pulls server-side changes.

- Applies conflict resolution if needed.

4. Server

- Receives mutations and sends deltas on request.

- The client merges changes into IndexedDB.



## File Roles

| File                                  | Role                                                                  |
| ------------------------------------- | --------------------------------------------------------------------- |
| .gitignore                            | Ignore node_modules, dist, logs, env files, OS files                  |
| package.json                          | Project dependencies + dev scripts (concurrently for Vite + Electron) |
| tsconfig.json                         | TypeScript compiler setup                                             |
| vite.config.ts                        | Vite dev/build config                                                 |
| electron/main.ts                      | Electron main process                                                 |
| electron/preload.js                   | Optional contextBridge for Electron APIs                              |
| src/renderer/main.tsx                 | React entry point, wraps App in React Query provider                  |
| src/renderer/App.tsx                  | Root component, shows form + table + sync status                      |
| src/renderer/pages/ItemsTablePage.tsx | Table view using TanStack Table                                       |
| src/renderer/components/ItemForm.tsx  | Form to add/edit items (React Hook Form + Zod)                        |
| src/renderer/hooks/useDataSync.ts     | Hook to sync local queue and pull server deltas                       |
| src/renderer/hooks/useItems.ts        | Hook to fetch items from IndexedDB via React Query                    |
| src/renderer/hooks/useMutateItem.ts   | Hook to update/delete items, queue mutations                          |
| src/db/indexedDb.ts                   | Dexie DB schema for items and mutationQueue                           |
| src/services/apiClient.ts             | Minimal API wrapper for fetch calls                                   |
| src/services/queueService.ts          | Handles queued offline mutations                                      |
| src/services/syncService.ts           | Push queued mutations, pull server changes                            |
| src/services/conflictResolver.ts      | Server/local conflict resolution for sync                             |