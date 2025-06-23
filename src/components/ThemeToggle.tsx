"use client"

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isRotating, setIsRotating] = useState(false)

  const cycleTheme = () => {
    setIsRotating(true)
    setTimeout(() => {
      if (theme === 'light') {
        setTheme('dark')
      } else if (theme === 'dark') {
        setTheme('system')
      } else {
        setTheme('light')
      }
      setTimeout(() => setIsRotating(false), 150)
    }, 150)
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className={`rounded-full transition-all duration-300 ${
        isRotating ? 'rotate-180' : 'rotate-0'
      }`}
      aria-label="Toggle theme"
    >
      {getIcon()}
    </Button>
  )
}