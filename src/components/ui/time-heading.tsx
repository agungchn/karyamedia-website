"use client"

import { useEffect, useState } from "react"
import { getTimeTheme } from "@/lib/time-theme"

export function TimeHeading({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const [theme, setTheme] = useState(() => getTimeTheme())

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <h1
      className={`heading-display text-transparent bg-clip-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${theme.headingFrom}, ${theme.headingTo})`,
        ...style,
      }}
    >
      {children}
    </h1>
  )
}
