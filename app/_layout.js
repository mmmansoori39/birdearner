import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NavigationIndependentTree } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <NavigationIndependentTree>
      <ThemeProvider>
        <AuthProvider>
          <Slot />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </NavigationIndependentTree>
  );
}