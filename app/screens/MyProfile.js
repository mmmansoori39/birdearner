import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Share,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, loading, userData } = useAuth();
  const [data, setData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
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
          <TouchableOpacity style={styles.tabButtonL}>
            <Text style={styles.tabTextL}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButtonR}
            onPress={() => {
              navigation.navigate("MyReview");
            }}
          >
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

        <Text style={styles.Profile_heading}>
          {role === "client"
            ? `Company Name: ${data?.company_name}`
            : data?.profile_heading}
        </Text>

        <Text style={styles.about}>About myself</Text>
        <Text style={styles.about_des}>{data.profile_description}</Text>

        {/* Portfolio Section */}
        {role === "freelancer" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <View style={styles.portfolioImages}>
              {data?.portfolio_images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.portfolioImage}
                />
              ))}
            </View>
          </View>
        )}

        {/* Experience & Certifications */}
        {role === "freelancer" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Text style={styles.sectionContent}>
              {data?.experience} months of experience
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Certifications
            </Text>
            {data?.certifications.map((cert, index) => (
              <Text key={index} style={styles.sectionContent}>
                {cert}
              </Text>
            ))}
          </View>
        )}

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <Text style={styles.buttonText}>Edit Your Profile</Text>
        </TouchableOpacity>

        {/* Deactivate Account Link */}
        <TouchableOpacity>
          <Text style={styles.deactivateLink}>Deactivate your account!</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
  },
  tabButtonL: {
    backgroundColor: "#5732a8",
    width: "50%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 80,
  },
  tabButtonR: {
    backgroundColor: "#DADADA",
    width: "50%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 80,
  },
  tabTextL: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabTextR: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },

  backgroundImg: {
    width: "100%",
    height: 150,
    // justifyContent: "center",
    // alignItems: "center",
    // paddingTop: 20,
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionContent: {
    color: "#333",
    marginTop: 5,
  },
  portfolioImages: {
    flexDirection: "row",
    marginTop: 10,
  },
  portfolioImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 6,
  },
  editProfileButton: {
    backgroundColor: "#5732a8",
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  deactivateLink: {
    textAlign: "center",
    color: "#5732a8",
    marginBottom: 20,
  },
  Profile_heading: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
    fontStyle: "italic",
    fontSize: 13,
  },
  about: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
    fontSize: 17,
  },
  about_des: {
    textAlign: "justify",
    marginTop: 10,
    fontWeight: "400",
    fontSize: 13,
    paddingHorizontal: 25,
  },
});
