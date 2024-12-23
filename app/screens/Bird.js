import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const Bird = () => {
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // Input text
  const [loading, setLoading] = useState(false);

  // Send a new message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    // Add user message to the chat history
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      setLoading(true);

      // Prepare chat history
      const history = messages.map((msg) => msg.text);
      // API request to backend
      const response = await fetch("http://ai.birdearner.com/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, history }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          sender: "bot",
          text: data.answer || "I couldn't process that. Please try again.",
        };

        // Add bot response to the chat
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        throw new Error(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        sender: "bot",
        text: "Oops! Something went wrong. Please try again.",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  // Render individual message
  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, marginHorizontal: 10, paddingTop: 50 },
  chatList: { flex: 1 },
  chatListContainer: { padding: 10 },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
  },
  userMessage: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#f1f1f1",
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16, color: "#000" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#5c2d91",
    borderRadius: 8,
    justifyContent: "center",
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
});

export default Bird;