"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailPasswordForm } from "./EmailPasswordForm"
import { SocialButton } from "./SocialButton"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [serverError, setServerError] = useState<string>("")

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
        // Handle successful authentication
        const result = await response.json()
        console.log("Authentication successful:", result)
        
        // Redirect to dashboard or home page
        window.location.href = "/dashboard"
      } else {
        const error = await response.json()
        setServerError(error.message || "Authentication failed")
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.")
      console.error("Authentication error:", error)
    }
  }

  const isLogin = mode === "login"
  const title = isLogin ? "Sign in" : "Create account"
  const linkText = isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"
  const linkHref = isLogin ? "/signup" : "/login"

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EmailPasswordForm
              mode={mode}
              onSubmit={handleSubmit}
              serverError={serverError}
            />
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <SocialButton provider="google" />
              <SocialButton provider="facebook" />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Link 
            href={linkHref}
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  )
}