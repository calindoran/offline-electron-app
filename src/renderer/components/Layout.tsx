import type React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-black bg-primary/10 shadow-[0_4px_0px_0px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Offline Electron App</h1>
          {/* //TODO: add a status indicator for online/offline */}
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}
              ></div>
              <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div> */}
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">{children}</main>

      <footer className="mt-auto border-t-2 border-black bg-primary/5 py-4">
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} Offline Electron App | Made with Neobrutalism UI</p>
        </div>
      </footer>
    </div>
  )
}
