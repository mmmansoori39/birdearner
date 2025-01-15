import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { appwriteConfig, databases } from '../lib/appwrite';
import ImageViewer from "react-native-image-zoom-viewer";
import { useTheme } from '../context/ThemeContext';


const JobDescriptionScreen = ({ route, navigation }) => {
  const { job, clientProfileImage, full_name } = route.params;
  const { userData } = useAuth();
  const [appliedStatus, setAppliedStatus] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);

  const { theme, themeStyles } = useTheme();
  const currentTheme = themeStyles[theme];

  const styles = getStyles(currentTheme);

  const projectId = job.$id;
  const receiverId = job.job_created_by

  useEffect(() => {
    const checkAppliedStatus = async () => {
      try {
        const jobId = job.$id;
        const freelancerId = userData.$id;

        const jobDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.jobCollectionID,
          jobId
        );

        const updatedFreelancers = jobDoc.applied_freelancer;

        if (updatedFreelancers.includes(freelancerId)) {
          setAppliedStatus(true);
        }
      } catch (error) {
        Alert.alert("Error job status:", error);
      }
    };

    const checkFlaggedStatus = async () => {
      try {
        const jobId = job.$id;
        const freelancerId = userData.$id;

        const freelancerDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.freelancerCollectionId,
          freelancerId
        );

        if (freelancerDoc.flags && freelancerDoc.flags.includes(jobId)) {
          setFlagged(true);
        }
      } catch (error) {
        Alert.alert("Error checking flagged status:", error)
      }
    };

    checkAppliedStatus();
    checkFlaggedStatus();
  }, [navigation]);

  const openImageModal = (imageUri) => {

    setImages([{ url: imageUri }]);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const jobId = job.$id;
      const freelancerId = userData.$id

      const jobDoc = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.jobCollectionID,
        jobId
      );

      const updatedFreelancers = jobDoc.applied_freelancer || [];

      if (!updatedFreelancers.includes(freelancerId)) {
        updatedFreelancers.push(freelancerId);
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.jobCollectionID,
        jobId,
        {
          applied_freelancer: updatedFreelancers,
          updated_at: new Date().toISOString(),
        }
      );
      setAppliedStatus(true)

    } catch (error) {
      Alert.alert("Error updating job document:", error)
    }
  };

  const toggleFlag = async () => {
    try {
      if (userData) {
        const freelancerId = userData?.$id;
        const jobId = job?.$id;

        const collectionId = userData?.role === "client" ? appwriteConfig.clientCollectionId : appwriteConfig.freelancerCollectionId


        const freelancerDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          collectionId,
          freelancerId
        );

        let updatedFlags = freelancerDoc.flags || [];

        if (updatedFlags.includes(jobId)) {
          // If already flagged, remove the projectId
          updatedFlags = updatedFlags.filter(id => id !== jobId);
          setFlagged(false);
        } else {
          // If not flagged, add the projectId
          updatedFlags.push(jobId);
          setFlagged(true);
        }

        await databases.updateDocument(
          appwriteConfig.databaseId,
          collectionId,
          freelancerId,
          {
            flags: updatedFlags,
          }
        );
      }
    } catch (error) {
      Alert.alert("Error updating flags:", error);
    }
  };


  const formatDeadline = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = Math.ceil((deadlineDate - currentDate) / (1000 * 60 * 60 * 24));
    return timeDiff > 0 ? `${timeDiff} days` : "Deadline passed";
  };

  const formatBudget = (budget) => {
    return budget >= 1000 ? `${(budget / 1000).toFixed(budget % 1000 === 0 ? 0 : 1)}k` : `${budget}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close on back button
      >
        <ImageViewer
          imageUrls={images} // Array of images
          enableSwipeDown={true} // Swipe down to close
          onSwipeDown={() => setModalVisible(false)}
          renderIndicator={() => null}
          renderHeader={() => (
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                position: "absolute",
                top: 30,
                left: 20,
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 20,
                padding: 10,
              }}
            >
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        />
      </Modal>

      <ScrollView style={styles.scrollContent}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <TouchableOpacity onPress={() => openImageModal(clientProfileImage)}>
            <Image
              source={{ uri: clientProfileImage || "../assets/profile.png" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.jobInfo}>
            <View style={styles.jobTitlebar}>
              <Text style={styles.jobTitle}>
                {job.title || "Job Heading missing"}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Budget </Text> Rs. {job.budget}/-
              </Text>
            </View>
            <TouchableOpacity onPress={toggleFlag}>
              <FontAwesome
                name="flag"
                size={24}
                color={flagged ? '#4C0183' : currentTheme.text || 'black'}
                style={styles.flagIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Description */}
        <Text style={styles.desText}>Description</Text>
        <View style={styles.jobDescription}>
          <Text style={styles.descriptionText}>
            {job.description}
          </Text>
        </View>

        <Text style={styles.desText}>Skills Required</Text>
        <Text style={styles.skillText}>
          {job.skills.join(", ")}
        </Text>

        <Text style={styles.desText}>Deadline</Text>
        <Text style={styles.detailText}>
          {new Date(job.deadline).toLocaleDateString()}
        </Text>

        <Text style={styles.desText}>Location</Text>
        <Text style={styles.detailText}>
          {job.location || "N/A"}
        </Text>

        {/* Attached Files */}
        <View style={styles.attachedFilesContainer}>
          <Text style={styles.attachedFilesTitle}>Attached Files</Text>
          <View style={styles.filePreviewContainer}>
            {job.attached_files.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => openImageModal(image)}>
                <Image
                  source={{ uri: image }}
                  style={styles.filePreview}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Apply Button */}
        {
          appliedStatus === true ? (
            <TouchableOpacity onPress={() => {
              navigation.navigate("Chat", { projectId, full_name, receiverId });
            }}>
              <Text style={styles.alreadyapplyButtonText}>Send Message</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.applyButton} onPress={handleSubmit} >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          )
        }

        {/* Report Job Link */}
        <Text style={styles.reportText}>Report this job</Text>
      </ScrollView>
    </ScrollView>
  );
};

// Styles
const getStyles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background || '#fff',
      padding: 20,
      paddingTop: 40,
    },
    scrollContent: {
      padding: 20,
      marginBottom: 30
    },
    jobHeader: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    jobTitlebar: {
      flex: 1,
      gap: 10,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 20,
    },
    jobInfo: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    jobTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentTheme.primary || '#4e2587',
      flex: 1,
    },
    flagIcon: {
      marginLeft: 10,
    },
    jobDetails: {
      backgroundColor: currentTheme.subText || '#f9f9f9',
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: currentTheme.shadow ||  "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    detailText: {
      fontSize: 14,
      color: '#4e2587',
      marginBottom: 10,
    },
    boldText: {
      fontWeight: 'bold',
    },
    jobDescription: {
      marginBottom: 20,
    },
    descriptionText: {
      fontSize: 14,
      color: '#555',
      lineHeight: 22,
      marginBottom: 10,
    },
    attachedFilesContainer: {
      marginBottom: 30,
    },
    attachedFilesTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4e2587',
      marginBottom: 10,
    },
    filePreviewContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 20,
      justifyContent: "center"
    },
    filePreview: {
      width: 80,
      height: 80,
      backgroundColor: '#ccc',
      borderRadius: 5,
      marginRight: 10,
      marginBottom: 10,
    },
    applyButton: {
      backgroundColor: currentTheme.primary || '#4e2587',
      // paddingHorizontal: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
      paddingVertical: 8
    },
    applyButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 24,
    },
    alreadyapplyButtonText: {
      color: currentTheme.subText || '#36454F',
      fontWeight: 'bold',
      fontSize: 24,
      backgroundColor: currentTheme.background3 || '#c2c2c2',
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
      paddingVertical: 8,
      textAlign: "center"
    },
    reportText: {
      color: '#555',
      textAlign: 'center',
      textDecorationLine: 'underline',
      fontSize: 14,
    },
    detailText: {
      fontSize: 14,
      color: '#595858',
      marginBottom: 10,
    },
    skillText: {
      fontSize: 14,
      color: currentTheme.subText || '#595858',
      marginBottom: 10,
    },
    boldText: {
      fontWeight: 'bold',
    },
    desText: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 3,
      color: currentTheme.text
    },
    jobDescription: {
      marginBottom: 20,
    },
    descriptionText: {
      fontSize: 14,
      color: '#555',
      lineHeight: 22,
      marginBottom: 10,
    },
    attachedFilesContainer: {
      marginBottom: 30,
    },
    attachedFilesTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4e2587',
      marginBottom: 10,
    },
    filePreviewContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 20,
      justifyContent: "center"
    },
    filePreview: {
      width: 80,
      height: 80,
      backgroundColor: '#ccc',
      borderRadius: 5,
      marginRight: 10,
      marginBottom: 10,
    },
    applyButtoncon: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      gap: 15,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      elevation: 4
    },
    applyButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
    },
    conColor: {
      backgroundColor: '#00871E',
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
      paddingVertical: 10,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      elevation: 4
    },
    repColor: {
      backgroundColor: '#B64928',
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
      paddingVertical: 10,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      elevation: 4
    },
    reportText: {
      color: '#555',
      textAlign: 'center',
      textDecorationLine: 'underline',
      fontSize: 14,
    },
  });

export default JobDescriptionScreen;
