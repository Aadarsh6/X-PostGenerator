import { createContext, useContext, useEffect, useState, useRef } from "react";
import { account } from "./appwrite";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const fetchingRef = useRef(false)

    const fetchUser = async () => {
        // Prevent concurrent fetches
        if (fetchingRef.current) {
            return user;
        }
        
        try {
            fetchingRef.current = true;
            setLoading(true);
            
            const userData = await account.get();
            setUser(userData);
            console.log("User fetched successfully:", userData);
            return userData;
        } catch (error) {
            if (error.code !== 401) {
                console.error("Error fetching user:", error);
            }
            setUser(null);
            return null;
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    };

    const refreshUser = async () => {
        console.log("Refreshing user data...");
        return await fetchUser();
    }

    const logoutUser = () => {
        setUser(null);
    };

    const setCurrentUser = (userData) => {
        setUser(userData);
    };

    const updateUserProfile = async () => {
        if (user) {
            return await fetchUser();
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
  
    return (
        <AuthContext.Provider value={{
            user,
            loading,
            refreshUser,
            logoutUser,
            setCurrentUser,
            fetchUser,
            updateUserProfile
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