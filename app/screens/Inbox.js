import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { appwriteConfig, databases } from "../lib/appwrite";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const Inbox = ({ navigation }) => {
  const [chatThreads, setChatThreads] = useState([]); // List of chat threads
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  // Load chat threads
  useEffect(() => {
    const fetchChatThreads = async () => {
      setLoading(true);
      try {
        // Fetch all messages involving the user
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.messageCollectionID,
          [
            `{"method":"or","values":[{"method":"equal","attribute":"sender","values":["${userData.$id}"]},{"method":"equal","attribute":"receiver","values":["${userData.$id}"]}]}`,
          ]
        );

        // Extract unique combinations of participants and projectId
        const uniqueThreads = [
            ...new Set(
              response.documents.map((doc) => {
                const participants = [doc.sender, doc.receiver].sort().join("-");
                return `${doc.projectId}-${participants}`;
              })
            ),
          ];
          
          

        // Fetch data for participants in the threads
        const oppositeParticipants = await Promise.all(
          uniqueThreads.map(async (thread) => {
            const [projectId, sender, receiver] = thread.split("-");
            const otherUserId =
              sender === userData.$id ? receiver : sender;

            try {
              const response = await databases.getDocument(
                appwriteConfig.databaseId,
                userData.role === "freelancer"
                  ? appwriteConfig.clientCollectionId
                  : appwriteConfig.freelancerCollectionId,
                otherUserId
              );
              return { projectId, otherUserId, participant: response };
            } catch (error) {
              console.error(
                `Failed to fetch receiver with ID ${otherUserId}:`,
                error
              );
              return null;
            }
          })
        ).then((results) => results.filter((result) => result !== null));

        // Fetch project titles for each thread
        const projectTitles = await Promise.all(
          uniqueThreads.map(async (thread) => {
            const [projectId] = thread.split("-");
            
            try {
              const projectData = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.jobCollectionID,
                projectId
              );
              
              return { projectId, title: projectData.title, projectData };
            } catch (error) {
              console.error(`Failed to fetch project data for ${projectId}:`, error);
              return { projectId, title: "Untitled" };
            }
          })
        );

        // Map threads to the latest message, participant info, and project title
        const chatThreads = uniqueThreads.map((thread) => {
          const [projectId, sender, receiver] = thread.split("-");
          const userMessages = response.documents.filter(
            (doc) =>
              doc.projectId === projectId &&
              ((doc.sender === sender && doc.receiver === receiver) ||
                (doc.sender === receiver && doc.receiver === sender))
          );

          // Get the latest message for the thread
          const latestMessage = userMessages.reduce(
            (latest, current) =>
              new Date(current.timestamp) > new Date(latest.timestamp)
                ? current
                : latest,
            userMessages[0]
          );

          const oppositeParticipant = oppositeParticipants.find(
            (participant) =>
              participant.projectId === projectId &&
              participant.otherUserId ===
                (sender === userData.$id ? receiver : sender)
          );

          const projectTitle = projectTitles.find(
            (project) => project.projectId === projectId
          );
          

          return {
            projectId,
            ...latestMessage,
            lastMessage: latestMessage
              ? latestMessage.text
              : "No messages yet",
            oppositeParticipantId: oppositeParticipant
              ? oppositeParticipant.otherUserId
              : null,
            oppositeParticipantName: oppositeParticipant
              ? oppositeParticipant.participant.full_name
              : "Unknown",
            profileImage: oppositeParticipant
              ? oppositeParticipant.participant.profile_photo
              : null,
            projectData: projectTitle,
          };
        });

        setChatThreads(chatThreads);
      } catch (err) {
        console.error("Error fetching chat threads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThreads();
  }, [userData.$id]);

  // Navigate to individual chat
  const openChat = (receiverId, full_name, profileImage, projectId) => {
    navigation.navigate("Chat", { receiverId, full_name, profileImage, projectId });
  };

  const renderChatThread = ({ item }) => {
      
      const projectData = item.projectData
      console.log(projectData);
    
    return (
      <View>
        <TouchableOpacity
          style={styles.jobContainer}
          onPress={() =>
            openChat(
              item.oppositeParticipantId,
              item.oppositeParticipantName,
              item.profileImage,
              item.projectId
            )
          }
        >
          <Image
            source={
              item.profileImage
                ? { uri: item.profileImage }
                : require("../assets/profile.png")
            }
            style={styles.avatar}
          />
          <View style={styles.jobContent}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {projectData.title} {/* Show the project title */}
            </Text>
            <Text style={styles.jobStatus}>@{item.oppositeParticipantName}: {item.lastMessage}</Text>
          </View>
          <View
            style={[styles.statusIndicator, { backgroundColor: "red" }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Inbox</Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={chatThreads}
          keyExtractor={(item) =>
            `${item.projectId}-${item.oppositeParticipantId}`
          }
          renderItem={renderChatThread}
          contentContainerStyle={styles.chatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" ,
    paddingHorizontal: 20,},
  main: {
    marginTop: 25,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    gap: 100,
    alignItems: "center"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: { textAlign: "center", marginTop: 20, color: "#888" },
  chatListContainer: { padding: 10 },
  chatThread: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#e0e0e0", // Fallback background for images
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
  },
  receiverName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  lastMessage: { fontSize: 14, color: "#666", marginTop: 1, marginBottom: 5 },
  timestamp: {
    fontSize: 12,
    color: "#aaa",
    alignSelf: "flex-start",
  },

  jobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    // padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    height: 70
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  jobContent: {
    flex: 1,
    paddingRight: 6
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A4CAE',
  },
  jobStatus: {
    fontSize: 14,
    color: '#6D6D6D',
  },
  statusIndicator: {
    width: 10,
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 350
  }
});

export default Inbox;
