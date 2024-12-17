import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ImageViewer from "react-native-image-zoom-viewer";


const JobDetailsScreen = ({ route, navigation }) => {
  const { formData } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);

  const openImageModal = (imageUri) => {

    setImages([{ url: imageUri }]); 
    setModalVisible(true);
  };  
 
  const handleSubmit = () => {
    navigation.navigate("JobSubmissionTimmer", { formData });
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
          <Image
            source={require("../assets/profile.png")}
            style={styles.avatar}
          />
          <View style={styles.jobInfo}>
            <View style={styles.jobTitlebar}>
              <Text style={styles.jobTitle}>
                {formData.jobTitle || "Job Heading missing"}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Budget </Text> Rs. {formData.budget}/-
              </Text>
            </View>
            <FontAwesome name="flag" size={20} color="black" style={styles.flagIcon} />
          </View>
        </View>

        {/* Job Description */}
        <Text style={styles.desText}>Description</Text>
        <View style={styles.jobDescription}>
          <Text style={styles.descriptionText}>
            {formData.jobDes}
          </Text>
        </View>

        <Text style={styles.desText}>Skills Required</Text>
        <Text style={styles.skillText}>
          {formData.skills.join(", ")}
        </Text>

        <Text style={styles.desText}>Deadline</Text>
        <Text style={styles.detailText}>
          {new Date(formData.deadline).toLocaleDateString()}
        </Text>

        <Text style={styles.desText}>Location</Text>
        <Text style={styles.detailText}>
          {formData.jobLocation || "N/A"}
        </Text>

        {/* Attached Files */}
        <View style={styles.attachedFilesContainer}>
          <Text style={styles.attachedFilesTitle}>Attached Files</Text>
          <View style={styles.filePreviewContainer}>
            {formData.portfolioImages.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => openImageModal(image)}>
                <Image
                  source={{ uri: image }}
                  style={styles.filePreview}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>



        <View style={styles.applyButtoncon}>
          <TouchableOpacity style={styles.conColor} onPress={handleSubmit} >
            <Text style={styles.applyButtonText}>Confirm Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.repColor} onPress={handleSubmit} >
            <Text style={styles.applyButtonText}>Report Job</Text>
          </TouchableOpacity>
        </View>

        {/* Report Job Link */}
        <Text style={styles.reportText}>Share this job</Text>
      </ScrollView>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  scrollContent: {
    padding: 20,
    marginBottom: 30
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 30,
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
    // flex: 1,
  },
  jobTitlebar: {
    flex: 1,
    gap: 10,
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
    color: '#595858',
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    color: '#595858',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  desText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3
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
    gap: 15
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

export default JobDetailsScreen;
