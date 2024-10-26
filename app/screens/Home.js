import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "expo-router";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => {
          navigation.navigate("Notification")
        }} >
          <MaterialIcons name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        {/* Make sure to wrap dynamic content with Text component */}
        <Text style={styles.usernameText}>
          {user ? `${user.name}` : "Loading..."}
        </Text>
      </View>

      {/* Your Statistics Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>70%</Text>
            <Text style={styles.statLabel}>Success Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>NA</Text>
            <Text style={styles.statLabel}>Flags</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.5</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1 hr</Text>
            <Text style={styles.statLabel}>Avg. Response time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Your Level</Text>
          </View>
        </View>
      </View>

      {/* Your Earnings Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Earnings</Text>
        <View style={styles.earningsContainer}>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>Rs. 5,052</Text>
            <Text style={styles.earningLabel}>Total Earnings</Text>
          </View>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>Rs. 1,531</Text>
            <Text style={styles.earningLabel}>Monthly</Text>
          </View>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>0</Text>
            <Text style={styles.earningLabel}>Outstanding Amount</Text>
          </View>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>Rs. 5,000</Text>
            <Text style={styles.earningLabel}>For Withdrawal</Text>
          </View>
        </View>
      </View>

      {/* Your Orders Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Orders</Text>
        <View style={styles.ordersContainer}>
          <View style={styles.orderItem}>
            <Text style={styles.orderValue}>3</Text>
            <Text style={styles.orderLabel}>Orders Completed</Text>
          </View>
          <View style={styles.orderItem}>
            <Text style={styles.orderValue}>1</Text>
            <Text style={styles.orderLabel}>Active Orders</Text>
          </View>
          <View style={styles.orderItem}>
            <Text style={styles.orderValue}>0</Text>
            <Text style={styles.orderLabel}>Cancelled Orders</Text>
          </View>
        </View>
      </View>

      {/* What's New Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>What's New</Text>
        <View style={styles.whatsNewContainer}>
          {/* You can add new content here */}
          <Text style={styles.whatsNewText}>Enjoy Earning</Text>
          <TouchableOpacity style={styles.chatIcon} onPress={() => {
            logout()
          }} >
            <FontAwesome name="comments" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b006b",
  },
  usernameText: {
    fontSize: 18,
    color: "#3b006b",
  },
  notificationIcon: {
    backgroundColor: "#3b006b",
    padding: 10,
    borderRadius: 50,
    position: "absolute",
    right: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#3b006b",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    textAlign: "center",
  },
  statsContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderBottomRightRadius: 20,
  },
  statItem: {
    alignItems: "center",
    width: "18%",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b006b",
  },
  statLabel: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  earningsContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "space-between",
    borderBottomRightRadius: 20,
  },
  earningItem: {
    alignItems: "center",
    width: "45%",
  },
  earningValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b006b",
  },
  earningLabel: {
    fontSize: 12,
    color: "#000",
  },
  ordersContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomRightRadius: 20,
  },
  orderItem: {
    alignItems: "center",
    width: "30%",
  },
  orderValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b006b",
  },
  orderLabel: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  whatsNewContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomRightRadius: 20,
  },
  whatsNewText: {
    fontSize: 16,
    color: "#000",
  },
  chatIcon: {
    backgroundColor: "#3b006b",
    padding: 10,
    borderRadius: 50,
  },
});

export default HomeScreen;
