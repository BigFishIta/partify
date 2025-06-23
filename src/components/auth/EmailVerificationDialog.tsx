"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/contexts/LocaleContext"
import { X, Mail, CheckCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmailVerificationDialogProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onResendEmail?: () => Promise<void>
}

export function EmailVerificationDialog({ 
  isOpen, 
  onClose, 
  email,
  onResendEmail 
}: EmailVerificationDialogProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Handle dialog opening and closing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
      
      const timer = setTimeout(() => {
        setIsAnimating(true)
      }, 10)
      
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = 'unset'
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Resend timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleResendEmail = async () => {
    if (resendTimer > 0 || !onResendEmail) return
    
    setIsResending(true)
    
    try {
      await onResendEmail()
      setResendTimer(60) // 60 seconds cooldown
    } catch (error) {
      console.error("Resend email error:", error)
    } finally {
      setIsResending(false)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Dialog */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-2xl border-t transform transition-all duration-500 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{
          maxHeight: '85vh',
          willChange: 'transform, opacity'
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full cursor-pointer hover:bg-muted-foreground/50 transition-colors"
               onClick={handleClose}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {t('auth.verifyEmail')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('auth.checkYourInbox')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Main Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {t('auth.verificationSent')}
            </h3>
            <p className="text-muted-foreground">
              {t('auth.verificationSentDescription', { email })}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">
              {t('auth.nextSteps')}
            </h4>
            <ol className="text-sm text-muted-foreground space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                {t('auth.step1CheckEmail')}
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                {t('auth.step2ClickLink')}
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                {t('auth.step3StartUsing')}
              </li>
            </ol>
          </div>

          {/* Resend Email */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('auth.didntReceiveEmail')}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendEmail}
              disabled={resendTimer > 0 || isResending || !onResendEmail}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.sending')}
                </>
              ) : resendTimer > 0 ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t('auth.resendEmailIn', { seconds: resendTimer })}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t('auth.resendEmail')}
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground">
            {t('auth.checkSpamFolder')}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <Button
            onClick={handleClose}
            variant="ghost"
            className="w-full"
          >
            {t('auth.continueToLogin')}
          </Button>
        </div>
      </div>
    </>
  )
}