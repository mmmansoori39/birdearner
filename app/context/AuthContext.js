import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { account, appwriteConfig, databases } from "../lib/appwrite";
import { Query } from "react-native-appwrite";
import { Alert } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Helper function to fetch user data
  const fetchUserData = async (email) => {
    try {
      const [freelancerResponse, clientResponse] = await Promise.all([
        databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          [Query.equal("email", email)]
        ),
        databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.clientCollectionId,
          [Query.equal("email", email)]
        ),
      ]);

      const freelancerData = freelancerResponse.documents[0];
      const clientData = clientResponse.documents[0];

      setUserData(freelancerData || clientData || null);
    } catch (error) {
      throw new Error("Error fetching user data")
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        await fetchUserData(currentUser.email);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);

      // Fetch user-specific data
      await fetchUserData(currentUser.email);
    } catch (error) {
      throw new Error("Invalid email or password. Please try again.");
    }
  };

  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      setUserData(null);
    } catch (error) {
      throw new Error("Logout failed");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        login,
        logout,
        loading,
        setUser,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
