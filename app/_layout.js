import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Slot } from 'expo-router';
// import { NavigationContainer } from '@react-navigation/native';
import { NavigationIndependentTree } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationIndependentTree>
      <AuthProvider>
      <Slot />
    </AuthProvider>
    </NavigationIndependentTree>
  );
}
