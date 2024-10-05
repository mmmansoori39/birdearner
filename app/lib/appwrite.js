import { Client, Account, ID } from "react-native-appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66f1b80b000d880e1d85")
  .setPlatform("birdearner");
