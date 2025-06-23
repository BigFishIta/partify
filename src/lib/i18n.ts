export type Locale = 'en' | 'it'

export const defaultLocale: Locale = 'en'
export const locales: Locale[] = ['en', 'it']

export const translations = {
  en: {
    // Auth
    'auth.signin': 'Sign in',
    'auth.signup': 'Create account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset Password',
    'auth.resetPasswordDescription': 'Enter your email address and we\'ll send you a link to reset your password.',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.checkEmail': 'Check your email',
    'auth.resetEmailSent': 'We\'ve sent a password reset link to {email}',
    'auth.checkSpam': 'Don\'t forget to check your spam folder.',
    'auth.backToLogin': 'Back to login',
    'auth.enterEmail': 'Enter your email address',
    'auth.continueWith': 'or continue with',
    'auth.noAccount': "Don't have an account? Sign up",
    'auth.hasAccount': 'Already have an account? Sign in',
    'auth.signinWith': 'Sign in with {provider}',
    
    // Common
    'common.welcome': 'Welcome to Partify',
    'common.getStarted': 'Get started by signing in to your account or creating a new one.',
    'common.createAccount': 'Create Account',
    
    // Validation
    'validation.emailRequired': 'Please enter a valid email address',
    'validation.passwordMin': 'Password must be at least {min} characters',
    'validation.passwordsMatch': "Passwords don't match",
    
    // Errors
    'error.authFailed': 'Authentication failed',
    'error.resetFailed': 'Password reset failed',
    'error.unexpected': 'An unexpected error occurred. Please try again.',
  },
  it: {
    // Auth
    'auth.signin': 'Accedi',
    'auth.signup': 'Crea account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Conferma Password',
    'auth.forgotPassword': 'Password dimenticata?',
    'auth.resetPassword': 'Reimposta Password',
    'auth.resetPasswordDescription': 'Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password.',
    'auth.sendResetLink': 'Invia Link di Reset',
    'auth.checkEmail': 'Controlla la tua email',
    'auth.resetEmailSent': 'Abbiamo inviato un link per reimpostare la password a {email}',
    'auth.checkSpam': 'Non dimenticare di controllare la cartella spam.',
    'auth.backToLogin': 'Torna al login',
    'auth.enterEmail': 'Inserisci il tuo indirizzo email',
    'auth.continueWith': 'o continua con',
    'auth.noAccount': 'Non hai un account? Registrati',
    'auth.hasAccount': 'Hai già un account? Accedi',
    'auth.signinWith': 'Accedi con {provider}',
    
    // Common
    'common.welcome': 'Benvenuto su Partify',
    'common.getStarted': 'Inizia accedendo al tuo account o creandone uno nuovo.',
    'common.createAccount': 'Crea Account',
    
    // Validation
    'validation.emailRequired': 'Inserisci un indirizzo email valido',
    'validation.passwordMin': 'La password deve avere almeno {min} caratteri',
    'validation.passwordsMatch': 'Le password non corrispondono',
    
    // Errors
    'error.authFailed': 'Autenticazione fallita',
    'error.resetFailed': 'Reset password fallito',
    'error.unexpected': 'Si è verificato un errore imprevisto. Riprova.',
  }
} as const

export function t(key: string, locale: Locale = defaultLocale, params?: Record<string, string | number>): string {
  const translation = translations[locale]
  let text = (translation as any)[key] || key
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value))
    })
  }
  
  return text
}