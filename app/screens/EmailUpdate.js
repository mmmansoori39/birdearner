import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmailUpdateScreen = ({ navigation }) => {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");



  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Change your email</Text>
      </View>

      {/* Full Name Input */}
      <Text style={styles.label}>Enter your current email address</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={oldEmail}
        onChangeText={setOldEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <Text style={styles.label}>Enter your new email address</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
      />

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm your new email address</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 30
  },
  main: {
    marginTop: 45,
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    gap: 60,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 8,
    // marginLeft: 8,
    fontWeight: "400",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#f4f0f0",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  signupButton: {
    width: "40%",
    height: 50,
    backgroundColor: "#6A0DAD",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    margin: "auto"
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default EmailUpdateScreen;