import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { appwriteConfig, databases } from '../lib/appwrite';
import { Query } from 'react-native-appwrite';
import { differenceInDays } from 'date-fns';

const categorizeJobs = (jobs) => {
  const today = new Date();

  return jobs.map((job) => {
    const daysRemaining = differenceInDays(new Date(job.deadline), today);

    let priority;
    let color = '#FFCC00';

    if(job.applied_freelancer.length === 0){
      priority= 'Under process'
    } else if(job.applied_freelancer.length === 1){
      priority= `${job.applied_freelancer.length} Entery Recieved`
    } else if(job.applied_freelancer.length > 1){
      priority= `${job.applied_freelancer.length} Enteries Recieved`
    }
    

    if (daysRemaining <= 2) {
      color = '#FF3B30';
    } else if (daysRemaining <= 10) {
      color = '#34C759'; 
    }

    return {
      ...job,
      color,
      priority,
    };
  });
};

const JobsPostedScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.jobCollectionID,
          [
            Query.equal('job_created_by', userData.$id),
            Query.orderDesc('created_at')
          ]
        );

        const categorizedJobs = categorizeJobs(response.documents);
        setJobs(categorizedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchJobs);

    return unsubscribe;
  }, [navigation]);

  const renderJobItem = ({ item }) => {

    const title = item.title
    const freelancersId = item.applied_freelancer
    const color = item.color

    return (
      <View>
        <TouchableOpacity style={styles.jobContainer} onPress={() => {
          navigation.navigate("AppliersScreen", {title, freelancersId, color})
        }} >
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/3.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.jobContent}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.jobStatus}>Status: {item.priority}</Text>
          </View>
          <View
            style={[styles.statusIndicator, { backgroundColor: item.color }]}
          />
        </TouchableOpacity>
      </View>
    )
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b006b" />
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Jobs Posted</Text>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.$id}
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
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 350
  }
});

export default JobsPostedScreen;
