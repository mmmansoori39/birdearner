import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NotificationScreen from "../screens/Notification";
import HomeScreen from "../screens/Home";
import ChatList from "../screens/ChatList";
import Chat from "../screens/Chat";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
