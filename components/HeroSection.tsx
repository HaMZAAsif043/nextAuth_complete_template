"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

const HeroSection = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("lead-form")
    formElement?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="w-full min-h-96 bg-linear-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full w-fit">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Smart Solar Solutions</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Save Money with
            <span className="text-orange-500"> Solar Energy</span>
          </h1>

          <p className="text-xl text-gray-600">
            Find out how much you can save on your electricity bills with a free solar assessment. Our AI-powered matching connects you with trusted solar installers in your area.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={scrollToForm}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 group"
            >
              Get Your Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex gap-8 border-t border-gray-200 pt-6 mt-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">1000+</p>
              <p className="text-sm text-gray-600">Qualified Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">98%</p>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">£2M+</p>
              <p className="text-sm text-gray-600">Savings Generated</p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full h-96">
            {/* Solar panel illustration */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-yellow-300 rounded-2xl transform rotate-3 shadow-lg opacity-20"></div>
            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Solar panel grid */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-md flex items-center justify-center">
                    <Zap className="w-8 h-8 text-yellow-300" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-gray-600 text-sm font-semibold">Your Solar Solution Awaits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
