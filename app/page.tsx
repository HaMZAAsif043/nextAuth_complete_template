import React from 'react'
import HeroSection from "@/components/HeroSection"
import BenefitsSection from "@/components/BenefitsSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import LeadFormSection from "@/components/LeadFormSection"

const page = () => {
  return (
    <div className='flex flex-col w-full'>
   
      <HeroSection />
      {/* <BenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection /> */}
      <LeadFormSection />
    </div>
  )
}

export default page