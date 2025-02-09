import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AuthProvider>
          <Slot />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </NavigationContainer>

  );
}