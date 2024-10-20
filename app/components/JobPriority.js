import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { jobsData } from "../assets/data";

const colors = {
  Immediate: ["#E22323", "#7C1313"],
  High: ["#896D08", "#EFBE0E"],
  Standard: ["#34660C", "#77CB35"],
};



const JobPriority = () => {
  const { priority } = useLocalSearchParams();
  const [jobs, setJobs] = useState([]);

  const currentColors = colors[priority] || ["#000", "#333"];

  useEffect(() => {
    if (priority) {
      const selectedJobs = jobsData[priority]?.jobs || [];
      setJobs(selectedJobs);
    }
  }, [priority]);

  const renderJobs = () => {
    return jobs.map((job, index) => (
      <View key={index} style={styles.jobCard}>
        <Image
          source={require("../assets/profile.png")}
          style={styles.profileImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobDetails}>
            Budget: {job.budget} Deadline: {job.deadline}
          </Text>
          <Text style={styles.jobDescription}>{job.description}</Text>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>JOBS</Text>

        <View style={styles.priorityContainer}>
          <TouchableOpacity>
            <LinearGradient
              colors={currentColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.priorityButton}
            >
              <Text style={styles.priorityText}>
                {" "}
                {priority} {priority === "Immediate" ? "Attention" : "Priority"}{" "}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {renderJobs()}
      </ScrollView>

      <LinearGradient
        colors={currentColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.allJobsContainer}
      >
        <TouchableOpacity style={styles.allJobsButton} onPress={() => {
            router.back()
        }} >
          <Text style={styles.allJobsText}>
            {priority} {priority === "Immediate" ? "Attention" : "Priority"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "normal",
    textAlign: "center",
    marginBottom: 15,
    color: "#988C8C",
  },
  priorityContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  priorityButton: {
    width: 355,
    padding: 8,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  priorityText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 24,
  },
  prioritySubText: {
    color: "#fff",
    fontSize: 14,
  },
  jobsAround: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  jobCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  jobDetails: {
    fontSize: 14,
    color: "#666",
  },
  jobDescription: {
    fontSize: 12,
    color: "#999",
    flexShrink: 1,
  },
  allJobsContainer: {
    alignItems: "center",
    width: 450,
    height: 450,
    borderRadius: 300,
    position: "absolute",
    bottom: -380,
    right: -30,
    padding: 10,
  },
  allJobsButton: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  allJobsText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "semibold",
  },
});

export default JobPriority;
