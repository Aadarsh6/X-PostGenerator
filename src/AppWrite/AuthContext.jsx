import { createContext, useContext, useEffect, useState } from "react";
import { account } from "./appwrite";


const AuthContext = createContext()


export const AuthProvider = ({children}) => {
        const [user, setUser] = useState(null)
        const [loading, setLoading] = useState(false)

const fetchUser = async () => {
  try {
    const userData = await account.get();
    setUser(userData);
  } catch (error) {
    console.error("No logged-in user", error);
    setUser(null); // treat as guest
  } finally {
    setLoading(false);
  }
};

        useEffect(()=>{
            fetchUser()
        },[])    
  return (
    <AuthContext.Provider value={{user, loading}}>
        {children}
    </AuthContext.Provider>
)
}

export const useAuth = () => useContext(AuthContext);
