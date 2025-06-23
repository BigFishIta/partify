"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  length: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  className?: string
}

export function OtpInput({ 
  length, 
  value, 
  onChange, 
  disabled = false, 
  error = false,
  className 
}: OtpInputProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  const handleChange = (index: number, inputValue: string) => {
    const newValue = inputValue.replace(/\D/g, '') // Only allow digits
    
    if (newValue.length > 1) {
      // Handle paste
      const pastedValue = newValue.slice(0, length)
      onChange(pastedValue)
      
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pastedValue.length, length - 1)
      setActiveIndex(nextIndex)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    // Single character input
    const newOtp = value.split('')
    newOtp[index] = newValue
    onChange(newOtp.join(''))

    // Move to next input if value entered
    if (newValue && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        setActiveIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newOtp = value.split('')
        newOtp[index] = ''
        onChange(newOtp.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    setActiveIndex(index)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '')
    const pastedValue = pastedData.slice(0, length)
    onChange(pastedValue)
    
    // Focus the last filled input
    const nextIndex = Math.min(pastedValue.length, length - 1)
    setActiveIndex(nextIndex)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            error && "border-destructive focus:ring-destructive focus:border-destructive",
            activeIndex === index && "ring-2 ring-primary border-primary"
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}