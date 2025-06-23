"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LocaleSelector } from "@/components/LocaleSelector"
import { useTranslation } from "@/contexts/LocaleContext"
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

const createSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('validation.emailRequired')),
})

type FormData = {
  email: string
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string>("")
  const { t } = useTranslation()
  
  const schema = createSchema(t)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerError("")
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const error = await response.json()
        setServerError(error.message || t('error.resetFailed'))
      }
    } catch (error) {
      setServerError(t('error.unexpected'))
      console.error("Password reset error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <ThemeToggle />
            <LocaleSelector />
          </div>
          
          <Card className="shadow-lg rounded-lg text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold">{t('auth.checkEmail')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('auth.resetEmailSent', { email: getValues('email') })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('auth.checkSpam')}
              </p>
              <Button asChild className="w-full">
                <Link href="/auth">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('auth.backToLogin')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <ThemeToggle />
          <LocaleSelector />
        </div>
        
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {t('auth.resetPassword')}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {t('auth.resetPasswordDescription')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {serverError}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('auth.enterEmail')}
                    className="pl-10"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.sendResetLink')}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Link 
            href="/auth"
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  )
}