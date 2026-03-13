import React from 'react'
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import BenefitsSection from "@/components/BenefitsSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import LeadFormSection from "@/components/LeadFormSection"
import Footer from "@/components/Footer"

const page = () => {
  return (
    <div className='flex flex-col w-full'>
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <LeadFormSection />
      <Footer />
    </div>
  )
}

export default page