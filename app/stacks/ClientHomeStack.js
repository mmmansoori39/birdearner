import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NotificationScreen from "../screens/Notification";
import HomeScreen from "../screens/Home";
import ChatList from "../screens/ChatList";
import ClientHomeScreen from "../screens/ClientHome";
import Chat from "../screens/Chat";
import Inbox from "../screens/Inbox";

const Stack = createStackNavigator();

export default function ClientHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={ClientHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Inbox"
        component={Inbox}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}
