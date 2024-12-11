import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WithdrawalEarningScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [totalAmountInWallet, setTotalAmountInWallet] = useState(5000); // Example wallet amount, can be dynamic
  const [warning, setWarning] = useState(""); // State to store warning message
  const platformChargeRate = 0.02; // 2% platform charge

  // Function to calculate the withdrawal amount after platform charge
  const calculateWithdrawalAmount = () => {
    const withdrawalAmount = parseFloat(amount);
    if (!isNaN(withdrawalAmount) && withdrawalAmount > 0 && withdrawalAmount <= totalAmountInWallet) {
      const platformCharge = withdrawalAmount * platformChargeRate;
      const finalAmount = withdrawalAmount - platformCharge;
      return finalAmount.toFixed(2);
    }
    return 0;
  };

  // Handle input change
  const handleAmountChange = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      setWarning("Please enter a valid amount.");
      setAmount("");
    } else if (numericValue > totalAmountInWallet) {
      // If the entered amount exceeds the total amount, adjust it to totalAmount - platform charge
      const adjustedAmount = totalAmountInWallet - (totalAmountInWallet * platformChargeRate);
      setAmount(adjustedAmount.toFixed(2)); // Automatically adjust the amount
      setWarning("Adjusted to maximum withdrawal.");
    } else {
      setWarning(""); // Clear warning if the amount is valid
      setAmount(value);
    }
  };

  const handleProcess = () => {
    const remainingAmount = totalAmountInWallet - parseFloat(amount);
    const paymentHistory = [
      {
        name: "Freelancer A", // Example data
        amount: parseFloat(amount),
        date: "02 May, 2024",
        time: "12:19 PM",
        status: "Pending",
      },
      // Add more payment history records as needed
    ];

    // Navigate to HistoryScreen with remaining balance and payment history
    navigation.navigate("Payment", { remainingAmount, paymentHistory });
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Withdrawal Earning</Text>
      </View>

      {/* Total Amount in Wallet */}
      <Text style={styles.label}>Total Amount in Wallet</Text>
      <Text style={styles.colorText}>RS. {totalAmountInWallet}</Text>

      {/* Withdrawal Amount Input */}
      <Text style={styles.label}>Enter the amount you want to withdraw</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
        autoComplete="off"
      />

      {/* Warning message */}
      {warning ? <Text style={styles.warning}>{warning}</Text> : null}

      {/* Platform Charges */}
      <Text style={styles.label}>Platform Charge (2%)</Text>
      <Text style={styles.colorText}>RS. {(parseFloat(amount) * platformChargeRate).toFixed(2)}</Text>

      {/* Amount to Withdraw */}
      <Text style={styles.label}>You’re withdrawing</Text>
      <View style={styles.withdrawal}>
        <Text style={styles.withdrawalText}>RS. {calculateWithdrawalAmount()}</Text>
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleProcess}>
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
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 8,
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
  withdrawal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  withdrawalText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#4B0082",
    // width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  input: {
    width: "80%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 40,
    fontSize: 16,
    borderColor: "#4B0082",
    borderWidth: 2,
    marginVertical: 10,
  },
  warning: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  signupButton: {
    width: "50%",
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
