"use client"

import { useEffect, useState } from "react"
import { getTimeTheme } from "@/lib/time-theme"

export function TimeText({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [theme, setTheme] = useState(() => getTimeTheme())

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return <p className={`${theme.desc} ${className}`}>{children}</p>
}
