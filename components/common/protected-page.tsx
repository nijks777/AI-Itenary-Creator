'use client'

import { ReactNode } from 'react'

interface ProtectedPageProps {
  children: ReactNode
  className?: string
}

export function ProtectedPage({
  children,
  className = ''
}: ProtectedPageProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  )
}
