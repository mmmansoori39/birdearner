import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox'; // Use checkbox for the agreements

const PortfolioScreen = () => {
  const [portfolioImages, setPortfolioImages] = useState([null, null, null]); // For 3 portfolio slots
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeTnC, setAgreeTnC] = useState(false);
  const router = useRouter();

  // Function to handle image upload
  const uploadPortfolioImage = async (index) => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You need to grant permission to access your photos.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square images (1080x1080 px ratio)
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const newImages = [...portfolioImages];
      newImages[index] = pickerResult.uri; // Save the selected image URI
      setPortfolioImages(newImages);
    }
  };

  const handleSubmit = () => {
    if (!agreeTerms || !agreeTnC) {
      Alert.alert("Error", "You need to agree to the terms and conditions before proceeding.");
      return;
    }

    if (portfolioImages.every((img) => img === null)) {
      Alert.alert("Portfolio Missing", "Please upload at least one portfolio image.");
      return;
    }

    // Proceed with submission
    Alert.alert("Success", "Portfolio submitted successfully!");
    router.push('/screens/Home'); // Adjust this route as per your navigation
  };

  const skipScreen = () => {
    router.push('/screens/Home'); // Redirect to home screen when skip is clicked
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>

      <TouchableOpacity style={styles.skipButton} onPress={skipScreen}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.instructions}>
        Please read before adding your portfolio on BirdEARNER:
      </Text>
      <Text style={styles.bulletPoint}>1. Upload your image in 1080x1080 px</Text>
      <Text style={styles.bulletPoint}>2. Image size should be between 100 KB-2 MB.</Text>
      <Text style={styles.bulletPoint}>3. Don’t upload any inappropriate or NSFW content.</Text>

      <View style={styles.imageContainer}>
        {portfolioImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageBox}
            onPress={() => uploadPortfolioImage(index)}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.plusText}>+</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Display uploaded images */}
      <View style={styles.uploadedImages}>
        {portfolioImages.map((image, index) => (
          image ? (
            <Image key={index} source={{ uri: image }} style={styles.uploadedImage} />
          ) : null
        ))}
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          color={agreeTerms ? "#ff9800" : undefined}
        />
        <Text style={styles.checkboxLabel}>
          I accept that all the work uploaded on BirdEARNER by me is authentic and belongs to me.
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreeTnC}
          onValueChange={setAgreeTnC}
          color={agreeTnC ? "#ff9800" : undefined}
        />
        <Text style={styles.checkboxLabel}>
          I agree upon all the <Text style={styles.link}>T&C</Text> and proceed.
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText} onPress={() => router.back()}>
            Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
          <Text
            style={styles.nextButtonText}
            onPress={handleSubmit}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b006b',
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 8,
  },
  skipButtonText: {
    color: '#ffffff',
    fontWeight: '350',
    fontSize: 20,
  },
  instructions: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  bulletPoint: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  imageBox: {
    width: 90,
    height: 90,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  plusText: {
    fontSize: 36,
    color: '#000000',
  },
  uploadedImages: {
    marginTop: 20,
  },
  uploadedImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#ff9800',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  nextButton: {
    width: "32%",
    height: 40,
    backgroundColor: "#fff", // Dark purple for button
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#6A0DAD",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default PortfolioScreen;
