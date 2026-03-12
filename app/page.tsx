import React from 'react'
import Navbar from "@/components/Navbar"
import LeadForm from "@/components/LeadForm"
const page = () => {
  return (
    <div className='flex flex-col gap-2'>
      <Navbar />
      
      <LeadForm />
      </div>
  )
}

export default page