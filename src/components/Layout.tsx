import { Link, useMatchRoute } from '@tanstack/react-router'
import { LogOut, Settings, User } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import { Sidebar, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from './Sidebar'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const matchRoute = useMatchRoute()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}>
        <SidebarHeader>
          <h2 className="text-lg font-bold">Pokémon Collection</h2>
          <p className="mt-1 text-xs text-muted-foreground">Offline Edition</p>
        </SidebarHeader>

        <div className="py-4">
          <SidebarSection title="Navigation">
            <Link to="/">
              <SidebarItem
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Home</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                }
                active={!!matchRoute({ to: '/', fuzzy: false })}
              >
                Home
              </SidebarItem>
            </Link>
            <Link to="/items">
              <SidebarItem
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Pokémon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
                active={!!matchRoute({ to: '/items', fuzzy: true })}
              >
                Pokémon
              </SidebarItem>
            </Link>
          </SidebarSection>

          <SidebarSection title="Settings">
            <Link to="/settings">
              <SidebarItem
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Settings</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                active={!!matchRoute({ to: '/settings' })}
              >
                Settings
              </SidebarItem>
            </Link>
          </SidebarSection>
        </div>

        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'w-full flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-all',
                  'border-2 border-transparent',
                  'hover:border-black hover:bg-primary/10',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
                  collapsed && 'justify-center'
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>⚡</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">Trainer</p>
                    <p className="text-xs truncate text-muted-foreground">Offline Mode</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align={collapsed ? 'center' : 'end'}
              side="right"
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>⚡</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Trainer</p>
                    <p className="text-xs truncate text-muted-foreground">trainer@pokemon.com</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="w-4 h-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <main className="flex-1 px-6 py-6 overflow-y-auto">{children}</main>
        <footer className="flex-shrink-0 py-4 border-t-4 border-black bg-primary/5">
          <div className="px-6 text-sm text-center">
            <p>© {new Date().getFullYear()} Pokémon Collection | Made with Neobrutalism UI</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
