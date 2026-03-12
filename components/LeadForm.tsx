import React from 'react'

const LeadForm = () => {
  return (
    <div className='w-1/2 h-auto border-2 rounded-lg border-gray-400'>
        <h1>Lead Form</h1>
        <form className='flex flex-col justify-center items-center' >
            <label htmlFor="name">
              <input type="text" placeholder='Enter your Name' name='name' />
              </label>
        <label htmlFor="phone">
                  <input type="text" placeholder='Enter your Name' name='phone' />
              </label>   
              <label htmlFor="name">
              <input type="text" placeholder='Enter your Name' name='name' />
              </label>
              
        </form>
    </div>
  )
}

export default LeadForm