import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useAvatar } from './Context/avatarContext'
import { useAuthStore } from '@/store/authStore'
import { LogoutIcon } from './LogoutIcon'
import { useNavigate } from 'react-router-dom'

export const UserAvatar = ({ collapsed = false }) => {
  const { avatar } = useAvatar()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`flex items-center transition-colors duration-200
      ${collapsed ? 'justify-center p-3 m-2' : 'justify-between p-3 m-2 hover:bg-[#252525] rounded-3xl cursor-pointer'}`}>

      <div className='flex items-center min-w-0'>
        <Avatar className="w-9 h-9 rounded-full">
          <AvatarImage src={avatar} alt="User Avatar" className="object-cover" />
          <AvatarFallback className='text-white'>
            {user?.name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>

        {!collapsed && (
          <div className="ml-3 overflow-hidden min-w-0 flex-1">
            <div className='flex justify-between items-center'>
              <div className='text-md font-medium text-[#cccccd] select-none truncate'>
                {user?.name || "User"}
              </div>
            </div>
            <div className='flex gap-2 text-xs mt-1 items-center text-gray-400 select-none'>
              <div className='w-2 h-2 rounded-full bg-green-500'></div>
              Online
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <button
          onClick={handleLogout}
          className='p-1.5 rounded transition-colors duration-200 ml-2 flex-shrink-0'
          aria-label='Logout'
        >
          <LogoutIcon />
        </button>
      )}
    </div>
  )
}