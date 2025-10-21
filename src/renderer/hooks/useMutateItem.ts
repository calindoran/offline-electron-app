import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db, type LocalEntity } from '../../db/indexedDb'
import { addToQueue } from '../../services/queueService'

export const useMutateItem = () => {
  const queryClient = useQueryClient()

  const upsertItem = useMutation({
    mutationFn: async (item: LocalEntity) => {
      await db.items.put({ ...item, updatedAt: Date.now() })
      await addToQueue({
        entity: 'items',
        type: 'update',
        payload: item,
      })

      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      await db.items.delete(id)
      await addToQueue({
        entity: 'items',
        type: 'delete',
        payload: { id },
      })

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  return { upsertItem, deleteItem }
}
