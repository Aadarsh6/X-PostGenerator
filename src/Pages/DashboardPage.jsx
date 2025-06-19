import { Sidebar } from '../components/BlockComponent/Sidebar'
import { Xpost } from '../components/BlockComponent/Xpost'

export const DashboardPage = () => {
  return (
    <div className="flex w-full h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto ml-16 lg:ml-64">
        <Xpost />
      </div>
    </div>
  )
}
