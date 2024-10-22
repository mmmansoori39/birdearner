import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function ReviewCard({
  reviewerName,
  reviewerLocation,
  starRating,
  reviewText,
}) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.card} >
        <View style={styles.reviewHeader}>
          <Image
            source={require("../assets/userProfile.png")}
            style={styles.reviewerImage}
          />
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewerName}>{reviewerName}</Text>
            <Text style={styles.reviewerLocation}>{reviewerLocation}</Text>
            <View style={styles.starRating}>
              {Array(starRating)
                .fill()
                .map((_, index) => (
                  <FontAwesome
                    key={index}
                    name="star"
                    size={20}
                    color="#4B0082"
                  />
                ))}
            </View>
          </View>
        </View>
        <FontAwesome
          name="flag"
          size={20}
          color="black"
          style={styles.flagIcon}
        />
      </View>
      <Text style={styles.reviewText}>{reviewText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  reviewerInfo: {
    marginLeft: 10,
  },
  reviewerName: {
    fontWeight: "600",
    fontSize: 16,
  },
  reviewerLocation: {
    color: "#888",
    fontSize: 14,
  },
  starRating: {
    flexDirection: "row",
    marginTop: 3,
    gap: 5,
  },
  reviewText: {
    marginTop: 10,
    color: "#555",
    fontSize: 14,
    // paddingHorizontal: 10
  },
});
