"use client"
import { usePathname } from "next/navigation"
import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/sonner"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavAndFooter = pathname === "/login"
  return (
    <>
      {!hideNavAndFooter && (
        <nav>
          <Navbar />
        </nav>
      )}
      {children}
      {!hideNavAndFooter && (
        <footer>
          <Footer />
        </footer>
      )}
      <Toaster richColors position="top-right" />
    </>
  )
}
