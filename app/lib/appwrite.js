import { Client, Account } from "react-native-appwrite";

// Initialize the Appwrite Client
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") 
  .setProject("66f1b80b000d880e1d85");        

const account = new Account(client);

export { client, account };
