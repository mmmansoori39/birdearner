import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    // Implement signup logic here
  };

  return (
    <View style={styles.container}>

    <Text style={styles.heading} >Register</Text>

      {/* Full Name Label and Input */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Email Label and Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Label and Input */}
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Confirm Password Label and Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Link href="/screens/DescribeRole" ><Text style={styles.signupButtonText}>Sign Up</Text></Link>
      </TouchableOpacity>

      <Link href="/screens/Login"style={styles.linkText} >
        <Text >Already have an account? Login</Text>
      </Link>

      <Image source={require("../assets/logo.png")} style={styles.logo} />
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    position: "absolute",
    bottom: 10,
    left: "44%",
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
  linkText: {
    color: "white",
    marginVertical: 15,
    fontSize: 14,
    textDecorationLine: "underline",
    margin: "auto"
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#6A0DAD", // Dark purple for button
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
    fontWeight: "normal",
  }
});

export default Signup;
