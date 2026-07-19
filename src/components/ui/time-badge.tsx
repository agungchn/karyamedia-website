"use client"

import { useEffect, useState, ReactNode } from "react"
import { getTimeTheme } from "@/lib/time-theme"

export function TimeBadge({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const [theme, setTheme] = useState(() => getTimeTheme())

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const isSore = theme.bgTop === "#E8A0B0"

  return (
    <div
      className={`inline-flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full transition-transform duration-300 hover:scale-105 cursor-default ${isSore ? 'bg-white/70 text-blue-950' : theme.badge} ${className}`}
    >
      {children}
    </div>
  )
}
