// Updated Signup.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { account } from "../lib/appwrite";
import { ID } from "react-native-appwrite";
import { useLocalSearchParams, useRouter, useSearchParams } from "expo-router";
import Toast from 'react-native-toast-message';

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top'
    });
  };

  const handleSignup = async () => {
    router.push("/screens/DescribeRole");
    // if (password !== confirmPassword) {
    //   showToast('error', 'Error', 'Passwords do not match');
    //   return;
    // }

    // try {
    //   const result = await account.create(ID.unique(), email, password, fullName);
    //   showToast('success', 'Success', 'User registered successfully!');
      
    //   await account.createEmailPasswordSession(email, password);

    //   // Redirect based on role
    //   if (role === "client") {
    //     router.push("/screens/TellUsAboutYou");
    //   } else {
    //     router.push("/screens/DescribeRole");
    //   }
    // } catch (error) {
    //   if (error.code === 409) {
    //     showToast('error', 'Signup Failed', 'User with this email already exists.');
    //   } else if (error.code === 400) {
    //     showToast('error', 'Signup Failed', 'Invalid email or password.');
    //   } else {
    //     showToast('error', 'Signup Failed', 'An unexpected error occurred.');
    //   }
    //   console.error("Signup error: ", error);
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>

      {/* Full Name Input */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Toast Notification Component */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B0082",
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    color: "white",
    marginBottom: 8,
    marginLeft: 8,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#6A0DAD",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 28,
    color: "white",
    marginBottom: 32,
    textAlign: "center",
  },
});

export default Signup;
