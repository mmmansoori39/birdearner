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
import { useRouter } from "expo-router";
import { account } from "../lib/appwrite"; // Assuming AppWrite is used
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

const TellUsAboutYouScreen = () => {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [certifications, setCertifications] = useState([""]);
  const [socialLinks, setSocialLinks] = useState([""]);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null); // For the profile image
  const router = useRouter();

  // Function to dynamically add more certifications
  const addCertification = () => {
    setCertifications([...certifications, ""]);
  };

  // Function to dynamically add more social media links
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  // Handle profile picture upload
  const handleProfileUpload = async () => {
    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to grant camera roll permissions to upload a profile picture."
      );
      return;
    }

    // Let the user pick an image from the gallery
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile picture
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.assets[0].uri);
    }
  };

  // Handle Date Picker for DOB
  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false); // Close the date picker
    setDob(currentDate); // Update the selected DOB
  };

  const handleNext = () => {
    // Handle form validation and data submission here
    if (!gender || !dob) {
      Alert.alert("Error", "Please fill in the required fields.");
      return;
    }
    // Assuming you want to save or submit the data
    Alert.alert(
      "Success",
      "Your data has been saved. Proceeding to the next step."
    );
    router.push("/NextScreen"); // Navigate to next screen
  };

  const skipScreen = () => {
    router.push("/screens/Home"); // Redirect to home screen when skip is clicked
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell us about you</Text>

      <TouchableOpacity style={styles.skipButton} onPress={skipScreen}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Gender and DOB Inputs */}
      <View style={styles.row}>
        <TextInput
          style={styles.smallInput}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />

        {/* DOB Input with Calendar */}
        <TouchableOpacity
          style={styles.smallInput}
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
            maximumDate={new Date()} // Ensure users can't select future dates
          />
        )}
      </View>

      {/* Certifications Section */}
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
      <Text style={styles.label}>Describe yourself</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe yourself"
        value={bio}
        multiline
        onChangeText={setBio}
      />

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
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
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
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push("/screens/Portfolio")}
        >
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
});

export default TellUsAboutYouScreen;
