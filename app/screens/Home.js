import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Import useAuth to access authentication

const Home = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020d19' }}>
      <Text style={{ color: '#f0f0f0', fontSize: 24 }}>Welcome to BirdEarner! </Text>
      <Button title="Logout" onPress={useAuth().logout} />
    </View>
  );
};

export default Home;
