import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WithdrawalEarningScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
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
        <Text style={styles.header}>Withdrawal Earning</Text>
      </View>

      {/* Full Name Input */}
      <Text style={styles.label}>Total Amount in Wallet</Text>
      <Text style={styles.colorText}>$256</Text>

      {/* Password Input */}
      <Text style={styles.label}>Enter the amount you want to withdrawal</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        autoComplete="off"
      />

      <Text style={styles.label}>Any other charges</Text>
      <Text style={styles.colorText}>$--</Text>

      <Text style={styles.label}>You’re withdrawaling</Text>
      <View style={styles.withdrwal}>
        <Text style={styles.withdrwalText}>${amount}</Text>
      </View>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Process</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 40,
  },
  main: {
    marginTop: 45,
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    gap: 50,
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
  colorText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4B0082",
    textAlign: "center",
    marginBottom: 30,
  },
  withdrwal: { 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  withdrwalText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#4B0082",
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12
  }
  ,
  input: {
    width: "25%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 40,
    fontSize: 16,
    borderColor: "#4B0082",
    borderWidth: 2,
    margin: "auto",
    marginVertical: 10,
  },
  signupButton: {
    width: "40%",
    height: 50,
    backgroundColor: "#6A0DAD",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    margin: "auto",
  },
  signupButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
});

export default WithdrawalEarningScreen;
