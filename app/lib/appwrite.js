// /app/lib/appwrite.js

import { Client, Account } from "react-native-appwrite";

// Initialize the Appwrite Client
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66f1b80b000d880e1d85");         // Your Appwrite project ID

// Initialize Account API (used to manage user authentication and account details)
const account = new Account(client);

export { client, account };
