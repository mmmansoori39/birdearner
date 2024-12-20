import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NavigationIndependentTree } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationIndependentTree>
      <AuthProvider>
      <Slot />
      <StatusBar style="auto" />
    </AuthProvider>
    </NavigationIndependentTree>
  );
}