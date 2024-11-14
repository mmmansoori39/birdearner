import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import {
  appwriteConfig,
  databases,
  uploadFile,
  account,
} from "../lib/appwrite";
import { Query } from "react-native-appwrite";

const PortfolioScreen = ({navigation}) => {
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeTnC, setAgreeTnC] = useState(false);

  // Function to handle multiple image uploads
  const uploadPortfolioImages = async () => {
    try {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "You need to grant permission to access your photos."
        );
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!pickerResult.canceled) {
        const newImages = pickerResult.assets.map((asset) => asset.uri);
        setPortfolioImages([...portfolioImages, ...newImages]);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to pick images: ${error.message}`);
    }
  };

  const removeImage = (index) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!agreeTerms || !agreeTnC) {
      Alert.alert(
        "Error",
        "You need to agree to the terms and conditions before proceeding."
      );
      return;
    }

    if (portfolioImages.length === 0) {
      Alert.alert(
        "Portfolio Missing",
        "Please upload at least one portfolio image."
      );
      return;
    }

    try {
      const user = await account.get();

      // Fetch the user's document based on their email
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.freelancerCollectionId,
        [Query.equal("email", user.email)]
      );

      if (response.documents.length === 0) {
        Alert.alert("Error", "No user document found with the provided email.");
        return;
      }

      const userDocumentId = response.documents[0].$id;

      // Upload each image and get URLs
      const uploadedImageURLs = await Promise.all(
        portfolioImages.map(async (imageUri) => {
          const fileResponse = await uploadFile({ uri: imageUri }, "image");
          return fileResponse;
        })
      );

      // Update freelancer collection with image URLs
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.freelancerCollectionId,
        userDocumentId,
        {
          portfolio_images: uploadedImageURLs,
          updated_at: new Date().toISOString(),
        }
      );

      Alert.alert("Success", "Portfolio submitted successfully!");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", `Failed to submit portfolio: ${error.message}`);
    }
  };

  const skipScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>

      <TouchableOpacity style={styles.skipButton} onPress={skipScreen}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.instructions}>
        Please read before adding your portfolio on BirdEARNER:
      </Text>
      <Text style={styles.bulletPoint}>
        1. Upload your image in 1080x1080 px
      </Text>
      <Text style={styles.bulletPoint}>
        2. Image size should be between 100 KB-2 MB.
      </Text>
      <Text style={styles.bulletPoint}>
        3. Don’t upload any inappropriate or NSFW content.
      </Text>

      {/* Upload button */}
      <TouchableOpacity
        style={styles.imageUploadButton}
        onPress={uploadPortfolioImages}
      >
        <Text style={styles.imageUploadButtonText}>
          Upload Portfolio Images
        </Text>
      </TouchableOpacity>

      {/* Display uploaded images with remove button */}
      <View style={styles.uploadedImages}>
        {portfolioImages.map((image, index) => (
          <View key={index} style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.uploadedImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Terms and Conditions Checkboxes */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          color={agreeTerms ? "#ff9800" : undefined}
        />
        <Text style={styles.checkboxLabel}>
          I accept that all the work uploaded on BirdEARNER by me is authentic
          and belongs to me.
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreeTnC}
          onValueChange={setAgreeTnC}
          color={agreeTnC ? "#ff9800" : undefined}
        />
        <Text style={styles.checkboxLabel}>
          I agree upon all the <Text style={styles.link}>T&C</Text> and proceed.
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.nextButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b006b",
    padding: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  skipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 8,
  },
  skipButtonText: {
    color: "#ffffff",
    fontWeight: "350",
    fontSize: 20,
  },
  instructions: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 10,
  },
  bulletPoint: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 10,
  },
  imageUploadButton: {
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  imageUploadButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  uploadedImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  imagePreviewContainer: {
    position: "relative",
    width: 100,
    height: 100,
    margin: 5,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#3b006b",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
  },
  removeButtonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600"
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 14,
  },
  link: {
    textDecorationLine: "underline",
    color: "#ff9800",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  nextButton: {
    width: "32%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#6A0DAD",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default PortfolioScreen;
