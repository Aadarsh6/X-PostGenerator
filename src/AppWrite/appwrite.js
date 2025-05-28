import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";

export const client = new Client()

client
.setEndpoint(conf.appwriteUrl)
.setProject(conf.appwriteProjectID)

const account = new Account(client)


export { account, ID }   