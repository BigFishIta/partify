"use client"

import { useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Locale } from '@/lib/i18n'

const FlagIcon = ({ locale }: { locale: Locale }) => {
  if (locale === 'en') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 16" fill="none">
        {/* UK Flag */}
        <rect width="24" height="16" fill="#012169"/>
        <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="2"/>
        <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1"/>
        <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="3"/>
        <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2"/>
      </svg>
    )
  }
  
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 16" fill="none">
      {/* Italian Flag */}
      <rect width="8" height="16" fill="#009246"/>
      <rect x="8" width="8" height="16" fill="#fff"/>
      <rect x="16" width="8" height="16" fill="#CE2B37"/>
    </svg>
  )
}

export function LocaleSelector() {
  const { locale, setLocale } = useLocale()
  const [isRotating, setIsRotating] = useState(false)

  const toggleLocale = () => {
    setIsRotating(true)
    setTimeout(() => {
      setLocale(locale === 'en' ? 'it' : 'en')
      setTimeout(() => setIsRotating(false), 150)
    }, 150)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLocale}
      className={`rounded-full p-2 hover:scale-105 transition-all duration-300 ${
        isRotating ? 'rotate-180' : 'rotate-0'
      }`}
      aria-label={`Switch to ${locale === 'en' ? 'Italian' : 'English'}`}
    >
      <FlagIcon locale={locale} />
    </Button>
  )
}