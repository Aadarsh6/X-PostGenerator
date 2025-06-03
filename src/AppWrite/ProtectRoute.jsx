import React, { useEffect, useState } from 'react'
import { getCurrentAccount } from './appwriteFunction'
import { useNavigate } from 'react-router-dom'

const ProtectRoute = ({ children }) => {
  const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    const AuthCheck = async () => {
      const Authentication = await getCurrentAccount()
      setIsAuth(Authentication)
    }
    AuthCheck()
  }, [])

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#121212] text-white text-center px-4">
        <h2 className="text-3xl font-semibold mb-2">Access Denied</h2>
        <p className="mb-4 text-gray-400 text-lg">You are not logged in or your session has expired.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 bg-[#1a1a1a] hover:scale-105 border border-[#ea580c] hover:bg-[#ea580c] hover:text-gray-300 text-[#ea580c] rounded-lg font-medium transition duration-200 shadow-sm hover:shadow-md"
        >
          Go to Login
        </button>
       
      </div>
    )
  }

  return children
}

export default ProtectRoute
