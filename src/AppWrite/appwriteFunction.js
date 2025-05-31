import { account, ID } from "./appwrite";

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