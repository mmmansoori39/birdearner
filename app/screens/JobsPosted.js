import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
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

    if (job.applied_freelancer.length === 0) {
      priority = 'Under process';
    } else if (job.applied_freelancer.length === 1) {
      priority = `${job.applied_freelancer.length} Entry Received`;
    } else {
      priority = `${job.applied_freelancer.length} Entries Received`;
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
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const cachedJobs = useRef([]);
  const profilePic = userData?.profile_photo

  const fetchJobs = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.jobCollectionID,
        [
          Query.equal('job_created_by', userData.$id),
          Query.orderDesc('created_at'),
        ]
      );

      const fetchedJobs = response.documents;
      if (JSON.stringify(fetchedJobs) !== JSON.stringify(cachedJobs.current)) {
        const categorizedJobs = categorizeJobs(fetchedJobs);
        cachedJobs.current = fetchedJobs;
        setJobs(categorizedJobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (cachedJobs.current.length === 0) {
        fetchJobs();
      }
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const renderJobItem = ({ item }) => {
    const title = item.title;
    const freelancersId = item.applied_freelancer;
    const color = item.color;
    const projectId = item.$id;

    return (
      <TouchableOpacity
        style={styles.jobContainer}
        onPress={() => {
          navigation.navigate('AppliersScreen', { title, freelancersId, color, item, projectId });
        }}
      >
        <Image
          source={{ uri: profilePic || 'https://randomuser.me/api/portraits/women/3.jpg' }}
          style={styles.avatar}
        />
        <View style={styles.jobContent}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.jobStatus}>Status: {item.priority}</Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: item.color }]} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b006b" />
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>Failed to load jobs. Please try again later.</Text>
        <TouchableOpacity onPress={fetchJobs} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>No jobs posted yet.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b006b']}
            progressBackgroundColor="#fff"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  backButton: {},
  main: {
    marginTop: 25,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 100,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  jobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
    height: 70,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  jobContent: {
    flex: 1,
    paddingRight: 6,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b006b',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6D6D6D',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#3b006b',
    fontSize: 16,
  },
});

export default JobsPostedScreen;
