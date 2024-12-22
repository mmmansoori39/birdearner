import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { appwriteConfig, databases } from "../lib/appwrite";
import { Query } from "react-native-appwrite";

const JobRequirementsScreen = ({ navigation }) => {
  const [jobLocation, setJobLocation] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [budget, setBudget] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [skills, setSkills] = useState([""]);
  const [jobDes, setJobDes] = useState("");
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [freelancerType, setFrelancerType] = useState("");
  const [jobType, setJobType] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [services, setServices] = useState([]);

  const formData = {
    jobLocation,
    deadline: deadline.toISOString(),
    budget,
    skills,
    jobDes,
    portfolioImages,
    jobTitle,
    freelancerType,
    jobType,
    latitude,
    longitude,
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Location access is needed to use this feature."
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.roleCollectionID,
          [Query.equal("category", ["freelance_service", "household_service"])]
        );
        const roles = response.documents.map((doc) => doc.role).flat();

        setServices(roles);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }
    fetchServices();
  }, []);

  const fetchCoordinates = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const [result] = await Location.geocodeAsync(jobLocation);
      if (result) {
        setLatitude(parseFloat(result.latitude));
        setLongitude(parseFloat(result.longitude));
      } else {
        Alert.alert("Error", "Unable to fetch coordinates. Please try again.");
      }
    } catch (error) {
      console.log(error.message);
      Alert.alert("Error", `Failed to fetch coordinates: ${error.message}`);
    }
  };

  const addSkills = () => {
    setSkills([...skills, ""]);
  };

  const onChangeDeadline = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(false);
    setDeadline(currentDate);
  };

  const uploadPortfolioImages = async () => {
    try {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
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

  // Validation function
  const validateForm = () => {
    if (jobType === "On-site" && !jobLocation) {
      Alert.alert("Validation Error", "Please enter a job location.");
      return false;
    }
    if (!jobTitle) {
      Alert.alert("Validation Error", "Please enter a job title.");
      return false;
    }
    if (!freelancerType) {
      Alert.alert("Validation Error", "Please select a freelancer type.");
      return false;
    }
    if (!jobType) {
      Alert.alert("Validation Error", "Please select a job type.");
      return false;
    }
    if (deadline < new Date()) {
      Alert.alert("Validation Error", "Deadline must be a future date.");
      return false;
    }
    if (!budget || isNaN(budget) || budget <= 0) {
      Alert.alert("Validation Error", "Please enter a valid budget.");
      return false;
    }
    if (skills.some((skill) => skill === "")) {
      Alert.alert("Validation Error", "Please enter all required skills.");
      return false;
    }
    if (!jobDes) {
      Alert.alert("Validation Error", "Please enter a job description.");
      return false;
    }
    if (portfolioImages.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please upload at least one portfolio image."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (jobType === "On-site") {
        await fetchCoordinates();
        if (latitude && longitude) {
          navigation.navigate("JobDetails", { formData });
        } else {
          Alert.alert("Validation Error", "Please enter a valid job location.");
        }
      } else {
        setJobLocation("india");
        await fetchCoordinates();
        if (latitude && longitude) {
          navigation.navigate("JobDetails", { formData });
        } else {
          Alert.alert("Validation Error", "Please enter a valid job location.");
        }
      }

    };
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Job Requirements</Text>
        </View>

        <Text style={styles.label}>Job Type</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={jobType}
            onValueChange={(itemValue) => setJobType(itemValue)}
          >
            <Picker.Item label="Select Job Type" value="" />
            <Picker.Item label="On-site" value="On-site" />
            <Picker.Item label="Remote" value="Remote" />
          </Picker>
        </View>

        {jobType === 'On-site' && (
          <View>
            <Text style={styles.label}>Job Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter job location"
              value={jobLocation}
              onChangeText={setJobLocation}
            />
          </View>
        )}


        <Text style={styles.label}>Freelancer Type</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={freelancerType}
            onValueChange={(itemValue) => setFrelancerType(itemValue)}
          >
            <Picker.Item label="Select Freelancer Type" value="" />
            {services.map((service, id) => (
              <Picker.Item key={id} label={service} value={service} />
            ))}
          </Picker>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity
              style={styles.dob}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{deadline ? deadline.toDateString() : "Deadline"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={onChangeDeadline}
              />
            )}
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Budget</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="number-pad"
              value={budget}
              onChangeText={setBudget}
            />
          </View>
        </View>

        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Looking for a ...."
          value={jobTitle}
          onChangeText={setJobTitle}
        />

        <Text style={styles.label}>Skills Required</Text>
        {skills.map((skill, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="Add the required skills"
            value={skill}
            onChangeText={(text) => {
              const updatedSkills = [...skills];
              updatedSkills[index] = text;
              setSkills(updatedSkills);
            }}
          />
        ))}
        <TouchableOpacity onPress={addSkills}>
          <Text style={styles.addMore}>+ Add more skills</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Job Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your job"
          value={jobDes}
          multiline
          onChangeText={setJobDes}
        />

        <Text style={styles.label}>Attachments</Text>
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={uploadPortfolioImages}
        >
          <Text style={styles.imageUploadButtonText}>
            Upload Portfolio Images
          </Text>
        </TouchableOpacity>

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

        <Text style={styles.bulletPoint}>
          1. Upload your image in 1080x1080 px
        </Text>
        <Text style={styles.bulletPoint}>
          2. Image size should be between 100 KB-2 MB.
        </Text>
        <Text style={styles.bulletPoint}>
          3. Don’t upload any inappropriate or NSFW content.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
            <Text style={styles.nextButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.nextButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexGrow: 1,
  },
  main: {
    marginBottom: 30,
    display: "flex",
    flexDirection: "row",
    gap: 50,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdown: {
    backgroundColor: "#ededed",
    borderRadius: 20,
    marginBottom: 20,
    height: 44,
  },
  label: {
    color: "000",
    marginVertical: 8,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 12,
  },
  input: {
    backgroundColor: "#ededed",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 44,
  },
  bulletPoint: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 25,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    gap: 20,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  dropdownContainer: {
    flex: 1,
  },
  dob: {
    width: "100%",
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#ededed",
    justifyContent: "center",
  },
  addMore: {
    color: "#000",
    marginBottom: 10,
    marginLeft: 12,
  },
  textArea: {
    height: 180,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#ededed",
    color: "#000",
    textAlignVertical: "top",
  },
  imageUploadButton: {
    backgroundColor: "#4c0183",
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
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    alignItems: "center",
  },
  nextButton: {
    width: "35%",
    height: 40,
    backgroundColor: "#6A0DAD",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    width: "35%",
    height: 40,
    backgroundColor: "#9a9a9a",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default JobRequirementsScreen;
