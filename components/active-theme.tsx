"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

const DEFAULT_THEME = "default"

type ThemeContextType = {
  activeTheme: string
  setActiveTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ActiveThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode
  initialTheme?: string
}) {
  const router = useRouter()
  const [activeTheme, setActiveThemeState] = useState<string>(
    () => initialTheme || DEFAULT_THEME
  )

  // This function updates state, sets the cookie, AND refreshes the server
  const setActiveTheme = (theme: string) => {
    setActiveThemeState(theme)
    
    // 1. Persist to cookie (1 year expiry)
    document.cookie = `active_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`
    
    // 2. Refresh the server component (RootLayout) to apply the new body class
    router.refresh()
  }

  useEffect(() => {
    // Clean up old theme classes
    const body = document.body
    const classes = Array.from(body.classList)
    
    classes.forEach((c) => {
      if (c.startsWith("theme-")) {
        body.classList.remove(c)
      }
    })

    // Add new theme classes
    body.classList.add(`theme-${activeTheme}`)
    
    // Handle the special 'scaled' logic
    if (activeTheme.endsWith("-scaled")) {
      body.classList.add("theme-scaled")
    }
  }, [activeTheme])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider")
  }
  return context
}