import { db, type LocalEntity } from '../db/indexedDb'
import { apiClient } from './apiClient'
import { resolveConflicts } from './confilctResolver'
import { clearMutation, getPendingMutations } from './queueService'

export const syncPendingMutations = async () => {
  const queued = await getPendingMutations()

  for (const mutation of queued) {
    try {
      const { entity, type, payload } = mutation
      if (type === 'create') await apiClient.post(`/api/${entity}`, payload)
      else if (type === 'update') await apiClient.put(`/api/${entity}/${payload.id}`, payload)
      else if (type === 'delete') await apiClient.delete(`/api/${entity}/${payload.id}`)

      await clearMutation(mutation.id)
    } catch (err) {
      console.error(`Failed to sync mutation ${mutation.id}`, err)
    }
  }
}

export const pullServerChanges = async () => {
  // Get first 150 Pokémon as example
  const data = await apiClient.get(`/pokemon?limit=150`)
  const localItems: LocalEntity[] = await db.items.toArray()

  // Map PokéAPI results into LocalEntity format
  const serverItems: LocalEntity[] = data.results.map((poke: any, index: number) => ({
    id: poke.name, // use name as unique ID
    name: poke.name,
    notes: '', // placeholder
    updatedAt: Date.now(),
    isSynced: true,
  }))

  await resolveConflicts(localItems, serverItems)

  return { items: serverItems }
}
