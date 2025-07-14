const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECTID),
    appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASEID),
    appwriteCollectionID: String(import.meta.env.VITE_APPWRITE_COLLECTIONID),
    appwriteUserCollectionID: String(import.meta.env.VITE_APPWRITE_USERCOLLECTIONID)

    

}

export default conf