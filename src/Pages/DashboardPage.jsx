// import React, { useState, useEffect } from 'react'
import { Sidebar } from '../components/BlockComponent/Sidebar'
import { Xpost } from '../components/BlockComponent/Xpost'

export const DashboardPage = () => {
  return (
    <div className='w-full min-h-screen bg-[#0a0a0a]'>
        <Sidebar/>
        <div className='pl-64 min-h-screen flex justify-center'>
            <div className='w-full'>
                <Xpost/>
            </div>
        </div>
    </div>
  )
}