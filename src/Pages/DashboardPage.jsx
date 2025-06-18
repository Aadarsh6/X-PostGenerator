// import React, { useState, useEffect } from 'react'
import { Sidebar } from '../components/BlockComponent/Sidebar'
import { Xpost } from '../components/BlockComponent/Xpost'

export const DashboardPage = () => {
  return (
    <div className='w-full h-screen bg-[#0a0a0a] overflow-hidden'>
        <Sidebar/>
        <div className='lg:pl-64 h-full w-full overflow-y-auto'>
            <Xpost/>
        </div>
    </div>
  )
}
