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
  Modal,
  RefreshControl
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import ImageViewer from "react-native-image-zoom-viewer";
import { appwriteConfig, databases } from "../lib/appwrite";

export default function ProfileScreen({ navigation }) {
  const { user, loading, userData, logout, setUserData } = useAuth();
  const [data, setData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState([]);
  const role = userData?.role;

  useEffect(() => {
    try {
      setData(userData);
    } catch (error) {
      console.error("Failed to fetch freelancer data:", error);
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    const flagsData = async () => {
      try {
        const freelancerId = userData.$id;
        const freelancerDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          freelancerId
        );

        setUserData(freelancerDoc)

      } catch (error) {
        console.error("Error updating flags:", error);
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

  const openImageModal = (imageUri) => {

    setImages([{ url: imageUri }]);
    setModalVisible(true);
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

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close on back button
      >
        <ImageViewer
          imageUrls={images} // Array of images
          enableSwipeDown={true} // Swipe down to close
          onSwipeDown={() => setModalVisible(false)}
          renderIndicator={() => null}
          renderHeader={() => (
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                position: "absolute",
                top: 30,
                left: 20,
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 20,
                padding: 10,
              }}
            >
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        />
      </Modal>


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
          <TouchableOpacity onPress={() => openImageModal(data?.profile_photo)}>
            <Image
              source={
                { uri: data?.profile_photo } || require("../assets/profile.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settings}
            onPress={() => {
              navigation.navigate('Settings');
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
            {userData.currently_available === true ? " Active " : " Inactive "}
            {userData.currently_available === true ? (<FontAwesome name="circle" size={12} color="#6BCD2F" />)
              : (<FontAwesome name="circle" size={12} color="#FF3131" />)}
          </Text>
        </View>

        <View style={styles.levelContainer}>
          <View style={styles.xpRan}>
            <View style={styles.xp}>
              <Text style={styles.xpText}>{userData.XP} xp</Text>
            </View>
            <Text style={styles.randomText}>Earn xp and promote to next level</Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.levelText}>Lev. {userData.level}</Text>
          </View>
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
                <TouchableOpacity key={index} onPress={() => openImageModal(image)}>
                  <Image
                    source={{ uri: image }}
                    style={styles.portfolioImage}
                  />
                </TouchableOpacity>
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
        <TouchableOpacity onPress={() => {
          logout()
        }} >
          <Text style={styles.deactivateLink}>Log out</Text>
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
    top: 82,
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
    marginTop: 10,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
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
    marginTop: 40,
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
  levelContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 40,
    marginVertical: 12,
    position: "relative"
  },
  xpRan: {
    backgroundColor: "#D9D9D9",
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    // gap: 8
  },
  xp: {
    backgroundColor: "#56118F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  xpText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff"
  },
  randomText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#A1A1A1",
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  level: {
    backgroundColor: "#56118F",
    paddingHorizontal: 6,
    paddingVertical: 15,
    borderRadius: 50,
    position: "absolute",
    right: 0,
    top: "-10"
  },
  levelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  }

});
