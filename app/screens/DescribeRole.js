import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { account, databases, appwriteConfig } from "../lib/appwrite";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { ID, Query } from "react-native-appwrite";

const DescribeRole = () => {
  const { fullName, email, password, role } = useLocalSearchParams();
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [heading, setHeading] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [designations, setDesignations] = useState([]);
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [services, setServices] = useState([]);

  // List of Indian states
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
  ];

  const addRole = () => {
    if (designation) {
      setDesignations([...designations, designation]);
      setDesignation("");
    }
  };

  const showToast = (type, message) => {
    Toast.show({
      type,
      text1: type === "success" ? "Success" : "Error",
      text2: message,
    });
  };

  const validateForm = () => {
    if (role === "client") {
      if (
        !designation.length ||
        !heading ||
        !city ||
        !state ||
        !zipCode ||
        !country ||
        !bio
      ) {
        showToast("info", "All fields are required.");
        return false;
      }
    } else {
      if (
        !designations.length ||
        !qualification ||
        !experience ||
        !heading ||
        !city ||
        !state ||
        !zipCode ||
        !country
      ) {
        showToast("info", "All fields are required.");
        return false;
      }
    }
    return true;
  };

  const authenticateUser = async () => {
    try {
      const session = await account.getSession("current");
      return session;
    } catch (error) {
      await account.createEmailPasswordSession(email, password);
    }
  };

  const saveFreelancerDetails = async () => {
    if (!validateForm()) return;

    try {
      // Authenticate and fetch user details
      await authenticateUser();

      // Create the document with permissions set to the user's ID
      if (role === "client") {
        const document = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.clientCollectionId,
          ID.unique(),
          {
            full_name: fullName,
            email: email,
            password: password,
            role: role,
            organization_type: designation,
            company_name: heading,
            city,
            state,
            zipcode: parseInt(zipCode),
            country,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profile_description: bio,
          }
        );
      } else {
        const document = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          ID.unique(),
          {
            full_name: fullName,
            email: email,
            password: password,
            role: role,
            role_designation: designations,
            highest_qualification: qualification,
            experience: parseInt(experience),
            profile_heading: heading,
            city,
            state,
            zipcode: parseInt(zipCode),
            country,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        );
      }

      router.push({ pathname: "/screens/TellUsAboutYou", params: { role } });

      showToast("success", "Freelancer details saved successfully.");
    } catch (error) {
      console.error("Error saving details:", error);
      showToast("error", `Failed to save ${role} details: ${error.message}`);
    }
  };

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.roleCollectionID,
          [Query.equal("category", "freelance_service")]
        );
        setServices(response.documents[0].role);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }
    fetchServices();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {role === "client" ? "Tell us about yourself" : "Describe Your Role"}
      </Text>

      {/* Role/Designation */}
      <Text style={styles.label}>
        {role === "client" ? "Type of you organisation" : "Role/Designation"}
      </Text>
      {role === "client" ? (
        <View style={styles.dropdown}>
          <Picker
            selectedValue={designation}
            onValueChange={(itemValue) => setDesignation(itemValue)}
          >
            <Picker.Item label="Select Organization Type" value="" />
            <Picker.Item label="Personal" value="personal" />
            <Picker.Item label="Company" value="Company" />
            <Picker.Item label="Manager" value="Manager" />
          </Picker>
        </View>
      ) : (
        <>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={designation}
              onValueChange={(itemValue) => setDesignation(itemValue)}
            >
              <Picker.Item label="Select Role" value="" />
              {services.map((service, id) => (
                <Picker.Item key={id} label={service} value={service} />
              ))}
            </Picker>
          </View>

          {designations.length > 0 &&
            designations.map((r, index) => (
              <Text key={index} style={styles.addedRole}>
                + {r}
              </Text>
            ))}
          <TouchableOpacity onPress={addRole}>
            <Text style={styles.addMoreRole}>+ Add 1 more role</Text>
          </TouchableOpacity>
        </>
      )}

      {role === "freelancer" && (
        <>
          {/* Qualification */}
          <Text style={styles.label}>Highest Qualification</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={qualification}
              onValueChange={(itemValue) => setQualification(itemValue)}
            >
              <Picker.Item label="Select Qualification" value="" />
              <Picker.Item
                label="Bachelor's Degree"
                value="Bachelor's Degree"
              />
              <Picker.Item label="Master's Degree" value="Master's Degree" />
              <Picker.Item label="PhD" value="PhD" />
            </Picker>
          </View>

          {/* Experience */}
          <Text style={styles.label}>Experience (In months)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="E.g. 24"
            value={experience}
            onChangeText={setExperience}
          />
        </>
      )}

      {/* Profile Heading */}
      <Text style={styles.label}>
        {" "}
        {role === "client"
          ? "Company Name (Optional)"
          : "Heading on your profile"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={
          role === "client" ? "Company name" : "E.g. I am a designer"
        }
        value={heading}
        onChangeText={setHeading}
      />

      {/* City and State */}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        </View>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>State</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={state}
              onValueChange={(itemValue) => setState(itemValue)}
            >
              <Picker.Item label="Select State" value="" />
              {indianStates.map((state, index) => (
                <Picker.Item key={index} label={state} value={state} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Zip Code and Country */}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Zip Code</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={zipCode}
            onChangeText={setZipCode}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Country</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={country}
              onValueChange={(itemValue) => setCountry(itemValue)}
            >
              <Picker.Item label="Select Country" value="" />
              {/* <Picker.Item label="USA" value="USA" /> */}
              <Picker.Item label="India" value="India" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Description (Bio) Section */}
      {role === "client" && (
        <>
          <Text style={styles.label}>Describe yourself</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe yourself"
            value={bio}
            multiline
            onChangeText={(text) => {
              if (text.length <= 255) {
                setBio(text);
              }
            }}
          />
          <Text style={styles.charCount}>{bio.length}/255</Text>
        </>
      )}

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={saveFreelancerDetails}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#4B0082",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    color: "#f0f0f0",
    marginBottom: 20,
    // marginTop: 20,
  },
  label: {
    color: "#f0f0f0",
    marginBottom: 10,
  },
  textArea: {
    height: 120,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#000",
    textAlignVertical: "top",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 44,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    height: 44,
  },
  addedRole: {
    color: "#fff",
    marginBottom: 10,
  },
  charCount:{
    color: "#fff",
    marginTop: 2,
    left: "auto"
  },
  addMoreRole: {
    color: "#fff",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  dropdownContainer: {
    flex: 1,
  },
  nextButton: {
    width: "32%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 230,
  },
  nextButtonText: {
    color: "#6A0DAD",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default DescribeRole;
