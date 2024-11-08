import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationScreen from '../screens/Notification';
import HomeScreen from '../screens/Home';
import JobRequirementsScreen from '../screens/JobRequirements';
import JobDetailsScreen from '../screens/JobDetails';
import JobSubmissionTimmerScreen from '../screens/JobSubmissionTimmer';


const Stack = createStackNavigator();

export default function JobRequirementStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JobRequirements"
        component={JobRequirementsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JobSubmissionTimmer"
        component={JobSubmissionTimmerScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}