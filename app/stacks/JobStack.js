import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JobsPostedScreen from '../screens/JobsPosted';
import AppliersScreen from '../screens/Appliers';
import Chat from '../screens/Chat';


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
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}