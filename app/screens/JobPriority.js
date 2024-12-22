import React, { useEffect, useState } from "react";
import { router } from "expo-router";
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
import { appwriteConfig, databases } from "../lib/appwrite";

const colors = {
  Immediate: ["#E22323", "#7C1313"],
  High: ["#896D08", "#EFBE0E"],
  Standard: ["#34660C", "#77CB35"],
};

const JobPriority = ({ route, navigation }) => {
  const { priority, jobs } = route.params;

  const [priorityJob, setPriorityJob] = useState([]);
  const [clientProfiles, setClientProfiles] = useState({});
  const [clientName, setClientName] = useState({});

  const currentColors = colors[priority] || ["#000", "#333"];

  useEffect(() => {
    if (priority === "Immediate") {
      const selectedJobs = jobs.Immediate || [];
      setPriorityJob(selectedJobs);
    } else if (priority === "High") {
      const selectedJobs = jobs.High || [];
      setPriorityJob(selectedJobs);
    } else if (priority === "Standard") {
      const selectedJobs = jobs.Standard || [];
      setPriorityJob(selectedJobs);
    }

  }, [priority]);

  useEffect(() => {
    priorityJob.forEach((job) => {
      getProfile(job.job_created_by);
    });
  }, [priorityJob]);

  const getProfile = async (id) => {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.clientCollectionId,
        id
      );
      const profile = response;
      setClientProfiles((prevProfiles) => ({
        ...prevProfiles,
        [id]: profile.profile_photo,
      }));

      setClientName((prevProfiles) => ({
        ...prevProfiles,
        [id]: profile.full_name,
      }));
    } catch (error) {
      console.error("Error fetching client profile:", error);
    }
  };

  const formatDeadline = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = Math.ceil(
      (deadlineDate - currentDate) / (1000 * 60 * 60 * 24)
    );
    return timeDiff > 0 ? `${timeDiff} days` : "Deadline passed";
  };

  const formatBudget = (budget) => {
    return budget >= 1000
      ? `${(budget / 1000).toFixed(budget % 1000 === 0 ? 0 : 1)}k`
      : `${budget}`;
  };

  const renderJobs = () => {
    return priorityJob.map((job, index) => {
      const clientProfileImage = clientProfiles[job.job_created_by];
      const full_name = clientName[job.job_created_by]


      return (
        <View key={index}>
          <TouchableOpacity
            style={styles.jobCard}
            onPress={() => {
              navigation.navigate("JobDescription", { job, clientProfileImage, full_name });
            }}
          >
            {/* Displaying the client's profile image */}
            <Image
              source={{ uri: clientProfileImage || "../assets/profile.png" }}
              style={styles.profileImage}
            />
            <View style={{ flex: 1, paddingVertical: 2 }}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobDetails}>
                Budget: ₹{formatBudget(job.budget)} Deadline:{" "}
                {formatDeadline(job.deadline)}
              </Text>
              <Text style={styles.jobDescription} numberOfLines={2}>
                {job.description}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                {priority} {priority === "Immediate" ? "Attention" : "Priority"}
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
        <TouchableOpacity
          style={styles.allJobsButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
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
    paddingTop: 30
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
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
    fontSize: 22,
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
    // padding: 15,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 100,
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
