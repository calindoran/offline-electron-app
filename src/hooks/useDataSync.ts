import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { getPendingMutations } from '@/services/queueService'
import { pullServerChanges, syncPendingMutations } from '@/services/syncService'
import type { PendingMutation, SyncStatus } from '@/types/electron'

interface UseDataSyncOptions {
  syncInterval?: number
  autoSync?: boolean
  useElectronIPC?: boolean
}

const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}

export const useDataSync = (options: UseDataSyncOptions = {}) => {
  const { useElectronIPC = false } = options
  const queryClient = useQueryClient()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncProgress, setSyncProgress] = useState<SyncStatus | null>(null)

  const syncNow = useCallback(async () => {
    setIsSyncing(true)
    setError(null)
    setSyncProgress(null)

    try {
      if (isElectron() && useElectronIPC) {
        const pending = await getPendingMutations()

        const mutations: PendingMutation[] = pending.map((m) => ({
          id: m.id,
          operation: m.type,
          data: m.payload,
          timestamp: m.timestamp,
        }))

        const result = await window.electronAPI.performSync(mutations)

        if (!result.success) {
          throw new Error(result.message || 'Sync failed')
        }

        const changes = await pullServerChanges()
        if (changes) {
          Object.entries(changes).forEach(([key, data]) => {
            queryClient.setQueryData([key], data)
          })
        }
      } else {
        await syncPendingMutations()

        const changes = await pullServerChanges()
        if (changes) {
          Object.entries(changes).forEach(([key, data]) => {
            queryClient.setQueryData([key], data)
          })
        }
      }

      setLastSync(new Date())
    } catch (err: unknown) {
      console.error('Sync error:', err)
      const message = err instanceof Error ? err.message : 'Unknown sync error'
      setError(message)
    } finally {
      if (!useElectronIPC) {
        setIsSyncing(false)
      }
    }
  }, [queryClient, useElectronIPC])

  useEffect(() => {
    if (!isElectron() || !useElectronIPC) return

    const unsubscribe = window.electronAPI.on('sync-status', (status: unknown) => {
      const syncStatus = status as SyncStatus
      setSyncProgress(syncStatus)

      if (syncStatus.status === 'completed') {
        setIsSyncing(false)
        setLastSync(new Date())
      } else if (syncStatus.status === 'error') {
        setIsSyncing(false)
        setError(syncStatus.error || 'Sync failed')
      }
    })

    return unsubscribe
  }, [useElectronIPC])

  useEffect(() => {
    if (!isElectron()) return

    const unsubscribe = window.electronAPI.on('sync-requested', () => {
      syncNow()
    })

    return unsubscribe
  }, [syncNow])

  return {
    isSyncing,
    lastSync,
    error,
    syncNow,
    syncProgress,
    isElectron: isElectron(),
  }
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
