import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appwriteConfig, databases } from "../lib/appwrite";
import { useAuth } from "../context/AuthContext";
import Toast from 'react-native-toast-message';

const BankAccountdetailsScreen = ({ navigation }) => {
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const { userData } = useAuth()

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const handleError = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });
  };

  const handleSuccess = (message) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: message,
    });
  };

  const fetchBankDetails = async () => {
    try {

      if (userData) {
        setBankName(userData?.bankName || "");
        setAccountHolderName(userData?.accountHolderName || "");
        setAccountNumber(userData?.accountNumber.toString() || "");
        setConfirmAccountNumber(userData?.accountNumber.toString() || "");
        setIfscCode(userData?.ifscCode || "");
      }
    } catch (error) {
      handleError("Error fetching bank details")
    }
  };

  const handleSave = async () => {
    if (accountNumber === confirmAccountNumber) {
      try {
        const document = {
          bankName,
          accountHolderName,
          accountNumber: parseInt(accountNumber),
          ifscCode,
        };
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          userData?.$id,
          document
        );

        handleSuccess("Bank Details Saved successfully!")
        // navigation.goBack();
      } catch (error) {
        handleError("Error saving bank details")
      }
    } else {
      handleError("Account numbers do not match!")
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View >
        <View style={styles.main}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>
            Bank Account details
          </Text>
        </View>

        <Text style={styles.label}>Select your bank</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter bank name"
          value={bankName}
          onChangeText={setBankName}
        />

        <Text style={styles.label}>Account holder name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter account holder's name"
          value={accountHolderName}
          onChangeText={setAccountHolderName}
        />

        <Text style={styles.label}>Enter your account number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter account number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Confirm your account number</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter account number"
          value={confirmAccountNumber}
          onChangeText={setConfirmAccountNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Enter your bank IFSC code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter IFSC code"
          value={ifscCode}
          onChangeText={setIfscCode}
        />

        <TouchableOpacity style={styles.signupButton} onPress={handleSave}>
          <Text style={styles.signupButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 30,
  },
  main: {
    marginTop: 45,
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    gap: 40,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 8,
    fontWeight: "400",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#f4f0f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 14,
    color: "#898686"
  },
  signupButton: {
    width: "40%",
    height: 50,
    backgroundColor: "#6A0DAD",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    margin: "auto",
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default BankAccountdetailsScreen;
