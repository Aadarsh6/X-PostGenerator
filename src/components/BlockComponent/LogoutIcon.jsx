import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../AppWrite/appwriteFunction'
import { LogOut } from 'lucide-react'


export const LogoutIcon = () => {
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
  return (
    <div>
        <div
        onClick={handleLogout}
        >
        <LogOut size={20} className="text-gray-400 hover:text-[#ea580c] font-semibold mr-2"/>
        </div>
    </div>
  )
}
