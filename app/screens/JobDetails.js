import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const JobDetailsScreen = ({ route, navigation }) => {
  const { formData } = route.params;

  const handleSubmit = () => {
    navigation.navigate("JobSubmissionTimmer", { formData });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScrollView style={styles.scrollContent}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <Image
            source={require("../assets/profile.png")}
            style={styles.avatar}
          />
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>
              {formData.jobTitle || "Job Heading missing"}
            </Text>
            <FontAwesome name="flag" size={20} color="black" style={styles.flagIcon} />
          </View>
        </View>

        {/* Job Details */}
        <View style={styles.jobDetails}>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Budget: ₹</Text>{formData.budget}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Location:</Text> {formData.jobLocation || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Deadline:</Text> {new Date(formData.deadline).toLocaleDateString()}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Skills:</Text> {formData.skills.join(", ")}
          </Text>
        </View>

        {/* Job Description */}
        <View style={styles.jobDescription}>
          <Text style={styles.descriptionText}>
            {formData.jobDes}
          </Text>
        </View>

        {/* Attached Files */}
        <View style={styles.attachedFilesContainer}>
          <Text style={styles.attachedFilesTitle}>Attached Files</Text>
          <View style={styles.filePreviewContainer}>
            {formData.portfolioImages.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.filePreview}
              />
            ))}
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleSubmit} >
          <Text style={styles.applyButtonText}>Confirm</Text>
        </TouchableOpacity>

        {/* Report Job Link */}
        <Text style={styles.reportText}>Report this job</Text>
      </ScrollView>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30,
  },
  scrollContent: {
    padding: 20,
    marginBottom: 30
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 20,
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
    color: '#4e2587',
    flex: 1,
  },
  flagIcon: {
    marginLeft: 10,
  },
  jobDetails: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
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
    backgroundColor: '#4e2587',
    // paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  reportText: {
    color: '#555',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default JobDetailsScreen;
