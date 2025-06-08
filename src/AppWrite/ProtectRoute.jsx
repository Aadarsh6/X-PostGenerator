import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentAccount } from './appwriteFunction'

const ProtectRoute = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(null)
    const navigate = useNavigate(true)

    useEffect(()=>{
        const getUser = async() =>{
            try {
                const User = await getCurrentAccount()
                if(User && User.$id){
                    setIsAuth(User)
                }
                else{
                    setIsAuth(null)
                }
            } catch (error) {
                console.log("Error while fetching user", error)
                setIsAuth(null)
            }finally{
                setLoading(false)
            }
        }
        getUser()
    },[])

    useEffect(()=>{
        if(!loading && isAuth === null){  //! !loading indicates that fetching of above api is completed
            navigate("/login", {replace: true})
            // ?User navigation flow:

/* //? Home → About → Dashboard (not authenticated) → Login
WITHOUT replace: true
History: [Home, About, Dashboard, Login]
Back button from Login takes user to Dashboard (BAD!)

WITH replace: true  
History: [Home, About, Login]
Back button from Login takes user to About (GOOD!)
*/
            }
    },[navigate, isAuth, loading])

  if(loading){
    return (
    <div className='w-full min-h-screen bg-[#191a1a] flex justify-center items-center'>
        <div className='w-16 h-16 rounded-full animate-spin border-b-2 border-[#ea5a0cde]'></div>
    </div>
    )
  }

  if(isAuth === null){
    return null
  }
  return children
}

export default ProtectRoute


