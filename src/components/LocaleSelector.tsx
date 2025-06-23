"use client"

import { useLocale } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Locale } from '@/lib/i18n'

export function LocaleSelector() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('en')}
      >
        EN
      </Button>
      <Button
        variant={locale === 'it' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('it')}
      >
        IT
      </Button>
    </div>
  )
}