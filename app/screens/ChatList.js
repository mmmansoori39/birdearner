import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { appwriteConfig, databases } from "../lib/appwrite";
import { useAuth } from "../context/AuthContext";

const ChatList = ({ navigation }) => {
  const [chatThreads, setChatThreads] = useState([]); // List of chat threads
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  console.log({ role: userData.role });

  // Load chat threads
  useEffect(() => {
    const fetchChatThreads = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.messageCollectionID, // Assume chat threads are stored here

          [
            `{"method":"or","values":[{"method":"equal","attribute":"sender","values":["${userData.$id}"]},{"method":"equal","attribute":"receiver","values":["${userData.$id}"]}]}`,
          ]
        );
        console.log("response.documents");
        console.log(response.documents);

        // getting receiver data
        const uniqueReceivers = [
          ...new Set(response.documents.map((doc) => doc.receiver)),
        ];
        const uniqueSenders = [
          ...new Set(response.documents.map((doc) => doc.sender)),
        ];

        const uniqueUsers = [
          ...new Set([...uniqueReceivers, ...uniqueSenders]),
        ].filter((userId) => userId !== userData.$id);
        console.log("Unique users:", uniqueUsers);
        

        const oppositeParticipants = await Promise.all(
          uniqueUsers.map(async (oppositeParticipant) => {
            try {
              const response = await databases.getDocument(
            appwriteConfig.databaseId,
            userData.role === "freelancer"
              ? appwriteConfig.clientCollectionId
              : appwriteConfig.freelancerCollectionId,
            oppositeParticipant
              );
              return response;
            } catch (error) {
              console.error(
            `Failed to fetch receiver with ID ${oppositeParticipant}:`,
            error
              );
              return null;
            }
          })
        ).then((results) => results.filter((result) => result !== null));

        console.log("Receiver data:", oppositeParticipants);

        const chatThreads = response.documents.map((doc) => {
          const oppositeParticipant = oppositeParticipants.find(
            (oppositeParticipant) => oppositeParticipant.$id === doc.receiver ||oppositeParticipant.$id === doc.sender 
          );
          return {
            ...doc,
            oppositeParticipantId:  oppositeParticipant.$id, 
            oppositeParticipantName: oppositeParticipant ? oppositeParticipant.full_name : "Unknown",
            senderName: oppositeParticipant ? oppositeParticipant.full_name : "Unknown",
            receiverName: oppositeParticipant ? oppositeParticipant.full_name : "Unknown",
            profileImage: oppositeParticipant ? oppositeParticipant.profile_photo : null,
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
  const openChat = (receiverId) => {
    navigation.navigate("Chat", { receiverId });
  };

  console.log("Chat threads:", chatThreads);
  

  // Render individual chat thread
  const renderChatThread = ({ item }) => {
    const issender = item.sender === userData.$id;
    const receiverId = issender ? item.receiver : item.sender;
    const oppositeParticipantName = item.oppositeParticipantName;
    const oppositeParticipantId = item.oppositeParticipantId;

    return (
      <TouchableOpacity
        style={styles.chatThread}
        onPress={() => openChat(oppositeParticipantId)}
      >
        <Text style={styles.receiverName}>{oppositeParticipantName}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
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
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  receiverName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  lastMessage: { fontSize: 14, color: "#666", marginTop: 5 },
  timestamp: { fontSize: 12, color: "#aaa", marginTop: 5 },
});

export default ChatList;
