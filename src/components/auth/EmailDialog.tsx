"use client"

import { useEffect } from "react"
import { EmailPasswordForm } from "./EmailPasswordForm"
import { useTranslation } from "@/contexts/LocaleContext"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmailDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "signup"
  onSubmit: (data: any) => Promise<void>
  serverError?: string
}

export function EmailDialog({ isOpen, onClose, mode, onSubmit, serverError }: EmailDialogProps) {
  const { t } = useTranslation()

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-2xl transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: '85vh',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
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
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          <EmailPasswordForm
            mode={mode}
            onSubmit={async (data) => {
              await onSubmit(data)
              onClose()
            }}
            serverError={serverError}
          />
        </div>

        {/* Footer with alternative action */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? t('auth.noAccount') : t('auth.hasAccount')}
          </p>
        </div>
      </div>
    </>
  )
}