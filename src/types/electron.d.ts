/**
 * Type definitions for Electron API exposed to renderer process
 * This ensures type safety when using window.electronAPI
 */

// Define a type for pending mutations
export interface PendingMutation {
  id: string
  operation: string
  data: unknown
  timestamp: number
}

export interface SyncResult {
  success: boolean
  message?: string
  data?: {
    successful?: string[]
    failed?: Array<{ id: string; error: string }>
    total?: number
  } | null
}

export interface SyncStatus {
  status: 'syncing' | 'completed' | 'error'
  progress?: number
  total?: number
  successful?: number
  failed?: number
  error?: string
}

export interface OnlineStatus {
  online: boolean
  timestamp: number
}

export interface AppInfo {
  version: string
  name: string
  platform: string
  electron: string
  chrome: string
  node: string
}

export interface IElectronAPI {
  /**
   * Perform sync operation with pending mutations
   * @param pendingMutations - Array of mutations to sync
   * @returns Promise that resolves with sync result
   */
  performSync: (pendingMutations: PendingMutation[]) => Promise<SyncResult>

  /**
   * Check if the app is currently online
   * @returns Promise with online status
   */
  checkOnlineStatus: () => Promise<OnlineStatus>

  /**
   * Get application information
   * @returns Promise with app info (version, platform, etc.)
   */
  getAppInfo: () => Promise<AppInfo>

  /**
   * Listen for events from main process
   * @param channel - Event channel name
   * @param callback - Callback function to handle the event
   * @returns Unsubscribe function to remove the listener
   */
  on: (channel: string, callback: (...args: unknown[]) => void) => () => void

  /**
   * Remove event listener
   * @param channel - Event channel name
   * @param callback - Callback function to remove
   */
  off?: (channel: string, callback: (...args: unknown[]) => void) => void

  /**
   * Send one-way message to main process
   * @param channel - Event channel name
   * @param args - Arguments to send
   */
  send?: (channel: string, ...args: unknown[]) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    electron?: {
      process: {
        platform: string
        versions: NodeJS.ProcessVersions
      }
    }
  }
}
