"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface LoginButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  asIcon?: boolean
  className?: string
}

export function LoginButton({
  variant = "default",
  size = "default",
  asIcon = false,
  className,
}: LoginButtonProps) {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/auth/login") // Updated path to match your auth structure
  }

  if (asIcon) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size="icon"
            className={className}
            onClick={handleLogin}
            aria-label="Login"
          >
            <LogIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Login</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleLogin}
    >
      Login
    </Button>
  )
}
