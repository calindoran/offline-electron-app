import { Link, useMatchRoute } from '@tanstack/react-router'
import { Home, List, LogOut, Settings, User } from 'lucide-react'
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
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}>
        <SidebarHeader>
          <h2 className="text-lg font-bold">Pokémon Collection</h2>
          <p className="mt-1 text-xs text-muted-foreground">Offline Edition</p>
        </SidebarHeader>

        <div className="py-4">
          <SidebarSection title="Navigation">
            <Link to="/">
              <SidebarItem
                icon={<Home className="w-4 h-4" />}
                active={!!matchRoute({ to: '/', fuzzy: false })}
              >
                Home
              </SidebarItem>
            </Link>
            <Link to="/items">
              <SidebarItem
                icon={<User className="w-4 h-4" />}
                active={!!matchRoute({ to: '/items', fuzzy: true })}
              >
                Pokémon
              </SidebarItem>
            </Link>
          </SidebarSection>

          <SidebarSection title="Settings">
            <Link to="/settings">
              <SidebarItem
                icon={<Settings className="w-4 h-4" />}
                active={!!matchRoute({ to: '/settings' })}
              >
                Settings
              </SidebarItem>
            </Link>
          </SidebarSection>

          <SidebarSection title="UI Components">
            <Link to="/examples">
              <SidebarItem
                icon={<List className="w-4 h-4" />}
                active={!!matchRoute({ to: '/examples' })}
              >
                Examples
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
                <Avatar className="flex-shrink-0 w-8 h-8">
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
                  <Avatar className="w-8 h-8">
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

      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 min-h-0 px-6 py-6 overflow-y-auto">{children}</main>
        <footer className="flex-shrink-0 py-4 border-t-4 border-black bg-primary/5">
          <div className="px-6 text-sm text-center">
            <p>© {new Date().getFullYear()} Pokémon Collection | Made with Neobrutalism UI</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
