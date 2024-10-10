import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Intro = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Heading */}
      <Text style={styles.heading}>BirdEarner</Text>

      {/* Description */}
      <Text style={styles.description}>Be BirdEarner, Become Bread Earner!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B0082', // Background color
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  heading: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#fff', // Heading color
  },
  description: {
    fontSize: 13,
    color: '#f0f0f0', // Description color
    marginTop: 0,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default Intro;
