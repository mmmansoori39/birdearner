import { ID, Account, Client, Databases, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "671cc8860027b96d7f3d",
  databaseId: "671cc8b0001ff969ee76",
  freelancerCollectionId: "671cc8be00219424fe65",
  clientCollectionId: "66f1bdfd0037e91d2064",
  bucketId: "671d0e22001ee9f5b509",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform("*  ");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;
  console.log("Uploading file", file);

  const fileData = {
    name: file.name || file.fileName,
    type: file.mimeType || file.type,
    size: file.size || file.fileSize,
    uri: file.uri,
  };

  if (fileData.name.toLowerCase().endsWith("jpeg"))
    fileData.name = `${fileData.name.split(".")[0]}.jpg`;

  try {
    const uniqueID = ID.unique();
    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      uniqueID,
      fileData
    );

    const fileUrl = await getFilePreview(uniqueID, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.bucketId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.bucketId,
        fileId
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}
