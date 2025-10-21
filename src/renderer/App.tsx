import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Layout from './components/Layout'
import { useDataSync } from './hooks/useDataSync'
import ItemsTablePage from './pages/ItemsTablePage'

function App() {
  const { isSyncing, lastSync, syncNow, error } = useDataSync()

  return (
    <Layout>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Sync Status</h2>
              <p className="text-sm mb-2">
                Status: <span className="font-medium">{isSyncing ? 'Syncing...' : 'Idle'}</span>
              </p>
              <p className="text-sm">
                Last Sync:{' '}
                <span className="font-medium">{lastSync?.toLocaleString() ?? 'Never'}</span>
              </p>
            </div>
            <Button onClick={syncNow} disabled={isSyncing}>
              <RefreshCw size={16} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          </div>

          {error && (
            <div className="mt-4 bg-destructive/15 p-3 rounded-md flex items-center text-destructive">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <ItemsTablePage />
    </Layout>
  )
}

export default App
