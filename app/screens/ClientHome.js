import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
  Alert
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { household_service, freelance_service } from "../lib/roleData";
import { useAuth } from "../context/AuthContext";
import { appwriteConfig, databases } from "../lib/appwrite";
import { Query } from "react-native-appwrite";
import { differenceInDays } from 'date-fns';

const placeholderImageURL = "https://picsum.photos/seed/";

const categorizeJobs = (jobs) => {
  const today = new Date();

  return jobs.map((job) => {
    const deadline = new Date(job.deadline);
    const daysRemaining = differenceInDays(deadline, today);

    let color;

    if (daysRemaining < 0) {
      color = '#000';
    } else if (daysRemaining <= 2) {
      color = '#FF3B30';
    } else if (daysRemaining <= 10) {
      color = '#FFCC00';
    } else {
      color = '#34C759';
    }

    return {
      ...job,
      color,
    };
  });
};


const RenderServiceItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.serviceCard}>
      <View style={styles.imageShadow}>
        <Image source={{ uri: item.image }} style={styles.serviceImage} />
      </View>
      <View style={styles.serviceTextlay}>
        <Text style={styles.serviceText} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));

const ClientHomeScreen = () => {
  const [search, setSearch] = useState("");
  const router = useRouter()
  const [filteredFreelanceServices, setFilteredFreelanceServices] = useState([]);
  const [filteredHouseholdServices, setFilteredHouseholdServices] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [freelanceProfile, setFreelanceProfile] = useState([])
  const [profilePercentage, setProfilePercentage] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const { userData, setUserData } = useAuth();
  const navigation = useNavigation()

  useEffect(() => {
    let percentage = 0;

    if (userData?.full_name) percentage = 20;
    if (userData?.country) percentage = 40;
    if (userData?.profile_photo) percentage = 70;
    if (userData?.terms_accepted) percentage = 100;


    setProfilePercentage(percentage);
  }, [userData, refreshing]);

  const sendTitle = (item) => {
    const title = item.title;
    const freelancerType = item.id;

    navigation.navigate("Job Requirements", { title, freelancerType });
  };

  useEffect(() => {
    const fetchOngoingJobs = async () => {
      try {
        const clientId = userData?.$id;
        if (!clientId) throw new Error("Client ID is undefined!");

        const projectDocs = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.jobCollectionID,
          [Query.equal("job_created_by", clientId)]
        );

        const onGoingJobs = projectDocs.documents.filter(
          (job) => job.completed_status === false || job.assigned_freelancer
        );

        const freelancePromises = onGoingJobs.map((freelance) =>
          databases.getDocument(appwriteConfig.databaseId, appwriteConfig.freelancerCollectionId, freelance.assigned_freelancer)
        );

        const freelanceProfiles = await Promise.allSettled(freelancePromises);

        const validProfiles = freelanceProfiles
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        const jobsWithColor = categorizeJobs(onGoingJobs);

        // Mapping combined data with job details and freelancer profiles
        const combinedData = validProfiles.map((profile) => {
          const correspondingJob = jobsWithColor.find(
            (job) => job.assigned_freelancer === profile.$id
          );

          return {
            ...profile,
            jobDetails: correspondingJob || null,
            color: correspondingJob?.color || "#D3D3D3",
          };
        });

        // Limiting to maximum 3 ongoing jobs
        const maxOngoingJobs = jobsWithColor.slice(0, 3);

        let emptySlots = [];

        if (maxOngoingJobs.length < 3) {
          const remainingEmptySlots = 3 - maxOngoingJobs.length;

          // Add empty slots based on how many jobs we have
          emptySlots = Array(remainingEmptySlots).fill({
            jobDetails: null,
            full_name: "?",
            profile_photo: placeholderImageURL,
            color: "#D3D3D3", // Placeholder for empty slots
          });
        }

        // Ensuring combinedData always has exactly 3 entries
        const finalData = [...combinedData, ...emptySlots].slice(0, 3);

        setOngoingJobs(jobsWithColor);
        setCombinedData(finalData);

      } catch (error) {
        console.error("Error fetching ongoing jobs:", error.message);
      }
    };

    fetchOngoingJobs();
  }, [refreshing]);


  const handleCompleteProfile = () => {
    if (userData) {  // Check if userData is not null
      const fullName = userData.full_name
      const email = userData.email
      const password = userData.password
      const role = userData.role

      if (profilePercentage < 20) {
        navigation.navigate("DescribeRoleCom", { fullName, email, password, role })
      } else if (profilePercentage >= 20 && profilePercentage < 40) {
        navigation.navigate("DescribeRoleCom", { fullName, email, password, role })
      } else if (profilePercentage >= 40 && profilePercentage < 70) {
        navigation.navigate("TellUsAboutYouCom", { role })
      } else if (profilePercentage >= 70 && profilePercentage < 100) {
        navigation.navigate("PortfolioCom", { role })
      }
    }
  };


  const openChat = (receiverId, full_name, profileImage, projectId) => {
    navigation.navigate("Chat", { receiverId, full_name, profileImage, projectId });
  };


  useEffect(() => {
    const freelanceData = freelance_service.map((service) => ({
      title: service,
      image: `${placeholderImageURL}${encodeURIComponent(service)}/160/160`,
      id: service,
    }));
    setFilteredFreelanceServices(freelanceData);

    const householdData = household_service.map((service) => ({
      title: service,
      image: `${placeholderImageURL}${encodeURIComponent(service)}/160/160`,
      id: service,
    }));
    setFilteredHouseholdServices(householdData);
  }, [refreshing]);

  useEffect(() => {
    const flagsData = async () => {
      if (userData) {
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

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      // Reset the services if search text is empty
      setFilteredFreelanceServices(
        freelance_service.map((service) => ({
          title: service,
          image: `${placeholderImageURL}${encodeURIComponent(service)}/160/160`,
          id: service,
        }))
      );
      setFilteredHouseholdServices(
        household_service.map((service) => ({
          title: service,
          image: `${placeholderImageURL}${encodeURIComponent(service)}/160/160`,
          id: service,
        }))
      );
    } else {
      // Filter services based on search text
      const filteredFreelance = freelance_service
        .filter((service) =>
          service.toLowerCase().includes(text.toLowerCase())
        )
        .map((service) => ({
          title: service,
          image: `${placeholderImageURL}${encodeURIComponent(service)}/160/160`,
          id: service,
        }));

      const filteredHousehold = household_service
        .filter((service) =>
          service.toLowerCase().includes(text.toLowerCase())
        )
        .map((service) => ({
          title: service,
          image: `${placeholderImageURL}${encodeURIComponent(service)}/160/160`,
          id: service,
        }));

      setFilteredFreelanceServices(filteredFreelance);
      setFilteredHouseholdServices(filteredHousehold);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };


  const renderService = useCallback(
    ({ item }) => <RenderServiceItem item={item} onPress={sendTitle} />,
    []
  );


  return (
    <SafeAreaView style={styles.safeContainer} showsVerticalScrollIndicator={true}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b006b"]}
            progressBackgroundColor="#fff"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.wraptext}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.how}>How’s the day!</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => {
              navigation.navigate("Notification");
            }}
          >
            <Image source={
              userData?.profile_photo ? { uri: userData.profile_photo } : require("../assets/profile.png")
            }
              style={styles.serviceImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={styles.ongoingJobsContainer}>
      <Text style={styles.ongoingTitle}>Your Ongoing Jobs</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.StoryContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Job Requirements")}>
          <View style={styles.addStory}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>

        {combinedData.length > 0 ? (
          combinedData.map((item, index) => {
            const { jobDetails, full_name, profile_photo, color } = item;
            const freelancerId = jobDetails?.assigned_freelancer || null;
            const jobId = jobDetails?._id || null;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => openChat(freelancerId, full_name, profile_photo, jobId)}
              >
                <View style={styles.ongoingStory}>
                  <View
                    style={[
                      styles.profileImgContainer,
                      { backgroundColor: color || '#D3D3D3' },
                    ]}
                  >
                    <Image
                      source={{ uri: profile_photo || placeholderImageURL }}
                      style={styles.profileImg}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.noJobsText}>No ongoing jobs</Text>
        )}
      </ScrollView>
    </View>



        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={search}
            onChangeText={handleSearch}
            autoFocus={false}
          />
        </View>

        <View>
          {/* Freelance Services */}
          <FlatList
            data={filteredFreelanceServices}
            renderItem={renderService}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: 200,
              offset: 200 * index,
              index,
            })}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Freelance Services Found</Text>
              </View>
            )}
          />

          {/* Household Services */}
          <FlatList
            data={filteredHouseholdServices}
            renderItem={renderService}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: 200,
              offset: 200 * index,
              index,
            })}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Household Services Found</Text>
              </View>
            )}
          />
        </View>


        {/* Job Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Job Notifications</Text>
          <View style={styles.notificationsContainer}>
            <View style={styles.notificationsBox}>
              {["Job 1"].map((job, index) => (
                <View
                  key={index}
                  style={[
                    styles.notiItem,
                    { borderWidth: 4, borderColor: index % 2 === 0 ? "#F81919" : "#1DCE44", borderRadius: 50 }
                  ]}
                >
                  <Image
                    source={{ uri: `${placeholderImageURL}${index}/100/100` }}
                    style={styles.storyImage}
                  />
                </View>
              ))}
              <View style={styles.notiTextLay}>
                <Text style={styles.notiText} numberOfLines={2} ellipsizeMode="tail">
                  Jack234 has sent you 2 files.
                </Text>
              </View>
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
            <Text style={styles.whatsNewText}>No new updates</Text>
          </View>
        </View>

        <View style={styles.stickyButton}>
          <TouchableOpacity
            style={styles.chats}
            onPress={() => {
              navigation.navigate("Inbox")
            }}
          >
            <FontAwesome name="comments" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    // paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    marginTop: 30,
    // backgroundColor: "red",
    padding: 4,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 40,
    fontWeight: "600",
  },
  how: {
    fontSize: 18,
    fontWeight: "300",
  },
  squareBox: {
    backgroundColor: "#5DE895",
    padding: 14,
  },
  searchContainer: {
    marginHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 35,
    marginBottom: 24
  },
  searchInput: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    borderRadius: 35,
    marginVertical: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    width: "100%",
    height: "100%"
  },
  carousel: {
    marginBottom: 20,
    paddingHorizontal: 20
  },
  serviceCard: {
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 2,
    // paddingHorizontal: 15,
    flexDirection: "column",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    width: 100,
    flexWrap: "wrap",
    gap: 5
  },
  serviceTextlay: {
    flex: 1,
    justifyContent: "center",
  },
  serviceText: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    flexWrap: "wrap",
  },
  serviceImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    shadowColor: "#000000", // Shadow color
    shadowOffset: { width: 2, height: 4 }, // Shadow position
    shadowOpacity: 0.2, // Shadow transparency (iOS)
    shadowRadius: 4, // Shadow blur (iOS)
    elevation: 3,
  },
  notificationsContainer: {
    backgroundColor: "#fff",
    padding: 10,
    // borderRadius: 10,
    marginTop: 12,
    marginHorizontal: 20,
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
  notificationText: {
    fontSize: 14,
    marginBottom: 12,
  },
  notificationsBox: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  notiText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
    lineHeight: 25,
  },
  notiTextLay: {
    flex: 1,

  },
  sectionContainer: {
    marginBottom: 20,
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
    marginHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  whatsNewContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginTop: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomRightRadius: 20,
    marginHorizontal: 20,
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
  profileContainers: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginTop: 12,
    // justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
    borderBottomRightRadius: 20,
    marginHorizontal: 20,
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
  whatsNewText: {
    fontSize: 16,
    color: "#000",
  },
  stickyButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#3b006b",
    // position: "absolute",
    // bottom: 20,
    // right: 20,
    marginLeft: 310,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  chats: {
    // backgroundColor: "#3b006b",
    padding: 1,
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  line: {
    backgroundColor: "#5F5959",
    width: "90%",
    height: 1,
    margin: "auto"
  },

  ongoingJobsContainer: {
    marginVertical: 20,
  },
  ongoingTitle: {
    fontSize: 17,
    fontWeight: "480",
    marginLeft: 44
  },
  storyItem: {
    marginRight: 10,
    marginVertical: 12
  },
  StoryContainer: {
    paddingLeft: 35,
    paddingRight: 20
  },
  storyImage: { width: 74, height: 74, borderRadius: 50 },
  addStory: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginVertical: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    alignContent: "center"
  },
  addText: { fontSize: 60, color: "#A39E9E" },
  profileContainer: { padding: 15, backgroundColor: "#f9f9f9", borderRadius: 10 },

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
    borderRadius: 25,
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

});

export default ClientHomeScreen;