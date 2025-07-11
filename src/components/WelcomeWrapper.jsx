import React, { useState, useEffect, useRef } from 'react';
import WelcomePage from '@/Pages/WelcomePage';
import { 
    getCurrentAccount, 
    handleNewUserWelcome, 
    checkIfNewUser, 
    hasSeenWelcome, 
    markWelcomeCompleted,
    checkUserExist
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
                    return;
                }
            }

            if (currentUser) {
                // Check if we've already processed this user
                if (processedUsersRef.current.has(currentUser.$id)) {
                    console.log('User already processed, skipping...');
                    setUser(currentUser);
                    setIsLoading(false);
                    return;
                }

                setUser(currentUser);
                
                // Check if user exists in database
                const userExistsInDB = await checkUserExist(currentUser.email);
                
                if (!userExistsInDB) {
                    console.log("New user detected - showing welcome screen");
                    setShowWelcome(true);
                    await handleNewUserWelcome(currentUser);
                    // Mark user as processed
                    processedUsersRef.current.add(currentUser.$id);
                } else {
                    const seenWelcome = await hasSeenWelcome(currentUser.$id);
                    if (!seenWelcome) {
                        console.log("Existing user hasn't seen welcome - showing welcome screen");
                        setShowWelcome(true);
                    }
                }
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
                console.log("Welcome marked as completed for user:", user.$id);
            }
            
            setShowWelcome(false);
        } catch (error) {
            console.error('Error completing welcome:', error);
            setShowWelcome(false);
        } finally {
            setWelcomeLoading(false);
        }
    };

   
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



    if (showWelcome && user) {
        return (
            <WelcomePage 
                user={user} 
                onComplete={handleWelcomeComplete}
                loading={welcomeLoading}
            />
        );
    }

    return children;
};

export default WelcomeWrapper;
