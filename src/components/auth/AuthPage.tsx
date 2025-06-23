"use client"

import { useState } from "react"
import { EmailPasswordForm } from "./EmailPasswordForm"
import { SocialButton } from "./SocialButton"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LocaleSelector } from "@/components/LocaleSelector"
import { useTranslation } from "@/contexts/LocaleContext"
import { Button } from "@/components/ui/button"
import { EmailDialog } from "./EmailDialog"
import { Mail } from "lucide-react"

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [serverError, setServerError] = useState<string>("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const { t } = useTranslation()

  const handleSubmit = async (data: any) => {
    setServerError("")
    
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup"
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Authentication successful:", result)
        window.location.href = "/dashboard"
      } else {
        const error = await response.json()
        setServerError(error.message || t('error.authFailed'))
      }
    } catch (error) {
      setServerError(t('error.unexpected'))
      console.error("Authentication error:", error)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Header controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="font-semibold text-lg">Partify</span>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <LocaleSelector />
            </div>
          </div>

          {/* Welcome section - Always show login */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {t('auth.welcomeBack')}
            </h1>
            <p className="text-muted-foreground">
              {t('auth.welcomeBackDescription')}
            </p>
          </div>

          {/* All Login Buttons - Now all circular and aligned */}
          <div className="space-y-6">
            <div className="flex justify-center gap-6">
              <SocialButton provider="google" variant="circular" />
              <SocialButton provider="facebook" variant="circular" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowEmailDialog(true)}
                className="w-16 h-16 rounded-full border-2 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-gray-200 dark:hover:shadow-gray-800"
                aria-label={t('auth.continueWithEmail')}
              >
                <Mail className="h-7 w-7 text-muted-foreground" />
              </Button>
            </div>
            
            {/* Labels under buttons */}
            <div className="flex justify-center gap-6">
              <div className="w-16 text-center">
                <span className="text-xs text-muted-foreground font-medium">Google</span>
              </div>
              <div className="w-16 text-center">
                <span className="text-xs text-muted-foreground font-medium">Facebook</span>
              </div>
              <div className="w-16 text-center">
                <span className="text-xs text-muted-foreground font-medium">Email</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="relative">
          {/* 3D Safe illustration placeholder */}
          <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-2xl transform rotate-12 relative overflow-hidden">
            <div className="absolute inset-4 bg-gradient-to-br from-blue-300 to-blue-500 rounded-2xl">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-300 to-teal-500 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full relative">
                      <div className="absolute top-1/2 left-1/2 w-6 h-1 bg-gray-600 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-blue-200 rounded-full opacity-60"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-200 rounded-full opacity-40"></div>
              <div className="absolute top-8 right-6 w-4 h-4 bg-blue-200 rounded-full opacity-50"></div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-white/15 rounded-full backdrop-blur-sm"></div>
          <div className="absolute top-1/3 -right-8 w-8 h-8 bg-white/25 rounded-full backdrop-blur-sm"></div>
        </div>
      </div>

      {/* Email Dialog */}
      <EmailDialog
        isOpen={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        mode={mode}
        onModeChange={setMode}
        onSubmit={handleSubmit}
        serverError={serverError}
      />
    </div>
  )
}