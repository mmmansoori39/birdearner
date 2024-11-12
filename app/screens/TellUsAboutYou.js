import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  account,
  databases,
  appwriteConfig,
  uploadFile,
} from "../lib/appwrite";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { ID, Query } from "react-native-appwrite";

const TellUsAboutYouScreen = ({navigation}) => {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [certifications, setCertifications] = useState([""]);
  const [socialLinks, setSocialLinks] = useState([""]);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const router = useRouter();
  const { role } = useLocalSearchParams();

  // Add a new certification input field
  const addCertification = () => {
    setCertifications([...certifications, ""]);
  };

  // Add a new social link input field
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  // Handle profile image upload
  const handleProfileUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera roll permissions to upload a profile picture."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setProfileImage(pickerResult.assets[0]);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Image Picker encountered an issue.");
    }
  };

  // Handle cover image upload
  const handleCoverUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera roll permissions to upload a profile picture."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setCoverImage(pickerResult.assets[0]);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Image Picker encountered an issue.");
    }
  };

  // Handle date of birth selection
  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const isValidURL = (string) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(string);
  };

  // Save user details to AppWrite database
  const saveDetails = async () => {
    // Validate social links
    for (const link of socialLinks) {
      if (link && !isValidURL(link)) {
        Alert.alert(
          "Invalid URL",
          "Please enter valid URLs for your social media links."
        );
        return;
      }
    }

    try {
      const user = await account.get();

      // Fetch the user's document based on their email
      if (role === "client") {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.clientCollectionId,
          [Query.equal("email", user.email)]
        );

        if (response.documents.length === 0) {
          Alert.alert(
            "Error",
            "No user document found with the provided email."
          );
          return;
        }

        const userDocumentId = response.documents[0].$id;

        let profileImageFileURL = null;
        let coverImageFileURL = null;

        if (profileImage) {
          try {
            profileImageFileURL = await uploadFile(profileImage, "image");
          } catch (uploadError) {
            Alert.alert("Error", uploadError);
            return;
          }
        }

        if (coverImage) {
          try {
            coverImageFileURL = await uploadFile(coverImage, "image");
          } catch (uploadError) {
            Alert.alert("Error", uploadError);
            return;
          }
        }

        // Update user document with new details
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.clientCollectionId,
          userDocumentId,
          {
            gender,
            dob: dob.toISOString(),
            website_link: socialLinks,
            profile_photo: profileImageFileURL,
            cover_photo : coverImageFileURL,
            updated_at: new Date().toISOString(),
          }
        );


      } else {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          [Query.equal("email", user.email)]
        );

        if (response.documents.length === 0) {
          Alert.alert(
            "Error",
            "No user document found with the provided email."
          );
          return;
        }

        const userDocumentId = response.documents[0].$id;

        let profileImageFileURL = null;
        let coverImageFileURL = null;

        if (profileImage) {
          try {
            profileImageFileURL = await uploadFile(profileImage, "image");
          } catch (uploadError) {
            Alert.alert("Error", uploadError);
            return;
          }
        }

        if (coverImage) {
          try {
            coverImageFileURL = await uploadFile(coverImage, "image");
          } catch (uploadError) {
            Alert.alert("Error", uploadError);
            return;
          }
        }

        // Update user document with new details
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          userDocumentId,
          {
            gender,
            dob: dob.toISOString(),
            certifications,
            social_media_links: socialLinks,
            profile_description: bio,
            profile_photo: profileImageFileURL,
            cover_photo : coverImageFileURL,
            updated_at: new Date().toISOString(),
          }
        );
      }

      Alert.alert("Success", "Your details have been updated successfully.");
      router.push({pathname: "/screens/Portfolio", params: {role}});
    } catch (error) {
      console.error("Error updating details:", error);
      Alert.alert("Error", `Failed to update details: ${error.message}`);
    }
  };

  // Skip the current screen
  const skipScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell us about you</Text>

      <TouchableOpacity style={styles.skipButton} onPress={skipScreen}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Gender and DOB Inputs */}
      <View style={styles.row}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.dob}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{dob ? dob.toDateString() : "DOB"}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={onChangeDob}
              maximumDate={new Date()}
            />
          )}
        </View>
      </View>

      {/* Certifications Section */}
      {role === "freelancer" && (
        <>
          <Text style={styles.label}>Certifications</Text>
          {certifications.map((cert, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="Certification"
              value={cert}
              onChangeText={(text) => {
                const updatedCerts = [...certifications];
                updatedCerts[index] = text;
                setCertifications(updatedCerts);
              }}
            />
          ))}
          <TouchableOpacity onPress={addCertification}>
            <Text style={styles.addMore}>+ Add more certifications</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Social Media Links Section */}
      <Text style={styles.label}>Your Social Media Links</Text>
      {socialLinks.map((link, index) => (
        <View key={index} style={styles.socialRow}>
          <TextInput
            style={styles.input}
            placeholder="www.instagram.com/xyz"
            value={link}
            onChangeText={(text) => {
              const updatedLinks = [...socialLinks];
              updatedLinks[index] = text;
              setSocialLinks(updatedLinks);
            }}
          />
        </View>
      ))}
      <TouchableOpacity onPress={addSocialLink}>
        <Text style={styles.addMore}>+ Add more social media links</Text>
      </TouchableOpacity>

      {/* Description (Bio) Section */}
      {role === "freelancer" && (
        <>
          <Text style={styles.label}>Describe yourself</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe yourself"
            value={bio}
            multiline
            onChangeText={setBio}
          />
        </>
      )}

      {/* Profile Image Upload */}
      <Text style={styles.label}>Add your profile picture</Text>
      <View style={styles.profileUploadContainer}>
        <TouchableOpacity
          onPress={handleProfileUpload}
          style={styles.uploadButton}
        >
          <Text>Click here to upload</Text>
        </TouchableOpacity>
        {profileImage && (
          <Image
            source={{ uri: profileImage?.uri }}
            style={styles.profileImage}
          />
        )}
      </View>

      {/* Profile Image Upload */}
      <Text style={styles.label}>Add your cover art</Text>
      <View style={styles.profileUploadContainer}>
        <TouchableOpacity
          onPress={handleCoverUpload}
          style={styles.uploadButton}
        >
          <Text>Click here to upload</Text>
        </TouchableOpacity>
        {coverImage && (
          <Image source={{ uri: coverImage?.uri }} style={styles.coverImage} />
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.back()}
        >
          <Text style={styles.nextButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={saveDetails}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#4B0082", // Deep purple background
    justifyContent: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 20,
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
  smallInput: {
    width: "48%",
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dob: {
    width: "100%",
    height: 44,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    height: 48,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  addMore: {
    color: "#ADD8E6",
    marginBottom: 10,
  },
  socialRow: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // marginBottom: 15,
  },
  textArea: {
    height: 100,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#000",
    textAlignVertical: "top",
  },
  profileUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  uploadButton: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 20,
  },
  coverImage: {
    width: 150,
    height: 90,
    borderRadius: 0,
    marginLeft: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  nextButton: {
    width: "32%",
    height: 40,
    backgroundColor: "#fff", // Dark purple for button
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#6A0DAD",
    fontWeight: "bold",
    fontSize: 20,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    height: 44,
  },
});

export default TellUsAboutYouScreen;
