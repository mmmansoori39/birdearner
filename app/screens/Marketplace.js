import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { appwriteConfig, databases } from "../lib/appwrite";

const colors = {
  Immediate: ["#E22323", "#7C1313"],
  High: ["#896D08", "#EFBE0E"],
  Standard: ["#34660C", "#77CB35"],
};

const maxDist = 6000;

const MarketplaceScreen = ({ navigation }) => {
  const [distance, setDistance] = useState(600);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [jobs, setJobs] = useState({
    Immediate: [],
    High: [],
    Standard: [],
  });
  const [loading, setLoading] = useState(true);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const categorizeJobs = (jobs) => {
    const currentDate = new Date();
    const categorizedJobs = {
      Immediate: [],
      High: [],
      Standard: [],
    };

    jobs.forEach((job) => {
      const deadline = new Date(job.deadline);
      const timeDiff = (deadline - currentDate) / (1000 * 60 * 60 * 24);
      if (timeDiff < 2) {
        categorizedJobs.Immediate.push(job);
      } else if (timeDiff <= 10) {
        categorizedJobs.High.push(job);
      } else {
        categorizedJobs.Standard.push(job);
      }
    });

    return categorizedJobs;
  };

  const fetchJobs = async (filterByLocation = true) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.jobCollectionID
      );
      const allJobs = response.documents;

      if (filterByLocation && location) {
        const filteredJobs = allJobs.filter((job) => {
          const jobDistance = calculateDistance(
            location.latitude,
            location.longitude,
            job.latitude,
            job.longitude 
          );
          return jobDistance <= distance;
        });
        setJobs(categorizeJobs(filteredJobs));
      } else {
        setJobs(categorizeJobs(allJobs));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert(
        "Error",
        "Failed to fetch jobs. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        Alert.alert(
          "Permission Denied",
          "Location permissions are required to use this feature. Please enable them in your device settings."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation.coords);
      fetchJobs(true); // Fetch jobs filtered by location
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Failed to fetch location. Please try again.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (location) {
      fetchJobs(true);
    }
  }, [distance, location]);

  const handlePriorityPress = (priority) => {
    navigation.navigate("JobPriority", { priority, jobs });
  };

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < 70; i++) {
      lines.push(<View key={i} style={styles.line}></View>);
    }
    return lines;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#762BAD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Marketplace</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.distanceText}>{distance} km</Text>

          <View style={styles.customSliderWrapper}>
            <TouchableOpacity
              onPress={() => setDistance(Math.max(0, distance - 1))}
              style={styles.iconButton}
            >
              <Entypo name="circle-with-minus" size={24} color="black" />
            </TouchableOpacity>

            <LinearGradient
              colors={["#898686", "#232222"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sliderBackground}
              onStartShouldSetResponder={(e) => {
                const { locationX } = e.nativeEvent;
                const percentage = (locationX / 307) * 100;
                const newDistance = Math.min(
                  maxDist,
                  Math.max(0, (percentage / 100) * maxDist)
                );
                setDistance(parseInt(newDistance));
                return true;
              }}
            >
              <View style={styles.linesContainer}>{renderLines()}</View>

              <View
                style={[
                  styles.sliderIndicator,
                  { left: `${(distance / 100) * 100}%` },
                ]}
              >
                <Text style={styles.sliderIndicatorText}>▼</Text>
              </View>
            </LinearGradient>

            <TouchableOpacity
              onPress={() => setDistance(Math.min(maxDist, distance + 1))}
              style={styles.iconButton}
            >
              <Entypo name="circle-with-plus" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sliderLabel}>
            Scroll the wheel to adjust job area
          </Text>
        </View>

        {/* <MapView
          style={styles.map}
          region={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : {
                  latitude: 37.7749,
                  longitude: -122.4194,
                  latitudeDelta: 1.0,
                  longitudeDelta: 1.0,
                }
          }
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Our Location"
              description="This is our current location"
              pinColor="blue"
            />
          )}

          {jobs.Immediate.map((job, index) => (
            <Marker
              key={`immediate-${index}`}
              coordinate={{
                latitude: job.latitude,
                longitude: job.longitude,
              }}
              title={job.title}
              description={job.description}
              pinColor="red"
            />
          ))}

          {jobs.High.map((job, index) => (
            <Marker
              key={`high-${index}`}
              coordinate={{
                latitude: job.latitude,
                longitude: job.longitude,
              }}
              title={job.title}
              description={job.description}
              pinColor="orange"
            />
          ))}


          {jobs.Standard.map((job, index) => (
            <Marker
              key={`standard-${index}`}
              coordinate={{
                latitude: job.latitude,
                longitude: job.longitude,
              }}
              title={job.title}
              description={job.description}
              pinColor="green"
            />
          ))}
        </MapView> */}

        <Text style={styles.jobsAround}>Jobs around...</Text>

        <View style={styles.priorityContainer}>
          <TouchableOpacity
            style={styles.priorityBox}
            onPress={() => handlePriorityPress("Immediate")}
          >
            <LinearGradient
              colors={colors.Immediate}
              style={styles.priorityButton}
            >
              <Text style={styles.priorityText}>Immediate Attention</Text>
              <Text style={styles.prioritySubText}>
                {jobs.Immediate.length}+ Jobs
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.priorityBox}
            onPress={() => handlePriorityPress("High")}
          >
            <LinearGradient colors={colors.High} style={styles.priorityButton}>
              <Text style={styles.priorityText}>High Priority</Text>
              <Text style={styles.prioritySubText}>
                {jobs.High.length}+ Jobs
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.priorityBox}
            onPress={() => handlePriorityPress("Standard")}
          >
            <LinearGradient
              colors={colors.Standard}
              style={styles.priorityButton}
            >
              <Text style={styles.priorityText}>Standard Priority</Text>
              <Text style={styles.prioritySubText}>
                {jobs.Standard.length}+ Jobs
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LinearGradient
        colors={["#762BAD", "#300E49"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.allJobsContainer}
      >
        <TouchableOpacity style={styles.allJobsButton}>
          <Text style={styles.allJobsText}>All Jobs</Text>
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
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sliderContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  distanceText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customSliderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 370,
    height: 24,
    backgroundColor: "transparent",
  },
  iconButton: {},
  sliderBackground: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 307,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#232222",
    position: "relative",
  },
  linesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  line: {
    width: 1,
    height: "100%",
    backgroundColor: "#898686",
  },
  sliderIndicator: {
    position: "absolute",
    top: -10,
    alignItems: "center",
  },
  sliderIndicatorText: {
    fontSize: 12,
    color: "#000",
  },
  sliderLabel: {
    color: "#6f28d4",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  map: {
    width: "100%",
    height: 220,
    marginVertical: 20,
  },
  jobsAround: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  priorityContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  priorityBox: {
    width: "100%",
  },
  priorityButton: {
    width: "100%",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 34,
    marginBottom: 12,
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 7,
  },
  priorityText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 20,
  },
  prioritySubText: {
    color: "#fff",
    fontSize: 14,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center"
  }
});

export default MarketplaceScreen;
