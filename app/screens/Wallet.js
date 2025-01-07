import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WalletScreen = ({ navigation, route }) => {
  // const { remainingAmount, paymentHistory } = route.params;


  // const renderItem = ({ item }) => (
  //   <View style={styles.paymentItem}>
  //     <Text style={styles.name}>{item.name}</Text>
  //     <Text style={styles.amount}>₹{item.amount}</Text>
  //     <Text style={styles.date}>{item.date} | {item.time}</Text>
  //     <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
  //   </View>
  // );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Success":
        return { color: "green" };
      case "Failed":
        return { color: "red" };
      case "Pending":
        return { color: "orange" };
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Wallet</Text>
      </View>

      {/* Full Name Input */}
      <Text style={styles.label}>Total Amount in Wallet</Text>
      <Text style={styles.colorText}>RS. 5,000</Text>

      {/* Password Input */}
      <Text style={styles.label}>Withdrawal Amount </Text>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Next Page</Text>
      </TouchableOpacity>

      <View style={styles.container}>
      <Text style={styles.header}>Payment History</Text>

      {/* Remaining Amount */}
      {/* <Text style={styles.remainingAmount}>Remaining Balance: ₹{256}</Text> */}

      {/* Payment History List */}
      {/* <FlatList
        data={paymentHistory}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      /> */}
    </View>
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
    gap: 80,
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
    fontSize: 30,
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
    width: "50%",
    height: 50,
    backgroundColor: "#6A0DAD",
    borderRadius: 12,
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

export default WalletScreen;