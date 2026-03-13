"use client"
import { LeadForm } from "@/components/LeadForm"

const LeadFormSection = () => {
  return (
    <section id="lead-form" className="w-full py-20 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Your Free Solar Quote
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Answer a few quick questions and discover how much you can save with solar energy
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
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
