import React, { createContext, useState, useEffect, useContext } from 'react';
import { account } from '../lib/appwrite'; // Import Appwrite account instance
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to check the user's authentication status
  const checkAuthStatus = async () => {
    try {
      const loggedInUser = await account.get();
      setUser(loggedInUser);
    } catch (error) {
      setUser(null); // No user is logged in
    } finally {
      setLoading(false);
    }
  };

  // Function to log in the user
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const loggedInUser = await account.get();
      setUser(loggedInUser);
      Alert.alert("Login Success", "You have been logged in successfully!");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      throw error;
    }
  };

  // Function to log out the user
  const logout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/screens/Login'); // Redirect to home if user is already logged in
      setUser(null);
      Alert.alert("Logout Success", "You have been logged out successfully!");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
      throw error;
    }
  };

  // Check user authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);
