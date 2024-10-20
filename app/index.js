import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet } from "react-native";
import { useAuth } from "./context/AuthContext";
import HomeScreen from "./screens/Home";
import LoginScreen from "./screens/Login";
import LeaderboardScreen from "./screens/Leaderboard";
import MarketplaceScreen from "./screens/Marketplace";
import JobDescriptionScreen from "./screens/JobDescription";
import SettingsScreen from "./screens/Settings";
import IntroScreen from "./screens/Intro";

const Tab = createBottomTabNavigator();

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <IntroScreen />;
  }

  return user ? (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#370F54",
          borderTopWidth: 0,
          height: 56,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? "#FFF" : "#aaa";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Leaderboard":
              iconName = "leaderboard";
              break;
            case "Marketplace":
              iconName = "storefront";
              break;
            case "Profile":
              iconName = "person";
              break;
            case "Settings":
              iconName = "settings";
              break;
            default:
              iconName = "circle";
          }

          return (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              {focused ? (
                <LinearGradient
                  colors={["#300E49", "#762BAD"]}
                  style={styles.gradientBackground}
                >
                  <MaterialIcons name={iconName} color={iconColor} size={30} />
                </LinearGradient>
              ) : (
                <MaterialIcons name={iconName} color={iconColor} size={30} />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ unmountOnBlur: false }}  // Retains the state when navigating between tabs
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ unmountOnBlur: false }}  // Keeps screen state intact
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{ unmountOnBlur: false }}  // Ensures state persistence
      />
      <Tab.Screen
        name="Profile"
        component={JobDescriptionScreen}
        options={{ unmountOnBlur: false }}  // Screen won't reset
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ unmountOnBlur: false }}  // Keeps settings state intact
      />
    </Tab.Navigator>
  ) : (
    <LoginScreen />
  );
}

const styles = StyleSheet.create({
  activeTab: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveTab: {
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
