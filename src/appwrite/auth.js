import conf from "../conf/conf.js";
import {Client, Account, ID} from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) { // this function will be called when the account is created
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            if(userAccount) {
                // call another method
                // if user is created, then login
                return this.login(email, password);
            }
            else {
                return userAccount; 
            }

        } catch (error) {
            console.log("Appwrite service :: createAccount error :: error, " + error);
        } 
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailSession(email, password);
        }
        catch(error) {
            console.log("Appwrite service :: Login error :: error, " + error);
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        }
        catch(error) {
            console.log("Appwrite service :: getCurrentUser error :: error, " + error);
        }
        
        return null;
    }

    async logout() {
        try {
            return await this.account.deleteSessions(); // logout from all browsers
        }
        catch(error) {
            console.log("Appwrite service :: logout error :: error, " + error);
        }
    }
}

const authService = new AuthService(); // authService is an object

export default authService;