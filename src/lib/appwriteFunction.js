import { account, ID } from "./appwrite";

export const createAccount = async (email, password, name) => {  //!This for creating account
    try {
        return await account.create(ID.unique(), email, password, name)
    } catch (e) {
        console.log("Account Creation Failed", e);
        
    }
}                                                         

export const login = async (email, password) => {                //!This for keeping user persist across refresh
    try {
        return await account.createEmailPasswordSession(email, password)
    } catch (e) {
        console.log("Login failed", e);
        
    }
}

export const getCurrentAccount = async () => {
    try {
        return await account.get()
    } catch (e) {
        console.log("Can't get account", e);
        
    }
}

export const logout = async () => {
    try {
        return await account.deleteSession('current')   //! Appwrite interprets 'current' as a special keyword that means: “Delete the current    session, regardless of the actual session ID.”
    } catch (e) {
        console.log("Logout Failed", e);
        
    }

}