import React from 'react'
import DailyChart from './DailyChart'
import WeeklyChart from './WeeklyChart'
import LeadDetailsTable from './LeadDetailsTable'

const page = () => {
  return (
    <div className='max-w-7xl mx-auto w-full px-4 py-5 space-y-10'>
      <div className='flex flex-col lg:flex-row lg:items-stretch gap-6'>
        <div className='flex-1 flex flex-col'>
          <h1 className=" pl-4 text-xl font-semibold tracking-widest uppercase text-orange-500 mb-1">
            Daily Overview
          </h1>
          <div className='flex-1'>
            <DailyChart />
          </div>
        </div>

        <div className='flex-1 flex flex-col'>
          <h1 className="pl-4 text-xl font-semibold tracking-widest uppercase text-orange-500 mb-1">
            Weekly Overview
          </h1>
          <div className='flex-1'>
            <WeeklyChart />
          </div>
        </div>
      </div>
      <div>
      
      </div>
      <div>
        <h1 className="pl-4 text-xl font-semibold tracking-widest uppercase text-orange-500 mb-1"> Leads Submissions</h1>
        <LeadDetailsTable/>
      </div>
    </div>
  )
}

export default page