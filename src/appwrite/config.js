import conf from "../conf/conf.js";
import {Client, ID, Databases, Storage, Query} from "appwrite";


export class Service {

    client = new Client();
    databases;
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    
    }

    async createPost({title, slug, content, capturedImage, status, userid, likeCnt, dislikeCnt, commentss, commentsCnt, uploadedBy}) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDataBaseId, 
                conf.appwriteCollectionId,
                slug, // slug is passes as unique id. we can either use ID.unique(). slug is the end part of url (afaik)
                {
                    title,
                    content,
                    capturedImage,
                    status,
                    userid: userid,
                    likeCnt,
                    dislikeCnt,
                    commentss,
                    commentsCnt,
                    uploadedBy
                }
            )
        }
        catch(error) {
            console.log("Appwrite error :: createPost error :: error, " + error);
        }
    }

    async updatePost(slug, {title, userid, content, capturedImage, status, likeCnt, dislikeCnt, commentss, commentsCnt, uploadedBy}) { // slug is passed first, because it will be used to find that post, 
                                                                      // bcz it was passed as the unique id of that post 
        try {
            return await this.databases.updateDocument(
                conf.appwriteDataBaseId, 
                conf.appwriteCollectionId,                                             
                slug,
                {
                    title,
                    content,
                    capturedImage,
                    userid,
                    status,
                    likeCnt,
                    dislikeCnt,
                    commentss, 
                    commentsCnt,
                    uploadedBy,
                }
            )
        }
        catch(error) {
            console.log("Appwrite error :: updatePost error :: error, " + error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument( // no need to return anything
                conf.appwriteDataBaseId, 
                conf.appwriteCollectionId,
                slug
            )
            return true; // deleted successfully
        }
        catch(error) {
            console.log("Appwrite error :: deletePost error :: error, " + error);
            return false; // not deleted
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDataBaseId, 
                conf.appwriteCollectionId,
                slug
            )
        }
        catch(error) {
            console.log("Appwrite error :: getPost error :: error, " + error);
            return false;
        }
    }

    async getPosts() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDataBaseId, 
                conf.appwriteCollectionId,
                [
                    Query.equal("status", "active")
                ]
            )
        }
        catch(error) {
            console.log("Appwrite error :: getPosts error :: error, " + error);
            return false;
        }
    }

    // file upload service
    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite error :: uploadFile error :: error, " + error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        }
        catch(error) {
            console.log("Appwrite error :: deleteFile error :: error, " + error);
            return false;
        }
    } 

    getFilePreview(fileId) {
        return this.storage.getFilePreview(
            conf.appwriteBucketId,
            fileId,
        )
    }
}

const service = new Service(); // service is an object

export default service;