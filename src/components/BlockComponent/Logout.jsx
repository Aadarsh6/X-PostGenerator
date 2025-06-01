import { Menu, Home, Settings, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../AppWrite/appwriteFunction'

export const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true)

     const navigate = useNavigate()
          const handleLogout = async() =>{
              try {
                  const removeSession = await logout()
                  if(removeSession){
                      navigate("/login")
                  }
                  return removeSession
              } catch (error) {
                  console.log("Cant logout", error)
              }
          }



  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ]

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#171717] border-r border-[#222323] transition-all duration-400 ease-in-out z-50
        flex flex-col
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header with Menu Toggle */}
      <div
        className="flex items-center justify-between p-4 border-b border-[#222323]"
        aria-label="Sidebar header"
      >
        {!collapsed && (
          <div className="text-white font-semibold text-xl select-none">
            XCrafter
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[#252525] focus:outline-none text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 mt-2 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className="relative group w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#252525] rounded-lg transition-colors duration-400 focus:outline-none focus:ring focus:ring-indigo-500"
              data-tooltip={collapsed ? item.label : ""}
              aria-label={item.label}
              type="button"
            >
              <Icon size={20} className="flex-shrink-0" />
              <span
  className={`text-sm font-medium select-none overflow-hidden transition-all duration-300 ease-in-out
    ${collapsed ? "opacity-0 w-0 scale-95" : "opacity-100 w-auto ml-1 scale-100"}`}>
  {item.label}
</span>

              {/* Tooltip for collapsed */}
              {collapsed && (
                <span
                  className="absolute left-full ml-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 z-50 select-none"
                  role="tooltip"
                >
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-[#222323]">
        <button
          className="relative group w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring focus:ring-red-500"
          type="button"
          aria-label="Logout"
          data-tooltip={collapsed ? "Logout" : ""}
          onClick={handleLogout}
        >
            
          <LogOut size={20} className="flex-shrink-0 flex justify-center items-center" 
          />
          {collapsed && (
      <span
        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 
        rounded-md bg-[#252525] text-xs text-white whitespace-nowrap
        transition-all duration-300 ease-in-out transform opacity-0 scale-95
        group-hover:opacity-100 group-hover:scale-100 shadow-md z-50 select-none"
        role="tooltip"
      >
        Logout
      </span>
    )}

        </button>
      </div>
    </div>
  )
}






















      // import { Button } from "@/components/ui/button"
      // // import { account } from ../AppWrite/appwrite"
      // import { logout } from "../AppWrite/appwriteFunction"
      // import { useNavigate } from "react-router-dom"
      
      // export const Dashboard = () => {
      // const navigate = useNavigate()
      //     const handleLogout = async() =>{
      //         try {
      //             const removeSession = await logout()
      //             if(removeSession){
      //                 navigate("/login")
      //             }
      //             return removeSession
      //         } catch (error) {
      //             console.log("Cant logout", error)
      //         }
      //     }
      
      //   return (
      //     <div className='w-full h-screen flex justify-center items-center bg-[#191a1a]' ><Button size="lg" className="text-xl"
      //     onClick = {handleLogout}
      //     >Logout</Button></div>
      
      //   )
      // }
      
      
      // // //!account is your Appwrite Account object.
      // // //!account.logout() is invalid because it doesn't exist.
