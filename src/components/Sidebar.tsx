import React from 'react'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  collapsed: boolean
}

const SidebarContext = React.createContext<SidebarContextType>({ collapsed: false })

export const useSidebar = () => React.useContext(SidebarContext)

interface SidebarProps {
  children: React.ReactNode
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}

interface SidebarItemProps {
  children: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}

interface SidebarSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function Sidebar({ children, className, collapsed = false, onToggle }: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        className={cn(
          'border-r-4 border-black bg-background shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]',
          'flex flex-col h-full transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        <div className="flex-1 p-4 overflow-y-auto">{children}</div>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'flex items-center justify-center p-4 border-t-4 border-black bg-primary/5',
              'hover:bg-primary/10 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={cn('w-5 h-5 transition-transform duration-300', collapsed && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>{collapsed ? 'Expand' : 'Collapse'}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </aside>
    </SidebarContext.Provider>
  )
}

export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  const { collapsed } = useSidebar()

  return (
    <div className={cn('mb-6', className)}>
      {title && !collapsed && (
        <h3 className="px-3 mb-3 text-xs font-bold tracking-wider uppercase text-muted-foreground">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

export function SidebarItem({
  children,
  icon,
  active = false,
  onClick,
  className,
}: SidebarItemProps) {
  const { collapsed } = useSidebar()

  const buttonContent = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center rounded-md text-sm font-medium transition-all',
        'border-2 border-transparent',
        'hover:border-black hover:bg-primary/10 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
        collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5 gap-3',
        active && [
          'bg-primary border-black text-primary-foreground',
          'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
          'translate-x-[1px] translate-y-[1px]',
        ],
        !active && 'text-foreground',
        className
      )}
      aria-label={collapsed ? String(children) : undefined}
    >
      {icon && <span className={cn('flex-shrink-0', collapsed && 'mx-auto')}>{icon}</span>}
      {!collapsed && <span className="flex-1 text-left truncate">{children}</span>}
    </button>
  )

  if (collapsed) {
    return (
      <div className="relative group">
        {buttonContent}
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-black text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {children}
        </div>
      </div>
    )
  }

  return buttonContent
}

export function SidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { collapsed } = useSidebar()

  return (
    <div
      className={cn(
        'py-5 border-b-4 border-black',
        'bg-primary/5',
        collapsed ? 'px-2' : 'px-4',
        className
      )}
    >
      {!collapsed ? (
        children
      ) : (
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-8 h-8 border-2 border-black rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">O</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { collapsed } = useSidebar()

  return (
    <div
      className={cn(
        'py-4 border-t-4 border-black',
        'bg-primary/5',
        'mt-auto',
        collapsed ? 'px-2' : 'px-4',
        className
      )}
    >
      {!collapsed ? (
        children
      ) : (
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-8 h-8 border-2 border-black rounded-full bg-primary">
            <span className="text-xs font-bold text-primary-foreground">U</span>
          </div>
        </div>
      )}
    </div>
  )
}
