import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full gap-1 rounded-xl border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default:
          "border-orange-200/80 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 text-orange-900 shadow-[0_10px_24px_-18px_rgba(249,115,22,0.65)] dark:border-orange-400/30 dark:from-orange-950/50 dark:via-orange-900/35 dark:to-amber-950/45 dark:text-orange-100",
        destructive:
          "border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/50 dark:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      data-variant={variant}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
}

function AlertAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="alert-action"
      className={cn(
        "absolute top-2 right-2 rounded-md border border-transparent px-2 py-1 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-100 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 dark:text-orange-200 dark:hover:bg-orange-900/40 dark:hover:text-orange-100",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
