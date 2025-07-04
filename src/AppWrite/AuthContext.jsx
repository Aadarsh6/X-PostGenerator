import { createContext, useContext, useEffect, useState } from "react";
import { account } from "./appwrite";


const AuthContext = createContext()


export const AuthProvider = ({children}) => {
        const [user, setUser] = useState(null)
        const [loading, setLoading] = useState(true)

const fetchUser = async () => {
        try {
            setLoading(true);
            const userData = await account.get();
            setUser(userData);
            console.log("User fetched successfully:", userData);
        } catch (error) {
            // Don't log error for 401 - it's expected when no user is logged in
            if (error.code !== 401) {
                console.error("Error fetching user:", error);
            }
            setUser(null); // treat as guest
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = () => {
      fetchUser()
    }

     const logoutUser = () => {
        setUser(null);
    };

     useEffect(() => {
        fetchUser();
    }, []);
  
  return (
    <AuthContext.Provider value={{user,
    loading,
    refreshUser,
    logoutUser
    }}>
        {children}
    </AuthContext.Provider>
)
}

export const useAuth = () => {
 
  const context = useContext(AuthContext)
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context
};
