import React, { createContext, useState, useContext, useEffect } from "react";
import { account, appwriteConfig, databases } from "../lib/appwrite";
import { Query } from "react-native-appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        const responseF = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          [Query.equal("email", currentUser.email)]
        );
    
        const responseC = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.clientCollectionId,
          [Query.equal("email", currentUser.email)]
        );
    
        if (responseF.documents.length > 0) {
          setUserData(responseF.documents[0]);
        } else {
          setUserData(responseC.documents[0]);
        }

      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);
  // user, setUser
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);

      const responseF = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.freelancerCollectionId,
        [Query.equal("email", session.email)]
      );
  
      const responseC = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.clientCollectionId,
        [Query.equal("email", session.email)]
      );
  
      if (responseF.documents.length > 0) {
        setUserData(responseF.documents[0]);
      } else {
        setUserData(responseC.documents[0]);
      }


    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading , userData, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
