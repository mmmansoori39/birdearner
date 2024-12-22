import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JobsPostedScreen from '../screens/JobsPosted';
import AppliersScreen from '../screens/Appliers';
import Chat from '../screens/Chat';
import ProjectChatScreen from '../screens/ProjectChat';


const Stack = createStackNavigator();

export default function JobStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JobsPostedScreen"
        component={JobsPostedScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppliersScreen"
        component={AppliersScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProjectChat"
        component={ProjectChatScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}