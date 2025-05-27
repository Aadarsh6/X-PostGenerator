import { Client, Account, ID } from "appwrite";
import conf from "../../conf/conf";

export const client = new Client()

client
.setEndpoint(conf.appwwiteUrl)
.setProject(conf.appwwiteProjectID)

const account = new Account(client)


export { account, ID }   