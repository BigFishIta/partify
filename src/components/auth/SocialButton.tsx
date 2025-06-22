"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Chrome, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialButtonProps {
  provider: "google" | "facebook"
  className?: string
}

export function SocialButton({ provider, className }: SocialButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialAuth = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/auth/social?provider=${provider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Handle redirect token or success response
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl
        }
      } else {
        console.error(`${provider} authentication failed`)
      }
    } catch (error) {
      console.error(`Error during ${provider} authentication:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = provider === "google" ? Chrome : Facebook
  const label = provider === "google" ? "Google" : "Facebook"

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full", className)}
      onClick={handleSocialAuth}
      disabled={isLoading}
      aria-label={`Sign in with ${label}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {label}
    </Button>
  )
}