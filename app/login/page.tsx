"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Zap, Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [magicLinkEmail, setMagicLinkEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSendingMagicLink(true)
    try {
      const result = await signIn("nodemailer", {
        email: magicLinkEmail,
        redirect: false,
        callbackUrl,
      })
      if (result?.error) {
        setError("Failed to send magic link. Please try again.")
      } else {
        setMagicLinkSent(true)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSendingMagicLink(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs — matches HeroSection style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Smart Solar Solutions</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl shadow-[0_20px_60px_-20px_rgba(234,88,12,0.2)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Welcome <span className="text-orange-500">back</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                Register here
              </Link>
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {!showMagicLink && !magicLinkSent && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-orange-200 hover:shadow-orange-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? "Signing in..." : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Magic link form */}
          {showMagicLink && !magicLinkSent && (
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div>
                <label htmlFor="magicLinkEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email for magic link
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="magicLinkEmail"
                    name="magicLinkEmail"
                    type="email"
                    autoComplete="email"
                    required
                    value={magicLinkEmail}
                    onChange={(e) => setMagicLinkEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">We&apos;ll send you a magic link to sign in</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSendingMagicLink}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSendingMagicLink ? "Sending..." : "Send magic link"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowMagicLink(false); setMagicLinkEmail(""); setError("") }}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:border-orange-200 hover:text-orange-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Magic link sent */}
          {magicLinkSent && (
            <div className="rounded-xl bg-orange-50 border border-orange-100 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-orange-800">Check your email</h3>
                  <p className="mt-1 text-sm text-orange-700">
                    We&apos;ve sent a magic link to <strong>{magicLinkEmail}</strong>. Click the link to sign in.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMagicLinkSent(false); setShowMagicLink(false); setMagicLinkEmail("") }}
                    className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Send another link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in you agree to our{" "}
          <span className="text-orange-500 cursor-pointer hover:underline">Terms</span> &amp;{" "}
          <span className="text-orange-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}