import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"
    import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google,
     Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user?.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        // Fetch fresh user data from database to ensure session is always up-to-date
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        })

        if (user && session.user ) {
          session.user.id = user.id
          session.user.email = user.email!
          session.user.name = user.name
          session.user.image = user.image
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

})