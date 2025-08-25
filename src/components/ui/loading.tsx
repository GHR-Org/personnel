import { cn } from "@/lib/utils"

interface LoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loading({ 
  message = "Chargement...", 
  size = "md",
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  }

  return (
    <div className={cn("flex items-center justify-center min-h-screen", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "animate-spin rounded-full border-b-2 border-blue-600",
          sizeClasses[size]
        )}></div>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  )
}

export function LoadingSpinner({ 
  size = "md",
  className 
}: Omit<LoadingProps, "message">) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={cn(
      "animate-spin rounded-full border-b-2 border-blue-600",
      sizeClasses[size],
      className
    )}></div>
  )
} 