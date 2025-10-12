'use client'

import React from 'react'

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}

export default Provider
