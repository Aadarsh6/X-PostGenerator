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
export const createAccount = async (name, email, password) => {  //!This for creating account
    try {
       const newAccount =  await account.create(ID.unique(), email, password, name)
       console.log("New Account created Successfully");   
       return newAccount
       
        
    } catch (e) {
        console.log("Account Creation Failed", e);
        throw new AuthError(`Account creation failed: ${e.message}`, e.code);        
    }
}

export const oAuth = async() => {
    try {
        // Get current URL to make redirect URLs dynamic
        const currentUrl = window.location.origin;
        
        await account.createOAuth2Session(
            OAuthProvider.Google,
            `${currentUrl}/dashboard`, // Success redirect
            `${currentUrl}/login`      // Failure redirect
        );
    } catch (e) {
        console.log("Can't do oAuth currently", e);
        throw new AuthError(`OAuth failed: ${e.message}`, e.code);
    }
}



// Handle OAuth callback - works for both new and existing users
export const handleOauthCallback = async() => {
    try {
        // Wait a moment for the session to be fully established
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const user = await account.get();
        if (user && user.$id) {
            console.log("OAuth successful - User authenticated:", {
                id: user.$id,
                name: user.name,
                email: user.email,
                isNewUser: user.registration ? 
                    (new Date() - new Date(user.registration)) < 60000 : false // Check if registered in last minute
            });
            
            return user;
        }
        throw new Error("OAuth completed but user not authenticated");
    } catch (e) {
        console.log("OAuth callback error:", e);
        if (e instanceof AuthError) throw e;{
        throw new AuthError(`OAuth callback failed: ${e.message}`, e.code);
    }
    }
}
export const checkUserExist = async(email) => {
    try {
        // This is a workaround since Appwrite doesn't have a direct "check user exists" method
        // You might want to implement this using your own user tracking system
        const users = await databases.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            [Query.equal("userEmail", email)]
        );
        return users.documents.length > 0;
    } catch (e) {
        console.log("Error checking user existence", e);
        return false;
    }
}

export const handleNewUserWelcome = async (user) => {
    try {
        // You can add logic here to:
        // 1. Save user profile to your database
        // 2. Send welcome email
        // 3. Set up user preferences
        // 4. Create initial user documents
        
        console.log(`Welcome new user: ${user.name} (${user.email})`);
        
        // Example: Save user info to your database
        const userProfile = await databases.createDocument(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            ID.unique(),
            {
                userId: user.$id,
                userName: user.name,
                userEmail: user.email,
                createdAt: new Date().toISOString(),
                loginMethod: 'oauth-google'
            }
        );
        
        return userProfile;
    } catch (e) {
        console.log("Error setting up new user:", e);
        // Don't throw error - user login should still work
        return null;
    }
}




//To login user with their credentials
export const login = async (email, password) => {                //!This for keeping user persist across refresh
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
        throw new AuthError(`Login failed: ${e.message}`, e.code);  //! Re-throw the error so it can be caught in the UI
        
    }
}


//To get the user info like name(to display to frontend), id(for other functions to use)
export const getCurrentAccount = async () => {
    try {
        const getLoggedInUSer =  await account.get()
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
    return true;   //!<--- This stops the function here if no user is logged in
   }
    try {
        const logoutUser = await account.deleteSession("current")  //! Appwrite interprets 'current' as a special keyword that means: “Delete the current    session, regardless of the actual session ID.”
        console.log("user log out")
        return logoutUser
    } catch (error) {
        console.log("Logout failed", error.message);
        // throw error
         return { success: false, message: `Logout failed: ${error.message}`};  //!return false or null → Something went wrong logging out
            
    }                                     

} 

//To save the post we like {createDocument}
export const savePost = async(content, threadID = null) => {
    try {
        const user = await account.get(); //make sure user is logged in
        const userId = user.$id;

        if(!threadID) threadID = ID.unique()   // If no threadID is provided, generate a new one (for a new thread)

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
        // alert("Post Saved")
        console.log("Post saved successfully")
        return userPost
    } catch (e) {
        console.log("Can't save post", e)
        alert("Something went wrong")
        throw new DatabaseError(`Failed to save post: ${e.message}`, e.code);
    }
}


// /To see what we saved - IMPROVED VERSION
export const fetchSavedPost = async() => {
    try {
        const user = await account.get();
        const userID = user.$id;
        
        const yourPost = await databases.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            [Query.equal("userId", userID)]
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