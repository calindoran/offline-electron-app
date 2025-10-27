import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h1 className="mb-4 text-4xl font-bold">Welcome to Pokémon Collection!</h1>
          <p className="text-lg">
            Your offline Pokémon collection app powered by the PokéAPI. Browse, organize, and manage
            your favourite Pokémon!
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-4 border-black dark:border-red-400 rounded-md p-4 bg-red-100 dark:bg-red-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(248,113,113,0.3)]">
          <h3 className="mb-2 text-lg font-bold text-red-900 dark:text-red-100">🔴 Fast</h3>
          <p className="text-sm text-red-800 dark:text-red-200">
            Built with Vite for lightning-fast performance.
          </p>
        </div>
        <div className="border-4 border-black dark:border-blue-400 rounded-md p-4 bg-blue-100 dark:bg-blue-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,165,250,0.3)]">
          <h3 className="mb-2 text-lg font-bold text-blue-900 dark:text-blue-100">
            ⚪ Offline First
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Access your Pokémon collection without internet.
          </p>
        </div>
        <div className="border-4 border-black dark:border-yellow-400 rounded-md p-4 bg-yellow-100 dark:bg-yellow-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.3)]">
          <h3 className="mb-2 text-lg font-bold text-yellow-900 dark:text-yellow-100">
            ⚡ PokéAPI
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Powered by comprehensive Pokémon data.
          </p>
        </div>
      </div>
    </div>
  )
}
