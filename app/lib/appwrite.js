import { Account, Client, Databases, Storage } from "react-native-appwrite";


export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "671cc8860027b96d7f3d",
  databaseId: "671cc8b0001ff969ee76",
  freelancerCollectionId: "671cc8be00219424fe65",
  clientCollectionId: "66f1bdfd0037e91d2064",
  bucketId: "671d0e22001ee9f5b509"
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) 
  .setProject(appwriteConfig.projectId)
  .setPlatform('*  ')

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases , storage};
