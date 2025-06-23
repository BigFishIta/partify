"use client"

import { useEffect, useState } from "react"
import { EmailPasswordForm } from "./EmailPasswordForm"
import { useTranslation } from "@/contexts/LocaleContext"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmailVerificationDialog } from "./EmailVerificationDialog"

interface EmailDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "signup"
  onModeChange: (mode: "login" | "signup") => void
  onSubmit: (data: any) => Promise<{ success: boolean; needsVerification?: boolean; email?: string }>
  serverError?: string
}

export function EmailDialog({ isOpen, onClose, mode, onModeChange, onSubmit, serverError }: EmailDialogProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")

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

  const handleModeSwitch = () => {
    onModeChange(mode === "login" ? "signup" : "login")
  }

  const handleFormSubmit = async (data: any) => {
    const result = await onSubmit(data)
    
    if (result.success) {
      if (result.needsVerification && result.email) {
        // Show verification dialog instead of closing
        setVerificationEmail(result.email)
        setShowVerificationDialog(true)
        handleClose() // Close the email dialog
      } else {
        // Login successful, close dialog
        handleClose()
      }
    }
    // If not successful, keep dialog open for error correction
  }

  const handleResendVerificationEmail = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: verificationEmail }),
      })

      if (!response.ok) {
        throw new Error("Failed to resend verification email")
      }
    } catch (error) {
      console.error("Resend verification email error:", error)
      throw error
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Main Email Dialog */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      
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
          <div>
            <h2 className="text-xl font-semibold">
              {mode === "login" ? t('auth.signin') : t('auth.signup')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('auth.continueWithEmail')}
            </p>
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
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <EmailPasswordForm
            mode={mode}
            onSubmit={handleFormSubmit}
            serverError={serverError}
          />
        </div>

        {/* Footer with alternative action */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                {t('auth.noAccount').split('?')[0]}?{' '}
                <button
                  onClick={handleModeSwitch}
                  className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
                >
                  {t('auth.signup')}
                </button>
              </>
            ) : (
              <>
                {t('auth.hasAccount').split('?')[0]}?{' '}
                <button
                  onClick={handleModeSwitch}
                  className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
                >
                  {t('auth.signin')}
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        email={verificationEmail}
        onResendEmail={handleResendVerificationEmail}
      />
    </>
  )
}