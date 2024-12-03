import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { appwriteConfig, databases } from "../lib/appwrite";
import { useAuth } from "../context/AuthContext";
import { Query } from "react-native-appwrite";

const Chat = ({ route, navigation }) => {
  const { receiverId } = route.params;
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // Input text
  const [loading, setLoading] = useState(false);
  const [receiverData, setReceiverData] = useState(null);
  const { userData } = useAuth();

  console.log("Receiver ID:", receiverId);
  console.log("User id:", userData.$id);

  console.log("Messages:", messages);
  

  // Load messages from Appwrite databases
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.messageCollectionID,
          [
            Query.or([
              Query.and([
                Query.equal("sender", userData.$id),
                Query.equal("receiver", receiverId),
              ]),
              Query.and([
                Query.equal("sender", receiverId),
                Query.equal("receiver", userData.$id),
              ]),
            ]),
          ]
        );

        // get receiver data
        const responseReceiver = await databases.getDocument(
          appwriteConfig.databaseId,
          userData.role === "freelancer"
            ? appwriteConfig.clientCollectionId
            : appwriteConfig.freelancerCollectionId,
          receiverId
        );
        setReceiverData(responseReceiver);
        

        setMessages(response.documents);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userData.$id, receiverId]);

  // Send a new message
  const sendMessage = async () => {
    if (input.trim()) {
      try {
        const newMessage = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.messageCollectionID,
          "unique()",
          {
            text: input,
            sender: userData.$id, // Current user (sender)
            receiver: receiverId, // ID of the recipient
            timestamp: new Date().toISOString(),
          }
        );
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  // Render individual message
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === userData.$id;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <Text style={styles.message}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@{receiverData.full_name}</Text>
        <Text style={styles.lastOnline}>Last online 3 hrs ago</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={renderMessage}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 15, backgroundColor: "#f4f4f4", alignItems: "center" },
  username: { fontSize: 18, fontWeight: "bold", color: "#5c2d91" },
  lastOnline: { fontSize: 12, color: "#888" },
  chatList: { flex: 1 },
  chatListContainer: { padding: 10 },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  currentUserMessage: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    backgroundColor: "#f1f1f1",
    alignSelf: "flex-start",
  },
  sender: { fontWeight: "bold", color: "#5c2d91" },
  message: { marginTop: 5, color: "#000" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#5c2d91",
    borderRadius: 5,
  },
  sendButtonText: { color: "#fff" },
});

export default Chat;
