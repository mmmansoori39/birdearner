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
import { useRouter } from "expo-router";

const ChatList = ({ navigation }) => {
  const [chatThreads, setChatThreads] = useState([]); // List of chat threads
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const router = useRouter()

  // Load chat threads
  useEffect(() => {
    const fetchChatThreads = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.messageCollectionID,
          [
            `{"method":"or","values":[{"method":"equal","attribute":"sender","values":["${userData.$id}"]},{"method":"equal","attribute":"receiver","values":["${userData.$id}"]}]}`,
          ]
        );

        // Extract unique participants (excluding the current user)
        const uniqueUsers = [
          ...new Set(
            response.documents.flatMap((doc) => [doc.sender, doc.receiver])
          ),
        ].filter((userId) => userId !== userData.$id);

        // Fetch data for unique users
        const oppositeParticipants = await Promise.all(
          uniqueUsers.map(async (userId) => {
            try {
              const response = await databases.getDocument(
                appwriteConfig.databaseId,
                userData.role === "freelancer"
                  ? appwriteConfig.clientCollectionId
                  : appwriteConfig.freelancerCollectionId,
                userId
              );
              return response;
            } catch (error) {
              console.error(
                `Failed to fetch receiver with ID ${userId}:`,
                error
              );
              return null;
            }
          })
        ).then((results) => results.filter((result) => result !== null));

        // Map unique users to the latest message and participant info
        const chatThreads = uniqueUsers.map((userId) => {
          const userMessages = response.documents.filter(
            (doc) => doc.sender === userId || doc.receiver === userId
          );

          // Get the latest message for the user
          const latestMessage = userMessages.reduce(
            (latest, current) =>
              new Date(current.timestamp) > new Date(latest.timestamp)
                ? current
                : latest,
            userMessages[0]
          );

          const oppositeParticipant = oppositeParticipants.find(
            (participant) => participant.$id === userId
          );

          console.log("last massage", latestMessage)

          return {
            ...latestMessage,
            lastMessage: latestMessage
              ? latestMessage.text
              : "No messages yet",
            oppositeParticipantId: userId,
            oppositeParticipantName: oppositeParticipant
              ? oppositeParticipant.full_name
              : "Unknown",
            profileImage: oppositeParticipant
              ? oppositeParticipant.profile_photo
              : null,
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
  const openChat = (receiverId, full_name, profileImage) => {
    // navigation.navigate("Chat", { receiverId, full_name, profileImage });
    router.push({pathname: "/screens/Chat", params: {receiverId, full_name, profileImage}})
  };

  const renderChatThread = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatThread}
        onPress={() => openChat(item.oppositeParticipantId, item.oppositeParticipantName, item.profileImage)}
      >
        <View style={styles.profileSection}>
          <Image
            source={
              item.profileImage
                ? { uri: item.profileImage }
                : require("../assets/profile.png") // Fallback to a default profile image
            }
            style={styles.profileImage}
          />
          <View style={styles.textSection}>
            <Text style={styles.receiverName}>
              {item.oppositeParticipantName}
            </Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={chatThreads}
          keyExtractor={(item) => item.$id}
          renderItem={renderChatThread}
          contentContainerStyle={styles.chatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 15,
    backgroundColor: "#5c2d91",
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
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
});

export default ChatList;
