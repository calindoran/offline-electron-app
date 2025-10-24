import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useDataSync } from '@/hooks/useDataSync'
import type { AppInfo } from '@/types/electron'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  // Use direct renderer sync (original behavior)
  const directSync = useDataSync({ useElectronIPC: false })

  // Use Electron IPC sync (with progress tracking)
  const ipcSync = useDataSync({ useElectronIPC: true })

  const [appInfo, setAppInfo] = React.useState<AppInfo | null>(null)
  const [activeMode, setActiveMode] = React.useState<'direct' | 'ipc'>('direct')

  // Get app info on mount (only in Electron)
  React.useEffect(() => {
    if (directSync.isElectron && window.electronAPI.getAppInfo) {
      window.electronAPI.getAppInfo().then(setAppInfo)
    }
  }, [directSync.isElectron])

  const currentSync = activeMode === 'direct' ? directSync : ipcSync

  return (
    <div className="space-y-6">
      <div className="border-4 border-black rounded-md p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-3xl font-bold">Settings</h1>
        <p className="mb-6 text-muted-foreground">Configure your application preferences.</p>

        <div className="space-y-4">
          <Card className="border-2 border-black">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-bold">General</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Enable notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Auto-sync data</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-bold">Appearance</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Dark mode</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Neobrutalism style (recommended)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="mb-2 font-bold">Data</h3>
              <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {/* App Info Section */}
                {appInfo && (
                  <div
                    style={{
                      padding: '10px',
                      background: '#f0f0f0',
                      borderRadius: '5px',
                      marginBottom: '20px',
                    }}
                  >
                    <h3>App Information</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li>
                        <strong>App:</strong> {appInfo.name} v{appInfo.version}
                      </li>
                      <li>
                        <strong>Platform:</strong> {appInfo.platform}
                      </li>
                      <li>
                        <strong>Electron:</strong> {appInfo.electron}
                      </li>
                      <li>
                        <strong>Node:</strong> {appInfo.node}
                      </li>
                    </ul>
                  </div>
                )}

                {/* Mode Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <h3>Sync Mode:</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveMode('direct')}
                      style={{
                        padding: '10px 20px',
                        background: activeMode === 'direct' ? '#007bff' : '#e0e0e0',
                        color: activeMode === 'direct' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Direct Renderer Sync
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('ipc')}
                      style={{
                        padding: '10px 20px',
                        background: activeMode === 'ipc' ? '#007bff' : '#e0e0e0',
                        color: activeMode === 'ipc' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                      disabled={!directSync.isElectron}
                    >
                      Electron IPC Sync {!directSync.isElectron && '(Electron only)'}
                    </button>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                    {activeMode === 'direct'
                      ? 'Sync happens directly in the renderer process (original behavior)'
                      : 'Sync is coordinated by the main process with progress tracking'}
                  </p>
                </div>

                {/* Sync Status */}
                <div
                  style={{
                    padding: '15px',
                    background: currentSync.isSyncing ? '#fff3cd' : '#d4edda',
                    borderRadius: '5px',
                    marginBottom: '20px',
                  }}
                >
                  <h3>Sync Status</h3>
                  <div>
                    <p>
                      <strong>Status:</strong> {currentSync.isSyncing ? 'Syncing...' : 'Idle'}
                    </p>
                    {currentSync.lastSync && (
                      <p>
                        <strong>Last Sync:</strong> {currentSync.lastSync.toLocaleTimeString()}
                      </p>
                    )}
                    {currentSync.error && (
                      <p style={{ color: 'red' }}>
                        <strong>Error:</strong> {currentSync.error}
                      </p>
                    )}
                  </div>

                  {/* Progress (IPC mode only) */}
                  {activeMode === 'ipc' && currentSync.syncProgress && (
                    <div style={{ marginTop: '10px' }}>
                      <h4>Progress Details:</h4>
                      {currentSync.syncProgress.status === 'syncing' && (
                        <>
                          <p>
                            Processing: {currentSync.syncProgress.progress} /{' '}
                            {currentSync.syncProgress.total}
                          </p>
                          <div
                            style={{
                              width: '100%',
                              height: '20px',
                              background: '#e0e0e0',
                              borderRadius: '10px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${((currentSync.syncProgress.progress || 0) / (currentSync.syncProgress.total || 1)) * 100}%`,
                                height: '100%',
                                background: '#28a745',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </>
                      )}
                      {currentSync.syncProgress.status === 'completed' && (
                        <p style={{ color: 'green' }}>
                          ✓ Completed: {currentSync.syncProgress.successful} successful,
                          {currentSync.syncProgress.failed} failed
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Sync Button */}
                <button
                  type="button"
                  onClick={currentSync.syncNow}
                  disabled={currentSync.isSyncing}
                  style={{
                    padding: '15px 30px',
                    background: currentSync.isSyncing ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: currentSync.isSyncing ? 'not-allowed' : 'pointer',
                    width: '100%',
                  }}
                >
                  {currentSync.isSyncing ? 'Syncing...' : 'Trigger Sync Now'}
                </button>

                {/* Info Section */}
                <div
                  style={{
                    marginTop: '30px',
                    padding: '15px',
                    background: '#e7f3ff',
                    borderRadius: '5px',
                  }}
                >
                  <h3>How It Works</h3>
                  <ul>
                    <li>
                      <strong>Direct Renderer Sync:</strong> All sync operations happen in the
                      renderer process using your existing syncService.
                    </li>
                    <li>
                      <strong>Electron IPC Sync:</strong> The main process coordinates sync
                      operations, providing progress updates and better control. Useful for
                      background sync, scheduled sync, or when you need more control from the main
                      process.
                    </li>
                    <li>
                      Both modes maintain offline functionality - mutations are queued locally and
                      synced when online.
                    </li>
                    <li>
                      The sync logic still uses existing queueService and syncService - just added
                      an optional IPC layer for enhanced control.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
