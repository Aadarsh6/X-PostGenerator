import conf from "@/conf/conf";
import { account, ID, databases } from "./appwrite";
import { Query } from "appwrite";


//To create New account
export const createAccount = async (name, email, password) => {  //!This for creating account
    try {
       const newAccount =  await account.create(ID.unique(), email, password, name)
       console.log("New Account created Successfully");   
       return newAccount
       
        
    } catch (e) {
        console.log("Account Creation Failed", e);
        throw e;
        
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
        throw e;  //! Re-throw the error so it can be caught in the UI
        
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
        throw e
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
         return null;  //!return false or null → Something went wrong logging out
        
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
    }
}


//To see what we saved {listdocument}

export const fetchSavedPost = async() => {
    try {
        const user = await account.get();
        const userID = user.$id;
        
        const yourPost = await databases.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteCollectionID,
            [Query.equal("userId", userID)] /*//!This will return

            [
  { id: "doc1", content: "Hello world" },
  { id: "doc3", content: "Appwrite is awesome!" }
]
            */
        );
        const threadMap = new Map()
        for(const post of yourPost.documents){ //!post is just a variable name you chose
            const threadID =post.threadID;  
            if(!threadID) continue
            if(!threadMap.has(post.threadID)){
                threadMap.set(post.threadID, [])
            }
            
            if(!threadMap.has(threadID)){
                threadMap.set(threadID, [])
            }
            threadMap.get(post.threadID).push(post)
        }

        const threads = Array.from(threadMap.entries().map(([threadID, posts])=>({
            threadID,
            posts,
            createdAt: posts[0].createdAt
        })));
        threads.sort((a, b)=>(new Date(b.createdAt) - new Date(a.createdAt) ));
        return threads;


        // return yourPost.documents // List of saved post
    } catch (e) {
        console.log("Could not save the post", e)
        return []  /*//!Returning an empty array means:
//!“No data, but still safe to render.” */
        
    }
}