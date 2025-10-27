import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-black rounded-md p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Pokémon Collection!</h1>
        <p className="text-lg">
          Your offline Pokémon collection app powered by the PokéAPI. Browse, organize, and manage
          your favorite Pokémon!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-4 border-black rounded-md p-4 bg-red-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-2 text-lg font-bold">🔴 Fast</h3>
          <p className="text-sm">Built with Vite for lightning-fast performance.</p>
        </div>
        <div className="border-4 border-black rounded-md p-4 bg-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-2 text-lg font-bold">⚪ Offline First</h3>
          <p className="text-sm">Access your Pokémon collection without internet.</p>
        </div>
        <div className="border-4 border-black rounded-md p-4 bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-2 text-lg font-bold">⚡ PokéAPI</h3>
          <p className="text-sm">Powered by comprehensive Pokémon data.</p>
        </div>
      </div>
    </div>
  )
}
