import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const freelanceServices = [
  { id: "1", title: "Web DeveloperWeb Developer", image: require("../assets/webdev.jpg") },
  { id: "2", title: "UI/UX", image: require("../assets/webdev.jpg") },
  { id: "3", title: "Graphic Designer", image: require("../assets/webdev.jpg") },
  { id: "4", title: "Web Developer", image: require("../assets/webdev.jpg") },
  { id: "5", title: "UI/UX", image: require("../assets/webdev.jpg") },
  { id: "6", title: "Graphic Designer", image: require("../assets/webdev.jpg") },
  { id: "7", title: "Web Developer", image: require("../assets/webdev.jpg") },
  { id: "8", title: "UI/UX", image: require("../assets/webdev.jpg") },
  { id: "9", title: "Graphic Designer", image: require("../assets/webdev.jpg") },
];

const householdServices = [
  { id: "1", title: "Plumber", image: require("../assets/webdev.jpg") },
  { id: "2", title: "Electrician", image: require("../assets/webdev.jpg") },
  { id: "3", title: "Decor", image: require("../assets/webdev.jpg") },
];

const ClientHomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [filteredFreelanceServices, setFilteredFreelanceServices] = useState(
    freelanceServices
  );
  const [filteredHouseholdServices, setFilteredHouseholdServices] = useState(
    householdServices
  );

  const router = useRouter()

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      // Reset the services if search text is empty
      setFilteredFreelanceServices(freelanceServices);
      setFilteredHouseholdServices(householdServices);
    } else {
      // Filter services based on search text
      const filteredFreelance = freelanceServices.filter((service) =>
        service.title.toLowerCase().includes(text.toLowerCase())
      );
      const filteredHousehold = householdServices.filter((service) =>
        service.title.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredFreelanceServices(filteredFreelance);
      setFilteredHouseholdServices(filteredHousehold);
    }
  };

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <Image source={item.image} style={styles.serviceImage} />
      <View style={styles.serviceTextlay}>
        <Text style={styles.serviceText} numberOfLines={2} ellipsizeMode="tail" >{item.title}</Text>
      </View>
    </View>
  );

  const renderEmptyComponent = (message) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer} showsVerticalScrollIndicator={true}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.chats}
          onPress={() => {
            router.push({ pathname: "/screens/Inbox" });
          }}
        >
          <FontAwesome name="comments" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => {
            navigation.navigate("Notification");
          }}
        >
          <View style={styles.squareBox} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <Text style={styles.searchTitle}>LOOKING FOR...</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
        />

        {/* Freelance Services */}
        <FlatList
          data={filteredFreelanceServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          ListEmptyComponent={() => renderEmptyComponent("No Freelance Services Found")}
        />

        {/* Household Services */}
        <FlatList
          data={filteredHouseholdServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          ListEmptyComponent={() => renderEmptyComponent("No Household Services Found")}
        />

        {/* Job Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Job Notifications</Text>
          <View style={styles.notificationsContainer}>
            <Text style={styles.notificationText}>
              Mike sent an image and a message.
            </Text>
            <Text style={styles.notificationText}>
              Charlie left the conversation.
            </Text>
            <Text style={styles.notificationText}>
              Deadline will expire in 20 mins.
            </Text>
          </View>
        </View>

        {/* What's New */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What's New</Text>
          <View style={styles.whatsNewContainer}>
            <Text style={styles.whatsNewText}>No new updates</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  searchTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#0000001D"
  },
  carousel: {
    marginBottom: 20,
    // backgroundColor: "red",
  },
  serviceCard: {
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 2,
    paddingHorizontal: 10,
    flexDirection: "column",
    borderRadius: 10,
    backgroundColor: "#ffffff", // Optional for better visibility
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    width: 100, // Adjust as needed
    // minHeight: 90, // Ensure space for text below the image
    flexWrap: "wrap",
  },
  serviceTextlay: {
    flex: 1,
    justifyContent: "center",
  },
  serviceText: {
    fontSize: 12, // Adjust font size for better fitting
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: "#000000", // Shadow color
    shadowOffset: { width: 2, height: 4 }, // Shadow position
    shadowOpacity: 0.2, // Shadow transparency (iOS)
    shadowRadius: 12, // Shadow blur (iOS)
    elevation: 6, // Shadow on Android
    // backgroundColor: "#fff", // Necessary for Android shadows
  },

  // sectionContainer: {
  //   marginBottom: 5,
  //   // marginTop: 40
  // },
  // sectionTitle: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: "#fff",
  //   backgroundColor: "#3b006b",
  //   padding: 10,
  //   borderRadius: 10,
  //   textAlign: "center",
  // },
  notificationsContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 5,
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
  stickyButton: {
    // flex: 1,
    // justifyContent: "center",
    // alignContent: "center",
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#3b006b",

  },
});

export default ClientHomeScreen;