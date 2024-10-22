import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyProfileScreen from '../screens/MyProfile';
import MyReviewScreen from '../screens/MyReview';


const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{headerShown: false}}

      />
      <Stack.Screen
        name="MyReview"
        component={MyReviewScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
