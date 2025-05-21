"use client"

import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { XIcon } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-start justify-between ${
            toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-white text-gray-900"
          } animate-in slide-in-from-right`}
        >
          <div>
            <h3 className="font-medium">{toast.title}</h3>
            <p className={`text-sm ${toast.variant === "destructive" ? "text-white" : "text-gray-600"}`}>
              {toast.description}
            </p>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className={`ml-4 p-1 rounded-full ${
              toast.variant === "destructive" ? "hover:bg-red-600" : "hover:bg-gray-100"
            }`}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
