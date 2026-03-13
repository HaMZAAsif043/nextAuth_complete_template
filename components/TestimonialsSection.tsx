"use client"
import { Star, Quote } from "lucide-react"

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "London, UK",
      image: "👩‍👨‍👧",
      text: "The entire process was so easy! I got my first quote within 24 hours and saved £5,000 on installation costs.",
      rating: 5,
      savings: "£5,000+",
    },
    {
      name: "Mike Chen",
      location: "Manchester, UK",
      image: "👨‍💼",
      text: "SolarAI matched me with the perfect installer for my budget. My monthly bills dropped from £150 to £30!",
      rating: 5,
      savings: "£1,440/year",
    },
    {
      name: "Emma Williams",
      location: "Birmingham, UK",
      image: "👩‍🦰",
      text: "Best decision ever! Not only do I save money, but knowing I'm helping the planet makes it even better.",
      rating: 5,
      savings: "£8,000+",
    },
  ]

  const partners = [
    { name: "SunPower", icon: "☀️" },
    { name: "Tesla Energy", icon: "⚡" },
    { name: "Sunrun", icon: "🔆" },
    { name: "Vivint Solar", icon: "💡" },
  ]

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Homeowners
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what real customers are saying about their solar journey
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-gray-50 to-blue-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-orange-300 mb-4" />

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                ))}
              </div>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-orange-600">Saved {testimonial.savings}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-2xl p-12 border border-orange-200 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted by Leading Installers</h3>
            <p className="text-gray-600">We work with certified solar professionals across the UK</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="text-5xl">{partner.icon}</div>
                <p className="font-semibold text-gray-700 text-center">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-200 text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">4.9/5</p>
            <p className="font-semibold text-gray-900 mb-1">Average Rating</p>
            <p className="text-sm text-gray-600">From 2,500+ verified reviews</p>
          </div>

          <div className="bg-green-50 rounded-xl p-8 border border-green-200 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">10K+</p>
            <p className="font-semibold text-gray-900 mb-1">Happy Customers</p>
            <p className="text-sm text-gray-600">Across the UK and Ireland</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-8 border border-orange-200 text-center">
            <p className="text-4xl font-bold text-orange-600 mb-2">£50M+</p>
            <p className="font-semibold text-gray-900 mb-1">Saved Collectively</p>
            <p className="text-sm text-gray-600">In energy bills annually</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
