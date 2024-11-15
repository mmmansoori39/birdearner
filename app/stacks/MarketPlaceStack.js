import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MarketplaceScreen from '../screens/Marketplace';
import JobPriority from '../screens/JobPriority';
import JobDescriptionScreen from '../screens/JobDescription';


const Stack = createStackNavigator();

export default function MarketPlaceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MarketplaceScreen"
        component={MarketplaceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JobPriority"
        component={JobPriority}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JobDescription"
        component={JobDescriptionScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}