import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-black rounded-md p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-bold mb-4">Welcome Home!</h1>
        <p className="text-lg">
          This is your offline Electron app with TanStack Router and Neobrutalism UI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-4 border-black rounded-md p-4 bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-bold text-lg mb-2">Fast</h3>
          <p className="text-sm">Built with Vite for lightning-fast development.</p>
        </div>
        <div className="border-4 border-black rounded-md p-4 bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-bold text-lg mb-2">Offline First</h3>
          <p className="text-sm">Works without an internet connection.</p>
        </div>
        <div className="border-4 border-black rounded-md p-4 bg-primary/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-bold text-lg mb-2">Type Safe</h3>
          <p className="text-sm">Full TypeScript support throughout.</p>
        </div>
      </div>
    </div>
  )
}
