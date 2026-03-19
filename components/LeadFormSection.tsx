"use client"
import { LeadForm } from "@/components/LeadForm"

const LeadFormSection = () => {
  return (
    <section id="lead-form" className="relative w-full overflow-hidden bg-linear-to-b from-orange-50 via-white to-orange-50 py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-yellow-200/45 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-orange-200 bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
            Quick 2-Minute Form
          </div>

          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Get Your Free Solar Quote
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
            Answer a few quick questions and discover how much you can save with solar energy
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-orange-100 bg-white/95 p-8 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.45)] backdrop-blur-sm md:p-12">
          <LeadForm />
        </div>

        {/* Trust footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ✓ No credit card required • ✓ No hidden fees • ✓ Free quotes from up to 3 installers
          </p>
        </div>
      </div>
    </section>
  )
}

export default LeadFormSection
