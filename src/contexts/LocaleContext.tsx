"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, defaultLocale } from '@/lib/i18n'
import { getUserTimezone } from '@/lib/timezone'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  timezone: string
  setTimezone: (timezone: string) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [timezone, setTimezone] = useState<string>('UTC')

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && ['en', 'it'].includes(savedLocale)) {
      setLocale(savedLocale)
    }

    // Set user's timezone
    setTimezone(getUserTimezone())
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  return (
    <LocaleContext.Provider value={{
      locale,
      setLocale: handleSetLocale,
      timezone,
      setTimezone
    }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

export function useTranslation() {
  const { locale } = useLocale()
  
  return {
    t: (key: string, params?: Record<string, string | number>) => {
      const { t } = require('@/lib/i18n')
      return t(key, locale, params)
    },
    locale
  }
}