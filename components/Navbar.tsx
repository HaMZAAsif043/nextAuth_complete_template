"use client"
import { useRouter } from "next/navigation"
import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const router = useRouter()

  const handleNavigation = (link: string) => {
    if (!link) return
    router.push(link)
  }

  const links = [
    { path: "/", name: "Home" },
    { path: "/#how-it-works", name: "How It Works" },
    { path: "/#benefits", name: "Benefits" },
    { path: "/login", name: "Login" },
  ]

  return (
    <nav className="w-full h-20 border-b border-zinc-200 bg-white flex justify-between items-center px-6 sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => handleNavigation("/")}
      >
        <Sun className="w-8 h-8 text-orange-500" />
        <span className="font-bold text-xl text-gray-800 hidden sm:inline">SolarAI Leads</span>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-center items-center gap-8">
        {links.map((link) => (
          <div
            key={link.path}
            className="px-4 py-2 hover:cursor-pointer text-gray-700 font-medium hover:text-orange-500 transition-colors"
            onClick={() => handleNavigation(link.path)}
          >
            {link.name}
          </div>
        ))}
        <Button
          onClick={() => handleNavigation("/login")}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Get Started
        </Button>
      </div>
    </nav>
  )
}

export default Navbar