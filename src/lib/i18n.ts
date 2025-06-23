export type Locale = 'en' | 'it'

export const defaultLocale: Locale = 'en'
export const locales: Locale[] = ['en', 'it']

export const translations = {
  en: {
    // Auth
    'auth.signin': 'Sign in',
    'auth.signup': 'Create account',
    'auth.welcomeBack': 'Welcome Back',
    'auth.welcomeBackDescription': 'Welcome Back, Please enter Your details',
    'auth.createAccountTitle': 'Create Account',
    'auth.createAccountDescription': 'Join us today, Please enter your details',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.newPassword': 'New Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset Password',
    'auth.resetPasswordDescription': 'Enter your email address and we\'ll send you a 6-digit code to reset your password.',
    'auth.sendResetCode': 'Send Reset Code',
    'auth.checkEmail': 'Check your email',
    'auth.resetCodeSent': 'We\'ve sent a 6-digit code to {email}',
    'auth.checkSpam': 'Don\'t forget to check your spam folder.',
    'auth.backToLogin': 'Back to login',
    'auth.continue': 'Continue',
    'auth.enterEmail': 'Enter your email address',
    'auth.enterCode': 'Enter the 6-digit code',
    'auth.enterNewPassword': 'Enter your new password',
    'auth.codeDescription': 'Please enter the 6-digit code we sent to {email}',
    'auth.resendCode': 'Resend code',
    'auth.resendCodeIn': 'Resend code in {seconds}s',
    'auth.didntReceiveCode': 'Didn\'t receive the code?',
    'auth.updatePassword': 'Update Password',
    'auth.passwordUpdated': 'Password Updated',
    'auth.passwordUpdatedDescription': 'Your password has been successfully updated. You can now sign in with your new password.',
    'auth.continueWith': 'or continue with',
    'auth.continueWithEmail': 'Continue with Email',
    'auth.noAccount': "Don't have an account? Sign up",
    'auth.hasAccount': 'Already have an account? Sign in',
    'auth.signinWith': 'Sign in with {provider}',
    
    // Email Verification
    'auth.verifyEmail': 'Verify Your Email',
    'auth.checkYourInbox': 'We sent you a verification link',
    'auth.verificationSent': 'Verification Email Sent!',
    'auth.verificationSentDescription': 'We\'ve sent a verification link to {email}. Please check your inbox and click the link to activate your account.',
    'auth.nextSteps': 'What\'s next?',
    'auth.step1CheckEmail': 'Check your email inbox (and spam folder)',
    'auth.step2ClickLink': 'Click the verification link in the email',
    'auth.step3StartUsing': 'Start using Partify!',
    'auth.didntReceiveEmail': 'Didn\'t receive the email?',
    'auth.resendEmail': 'Resend Email',
    'auth.resendEmailIn': 'Resend email in {seconds}s',
    'auth.sending': 'Sending...',
    'auth.checkSpamFolder': 'Make sure to check your spam or junk folder if you don\'t see the email in your inbox.',
    'auth.continueToLogin': 'Continue to Login',
    
    // Common
    'common.welcome': 'Welcome to Partify',
    'common.getStarted': 'Get started by signing in to your account or creating a new one.',
    'common.createAccount': 'Create Account',
    
    // Validation
    'validation.emailRequired': 'Please enter a valid email address',
    'validation.passwordMin': 'Password must be at least {min} characters',
    'validation.passwordsMatch': "Passwords don't match",
    'validation.codeRequired': 'Please enter the 6-digit code',
    'validation.codeLength': 'Code must be exactly 6 digits',
    'validation.codeNumbers': 'Code must contain only numbers',
    
    // Errors
    'error.authFailed': 'Authentication failed',
    'error.resetFailed': 'Password reset failed',
    'error.invalidCode': 'Invalid or expired code',
    'error.codeExpired': 'Code has expired. Please request a new one.',
    'error.unexpected': 'An unexpected error occurred. Please try again.',
    
    // Success
    'success.codeSent': 'Code sent successfully',
    'success.passwordReset': 'Password reset successfully',
  },
  it: {
    // Auth
    'auth.signin': 'Accedi',
    'auth.signup': 'Crea account',
    'auth.welcomeBack': 'Bentornato',
    'auth.welcomeBackDescription': 'Bentornato, inserisci i tuoi dati',
    'auth.createAccountTitle': 'Crea Account',
    'auth.createAccountDescription': 'Unisciti a noi oggi, inserisci i tuoi dati',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Conferma Password',
    'auth.newPassword': 'Nuova Password',
    'auth.forgotPassword': 'Password dimenticata?',
    'auth.resetPassword': 'Reimposta Password',
    'auth.resetPasswordDescription': 'Inserisci il tuo indirizzo email e ti invieremo un codice a 6 cifre per reimpostare la password.',
    'auth.sendResetCode': 'Invia Codice di Reset',
    'auth.checkEmail': 'Controlla la tua email',
    'auth.resetCodeSent': 'Abbiamo inviato un codice a 6 cifre a {email}',
    'auth.checkSpam': 'Non dimenticare di controllare la cartella spam.',
    'auth.backToLogin': 'Torna al login',
    'auth.continue': 'Continua',
    'auth.enterEmail': 'Inserisci il tuo indirizzo email',
    'auth.enterCode': 'Inserisci il codice a 6 cifre',
    'auth.enterNewPassword': 'Inserisci la tua nuova password',
    'auth.codeDescription': 'Inserisci il codice a 6 cifre che abbiamo inviato a {email}',
    'auth.resendCode': 'Reinvia codice',
    'auth.resendCodeIn': 'Reinvia codice tra {seconds}s',
    'auth.didntReceiveCode': 'Non hai ricevuto il codice?',
    'auth.updatePassword': 'Aggiorna Password',
    'auth.passwordUpdated': 'Password Aggiornata',
    'auth.passwordUpdatedDescription': 'La tua password è stata aggiornata con successo. Ora puoi accedere con la tua nuova password.',
    'auth.continueWith': 'o continua con',
    'auth.continueWithEmail': 'Continua con Email',
    'auth.noAccount': 'Non hai un account? Registrati',
    'auth.hasAccount': 'Hai già un account? Accedi',
    'auth.signinWith': 'Accedi con {provider}',
    
    // Email Verification
    'auth.verifyEmail': 'Verifica la Tua Email',
    'auth.checkYourInbox': 'Ti abbiamo inviato un link di verifica',
    'auth.verificationSent': 'Email di Verifica Inviata!',
    'auth.verificationSentDescription': 'Abbiamo inviato un link di verifica a {email}. Controlla la tua casella di posta e clicca sul link per attivare il tuo account.',
    'auth.nextSteps': 'Cosa fare ora?',
    'auth.step1CheckEmail': 'Controlla la tua casella di posta (e la cartella spam)',
    'auth.step2ClickLink': 'Clicca sul link di verifica nell\'email',
    'auth.step3StartUsing': 'Inizia a usare Partify!',
    'auth.didntReceiveEmail': 'Non hai ricevuto l\'email?',
    'auth.resendEmail': 'Reinvia Email',
    'auth.resendEmailIn': 'Reinvia email tra {seconds}s',
    'auth.sending': 'Invio in corso...',
    'auth.checkSpamFolder': 'Assicurati di controllare la cartella spam o posta indesiderata se non vedi l\'email nella tua casella di posta.',
    'auth.continueToLogin': 'Continua al Login',
    
    // Common
    'common.welcome': 'Benvenuto su Partify',
    'common.getStarted': 'Inizia accedendo al tuo account o creandone uno nuovo.',
    'common.createAccount': 'Crea Account',
    
    // Validation
    'validation.emailRequired': 'Inserisci un indirizzo email valido',
    'validation.passwordMin': 'La password deve avere almeno {min} caratteri',
    'validation.passwordsMatch': 'Le password non corrispondono',
    'validation.codeRequired': 'Inserisci il codice a 6 cifre',
    'validation.codeLength': 'Il codice deve essere di esattamente 6 cifre',
    'validation.codeNumbers': 'Il codice deve contenere solo numeri',
    
    // Errors
    'error.authFailed': 'Autenticazione fallita',
    'error.resetFailed': 'Reset password fallito',
    'error.invalidCode': 'Codice non valido o scaduto',
    'error.codeExpired': 'Il codice è scaduto. Richiedine uno nuovo.',
    'error.unexpected': 'Si è verificato un errore imprevisto. Riprova.',
    
    // Success
    'success.codeSent': 'Codice inviato con successo',
    'success.passwordReset': 'Password reimpostata con successo',
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