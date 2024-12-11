import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { databases } from "../lib/appwrite";
import { Query } from "appwrite";

const ProjectChatScreen = ({ route, navigation }) => {
  const { projectId, clientId, freelancerId } = route.params; // Get IDs from navigation params
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [characterLimit, setCharacterLimit] = useState(200);
  const [projectStatus, setProjectStatus] = useState("pending");
  const [deadlineTimer, setDeadlineTimer] = useState("02d 04h 12m 25s");
  const [showMenu, setShowMenu] = useState(false);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await databases.listDocuments(
        "databaseId",
        "messagesCollectionId",
        [
          Query.equal("projectId", projectId),
          Query.or([
            Query.and([Query.equal("sender", clientId), Query.equal("receiver", freelancerId)]),
            Query.and([Query.equal("sender", freelancerId), Query.equal("receiver", clientId)]),
          ]),
        ]
      );
      setMessages(response.documents);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Handle message sending
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await databases.createDocument(
        "databaseId",
        "messagesCollectionId",
        {
          sender: clientId, // or freelancerId
          receiver: freelancerId, // or clientId
          projectId,
          message: input.trim(),
          timestamp: new Date().toISOString(),
        }
      );
      setInput("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Handle Accept/Reject actions
  const handleAccept = async () => {
    try {
      await databases.updateDocument("databaseId", "projectsCollectionId", projectId, {
        status: "accepted",
      });
      setCharacterLimit(null); // Remove character limit
      setProjectStatus("accepted");
    } catch (err) {
      console.error("Error accepting project:", err);
    }
  };

  const handleReject = async () => {
    try {
      await databases.updateDocument("databaseId", "projectsCollectionId", projectId, {
        status: "rejected",
      });
      navigation.goBack(); // Go back to the previous screen
    } catch (err) {
      console.error("Error rejecting project:", err);
    }
  };

  // Handle dropdown menu actions
  const handleMenuAction = (action) => {
    switch (action) {
      case "Job Details":
        Alert.alert("Job Details", "Details of the job can be viewed here.");
        break;
      case "Mark Unread":
        Alert.alert("Marked Unread", "The chat has been marked as unread.");
        break;
      case "Star":
        Alert.alert("Starred", "The chat has been starred.");
        break;
      case "Delete":
        Alert.alert("Deleted", "The chat has been deleted.");
        break;
      case "Block":
        Alert.alert("Blocked", "The user has been blocked.");
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@jake.eo1</Text>
        <Text style={styles.lastOnline}>Last online 3 hrs ago</Text>
        {projectStatus === "accepted" && (
          <>
            <Text style={styles.deadlineTimer}>Deadline Timer: {deadlineTimer}</Text>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <Text style={styles.menuButtonText}>⋮</Text>
            </TouchableOpacity>
            {showMenu && (
              <Modal
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowMenu(false)}
              >
                <View style={styles.menuContainer}>
                  {["Job Details", "Mark Unread", "Star", "Delete", "Block"].map((action) => (
                    <TouchableOpacity
                      key={action}
                      style={styles.menuItem}
                      onPress={() => handleMenuAction(action)}
                    >
                      <Text style={styles.menuItemText}>{action}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Modal>
            )}
          </>
        )}
      </View>

      {projectStatus === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message..."
        maxLength={characterLimit || undefined}
        editable={characterLimit !== 200 || projectStatus === "accepted"}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  header: { alignItems: "center", marginBottom: 10 },
  username: { fontSize: 18, fontWeight: "bold" },
  lastOnline: { fontSize: 12, color: "gray" },
  deadlineTimer: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  menuButton: { position: "absolute", right: 10, top: 10 },
  menuButtonText: { fontSize: 24, color: "black" },
  menuContainer: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: { paddingVertical: 10 },
  menuItemText: { fontSize: 16, color: "black" },
  actionButtons: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  acceptButton: { backgroundColor: "green", padding: 10, borderRadius: 5 },
  rejectButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
  messageContainer: { padding: 10, backgroundColor: "#eaeaea", marginVertical: 5, borderRadius: 5 },
  messageText: { fontSize: 14 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  sendButton: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5 },
});

export default ProjectChatScreen;
