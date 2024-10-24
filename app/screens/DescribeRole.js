import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import from the new package
import { router } from "expo-router";

const DescribeRole = () => {
  const [role, setRole] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [heading, setHeading] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [roles, setRoles] = useState([]);

  const addRole = () => {
    if (role) {
      setRoles([...roles, role]);
      setRole("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Describe Your Role</Text>

      {/* Role/Designation */}
      <Text style={styles.label}>Role/Designation</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Designer" value="Designer" />
          <Picker.Item label="Developer" value="Developer" />
          <Picker.Item label="Manager" value="Manager" />
        </Picker>
      </View>
      {roles.length > 0 &&
        roles.map((r, index) => (
          <Text key={index} style={styles.addedRole}>
            + {r}
          </Text>
        ))}
      <TouchableOpacity onPress={addRole}>
        <Text style={styles.addMoreRole}>+ Add 1 more role</Text>
      </TouchableOpacity>

      {/* Highest Qualification */}
      <Text style={styles.label}>Highest Qualification</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={qualification}
          onValueChange={(itemValue) => setQualification(itemValue)}
        >
          <Picker.Item label="Select Qualification" value="" />
          <Picker.Item label="Bachelor's Degree" value="Bachelor's Degree" />
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

      {/* Heading on your profile */}
      <Text style={styles.label}>Heading on your profile</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g. I am a designer"
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
              <Picker.Item label="New York" value="New York" />
              <Picker.Item label="California" value="California" />
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
              <Picker.Item label="USA" value="USA" />
              <Picker.Item label="India" value="India" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/screens/TellUsAboutYou")}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4B0082",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    color: "#f0f0f0",
    marginBottom: 20,
  },
  label: {
    color: "#f0f0f0",
    marginBottom: 10,
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
    backgroundColor: "#fff", // Dark purple for button
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
