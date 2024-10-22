import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import ReviewCard from "../components/ReviewCard";

export default function ReviewsScreen() {
  const navigation = useNavigation();

  // Dummy data for reviews
  const reviews = [
    {
      reviewerName: "Josaph Niloy",
      reviewerLocation: "United States of America",
      starRating: 5,
      reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
    },
    {
      reviewerName: "Alina Broke",
      reviewerLocation: "Canada",
      starRating: 5,
      reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
    },
    {
        reviewerName: "Josaph Niloy",
        reviewerLocation: "United States of America",
        starRating: 5,
        reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
      },
      {
        reviewerName: "Alina Broke",
        reviewerLocation: "Canada",
        starRating: 5,
        reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
      },
      {
        reviewerName: "Josaph Niloy",
        reviewerLocation: "United States of America",
        starRating: 5,
        reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
      },
      {
        reviewerName: "Alina Broke",
        reviewerLocation: "Canada",
        starRating: 5,
        reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
      },
      {
        reviewerName: "Josaph Niloy",
        reviewerLocation: "United States of America",
        starRating: 5,
        reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
      },
      {
        reviewerName: "Alina Broke",
        reviewerLocation: "Canada",
        starRating: 5,
        reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
      },
  ];

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
