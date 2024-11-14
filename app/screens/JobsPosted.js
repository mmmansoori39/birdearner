import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Placeholder data for job postings
const jobData = [
  {
    id: '1',
    title: 'Looking for graphic designer for branding project',
    status: 'Under process',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    color: '#FF3B30', // Red
  },
  {
    id: '2',
    title: 'Looking for graphic designer for branding project',
    status: '4 Entries Received',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    color: '#34C759', // Green
  },
  {
    id: '3',
    title: 'Looking for graphic designer for branding project',
    status: 'Under process',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    color: '#FFCC00', // Yellow
  },
  {
    id: '4',
    title: 'Looking for graphic designer for branding project',
    status: 'Cancelled',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    color: '#34C759', // Green
  },
  {
    id: '5',
    title: 'Looking for graphic designer for branding project',
    status: 'Completed',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    color: '#FFCC00', // Yellow
  },
];

const JobsPostedScreen = ({ navigation }) => {
  const {user} = useAuth()
  // Renders each job item in the list
  const renderJobItem = ({ item }) => (
    <View style={styles.jobContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.jobContent}>
        <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.jobStatus}>Status: {item.status}</Text>
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: item.color }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.main}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Jobs Posted</Text>
      </View>
      <FlatList
        data={jobData}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  backButton: {
    // marginTop: 20,
    // marginBottom: 10,
  },
  main: {
    marginTop: 65,
    marginBottom: 30,
    display: "flex",
    flexDirection: "row",
    gap: 100,
    alignItems: "center"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  jobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    // padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    height: 70
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  jobContent: {
    flex: 1,
    paddingRight: 6
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A4CAE',
  },
  jobStatus: {
    fontSize: 14,
    color: '#6D6D6D',
  },
  statusIndicator: {
    width: 10,
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default JobsPostedScreen;
