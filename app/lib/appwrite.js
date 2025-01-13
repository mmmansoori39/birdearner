import { ID, Account, Client, Databases, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "671cc8860027b96d7f3d",
  databaseId: "671cc8b0001ff969ee76",
  freelancerCollectionId: "671cc8be00219424fe65",
  clientCollectionId: "671cceb9002cacc68e57",
  bucketId: "671d0e22001ee9f5b509",
  filesBucketId: "6769c9d1002a8bd22e16",
  roleCollectionID: "6733184d001684b89a24",
  jobCollectionID: "673327260000fb1f8aed",
  messageCollectionID: "674f23ba0019a93a384f",
  paymentHistoryCollectionId: "6769187c002cd44cc156",
  reviewCollectionId: "676922e0000cae8e2c3f",
  withdrawalRequestsCollectionId: "677cd4020023da8571b7",
  blockedAndStarDataCollectionId: "6784d356001feaaed104"
};
export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform("*");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Upload File
export async function uploadFile(file, type = "application/octet-stream") {
  if (!file || !file.uri) return;

  const fileData = {
    name: file.name || file.fileName || `file_${ID.unique()}`,
    type: file.mimeType || file.type || "application/octet-stream", 
    size: file.size || file.fileSize || 0,
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

    // Generate URL based on file type
    const fileUrl = await getFileURL(uniqueID, fileData.type);

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw new Error(error);
  }
}

// Get File URL based on type
export async function getFileURL(fileId, mimeType) {
  try {
    // Use getFilePreview for images and getFileView for other types
    let fileUrl;
    if (mimeType.startsWith("image")) {
      fileUrl = storage.getFilePreview(appwriteConfig.bucketId, fileId);
    } else {
      fileUrl = storage.getFileView(appwriteConfig.bucketId, fileId);
    }

    if (!fileUrl) throw new Error("Failed to retrieve file URL");

    return fileUrl;
  } catch (error) {
    console.error("Error getting file URL:", error.message);
    throw new Error(error);
  }
}
