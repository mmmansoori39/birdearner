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
  const { full_name, profileImage, projectId, receiverId } = route.params;
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // Input text
  const [selectedMessage, setSelectedMessage] = useState(null); // Store selected message for delete
  const { userData } = useAuth();
  const flatListRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [deadlineTimer, setDeadlineTimer] = useState("");
  const [characterLimit, setCharacterLimit] = useState(0);
  const [projectStatus, setProjectStatus] = useState("pending");
  const [job, setJob] = useState(null);

  // console.log(job.assigned_freelancer);


  const [timeLeft, setTimeLeft] = useState("00D 00H 00M 00S");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.jobCollectionID,
          projectId
        );
        setJob(response);
      } catch (err) {
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, characterLimit]);

  useEffect(() => {
    const timer = setInterval(() => {
      const deadline = new Date(job?.deadline);

      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("00d 00h 00m 00s");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [characterLimit, job]);

  useEffect(() => {
    const calculateTotalCharacters = () => {
      const totalCharacters = messages
        .filter((message) => message.sender === userData.$id) // Filter messages sent by the current user
        .reduce((sum, message) => sum + (message.text?.length || 0), 0); // Sum up the character lengths

      // Set the remaining character limit
      const maxCharacters = 200; // Maximum allowed characters
      setCharacterLimit(Math.max(maxCharacters - totalCharacters, 0)); // Ensure limit doesn't go negative
    };

    calculateTotalCharacters();
  }, [messages, userData.$id]);


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
                Query.equal("projectId", projectId),
              ]),
              Query.and([
                Query.equal("sender", receiverId),
                Query.equal("receiver", userData.$id),
                Query.equal("projectId", projectId),
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
            sender: userData.$id,
            receiver: receiverId,
            projectId: projectId,
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


  // Handle Accept/Reject actions
  const handleAccept = async () => {
    try {
      await databases.updateDocument(appwriteConfig.databaseId,
        appwriteConfig.jobCollectionID, projectId, {
        assigned_freelancer: receiverId,
      });
      setCharacterLimit(null);
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
        <Text style={[styles.message, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>{item.text}</Text>
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
        <View style={styles.headerData}>
          <Text style={styles.profile}>Tap for contact details</Text>
          <Text style={styles.username}>@{full_name}</Text>
          <Text style={styles.profile}>Last online 3 hrs ago</Text>

          {userData.role === "client" ? (
            job?.assigned_freelancer === null ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.deadline}>Deadline Timer</Text>
                <View style={styles.deadlineTimerContainer}>
                  {timeLeft.split(" ").map((timePart, index) => {
                    const unit = timePart.slice(-1);
                    const value = timePart.slice(0, -1);

                    return (
                      <View key={index} style={styles.timeBox}>
                        <Text style={styles.timeText}>{value}</Text>
                        <Text style={styles.unitText}>{unit.toUpperCase()}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )
          ) : (
            <View>
              <Text style={styles.deadline}>Deadline Timer</Text>
              <View style={styles.deadlineTimerContainer}>
                {timeLeft.split(" ").map((timePart, index) => {
                  const unit = timePart.slice(-1);
                  const value = timePart.slice(0, -1);

                  return (
                    <View key={index} style={styles.timeBox}>
                      <Text style={styles.timeText}>{value}</Text>
                      <Text style={styles.unitText}>{unit.toUpperCase()}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

        </View>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)} >
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
        {showMenu && (
          // <Modal
          //   transparent={true}
          //   animationType="slide"
          //   onRequestClose={() => setShowMenu(false)}
          // >

          // </Modal>
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
        )}
      </View>

      {job?.assigned_freelancer === null && (
        <View style={styles.limit}>
          <Text style={styles.limitchar}>Characters Limit: {characterLimit}/200</Text>
          <Text style={styles.limitvar}>Please accept this lead to remove the characters limit.</Text>
          {characterLimit === 0 && (
            <Text style={styles.limitvar}>
              You have reached the character limit. Please accept the project to remove the limit.
            </Text>
          )}
        </View>
      )}

      {job?.assigned_freelancer !== userData.$id && job?.assigned_freelancer !== null && userData.role === "freelancer" && (
        <View style={styles.limit}>
          <Text style={styles.limitchar}>Already assigned to someone</Text>
          {/* <Text style={styles.limitvar}>Please accept this lead to remove the characters limit.</Text>
          {characterLimit === 0 && (
            <Text style={styles.limitvar}>
              You have reached the character limit. Please accept the project to remove the limit.
            </Text>
          )} */}
        </View>
      )}

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
          maxLength={characterLimit || undefined}
          editable={characterLimit > 0}
        />
        {/* || job.assigned_freelancer !== null */}
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
  header: {
    padding: 15,
    // backgroundColor: "#f4f4f4",
    alignItems: "center",
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  headerData: {
    // padding: 15,
    alignItems: "center",
    flex: 0,
    flexDirection: "column",
  },
  profile: { fontSize: 12, fontWeight: "400", color: "#000000" },
  username: { fontSize: 24, fontWeight: "600", color: "#5c2d91", paddingVertical: 4 },
  deadline: { fontSize: 15, fontWeight: "500", color: "#000000", paddingTop: 6, textAlign: "center" },
  lastOnline: { fontSize: 12, color: "#888" },
  deadlineTimer: { fontSize: 12, color: "#888" },
  chatList: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    marginHorizontal: 15,
    borderRadius: 10
  },
  chatListContainer: { padding: 10 },
  messageContainer: {
    marginVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 6
  },
  currentUserMessage: {
    backgroundColor: "#DADADA",
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    backgroundColor: "#4C0183",
    alignSelf: "flex-start",
    color: "#fff"
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
  actionButtons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, gap: 55, marginTop: 25 },
  acceptButton: { backgroundColor: "#4C0183", paddingHorizontal: 22, paddingVertical: 7, borderRadius: 20 },
  rejectButton: { backgroundColor: "#A00B0B", paddingHorizontal: 22, paddingVertical: 7, borderRadius: 20 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600", },

  limit: {
    flex: 0,
    backgroundColor: "#F1F1F1",
    marginHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 20,
  },

  limitchar: {
    color: "#464646", textAlign: "center", fontSize: 12, fontWeight: "600",
  },
  limitvar: {
    color: "#464646", textAlign: "center", fontSize: 10, fontWeight: "400",
  },

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
    zIndex: 2334
  },
  menuItem: { paddingVertical: 10 },
  menuItemText: { fontSize: 16, color: "black" },

  deadlineTimerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  timeBox: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#000000",
    marginHorizontal: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // White text
  },
  unitText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // White text
  },


  // actionButtons: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  // acceptButton: { backgroundColor: "#4C0183", padding: 10, borderRadius: 5 },
  // rejectButton: { backgroundColor: "#A00B0B", padding: 10, borderRadius: 5 },
  // buttonText: { color: "#fff", textAlign: "center" },
  // messageContainer: { padding: 10, backgroundColor: "#eaeaea", marginVertical: 5, borderRadius: 5 },
  // messageText: { fontSize: 14 },
  // input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  // sendButton: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5 },


});

export default Chat;