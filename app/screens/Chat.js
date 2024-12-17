import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from "react-native";
import { appwriteConfig, databases } from "../lib/appwrite";
import { useAuth } from "../context/AuthContext";
import { Query } from "react-native-appwrite";
import { Ionicons } from "@expo/vector-icons";

const Chat = ({ route, navigation }) => {
  const { receiverId, full_name, profileImage } = route.params;
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // Input text
  const [selectedMessage, setSelectedMessage] = useState(null); // Store selected message for delete
  const { userData } = useAuth();
  const flatListRef = useRef();

  // Fetch messages with polling
  useEffect(() => {
    const fetchMessages = async () => {
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

        // Sort messages by timestamp
        const sortedMessages = response.documents.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    // Initial fetch
    fetchMessages();

    // Polling every 2 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [receiverId, userData.$id]);

  // Scroll to bottom whenever messages are updated
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.messageCollectionID,
        messageId
      );
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.$id !== messageId)
      );
      setSelectedMessage(null); // Close modal after deletion
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  // Render individual message
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === userData.$id;

    // Long press handler to show delete confirmation modal
    const handleLongPress = () => {
      setSelectedMessage(item);
    };

    return (
      <TouchableOpacity
        onLongPress={handleLongPress}
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <Text style={styles.message}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  // Modal for delete confirmation
  const renderDeleteConfirmation = () => (
    <Modal
      transparent={true}
      animationType="fade"
      visible={selectedMessage !== null}
      onRequestClose={() => setSelectedMessage(null)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this message?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => deleteMessage(selectedMessage.$id)}
            >
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSelectedMessage(null)}
            >
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/profile.png")
          }
          style={styles.profileImage}
        />
        <View style={styles.headerData}>
          <Text style={styles.username}>@{full_name}</Text>
          <Text style={styles.lastOnline}>Last online 3 hrs ago</Text>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        ref={flatListRef}
        keyExtractor={(item) => item.$id}
        renderItem={renderMessage}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContainer}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {/* Input Box */}
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

      {/* Delete Confirmation Modal */}
      {renderDeleteConfirmation()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 15, backgroundColor: "#f4f4f4", alignItems: "center", flex: 0, flexDirection: "row" },
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#e0e0e0", // Fallback background for images
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#5c2d91",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Chat;