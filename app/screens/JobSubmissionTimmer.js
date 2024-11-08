import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const TOTAL_TIME = 30; // Total countdown time in seconds

const JobSubmissionTimmerScreen = ({ navigation }) => {
  const [seconds, setSeconds] = useState(TOTAL_TIME);
  const [progress, setProgress] = useState(1); // Start with a full circle

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      // Update progress as seconds decrease
      setProgress(seconds / TOTAL_TIME);

      return () => clearInterval(interval);
    }
  }, [seconds]);

  const handleSubmit = () => {
    navigation.navigate("HomeScreen");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const strokeDashoffset = 251.2 * (1 - progress); // Adjust arc based on progress

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Job Submission</Text>

      <View style={styles.timerWrapper}>
        <Svg width="150" height="150" viewBox="0 0 100 100">
          {/* Background Circle */}
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#ddd"
            strokeWidth="10"
            fill="none"
          />
          {/* Animated Progress Circle */}
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#4B0082"
            strokeWidth="10"
            strokeDasharray="251.2" // Circumference of the circle
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            rotation="-90" // Start at the top
            origin="50, 50"
          />
        </Svg>
        <Text style={styles.timerText}>{seconds}</Text>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        // disabled={seconds > 0}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5A4CAE",
    marginBottom: 40,
  },
  timerWrapper: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  timerText: {
    position: "absolute",
    fontSize: 32,
    fontWeight: "bold",
    color: "#5A4CAE",
  },
  submitButton: {
    backgroundColor: "#4B0082",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 15,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#6D6D6D",
    fontSize: 16,
  },
});

export default JobSubmissionTimmerScreen;
