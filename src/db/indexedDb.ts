import Dexie, { type Table } from 'dexie'
import type { QueuedMutation } from '../services/queueService'

export interface LocalEntity {
  id: string
  updatedAt: number // unix timestamp for delta sync
  [key: string]: any
}

export class AppDatabase extends Dexie {
  items!: Table<LocalEntity>
  mutationQueue!: Table<QueuedMutation>

  constructor() {
    super('OfflineAppDB')
    this.version(1).stores({
      items: 'id, updatedAt', // sample entity table
      mutationQueue: 'id, entity, type, timestamp',
    })
  }
}

export const db = new AppDatabase()
