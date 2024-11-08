import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const NotificationsSettingScreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState("Enable");

  // Function to handle the selected option (Online/Offline)
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Notifications</Text>
      </View>

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            selectedStatus === "Enable" && styles.radioSelected,
          ]}
          onPress={() => handleStatusChange("Enable")}
        >
          {selectedStatus === "Enable" && <View style={styles.radioInner} />}
        </TouchableOpacity>
        <Text style={styles.radioText}>Enable</Text>
      </View>

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            selectedStatus === "Disable" && styles.radioSelected,
          ]}
          onPress={() => handleStatusChange("Disable")}
        >
          {selectedStatus === "Disable" && <View style={styles.radioInner} />}
        </TouchableOpacity>
        <Text style={styles.radioText}>Disable</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  main: {
    marginTop: 45,
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 20,
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4B0082",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#4B0082",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  radioText: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
    marginRight: 40,
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
    marginTop: 20,
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
});

export default NotificationsSettingScreen;
