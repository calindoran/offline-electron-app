import ItemForm from './components/ItemForm'
import { useDataSync } from './hooks/useDataSync'
import ItemsTablePage from './pages/ItemsTablePage'

function App() {
  const { isSyncing, lastSync, syncNow, error } = useDataSync()

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <h1>Pokémon Offline App</h1>
      <p>
        Status: {isSyncing ? 'Syncing...' : 'Idle'} | Last Sync:{' '}
        {lastSync?.toLocaleString() ?? 'Never'}
      </p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <button type="button" onClick={syncNow} style={{ marginBottom: 16 }}>
        Sync Now
      </button>

      <ItemForm />
      <ItemsTablePage />
    </div>
  )
}

export default App
