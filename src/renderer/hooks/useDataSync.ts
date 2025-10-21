import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { getPendingMutations } from '@/services/queueService'
import { pullServerChanges, syncPendingMutations } from '@/services/syncService'

interface UseDataSyncOptions {
  syncInterval?: number // in ms
  autoSync?: boolean
}

// Simple version without auto-sync
export const useDataSync = () => {
  const queryClient = useQueryClient()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const syncNow = useCallback(async () => {
    setIsSyncing(true)
    setError(null)
    try {
      const changes = await pullServerChanges()
      if (changes) {
        Object.entries(changes).forEach(([key, data]) => {
          queryClient.setQueryData([key], data)
        })
      }
      setLastSync(new Date())
    } catch (err: any) {
      console.error('Sync error:', err)
      setError(err?.message || 'Unknown sync error')
    } finally {
      setIsSyncing(false)
    }
  }, [queryClient])

  return { isSyncing, lastSync, error, syncNow }
}

// Full version with auto-sync (commented out)
// export const useDataSync = ({ syncInterval = 30000, autoSync = true }: UseDataSyncOptions = {}) => {
//   const queryClient = useQueryClient()
//   const [isSyncing, setIsSyncing] = useState(false)
//   const [lastSync, setLastSync] = useState<Date | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const syncNow = useCallback(async () => {
//     setIsSyncing(true)
//     setError(null)
//     try {
//       // 1. Push queued offline mutations to server
//       await syncPendingMutations()

//       // 2. Pull latest changes from server
//       const changes = await pullServerChanges()

//       // 3. Update local cache with remote changes
//       if (changes) {
//         Object.entries(changes).forEach(([key, data]) => {
//           // Write into React Query cache
//           queryClient.setQueryData([key], data)
//         })
//       }

//       setLastSync(new Date())
//     } catch (err: any) {
//       console.error('Sync error:', err)
//       setError(err?.message || 'Unknown sync error')
//     } finally {
//       setIsSyncing(false)
//     }
//   }, [queryClient])

//   // Auto-sync loop
//   useEffect(() => {
//     if (!autoSync) return
//     const interval = setInterval(syncNow, syncInterval)
//     return () => clearInterval(interval)
//   }, [syncInterval, autoSync, syncNow])

//   // Optionally trigger immediate sync when pending mutations exist & online
//   useEffect(() => {
//     const handleOnline = async () => {
//       const pending = await getPendingMutations()
//       if (pending.length > 0) syncNow()
//     }
//     window.addEventListener('online', handleOnline)
//     return () => window.removeEventListener('online', handleOnline)
//   }, [syncNow])

//   return {
//     isSyncing,
//     lastSync,
//     error,
//     syncNow,
//   }
// }
