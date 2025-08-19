import React, { useState, useEffect, useRef } from 'react';
import WelcomePage from '@/Pages/WelcomePage';
import { 
    getCurrentAccount, 
    handleNewUserWelcome, 
    markWelcomeCompleted,
    shouldShowWelcome
} from '@/AppWrite/appwriteFunction';
import { useAuth } from '@/AppWrite/AuthContext';

const WelcomeWrapper = ({ children }) => {
    const { user: contextUser, loading: authLoading } = useAuth();
    const [user, setUser] = useState(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [welcomeLoading, setWelcomeLoading] = useState(false);
    
    // Prevent duplicate executions
    const isProcessingRef = useRef(false);
    const processedUsersRef = useRef(new Set());

    useEffect(() => {
        if (!authLoading && !isProcessingRef.current) {
            checkUserStatus();
        }
    }, [authLoading, contextUser]);

    const checkUserStatus = async () => {
    if (isProcessingRef.current) return;
    
    try {
        setIsLoading(true);
        isProcessingRef.current = true;
        
        let currentUser = contextUser;
        if (!currentUser) {
            try {
                currentUser = await getCurrentAccount();
            } catch (e) {
                console.log('No authenticated user found', e);
                setIsLoading(false);
                return;
            }
        }

        if (currentUser) {
            // Check if we've already processed this user in this session
            if (processedUsersRef.current.has(currentUser.$id)) {
                console.log('User already processed in this session, skipping...');
                setUser(currentUser);
                setIsLoading(false);
                return;
            }

            setUser(currentUser);
            
            // Check if this is a new signup
            const isNewSignup = sessionStorage.getItem('isNewSignup') === 'true';
        
            await handleNewUserWelcome(currentUser, isNewSignup);
            
            // Use the new helper function to determine welcome status
            const shouldShow = await shouldShowWelcome(currentUser.$id);
            
   
            
            if (shouldShow) {
                console.log("User needs to see welcome - showing welcome screen");
                setShowWelcome(true);
            } else {
                console.log("User has already seen welcome - proceeding to main app");
                setShowWelcome(false);
                // Clear the new signup flag after processing
                sessionStorage.removeItem('isNewSignup');
            }
            
            // Mark user as processed in this session
            processedUsersRef.current.add(currentUser.$id);
        }
    } catch (error) {
        console.error('Error checking user status:', error);
    } finally {
        setIsLoading(false);
        isProcessingRef.current = false;
    }
};

    const handleWelcomeComplete = async () => {
        try {
            setWelcomeLoading(true);
            
            if (user) {
                await markWelcomeCompleted(user.$id);
            }
            
            // Clear the new signup flag when welcome is completed
            sessionStorage.removeItem('isNewSignup');
            sessionStorage.removeItem('signupMethod');
            
            setShowWelcome(false);
        } catch (error) {
            console.error('Error completing welcome:', error);
            // Still hide welcome even if there's an error
            setShowWelcome(false);
        } finally {
            setWelcomeLoading(false);
        }
    };

    // Show loading screen while checking user status
    if (isLoading || authLoading) {
        return (
            <div className='w-full min-h-screen bg-[#191a1a] flex flex-col justify-center items-center'>
                <div className='w-16 h-16 rounded-full animate-spin border-b-2 border-[#ea5a0cde]'></div>
                <p className='text-white mt-4 text-center'>
                    Loading...
                </p>
            </div>
        );
    }

    // Show welcome page if user hasn't seen it
    if (showWelcome && user) {
        return (
            <WelcomePage 
                user={user} 
                onComplete={handleWelcomeComplete}
                loading={welcomeLoading}
            />
        );
    }

    // Show main app content
    return children;
};

export default WelcomeWrapper;