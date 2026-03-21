"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "oklch(0.975 0.028 72)",
          "--normal-text": "oklch(0.39 0.11 48)",
          "--normal-border": "oklch(0.89 0.06 63)",
          "--success-bg": "oklch(0.975 0.03 150)",
          "--success-text": "oklch(0.44 0.12 151)",
          "--success-border": "oklch(0.86 0.08 150)",
          "--warning-bg": "oklch(0.97 0.04 86)",
          "--warning-text": "oklch(0.45 0.11 70)",
          "--warning-border": "oklch(0.87 0.09 78)",
          "--error-bg": "oklch(0.965 0.03 30)",
          "--error-text": "oklch(0.49 0.17 29)",
          "--error-border": "oklch(0.84 0.1 28)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border border-orange-200/80 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 text-orange-900 shadow-[0_12px_28px_-18px_rgba(249,115,22,0.75)] dark:border-orange-400/30 dark:from-orange-950/50 dark:via-orange-900/35 dark:to-amber-950/45 dark:text-orange-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
