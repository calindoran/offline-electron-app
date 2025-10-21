import { db } from '../db/indexedDb'

export interface QueuedMutation {
  id: string
  entity: string
  type: 'create' | 'update' | 'delete'
  payload: any
  timestamp: number
}

export const addToQueue = async (mutation: Omit<QueuedMutation, 'id' | 'timestamp'>) => {
  const item: QueuedMutation = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...mutation,
  }
  await db.mutationQueue.add(item)
  return item
}

export const getPendingMutations = () => {
  return db.mutationQueue.toArray()
}

export const clearMutation = async (id: string) => {
  return db.mutationQueue.delete(id)
}

export const clearAllMutations = async () => {
  return db.mutationQueue.clear()
}
