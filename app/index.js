import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, Image } from "react-native";
import { useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/Login";
import LeaderboardScreen from "./screens/Leaderboard";
import ProfileStack from "./stacks/ProfileStack";
import IntroScreen from "./screens/Intro";
import HomeStack from "./stacks/HomeStack";
import Bird from "./screens/Bird";
import JobRequirementStack from "./stacks/JobRequirementStack";
import ClientHomeScreen from "./screens/ClientHome";
import MarketPlaceStack from "./stacks/MarketPlaceStack";
import JobStack from "./stacks/JobStack";

const Tab = createBottomTabNavigator();

export default function App() {
  const { user, loading, userData } = useAuth();

  const role = userData?.role

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

          if (route.name === "Job Posted") {
            return (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                {focused ? (
                  <LinearGradient
                    colors={["#300E49", "#762BAD"]}
                    style={styles.gradientBackground}
                  >
                    <Image source={require("./assets/jobIcon.png")} style={styles.uploadedImage} />
                  </LinearGradient>
                ) : (
                  <Image source={require("./assets/jobIcon.png")} style={styles.uploadedImage} />
                )}
              </View>
            );
          } else if(route.name === "AI Bird"){
            return (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                {focused ? (
                  <LinearGradient
                    colors={["#300E49", "#762BAD"]}
                    style={styles.gradientBackground}
                  >
                    <Image source={require("./assets/bird.png")} style={styles.bird} />
                  </LinearGradient>
                ) : (
                  <Image source={require("./assets/bird.png")} style={styles.bird} />
                )}
              </View>
            );
          }
           else {
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
              case "Job Requirements":
                iconName = "add";
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
      {role === "client" ? (
        <>
          <Tab.Screen
            name="Home"
            component={ClientHomeScreen}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="Job Posted"
            component={JobStack}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="Job Requirements"
            component={JobRequirementStack}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="AI Bird"
            component={Bird}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{ unmountOnBlur: false }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="Marketplace"
            component={MarketPlaceStack}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="AI Bird"
            component={Bird}
            options={{ unmountOnBlur: false }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{ unmountOnBlur: false }}
          />
        </>
      )}
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
  uploadedImage: {
    width: 25,
    height: 25,
  },
  bird: {
    width: 40,
    height: 45,
  },
});



// eas build --platform android --profile debug
// builing an Apk for debuging purpose