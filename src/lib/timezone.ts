export function getUserTimezone(): string {
  if (typeof window !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  return 'UTC'
}

export function formatDateTime(
  date: Date | string,
  timezone?: string,
  locale: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const tz = timezone || getUserTimezone()
  
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function formatTime(
  date: Date | string,
  timezone?: string,
  locale: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const tz = timezone || getUserTimezone()
  
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function formatDate(
  date: Date | string,
  timezone?: string,
  locale: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const tz = timezone || getUserTimezone()
  
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}