"use client"
import { TrendingDown, Leaf, Lock, Users, Zap, Home } from "lucide-react"

const BenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingDown,
      title: "Lower Energy Bills",
      description: "Reduce your electricity costs by 75-90% with solar panels, saving thousands over 25 years.",
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Cut your carbon footprint and contribute to a sustainable future for generations to come.",
    },
    {
      icon: Lock,
      title: "Protection from Price Hikes",
      description: "Lock in predictable energy costs and protect yourself from rising electricity prices.",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Get matched with certified solar installers who provide personalized recommendations.",
    },
    {
      icon: Zap,
      title: "Increased Home Value",
      description: "Homes with solar panels sell 4% faster and at higher prices on average.",
    },
    {
      icon: Home,
      title: "Tax Credits & Incentives",
      description: "Access government grants, tax credits, and rebates that make solar more affordable.",
    },
  ]

  return (
    <section id="benefits" className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Solar Energy?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the financial and environmental benefits of switching to solar power
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="bg-linear-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <Icon className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* Statistics */}
        <div className="mt-20 bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">25+ Years</p>
              <p className="text-orange-100">Average Panel Lifespan</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">$30K+</p>
              <p className="text-orange-100">Average Lifetime Savings</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">Tax Credits</p>
              <p className="text-orange-100">Federal & State Incentives</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">4% Faster</p>
              <p className="text-orange-100">Home Sale Speed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
