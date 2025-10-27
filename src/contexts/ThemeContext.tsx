import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  neobrutalism: boolean
  setNeobrutalism: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    return stored ? JSON.parse(stored) : false
  })

  const [neobrutalism, setNeobrutalismState] = useState(() => {
    const stored = localStorage.getItem('neobrutalism')
    return stored ? JSON.parse(stored) : true
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('neobrutalism', JSON.stringify(neobrutalism))
  }, [neobrutalism])

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value)
  }

  const setNeobrutalism = (value: boolean) => {
    setNeobrutalismState(value)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, neobrutalism, setNeobrutalism }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
