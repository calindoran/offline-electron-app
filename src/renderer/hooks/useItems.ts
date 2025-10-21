import { useQuery } from '@tanstack/react-query'
import { db, type LocalEntity } from '../../db/indexedDb'

const fetchLocalItems = async (): Promise<LocalEntity[]> => {
  return db.items.toArray()
}

export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchLocalItems,
    staleTime: Infinity,
  })
}
