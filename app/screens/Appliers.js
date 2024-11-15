import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { appwriteConfig, databases } from "../lib/appwrite";

const AppliersScreen = ({ navigation, route }) => {
  const { userData } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { title, freelancersId, color } = route.params;

  useEffect(() => {
    if (freelancersId.length === 0) {
      setLoading(false);
      return;
    }

    const fetchFreelancers = async () => {
      try {
        // Fetch freelancer profiles by IDs
        const freelancerProfiles = await Promise.all(
          freelancersId.map(async (id) => {
            try {
              const response = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.freelancerCollectionId, // Replace with your actual collection ID for freelancers
                id
              );
              return response;
            } catch (error) {
              console.error(`Failed to fetch freelancer with ID ${id}:`, error);
              return null;
            }
          })
        );

        // Filter out null profiles in case of errors
        const validProfiles = freelancerProfiles.filter(
          (profile) => profile !== null
        );
        setFreelancers(validProfiles);
      } catch (error) {
        console.error("Failed to fetch freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const renderAppliedFreelancer = ({ item }) => (
    <View>
      <TouchableOpacity style={styles.jobContainer}>
        <Image
          source={{
            uri: item.profile_photo || "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
        <View style={styles.jobContent}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.freelancerName}>Name: {item.full_name || "N/A"}</Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: color }]} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b006b" />
        <Text>Loading freelancers...</Text>
      </View>
    );
  }

  if (freelancersId.length === 0) {
    return (
      <View style={styles.noAppliersContainer}>
        <Text style={styles.noAppliersText}>
          There are no appliers for this job.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Appliers</Text>
      </View>
      <FlatList
        data={freelancers}
        renderItem={renderAppliedFreelancer}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  backButton: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  noAppliersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noAppliersText: { fontSize: 18, color: "#6e6e6e", marginBottom: 20 },
  goBackText: { fontSize: 16, marginLeft: 8, color: "black" },
  main: {
    marginTop: 65,
    marginBottom: 30,
    display: "flex",
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  jobContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    // padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    height: 70,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  jobContent: {
    flex: 1,
    paddingRight: 6,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5A4CAE",
  },
  jobStatus: {
    fontSize: 14,
    color: "#6D6D6D",
  },
  statusIndicator: {
    width: 10,
    height: "100%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 350,
  },
});

export default AppliersScreen;
