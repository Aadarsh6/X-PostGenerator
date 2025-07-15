import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOauthCallback } from '@/AppWrite/appwriteFunction';
import { useAuth } from '@/AppWrite/AuthContext';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth(); // Keep this for potential error recovery

    useEffect(() => {
        const processOAuthCallback = async () => {
            try {
                console.log('Processing OAuth callback...');
                
                const user = await handleOauthCallback();
                
                if (user) {
                    // console.log('OAuth callback successful, user:', user);                    
                    navigate('/dashboard');
                } else {
                    console.error('OAuth callback failed - no user returned');
                    navigate('/login');
                }
            } catch (error) {
                console.error('OAuth callback processing failed:', error);
                navigate('/login');
            }
        };

        processOAuthCallback();
    }, [navigate]); 

    return (
        <div className='w-full min-h-screen bg-[#191a1a] flex flex-col justify-center items-center'>
            <div className='w-16 h-16 rounded-full animate-spin border-b-2 border-[#ea5a0cde]'></div>
            <p className='text-white mt-4 text-center'>
                Completing sign in...
            </p>
        </div>
    );
};

export default OAuthCallback;
