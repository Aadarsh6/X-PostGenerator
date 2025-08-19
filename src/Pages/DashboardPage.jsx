import { Sidebar } from '../components/BlockComponent/Sidebar'
import { Xpost } from '../components/BlockComponent/Xpost'

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex relative">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 transition-all duration-300 ease-in-out lg:ml-64 relative">
        {/* Mobile Header Space - Only visible on mobile */}
        <div className="lg:hidden h-16 w-full bg-[#0a0a0a]/80 border-b border-[#222323] flex items-center px-4 pr-16 sticky top-0 z-30">
          <div className="text-white font-semibold text-lg">
            XCrafter
          </div>
        </div>
        
        {/* Xpost Component Container */}
        <div className="w-full min-h-[calc(100vh-4rem)] lg:min-h-screen overflow-auto">
          <Xpost />
        </div>
      </main>
    </div>
  ) 
}