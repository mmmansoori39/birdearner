import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { appwriteConfig, databases } from "../lib/appwrite";
import { useNavigation } from "expo-router";

const HomeScreen = () => {
  const { user, userData, setUserData } = useAuth();
  const [profilePercentage, setProfilePercentage] = useState(20);
  const [flagsCount, setFlagsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [CompletedOrders, setCompletedOrders] = useState(0)
  const [activeOrders, setActiveOrders] = useState(0)
  const [cancelledOrders, setCancelledOrdersOrders] = useState(0)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchOrderRecords = async () => {
      try {
        const cancelledOrders = userData?.cancelled_jobs.length
        const assignedJobs = userData?.assigned_jobs        

        setCancelledOrdersOrders(cancelledOrders)

        if (userData?.assigned_jobs.length === 0) {
          setActiveOrders(0)
          setCompletedOrders(0)
        } else {
          const jobPromises = assignedJobs.map((jobId) =>
            databases.getDocument(appwriteConfig.databaseId, appwriteConfig.jobCollectionID, jobId)
          );

          const jobs = await Promise.all(jobPromises);

          const completedCount = jobs.filter((job) => job.completed_status === true).length;
          const activeCount = jobs.filter((job) => job.completed_status === false || job.completed_status === null).length;

          setCompletedOrders(completedCount);
          setActiveOrders(activeCount);
        }

      } catch (error) {
        throw error
      }
    }

    fetchOrderRecords()
  }, [refreshing])


  useEffect(() => {
    let percentage = 0;

    if (userData?.full_name) percentage = 20;
    if (userData?.country) percentage = 40;
    if (userData?.gender) percentage = 70;
    if (userData?.terms_accepted) percentage = 100;

    setProfilePercentage(percentage);

    if (userData?.flags && Array.isArray(userData?.flags)) {
      setFlagsCount(userData?.flags.length);
    }

  }, [userData]);

  const handleCompleteProfile = () => {
    const fullName = userData.full_name
    const email = userData.email
    const password = userData.password
    const role = userData.role

    if (profilePercentage < 20) {
      navigation.navigate("DescribeRoleCom", {fullName, email, password, role})
    } else if (profilePercentage >= 20 && profilePercentage < 40) {
      navigation.navigate("DescribeRoleCom", {fullName, email, password, role})
    } else if (profilePercentage >= 40 && profilePercentage < 70) {
      navigation.navigate("TellUsAboutYouCom", {role})
    } else if (profilePercentage >= 70 && profilePercentage < 100) {
      navigation.navigate("PortfolioCom", {role})
    }
  };

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

  return (
    <SafeAreaView >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.safeContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b006b"]}
            progressBackgroundColor="#fff"
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.notificationIcon} onPress={() => {
            navigation.navigate("Notification")
          }} >
            <MaterialIcons name="notifications" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          {/* Make sure to wrap dynamic content with Text component */}
          <Text style={styles.usernameText}>
            {user ? `${userData?.full_name}` : "User"}
          </Text>
        </View>
        
        {/* Your Statistics Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>70%</Text>
                <Text style={styles.statLabel}>Success Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1 hr</Text>
                <Text style={styles.statLabel}>Avg. Response time</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{flagsCount || "NA"}</Text>
              <Text style={styles.statLabel}>Flags</Text>
            </View>
            <View style={styles.statsBox}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData?.rating || "NA"}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData?.level || 1}</Text>
                <Text style={styles.statLabel}>Your Level</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Your Earnings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Earnings</Text>
          <View style={styles.earningsContainer}>
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>Rs. {userData?.totalEarnings || "0"} </Text>
              <Text style={styles.earningLabel}>Total Earnings</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>Rs. {userData?.monthlyEarnings || "0"}</Text>
              <Text style={styles.earningLabel}>Monthly</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>{userData?.outstandingAmount || "0"}</Text>
              <Text style={styles.earningLabel}>Outstanding Amount</Text>
            </View>
            <View style={styles.earningItem}>
              <TouchableOpacity onPress={() => navigation.navigate("Profile", { screen: "Withdrawal Earning" })}>
              <Text style={styles.earningValue}>Rs. {userData?.withdrawableAmount || "0"}</Text>
              </TouchableOpacity>
              <Text style={styles.earningLabel}>For Withdrawal</Text>
            </View>
          </View>
        </View>

        {/* Your Orders Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Orders</Text>
          <View style={styles.ordersContainer}>
            <View style={styles.orderItem}>
              <Text style={styles.orderValue}>{CompletedOrders || 0}</Text>
              <Text style={styles.orderLabel}>Orders Completed</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderValue}>{activeOrders || 0}</Text>
              <Text style={styles.orderLabel}>Active Orders</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderValue}>{cancelledOrders || 0}</Text>
              <Text style={styles.orderLabel}>Cancelled Orders</Text>
            </View>
          </View>
        </View>


        {
          !userData?.terms_accepted && profilePercentage !== 100 && (
            <View style={styles.sectionContainer}>
              <View style={styles.profileContainers}>
                <Text style={styles.profileText}>Complete Your Profile</Text>
                <Text style={styles.whatsNewText}>Your profile is {profilePercentage}% complete</Text>
                <View style={styles.boxColor}>
                  <View style={profilePercentage >= 20 ? styles.redBox : styles.pBoxColor}></View>
                  <View style={profilePercentage >= 40 ? styles.redBox : styles.pBoxColor}></View>
                  <View style={profilePercentage >= 70 ? styles.yellowBox : styles.pBoxColor}></View>
                  <View style={profilePercentage >= 70 ? styles.yellowBox : styles.pBoxColor}></View>
                  <View style={profilePercentage === 100 ? styles.greenBox : styles.pBoxColor}></View>
                  <View style={profilePercentage === 100 ? styles.greenBox : styles.pBoxColor}></View>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleCompleteProfile} F>
                  <Text style={styles.loginButtonText}>Complete Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What's New</Text>
          <View style={styles.whatsNewContainer}>
            {/* You can add new content here */}
            <Text style={styles.whatsNewText}>No updates</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.stickyButton}>
        <TouchableOpacity style={styles.chatIcon} onPress={() => navigation.navigate("Chatlist")}>
          <FontAwesome name="comments" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    // flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b006b",
  },
  usernameText: {
    fontSize: 18,
    color: "#3b006b",
  },
  notificationIcon: {
    backgroundColor: "#3b006b",
    padding: 10,
    borderRadius: 50,
    position: "absolute",
    right: 10,

  },
  sectionContainer: {
    marginBottom: 20,
  },
  profileContainers: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginTop: 12,
    // justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
    borderBottomRightRadius: 20,
    // marginHorizontal: 20,
    gap: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  profileText: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center"
  },
  boxColor: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    marginHorizontal: 20
  },
  pBoxColor: {
    backgroundColor: "#CCD2CE",
    height: 12,
    width: 48,
    borderRadius: 12
  },
  redBox: {
    backgroundColor: "#FF3131",
    height: 12,
    width: 48,
    borderRadius: 12
  },
  yellowBox: {
    backgroundColor: "#CEBF1D",
    height: 12,
    width: 48,
    borderRadius: 12
  },
  greenBox: {
    backgroundColor: "#00871E",
    height: 12,
    width: 48,
    borderRadius: 12
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4B0082",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#3b006b",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    textAlign: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  statsContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    paddingVertical: 20,
    gap: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  statsBox: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    gap: 15
  },
  statItem: {
    alignItems: "center",
    // width: "1%",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b006b",
  },
  statLabel: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  earningsContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "space-between",
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  earningItem: {
    alignItems: "center",
    width: "45%",
  },
  earningValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b006b",
  },
  earningLabel: {
    fontSize: 12,
    color: "#000",
  },
  ordersContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  orderItem: {
    alignItems: "center",
    width: "30%",
  },
  orderValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b006b",
  },
  orderLabel: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  whatsNewContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginTop: 12,
    marginBottom: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  whatsNewText: {
    fontSize: 16,
    color: "#000",
  },
  stickyButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#3b006b",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  chatIcon: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
});

export default HomeScreen;
