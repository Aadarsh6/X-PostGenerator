import { Button } from "@/components/ui/button"
// import { account } from ../AppWrite/appwrite"
import { logout } from "../AppWrite/appwriteFunction"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
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
    <div className='w-full h-screen flex justify-center items-center bg-[#191a1a]' ><Button size="lg" className="text-xl"
    onClick = {handleLogout}
    >Logout</Button></div>

  )
}


//!account is your Appwrite Account object.
//!account.logout() is invalid because it doesn't exist.