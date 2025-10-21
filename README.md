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
