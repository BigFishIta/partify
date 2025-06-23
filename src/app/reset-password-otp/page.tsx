"use client"

import { useState, useEffect, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OtpInput } from "@/components/auth/OtpInput"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LocaleSelector } from "@/components/LocaleSelector"
import { useTranslation } from "@/contexts/LocaleContext"
import { ArrowLeft, CheckCircle, Loader2, Lock, Eye, EyeOff } from "lucide-react"

const createSchema = (t: (key: string) => string) => z.object({
  code: z.string()
    .min(6, t('validation.codeLength'))
    .max(6, t('validation.codeLength'))
    .regex(/^\d{6}$/, t('validation.codeNumbers')),
  password: z.string().min(8, t('validation.passwordMin', { min: 8 })),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('validation.passwordsMatch'),
  path: ["confirmPassword"],
})

type FormData = {
  code: string
  password: string
  confirmPassword: string
}

function ResetPasswordOtpContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [serverError, setServerError] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const schema = createSchema(t)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    }
  })

  const codeValue = watch('code')

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

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerError("")
    
    try {
      const response = await fetch("/api/auth/reset-password-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: data.code,
          password: data.password,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const error = await response.json()
        setServerError(error.message || t('error.invalidCode'))
      }
    } catch (error) {
      setServerError(t('error.unexpected'))
      console.error("Password reset error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendTimer > 0 || !email) return
    
    setIsResending(true)
    setServerError("")
    
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setResendTimer(60) // 60 seconds cooldown
      } else {
        const error = await response.json()
        setServerError(error.message || t('error.unexpected'))
      }
    } catch (error) {
      setServerError(t('error.unexpected'))
      console.error("Resend code error:", error)
    } finally {
      setIsResending(false)
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
              <CardTitle className="text-2xl font-bold">{t('auth.passwordUpdated')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('auth.passwordUpdatedDescription')}
              </p>
              <Button asChild className="w-full">
                <Link href="/auth">
                  {t('auth.backToLogin')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <ThemeToggle />
            <LocaleSelector />
          </div>
          
          <Card className="shadow-lg rounded-lg text-center">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                {t('error.unexpected')}
              </p>
              <Button asChild className="w-full">
                <Link href="/forgot-password">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('auth.resetPassword')}
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
              {t('auth.codeDescription', { email })}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {serverError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {serverError}
                </div>
              )}
              
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block text-center">
                  {t('auth.enterCode')}
                </label>
                <OtpInput
                  length={6}
                  value={codeValue}
                  onChange={(value) => setValue('code', value)}
                  disabled={isLoading}
                  error={!!errors.code}
                  className="mb-2"
                />
                {errors.code && (
                  <p className="text-sm text-destructive text-center">{errors.code.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t('auth.newPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder={t('auth.enterNewPassword')}
                    className="pl-10 pr-10"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder={t('auth.confirmPassword')}
                    className="pl-10 pr-10"
                    {...register("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.updatePassword')}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('auth.didntReceiveCode')}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || isResending}
                className="text-primary hover:text-primary/80"
              >
                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {resendTimer > 0 
                  ? t('auth.resendCodeIn', { seconds: resendTimer })
                  : t('auth.resendCode')
                }
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Link 
            href="/forgot-password"
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

export default function ResetPasswordOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ResetPasswordOtpContent />
    </Suspense>
  )
}