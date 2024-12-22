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
  RefreshControl,
  Alert
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import ReviewCard from "../components/ReviewCard";
import reviews from "../assets/data";
import { useAuth } from "../context/AuthContext";
import { appwriteConfig, databases } from "../lib/appwrite";

export default function ReviewsScreen({ navigation }) {
  const { user, loading, userData, setUserData } = useAuth();
  const [data, setData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const role = userData?.role


  useEffect(() => {
    try {
      setData(userData)
    } catch (error) {
      console.error("Failed to fetch freelancer data:", error);
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

useEffect(() => {
    const flagsData = async () => {
      if(userData){
        try {
          const freelancerId = userData?.$id;
  
          const collectionId = userData?.role === "client" ? appwriteConfig.clientCollectionId : appwriteConfig.freelancerCollectionId
  
  
          const freelancerDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            collectionId,
            freelancerId
          );
          setUserData(freelancerDoc)
        } catch (error) {
          Alert.alert("Error updating flags:", error)
        }
      }
      }

    flagsData()
  }, [refreshing])

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onShare = async () => {
    try {
      const profileLink = `https://birdearner.com/profile/${userData.$id}`;

      const result = await Share.share({
        message: `Check out my profile on our app! Name: ${data?.full_name}\n\nProfile Link: ${profileLink}`,
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
      <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b006b"]}
            progressBackgroundColor="#fff"
          />
        }
      >
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
            data?.cover_photo ? { uri: data.cover_photo } : require("../assets/backGroungBanner.png")
          }
          style={styles.backgroundImg}
        >
          <Image
            source={
              data?.profile_photo ? { uri: data.profile_photo } : require("../assets/profile.png")
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
          {role === "client" ? (
            <Text style={styles.roleText}>{data?.organization_type}</Text>
          ) : (
            <View style={styles.roleWrap}>
              {data?.role_designation?.map((item, idx) => (
                <Text key={idx} style={styles.roleText}>
                  {item}
                  {", "}
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.statusText}>
            Status:
            {data?.currently_available ? "Active" : "Inactive"}
            <FontAwesome name="circle" size={12} color="#6BCD2F" />
          </Text>
        </View>

        <View style={styles.reviewSection}>
          {reviews?.map((review, index) => (
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
  roleWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
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
