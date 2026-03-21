"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
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
            <div className="absolute -inset-2 bg-linear-to-br from-orange-200/70 via-amber-100/70 to-yellow-100/70 rounded-3xl blur-xl opacity-70" />

            <div className="relative h-full bg-orange-50/70 border border-orange-100 rounded-3xl shadow-[0_20px_45px_-20px_rgba(234,88,12,0.35)] p-4 flex flex-col gap-4 backdrop-blur-xs">
              <div className="relative flex-1 rounded-2xl overflow-hidden ring-1 ring-orange-100">
                <Image
                  src="/solar/solar2.png"
                  alt="Solar installation on a home roof"
                  fill
                  className="object-cover saturate-[0.85] sepia-[0.15]"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-tr from-orange-500/15 via-transparent to-amber-200/20" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  "/solar/solar1.png",
                  "/solar/solar4.png",
                  "/solar/solar.png",
                ].map((imageSrc) => (
                  <div key={imageSrc} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-orange-100">
                    <Image
                      src={imageSrc}
                      alt="Solar panel project"
                      fill
                      className="object-cover saturate-[0.85] sepia-[0.12]"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-orange-500/10 to-amber-100/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
