import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useAvatar } from './Context/avatarContext'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { LogOut, Bookmark } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export const UserAvatar = ({ collapsed = false }) => {
  const { avatar } = useAvatar()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Main avatar row */}
      <button
        onClick={() => !collapsed && setOpen(prev => !prev)}
        className={`w-full flex items-center transition-colors duration-200
          ${collapsed ? 'justify-center p-3 m-2' : 'justify-between p-3 m-2 hover:bg-[#252525] rounded-3xl cursor-pointer'}`}
      >
        <div className='flex items-center min-w-0 gap-3'>
          <Avatar className="w-9 h-9 rounded-full flex-shrink-0">
            <AvatarImage src={avatar} alt="User Avatar" className="object-cover rounded-full" />
            <AvatarFallback className='text-white bg-orange-600 rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold'>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="overflow-hidden min-w-0 flex-1 text-left">
              <div className='text-sm font-medium text-[#cccccd] select-none truncate'>
                {user?.name || "User"}
              </div>
              <div className='flex gap-1.5 text-xs mt-0.5 items-center text-gray-500 select-none'>
                <div className='w-1.5 h-1.5 rounded-full bg-green-500'></div>
                Online
              </div>
            </div>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {open && !collapsed && (
        <div className="absolute bottom-full left-2 right-2 mb-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-[#2a2a2a]">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <Link
              to="/save-post"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white rounded-xl transition-colors"
            >
              <Bookmark className="w-4 h-4 text-orange-500" />
              Saved Posts
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}