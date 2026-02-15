import nodemailer from "nodemailer"

const transport = nodemailer.createTransport(process.env.EMAIL_SERVER)

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 40px; margin: 20px 0;">
          <h1 style="color: #18181b; margin-top: 0; font-size: 24px;">Reset Your Password</h1>
          <p style="color: #52525b; font-size: 16px;">
            You requested to reset your password. Click the button below to create a new password.
          </p>
          <p style="color: #52525b; font-size: 16px;">
            This link will expire in <strong>15 minutes</strong>.
          </p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #18181b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #71717a; font-size: 14px;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 30px 0;">
          <p style="color: #a1a1aa; font-size: 12px;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #18181b; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      </body>
    </html>
  `

  const emailText = `
Reset Your Password

You requested to reset your password. Use the link below to create a new password.

This link will expire in 15 minutes.

${resetUrl}

If you didn't request a password reset, you can safely ignore this email.
  `

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset Your Password",
      html: emailHtml,
      text: emailText,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    return { success: false, error }
  }
}
