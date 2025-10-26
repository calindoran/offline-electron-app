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

  // Fetch detailed data for each Pokemon
  const serverItems: LocalEntity[] = await Promise.all(
    data.results.map(async (poke: { name: string; url: string }) => {
      try {
        // Fetch full pokemon details
        const details = await apiClient.get(`/pokemon/${poke.name}`)

        return {
          id: String(details.id), // use pokemon ID as unique identifier
          name: details.name,
          notes: '', // placeholder for user notes
          updatedAt: Date.now(),
          isSynced: true,
          sprites: details.sprites,
          types: details.types,
          abilities: details.abilities,
          height: details.height,
          weight: details.weight,
          stats: details.stats,
          base_experience: details.base_experience,
        }
      } catch (err) {
        console.error(`Failed to fetch details for ${poke.name}`, err)
        // Return basic data if detailed fetch fails
        return {
          id: poke.name,
          name: poke.name,
          notes: '',
          updatedAt: Date.now(),
          isSynced: true,
        }
      }
    })
  )

  await resolveConflicts(localItems, serverItems)

  return { items: serverItems }
}
