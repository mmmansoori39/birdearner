import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Share,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import ReviewCard from "../components/ReviewCard";
import { reviews } from "../assets/data";
import { useAuth } from "../context/AuthContext";
import { Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "../lib/appwrite";

export default function ReviewsScreen() {
  const navigation = useNavigation();
  const { user, loading, role } = useAuth();
  const [data, setata] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (role === "client") {
      fetchClientProfileByEmail(user.email);
    } else {
      fetchFreelancerProfileByEmail(user.email);
    }
  }, [user]);

  const fetchFreelancerProfileByEmail = async (email) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.freelancerCollectionId,
        [Query.equal("email", email)]
      );
      console.log(response.documents[0]);
      if (response.documents) {
        setata(response.documents[0]);
      } else {
        console.error("No freelancer found with the provided email.");
      }
    } catch (error) {
      console.error("Failed to fetch freelancer data:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchClientProfileByEmail = async (email) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.clientCollectionId,
        [Query.equal("email", email)]
      );
      console.log(response.documents[0]);
      if (response.documents) {
        setata(response.documents[0]);
      } else {
        console.error("No freelancer found with the provided email.");
      }
    } catch (error) {
      console.error("Failed to fetch freelancer data:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out my profile on our app! Name: ${data?.full_name}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with specific activity
          console.log("Shared with activity:", result.activityType);
        } else {
          // shared without specific activity
          console.log("Profile shared successfully.");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share the profile.");
    }
  };

  if (loading || loadingProfile) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.tab}>
          <TouchableOpacity
            style={styles.tabButtonL}
            onPress={() => {
              navigation.navigate("MyProfile");
            }}
          >
            <Text style={styles.tabTextL}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButtonR}>
            <Text style={styles.tabTextR}>My Reviews</Text>
          </TouchableOpacity>
        </View>

        <ImageBackground
          source={
            { uri: data?.cover_photo } ||
            require("../assets/backGroungBanner.png")
          }
          style={styles.backgroundImg}
        >
          <Image
            source={
              { uri: data?.profile_photo } ||
              require("../assets/userProfile.png")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.settings}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <MaterialIcons name="settings" size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.share} onPress={onShare}>
            <FontAwesome name="share" size={24} />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.userDetails}>
          <Text style={styles.nameText}>{data?.full_name}</Text>
          <Text style={styles.roleText}>
            {role === "client"
              ? data?.organization_type
              : data?.role_designation}
          </Text>
          <Text style={styles.statusText}>
            Status:
            {data?.currently_available ? "Active" : "Inactive"}
            <FontAwesome name="circle" size={12} color="#6BCD2F" />
          </Text>
        </View>

        <View style={styles.reviewSection}>
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              reviewerName={review.reviewerName}
              reviewerLocation={review.reviewerLocation}
              starRating={review.starRating}
              reviewText={review.reviewText}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  tab: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
  },
  tabButtonL: {
    backgroundColor: "#DADADA",
    width: "50%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 80,
  },
  tabButtonR: {
    backgroundColor: "#5732a8",
    width: "50%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 80,
  },
  tabTextL: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabTextR: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  backgroundImg: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    bottom: -20,
    left: "38%",
  },
  share: {
    position: "absolute",
    bottom: 5,
    right: 80,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  settings: {
    position: "absolute",
    bottom: 5,
    right: 20,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  nameText: {
    fontSize: 28,
    fontWeight: "600",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "400",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewSection: {
    padding: 20,
  },
});
