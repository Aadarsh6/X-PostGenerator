import React from 'react'
import { Sidebar } from '../components/BlockComponent/Sidebar'
import { Xpost } from '../components/BlockComponent/Xpost'

export const DashboardPage = () => {
  return (
    <div className='w-full h-screen bg-[#0a0a0a]'>
        <Sidebar/>
        <div className='ml-50'>
        <Xpost/>
        </div>
    </div>
  )
}
