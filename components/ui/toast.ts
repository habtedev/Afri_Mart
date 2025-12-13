import * as React from 'react'

// Minimal types to satisfy use-toast hook
export type ToastActionElement = React.ReactNode

export type ToastProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'default' | 'destructive'
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}
