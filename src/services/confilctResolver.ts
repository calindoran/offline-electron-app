import { db, type LocalEntity } from '../db/indexedDb'

export const resolveConflicts = async (localItems: LocalEntity[], serverItems: LocalEntity[]) => {
  const updates: LocalEntity[] = []

  for (const serverItem of serverItems) {
    const local = localItems.find((i) => i.id === serverItem.id)
    if (!local) {
      updates.push(serverItem)
    } else if (serverItem.updatedAt > local.updatedAt) {
      updates.push(serverItem)
    }
  }

  if (updates.length > 0) {
    await db.items.bulkPut(updates)
  }

  return updates
}
