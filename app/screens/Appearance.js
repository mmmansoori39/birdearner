import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const AppearanceScreen = ({ navigation }) => {
  const { theme, toggleTheme, themeStyles } = useTheme();
  const currentTheme = themeStyles[theme];

  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: currentTheme.text }]}>
          Appearance
        </Text>
      </View>

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            theme === "light" && { backgroundColor: currentTheme.primary },
          ]}
          onPress={() => handleThemeChange("light")}
        >
          {theme === "light" && <View style={styles.radioInner} />}
        </TouchableOpacity>
        <Text style={[styles.radioText, { color: currentTheme.text }]}>Light Theme</Text>
      </View>

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            theme === "dark" && { backgroundColor: currentTheme.primary },
          ]}
          onPress={() => handleThemeChange("dark")}
        >
          {theme === "dark" && <View style={styles.radioInner} />}
        </TouchableOpacity>
        <Text style={[styles.radioText, { color: currentTheme.text }]}>Dark Theme</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  main: {
    marginTop: 45,
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4B0082",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  radioText: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default AppearanceScreen;
