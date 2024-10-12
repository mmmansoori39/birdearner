import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Import the AuthContext
import { Slot } from 'expo-router';

export default function App() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
