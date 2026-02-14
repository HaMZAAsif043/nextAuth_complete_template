"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
  })

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600">Loading...</div>
      </div>
    )
  }

  if (!session) {
    redirect("/login")
  }

  const handleEdit = () => {
    setFormData({
      name: session.user?.name || "",
    })
    setIsEditing(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: session.user?.name || "",
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      // Trigger session refresh - auth.ts will fetch fresh data from database
      await update()

      setSuccess("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">Profile</h1>
                <p className="mt-1 text-sm text-zinc-600">
                  {isEditing ? "Edit your account information" : "View your account information"}
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="border-t border-zinc-200 px-6 py-4">
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="border-t border-zinc-200 px-6 py-4">
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
                {success}
              </div>
            </div>
          )}

          <div className="border-t border-zinc-200 px-6 py-8">
            <div className="flex items-center gap-6">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200">
                  <svg
                    className="h-10 w-10 text-zinc-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  {session.user?.name || "User"}
                </h2>
                <p className="text-sm text-zinc-600">{session.user?.email}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Email Address
                    </label>
                    <p className="mt-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                      {session.user?.email}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Account Type
                    </label>
                    <p className="mt-1 text-sm text-zinc-900">
                      {session.user?.image ? "OAuth Account" : "Email Account"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="rounded-lg border border-zinc-300 bg-white px-6 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-zinc-900">
                      {session.user?.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Email Address
                    </label>
                    <p className="mt-1 text-sm text-zinc-900">
                      {session.user?.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Account Type
                    </label>
                    <p className="mt-1 text-sm text-zinc-900">
                      {session.user?.image ? "OAuth Account" : "Email Account"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
