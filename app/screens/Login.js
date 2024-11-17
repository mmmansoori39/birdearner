import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useNavigation, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Toast.show({
          type: "info",
          text1: "Warning",
          text2: "All fields are required",
          position: "top",
        });
        return;
      }
      // Validate email syntax
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Toast.show({
          type: "info",
          text1: "warning",
          text2: "Please enter a valid email address",
          position: "top",
        });
        return;
      }

      await login(email, password);
      Toast.show({
        type: "success",
        text1: "Login Successful!",
        text2: "Redirecting to Home...",
        position: "top",
      });
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      
    } catch (error) {
      // Handle specific errors
    if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
      // Incorrect credentials error
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Incorrect email or password. Please try again.",
        position: "top",
      });
    } else if (error.message.includes('Invalid `password` param')) {
      // Password length validation error
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Password must be between 8 and 256 characters long.",
        position: "top",
      });
    } else {
      // Generic error handling
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message || "An unexpected error occurred",
        position: "top",
      });
    }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* App Name */}
      <Text style={styles.title}>BirdEARNER</Text>
      <Text style={styles.subtitle}>Be BirdEARNER, Become Bread Earner!</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="yourname@gmail.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#999"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Forget Password */}
      <Link href="/screens/ForgotPassword">
        <Text style={styles.linkText}>Forget Password</Text>
      </Link>

      {/* Create Account */}
      <Link href="/screens/Role">
        <Text style={styles.linkText}>New Here? Create Your Account Here!</Text>
      </Link>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton}>
        <FontAwesome name="google" size={24} color="black" />
        <Text style={styles.googleButtonText}>Log in with Google</Text>
      </TouchableOpacity>

      {/* Social Icons */}
      <View style={styles.socialContainer}>
        <FontAwesome
          name="instagram"
          size={24}
          color="white"
          style={styles.socialIcon}
        />
        <FontAwesome
          name="facebook"
          size={24}
          color="white"
          style={styles.socialIcon}
        />
      </View>

      {/* Toast container for displaying messages */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B0082", // Purple background
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 40,
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
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#6A0DAD", // Dark purple for button
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "white",
    marginVertical: 10,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  socialContainer: {
    flexDirection: "row",
    marginTop: 40,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default Login;
