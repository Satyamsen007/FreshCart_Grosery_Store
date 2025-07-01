'use client'
import { SessionProvider } from "next-auth/react"
import React from "react"

export const AuthProvider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}