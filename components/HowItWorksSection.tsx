"use client"
import { CheckCircle, Brain, Zap, Send } from "lucide-react"

const HowItWorksSection = () => {
  const steps = [
    {
      icon: CheckCircle,
      step: "1",
      title: "Submit Your Details",
      description:
        "Fill out our quick form with your home information, location, and electricity usage. Takes just 2 minutes.",
    },
    {
      icon: Brain,
      step: "2",
      title: "AI Qualification",
      description:
        "Our AI instantly analyzes your situation to determine your solar potential and estimated savings.",
    },
    {
      icon: Zap,
      step: "3",
      title: "Get Matched",
      description:
        "We connect you with up to 3 certified solar installers in your area that match your needs and budget.",
    },
    {
      icon: Send,
      step: "4",
      title: "Free Consultations",
      description:
        "Receive free quotes and design proposals from trusted installers without any obligation.",
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to find your perfect solar solution
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 -right-3 w-6 h-0.5 bg-orange-300 z-0"></div>
                )}

                {/* Card */}
                <div className="relative z-10 bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-orange-400 to-orange-600 rounded-full mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-semibold text-orange-500 mb-2">Step {item.step}</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Timeline Visual for mobile */}
        <div className="md:hidden space-y-6">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex gap-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full text-white font-bold">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 h-16 bg-orange-200 mt-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8 border border-orange-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Your Solar Journey?</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of homeowners saving money and helping the environment
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
