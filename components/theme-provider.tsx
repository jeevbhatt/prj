"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type ThemeProviderState = {
  theme: string | undefined
  setTheme: (theme: string) => void
  isInitialized: boolean
  systemTheme: string | undefined
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: undefined,
  setTheme: () => null,
  isInitialized: false,
  systemTheme: undefined,
})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [systemTheme, setSystemTheme] = useState<string | undefined>(undefined)

  useEffect(() => {
    setIsInitialized(true)

    // Detect system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemTheme(mediaQuery.matches ? "dark" : "light")

    // Listen for changes in system preference
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return (
    <NextThemesProvider {...props} enableSystem={true} defaultTheme="system">
      <ThemeProviderContext.Provider
        value={{
          theme: undefined,
          setTheme: () => null,
          isInitialized,
          systemTheme,
        }}
      >
        {children}
      </ThemeProviderContext.Provider>
    </NextThemesProvider>
  )
}

export const useThemeProvider = () => {
  const context = useContext(ThemeProviderContext)
  return context
}
