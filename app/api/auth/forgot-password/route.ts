import { NextRequest, NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

// Rate limiting map: email -> timestamp of last request
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check rate limiting
    const lastRequestTime = rateLimitMap.get(normalizedEmail)
    const now = Date.now()

    if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_WINDOW) {
      const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequestTime)) / 60000)
      return NextResponse.json(
        { error: `Please wait ${timeLeft} minute(s) before requesting another reset` },
        { status: 429 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      rateLimitMap.set(normalizedEmail, now)
      return NextResponse.json({
        message: "If an account exists with that email, a password reset link has been sent.",
      })
    }

    // Only allow password reset for users with passwords (not OAuth-only users)
    if (!user.password) {
      rateLimitMap.set(normalizedEmail, now)
      return NextResponse.json({
        message: "If an account exists with that email, a password reset link has been sent.",
      })
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    })

    // Create new reset token
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    })

    // Send reset email
    const emailResult = await sendPasswordResetEmail(normalizedEmail, token)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      )
    }

    // Update rate limit
    rateLimitMap.set(normalizedEmail, now)

    return NextResponse.json({
      message: "If an account exists with that email, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
