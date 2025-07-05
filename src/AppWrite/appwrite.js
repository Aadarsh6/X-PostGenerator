import { Client, Account, ID, Databases, OAuthProvider } from "appwrite";
import conf from "../conf/conf";

export const client = new Client()



client
.setEndpoint(conf.appwriteUrl)
.setProject(conf.appwriteProjectID)

const account = new Account(client)
const databases = new Databases(client)


export { account, ID, databases }   