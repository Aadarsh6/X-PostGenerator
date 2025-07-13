import conf from "@/conf/conf";
import { account, ID, databases } from "./appwrite";
import { OAuthProvider, Query } from "appwrite";

class AuthError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'AuthError';
        this.code = code;
    }
}

class DatabaseError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'DatabaseError';
        this.code = code;
    }
}

//To create New account
export const createAccount = async (name, email, password) => {
    try {
       const newAccount = await account.create(ID.unique(), email, password, name)
       console.log("New Account created Successfully");   
       return newAccount
    } catch (e) {
        console.log("Account Creation Failed", e);
        throw new AuthError(`Account creation failed: ${e.message}`, e.code);        
    }
}

//To create account and login (for signup flow)
export const signUpAndLogin = async (name, email, password) => {
    try {
        // First create the account
        const newAccount = await createAccount(name, email, password);
        
        // Then login with the new credentials
        const session = await account.createEmailPasswordSession(email, password);
        console.log("Account created and logged in successfully");
        
        return { account: newAccount, session };
    } catch (e) {
        console.log("SignUp and Login failed", e);
        throw new AuthError(`SignUp and Login failed: ${e.message}`, e.code);
    }
}

export const oAuth = async() => {
    try {
        const currentUrl = window.location.origin;
        
        try {
            await account.deleteSession("current");
        } catch (e) {
            console.log("No existing session to clear", e);
        }
        
        await account.createOAuth2Session(
            OAuthProvider.Google,
            `${currentUrl}/dashboard`,
            `${currentUrl}/login`
        );
    } catch (e) {
        console.log("Can't do oAuth currently", e);
        throw new AuthError(`OAuth failed: ${e.message}`, e.code);
    }
}

export const handleOauthCallback = async() => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        let user = null;
        let retries = 3;
        
        while (retries > 0 && !user) {
            try {
                user = await account.get();
                if (user && user.$id) {
                    break;
                }
            } catch (e) {
                console.log(`Retry ${4 - retries}: Session not ready yet, retrying...`, e);
                retries--;
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        if (user && user.$id) {
            console.log("OAuth successful - User authenticated:", {
                id: user.$id,
                name: user.name,
                email: user.email
            });
            
            return user;
        }
        
        throw new Error("OAuth completed but user not authenticated after retries");
        
    } catch (e) {
        console.log("OAuth callback error:", e);
        if (e instanceof AuthError) {
            throw e;
        }
        throw new AuthError(`OAuth callback failed: ${e.message}`, e.code);
    }
}

// Get user profile from database
export const getUserProfile = async(userId) => {
    try {
        const users = await databases.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteUserCollectionID,
            [Query.equal("userId", userId)]
        );
        return users.documents.length > 0 ? users.documents[0] : null;
    } catch (e) {
        console.log("Error getting user profile", e);
        return null;
    }
}

// Check if user exists in your database
export const checkUserExist = async(email) => {
    try {
        const users = await databases.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteUserCollectionID,
            [Query.equal("userEmail", email)]
        );
        return users.documents.length > 0;
    } catch (e) {
        console.log("Error checking user existence", e);
        return false;
    }
}

// Create user profile in database (for new users)
export const createUserProfile = async (user, isNewSignup = false) => {
    try {
        console.log(`Creating profile for user: ${user.name} (${user.email})`);
        
        // For new signups, always create a fresh profile
        if (!isNewSignup) {
            // Double-check if user already exists before creating
            const existingUser = await checkUserExist(user.email);
            if (existingUser) {
                console.log("User profile already exists, returning existing profile");
                return await getUserProfile(user.$id);
            }
        }
        
        const userProfile = await databases.createDocument(
            conf.appwriteDatabaseID,
            conf.appwriteUserCollectionID,
            ID.unique(),
            {
                userId: user.$id,
                userName: user.name || 'User',
                userEmail: user.email,
                createdAt: new Date().toISOString(),
                loginMethod: user.providerAccessToken ? 'oauth-google' : 'email',
                hasSeenWelcome: false, // Always false for new users
                isNewUser: true
            }
        );
        
        console.log("New user profile created successfully");
        return userProfile;
        
    } catch (e) {
        // Check if error is due to duplicate entry
        if (e.message && e.message.includes('unique')) {
            console.log("User profile already exists (duplicate key)");
            return await getUserProfile(user.$id);
        }
        console.log("Error creating user profile:", e);
        throw new DatabaseError(`Failed to create user profile: ${e.message}`, e.code);
    }
}

// Enhanced function to handle new user welcome and setup
export const handleNewUserWelcome = async (user, isNewSignup = false) => {
    try {
        // Get or create user profile
        let userProfile = await getUserProfile(user.$id);
        
        if (!userProfile) {
            userProfile = await createUserProfile(user, isNewSignup);
        } else if (isNewSignup) {
            // If this is a new signup but profile exists, reset welcome status
            userProfile = await databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUserCollectionID,
                userProfile.$id,
                {
                    hasSeenWelcome: false,
                    isNewUser: true
                }
            );
            console.log("Reset welcome status for new signup");
        }
        
        return userProfile;
        
    } catch (e) {
        console.log("Error in handleNewUserWelcome:", e);
        return null;
    }
}

// Check if user has seen welcome screen
export const hasSeenWelcome = async(userId) => {
    try {
        const userProfile = await getUserProfile(userId);
        
        if (userProfile) {
            return userProfile.hasSeenWelcome || false;
        }
        
        return false;
        
    } catch (e) {
        console.log("Error checking welcome status:", e);
        return false;
    }
}

// Mark welcome as completed
export const markWelcomeCompleted = async(userId) => {
    try {
        const userProfile = await getUserProfile(userId);
        
        if (userProfile) {
            // Update the profile to mark welcome as completed
            const updatedProfile = await databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUserCollectionID,
                userProfile.$id,
                {
                    hasSeenWelcome: true,
                    isNewUser: false
                }
            );
            
            console.log("Welcome marked as completed");
            return updatedProfile;
        }
        
        return null;
        
    } catch (e) {
        console.log("Error marking welcome as completed:", e);
        return null;
    }
}

//To login user with their credentials
export const login = async (email, password) => {
    try {
        const presentUser = await account.get();
        if (presentUser) {
            await account.deleteSession("current");
        }
    } catch (e) {
        console.log("No active session to delete", e?.message || e);
    }
    
    try {
        const accountLogin = await account.createEmailPasswordSession(email, password)
        console.log("Login Successful")
        return accountLogin
    } catch (e) {
        console.log("Login failed", e);
        throw new AuthError(`Login failed: ${e.message}`, e.code);
    }
}

//To get the user info
export const getCurrentAccount = async () => {
    try {
        const getLoggedInUSer = await account.get()
        if(getLoggedInUSer){
            console.log("user detail retrived")
        }
        return getLoggedInUSer
    } catch (e) {
        console.log("Can't get account", e);
        throw new AuthError(`Failed to get current account: ${e.message}`, e.code);
    }
}

//To logout the user
export const logout = async () => {
    try {
        await account.get()
    } catch (error) {
        console.log("No active user", error)
        return true;
    }
    try {
        const logoutUser = await account.deleteSession("current")
        console.log("user log out")
        return logoutUser
    } catch (error) {
        console.log("Logout failed", error.message);
        return { success: false, message: `Logout failed: ${error.message}`};
    }
} 

//To save the post
export const savePost = async(content, threadID = null) => {
    try {
        const user = await account.get();
        const userId = user.$id;

        if(!threadID) threadID = ID.unique()

        const userPost = await databases.createDocument(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            ID.unique(),
            {
                userId,
                content,
                createdAt: new Date().toISOString(),
                threadID
            }
        );
        console.log("Post saved successfully")
        return userPost
    } catch (e) {
        console.log("Can't save post", e)
        alert("Something went wrong")
        throw new DatabaseError(`Failed to save post: ${e.message}`, e.code);
    }
}

//To fetch saved posts
export const fetchSavedPost = async() => {
    try {
        const user = await account.get();
        const userID = user.$id;
        
        const yourPost = await databases.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            [
                Query.equal("userId", userID),
            ]
        );
        
        // Group posts by threadID
        const threadMap = new Map();
        
        for (const post of yourPost.documents) {
            const threadID = post.threadID;
            if (!threadID) continue;
            
            if (!threadMap.has(threadID)) {
                threadMap.set(threadID, []);
            }
            threadMap.get(threadID).push(post);
        }

        // Convert to array and sort by creation date
        const threads = Array.from(threadMap.entries()).map(([threadID, posts]) => ({
            threadID,
            posts: posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
            createdAt: posts[0].createdAt,
            lastUpdated: posts[posts.length - 1].createdAt
        }));
        
        threads.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        
        return threads;
    } catch (e) {
        console.log("Could not fetch saved posts", e);
        return [];
    }
}

//To delete from database
export const deleteFromDatabase = async(threadID) => {
    try {
        const deleteDB = await databases.deleteDocument(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            threadID
        )
        return deleteDB
    } catch (e) {
        console.log("Cant delete the post", e)
        throw new DatabaseError(`Failed to delete document: ${e.message}`, e.code);
    }
} 

export const handleError = (error, context = 'Operation') => {
    if (error instanceof AuthError || error instanceof DatabaseError) {
        return {
            success: false,
            message: error.message,
            code: error.code
        };
    }
    
    return {
        success: false,
        message: `${context} failed: ${error.message}`,
        code: error.code || 'UNKNOWN_ERROR'
    };
};