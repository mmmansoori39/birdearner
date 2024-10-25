// lib/appwrite.js
import { Client, Account, Databases, Permission, Role } from "react-native-appwrite"; // Added Permission and Role

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66f1b80b000d880e1d85",
  databaseId: "66f1b9d70005c7d69a8f",
  freelancerCollectionId: "66f1b9ee0012317673e9"
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) 
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const databases = new Databases(client);

// Export Permission and Role along with other configurations
export { client, account, databases, Permission, Role };
