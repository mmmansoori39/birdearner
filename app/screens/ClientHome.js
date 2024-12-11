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

const ClientHomeScreen = ({navigation}) => {
  const { user, logout, userData } = useAuth();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.chats} onPress={() => {
          navigation.navigate("Inbox")
        }} >
          <FontAwesome name="comments" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => {
          navigation.navigate("Notification")
        }} >
          <View style={styles.squareBox}>

          </View>
        </TouchableOpacity>
      </View>

      
      

      {/* What's New Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>What's New</Text>
        <View style={styles.whatsNewContainer}>
          {/* You can add new content here */}
          <Text style={styles.whatsNewText}>Click on chat icon to logout ( temprory)</Text>
          <TouchableOpacity style={styles.chatIcon} onPress={() => {
            logout()
          }} >
            <FontAwesome name="comments" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>What's New</Text>
        <View style={styles.whatsNewContainer}>
          {/* You can add new content here */}
          <Text style={styles.whatsNewText}>Click on chat icon</Text>
          <TouchableOpacity style={styles.chatIcon} onPress={() => {
            navigation.navigate("ChatList")
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 30,
  },
  notificationIcon: {
    backgroundColor: "#6C1717",
    padding: 12,
    borderRadius: 50,
  },
  chats: {
    backgroundColor: "#4C0183",
    padding: 12,
    borderRadius: 50,
  },
  squareBox: {
    backgroundColor: "#5DE895",
    padding: 14,
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

export default ClientHomeScreen;
