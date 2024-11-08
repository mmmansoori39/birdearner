import React, { useState } from "react";
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

const JobRequirementsScreen = ({ navigation }) => {
  const [jobLocation, setJobLocation] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [budget, setBudget] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [skills, setSkills] = useState([""]);
  const [jobDes, setJobDes] = useState("");
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [jobTitle, setJobTitle] = useState("");

  const formData = {
    jobLocation,
    deadline: deadline.toISOString(),
    budget,
    skills,
    jobDes,
    portfolioImages,
    jobTitle
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

  const handleSubmit = () => {
    navigation.navigate("JobDetails", { formData });
  };

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

        <Text style={styles.label}>Job Location</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={jobLocation}
          onChangeText={setJobLocation}
        />

        <Text style={styles.label}>Freelancer Type</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={jobLocation}
            onValueChange={(itemValue) => setJobLocation(itemValue)}
          >
            <Picker.Item label="Select Freelancer Type" value="" />
            <Picker.Item label="Part time" value="Part time" />
            <Picker.Item label="Full time" value="Full time" />
            <Picker.Item label="Onsite" value="Onsite" />
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
                <Text style={styles.removeButtonText}>Remove</Text>
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
    paddingVertical: 30,
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
    backgroundColor: "#F87A53",
    padding: 5,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#ffffff",
    fontSize: 10,
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
