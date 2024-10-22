import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

export default function ProfileScreen() {
  const navigation = useNavigation();

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
          source={require("../assets/backGroungBanner.png")}
          style={styles.backgroundImg}
        >
          <Image
            source={require("../assets/userProfile.png")}
            style={styles.profileImage}
          />
          <View style={styles.share}>
            <FontAwesome name="share" size={24} />
          </View>
        </ImageBackground>

        <View style={styles.userDetails}>
          <Text style={styles.nameText}>John Smith</Text>
          <Text style={styles.roleText}>Graphic Designer</Text>
          <Text style={styles.statusText}>
            Status: Active{" "}
            <FontAwesome name="circle" size={12} color="#6BCD2F" />
          </Text>
        </View>

        {/* Experience & Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.sectionContent}>
            Company 1 - Graphic Designer
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Certifications
          </Text>
          <Text style={styles.sectionContent}>Certification 1</Text>
        </View>

        {/* Portfolio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <View style={styles.portfolioImages}>
            <Image
              source={require("../assets/portfolio_img1.png")}
              style={styles.portfolioImage}
            />
            <Image
              source={require("../assets/portfolio_img2.png")}
              style={styles.portfolioImage}
            />
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editProfileButton}>
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
    width: 80,
    height: 80,
    marginRight: 10,
  },
  editProfileButton: {
    backgroundColor: "#5732a8",
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
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
});
