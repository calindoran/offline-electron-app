import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
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
  const [notifications, setNotifications] = React.useState(false)
  const [autoSync, setAutoSync] = React.useState(false)
  const [darkMode, setDarkMode] = React.useState(false)
  const [neobrutalism, setNeobrutalism] = React.useState(true)

  React.useEffect(() => {
    if (directSync.isElectron && window.electronAPI.getAppInfo) {
      window.electronAPI.getAppInfo().then(setAppInfo)
    }
  }, [directSync.isElectron])

  const currentSync = activeMode === 'direct' ? directSync : ipcSync

  return (
    <div className="space-y-6">
      <h1 className="mb-4 text-3xl font-bold">Settings</h1>
      <p className="mb-6 text-muted-foreground">Configure your application preferences.</p>

      <div className="space-y-4">
        <Card className="border-2 border-black">
          <CardContent className="pt-6">
            <h3 className="mb-4 font-bold">General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="cursor-pointer">
                  Enable notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync" className="cursor-pointer">
                  Auto-sync data
                </Label>
                <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black">
          <CardContent className="pt-6">
            <h3 className="mb-4 font-bold">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="cursor-pointer">
                  Dark mode
                </Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div className="flex items-center gap-3 space-between">
                <Checkbox
                  id="neobrutalism"
                  checked={neobrutalism}
                  onCheckedChange={(checked) => setNeobrutalism(checked as boolean)}
                />
                <Label htmlFor="neobrutalism" className="flex-1 cursor-pointer">
                  Neobrutalism style (recommended)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-2 border-black">
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-bold">Data</h3>
            <div className="space-y-6">
              {appInfo && (
                <Card className="border-2 border-black bg-secondary">
                  <CardContent className="pt-4">
                    <h4 className="mb-3 font-semibold">App Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">App:</span>
                        <span className="font-medium">
                          {appInfo.name} v{appInfo.version}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Platform:</span>
                        <Badge variant="neutral">{appInfo.platform}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Electron:</span>
                        <span className="font-medium">{appInfo.electron}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Node:</span>
                        <span className="font-medium">{appInfo.node}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold">Sync Mode:</h4>
                <div className="flex gap-3">
                  <Button
                    variant={activeMode === 'direct' ? 'default' : 'outline'}
                    onClick={() => setActiveMode('direct')}
                  >
                    Direct Renderer Sync
                  </Button>
                  <Button
                    variant={activeMode === 'ipc' ? 'default' : 'outline'}
                    onClick={() => setActiveMode('ipc')}
                    disabled={!directSync.isElectron}
                  >
                    Electron IPC Sync {!directSync.isElectron && '(Electron only)'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activeMode === 'direct'
                    ? 'Sync happens directly in the renderer process (original behavior)'
                    : 'Sync is coordinated by the main process with progress tracking'}
                </p>
              </div>

              <Card
                className={`border-2 border-black ${currentSync.isSyncing ? 'bg-yellow-50' : 'bg-green-50'}`}
              >
                <CardContent className="pt-4">
                  <h4 className="mb-3 font-semibold">Sync Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={currentSync.isSyncing ? 'default' : 'neutral'}>
                        {currentSync.isSyncing ? 'Syncing...' : 'Idle'}
                      </Badge>
                    </div>
                    {currentSync.lastSync && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Sync:</span>
                        <span className="text-sm font-medium">
                          {currentSync.lastSync.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    {currentSync.error && (
                      <div className="text-sm text-destructive">
                        <strong>Error:</strong> {currentSync.error}
                      </div>
                    )}
                  </div>

                  {activeMode === 'ipc' && currentSync.syncProgress && (
                    <div className="mt-4 space-y-2">
                      <h5 className="text-sm font-semibold">Progress Details:</h5>
                      {currentSync.syncProgress.status === 'syncing' && (
                        <div className="space-y-2">
                          <p className="text-sm">
                            Processing: {currentSync.syncProgress.progress} /{' '}
                            {currentSync.syncProgress.total}
                          </p>
                          <Progress
                            value={
                              ((currentSync.syncProgress.progress || 0) /
                                (currentSync.syncProgress.total || 1)) *
                              100
                            }
                          />
                        </div>
                      )}
                      {currentSync.syncProgress.status === 'completed' && (
                        <p className="text-sm text-green-700">
                          ✓ Completed: {currentSync.syncProgress.successful} successful,
                          {currentSync.syncProgress.failed} failed
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={currentSync.syncNow}
                disabled={currentSync.isSyncing}
                className="w-full"
                size="lg"
              >
                {currentSync.isSyncing ? 'Syncing...' : 'Trigger Sync Now'}
              </Button>

              <Card className="border-2 border-black bg-blue-50">
                <CardContent className="pt-4">
                  <h4 className="mb-3 font-semibold">How It Works</h4>
                  <ul className="space-y-2 text-sm">
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
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
