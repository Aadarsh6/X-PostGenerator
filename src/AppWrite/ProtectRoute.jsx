import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { handleOauthCallback, handleNewUserWelcome } from './appwriteFunction'
import { useAuth } from './AuthContext'

const ProtectRoute = ({children}) => {
    const [oauthLoading, setOauthLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, loading, refreshUser } = useAuth()

    useEffect(() => {
        const handleOAuth = async() => {
            // Check if this is an OAuth callback
            const isOauthCallback = location.pathname === "/dashboard" && 
                (location.search.includes('code=') || location.search.includes('state='));
            
            if (isOauthCallback && !user) {
                console.log('Handling OAuth callback...');
                setOauthLoading(true);
                
                try {
                    const oauthUser = await handleOauthCallback();
                    if (oauthUser && oauthUser.$id) {
                        console.log('OAuth authentication successful:', oauthUser);
                        
                        // Check if this is a new user (registered in last minute)
                        const isNewUser = oauthUser.registration ? 
                            (new Date() - new Date(oauthUser.registration)) < 60000 : false;
                        
                        if (isNewUser) {
                            console.log('New user detected - setting up profile...');
                            await handleNewUserWelcome(oauthUser);
                        }
                        
                        // Refresh the user data in AuthContext
                        refreshUser();
                        
                        // Clean up the URL and navigate
                        navigate("/dashboard", {replace: true});
                    } else {
                        throw new Error('OAuth callback handled but no user returned');
                    }
                } catch (oauthError) {
                    console.error('OAuth callback failed:', oauthError);
                    navigate("/login", {replace: true});
                } finally {
                    setOauthLoading(false);
                }
            }
        }
        
        handleOAuth();
    }, [location, navigate, user, refreshUser])

    // Handle authentication redirect
    useEffect(() => {
        if (!loading && !oauthLoading && !user && location.pathname !== "/login") {
            console.log('No authenticated user, redirecting to login');
            navigate("/login", {replace: true});
        }
    }, [navigate, user, loading, location.pathname, oauthLoading])

    // Show loading state
    if (loading || oauthLoading) {
        return (
            <div className='w-full min-h-screen bg-[#191a1a] flex justify-center items-center'>
                <div className='w-16 h-16 rounded-full animate-spin border-b-2 border-[#ea5a0cde]'></div>
                <p className='text-white mt-4 text-center'>
                    {oauthLoading ? 'Completing Google sign-in...' : 'Loading...'}
                </p>
            </div>
        )
    }

    return user ? children : null
}

export default ProtectRoute