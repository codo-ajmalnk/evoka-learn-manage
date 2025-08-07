import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"
import { memo, useCallback } from "react"

export const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme()

  const handleToggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light")
  }, [theme, setTheme])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="h-8 w-8 px-0 hover:bg-accent/80 hover:scale-105 transition-all duration-200 touch-manipulation"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
})

ThemeToggle.displayName = "ThemeToggle"