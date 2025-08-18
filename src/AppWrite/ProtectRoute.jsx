import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { handleOauthCallback, handleNewUserWelcome } from './appwriteFunction'
import { useAuth } from './AuthContext'

const ProtectRoute = ({children}) => {
    const [oauthLoading, setOauthLoading] = useState(false)
    const [oauthProcessed, setOauthProcessed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, loading, refreshUser, setCurrentUser } = useAuth()

    useEffect(() => {
        const handleOAuth = async() => {
            // Check if this is an OAuth callback
            const isOauthCallback = location.pathname === "/dashboard" && 
                (location.search.includes('code=') || 
                location.search.includes('state=') || 
                location.search.includes('session=') ||
                location.hash.includes('access_token=') ||
                document.referrer.includes('appwrite.io') ||
                document.referrer.includes('accounts.google.com'));
            
            // Don't process if already processed, already have user, or not an OAuth callback
            if (oauthProcessed || user || !isOauthCallback) {
                return;
            }
            
            console.log('Detected OAuth callback, processing...');
            setOauthLoading(true);
            setOauthProcessed(true);
            
            try {
                const oauthUser = await handleOauthCallback();
                
                if (oauthUser && oauthUser.$id) {
                    console.log('OAuth authentication successful:', oauthUser);
                    
                    // Set the user immediately in context
                    setCurrentUser(oauthUser);
                    
                    // Check if this is a new user
                    const isNewUser = oauthUser.registration ? 
                        (new Date() - new Date(oauthUser.registration)) < 60000 : false;
                    
                    if (isNewUser) {
                        console.log('New user detected - setting up profile...');
                        try {
                            await handleNewUserWelcome(oauthUser);
                        } catch (welcomeError) {
                            console.log('Welcome setup failed, but login successful:', welcomeError);
                        }
                    }
                    
                    // Refresh user data to ensure consistency
                    try {
                        await refreshUser();
                    } catch (refreshError) {
                        console.log('Refresh failed but user is set:', refreshError);
                    }
                    
                    // Clean up the URL
                    window.history.replaceState({}, document.title, "/dashboard");
                    
                } else {
                    throw new Error('OAuth callback handled but no user returned');
                }
            } catch (oauthError) {
                console.error('OAuth callback failed:', oauthError);
                setOauthProcessed(false); // Reset so it can be retried
                navigate("/login", {
                    replace: true,
                    state: { error: 'OAuth authentication failed. Please try again.' }
                });
            } finally {
                setOauthLoading(false);
            }
        }
        
        handleOAuth();
    }, [location, navigate, user, refreshUser, oauthProcessed, setCurrentUser])

    // Handle authentication redirect - but don't redirect if we're processing OAuth
    useEffect(() => {
        if (!loading && !oauthLoading && !user && location.pathname !== "/login" && !oauthProcessed) {
            console.log('No authenticated user, redirecting to login');
            navigate("/login", {replace: true});
        }
    }, [navigate, user, loading, location.pathname, oauthLoading, oauthProcessed])

    // Show loading state
    if (loading || oauthLoading) {
        return (
            <div className='w-full min-h-screen bg-[#191a1a] flex flex-col justify-center items-center'>
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