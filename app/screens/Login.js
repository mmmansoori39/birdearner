import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // Import useAuth to access authentication

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth(); // Use login and user from AuthContext
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push('/screens/Home'); // Redirect to home if login is successful
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push('/screens/Home'); // Redirect to home if user is already logged in
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

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
      <Link href="/screens/Signup">
        <Text style={styles.linkText}>New Here? Create Your Account Here!</Text>
      </Link>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton}>
        <FontAwesome name="google" size={24} color="black" />
        <Text style={styles.googleButtonText}>Log in with Google</Text>
      </TouchableOpacity>

      {/* Social Icons */}
      <View style={styles.socialContainer}>
        <FontAwesome name="instagram" size={24} color="white" style={styles.socialIcon} />
        <FontAwesome name="facebook" size={24} color="white" style={styles.socialIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082', // Purple background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6A0DAD', // Dark purple for button
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'white',
    marginVertical: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default Login;
