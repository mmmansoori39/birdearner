import { ImageBackground, StyleSheet, SafeAreaView, Image, View, TouchableOpacity, Text, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import offerBackground from "../assets/offerBackground.png";
import egg from "../assets/egg.png";
import nest from "../assets/nest.png";
import tree from "../assets/tree.png";

// Sample cashback offers (You can customize this)
const offers = [
  "10rs",
  "50rs",
  "0",
  "25rs",
  "10%<500rs",
];

const OffersScreen = ({ navigation }) => {
  const [eggStatus, setEggStatus] = useState([false, false, false, false, false]); // Tracks egg unlock status
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedEggIndex, setSelectedEggIndex] = useState(null);

  // Function to handle egg clicks
  const handleEggClick = (index) => {
    // If the egg is unlocked, show offer, else show video popup
    if (eggStatus[index]) {
      const randomOffer = offers[Math.floor(Math.random() * offers.length)];
      setSelectedOffer(randomOffer);
      setSelectedEggIndex(index);
      setShowOfferPopup(true);
    } else {
      setShowVideoPopup(true);
    }
  };

  // Function to close popups
  const closePopup = () => {
    setShowOfferPopup(false);
    setShowVideoPopup(false);
  };

  // Function to mark the egg as unlocked (this would typically be tied to a project completion)
  const unlockEgg = (eggIndex) => {
    const updatedEggStatus = [...eggStatus];
    updatedEggStatus[eggIndex] = true;
    setEggStatus(updatedEggStatus);
  };

  // Reset the eggs at the end of the month (This can be triggered based on your system's time or a button)
  const resetEggs = () => {
    setEggStatus([false, false, false, false, false]);
  };

  useEffect(() => {
    // This is just an example trigger, you can replace it with real-time data (e.g., when a project is completed).
    unlockEgg(0); // Unlock first egg (e.g., after project completion)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={offerBackground}
        style={styles.offerBackground}
        resizeMode="cover"
      >
        <Image source={tree} style={styles.tree} />
        {eggStatus.map((status, index) => (
          <React.Fragment key={index}>
            <Image source={nest} style={[styles[`nest${index + 1}`]]} />
            <TouchableOpacity
              style={[styles[`egg${index + 1}`], status && styles.activeEgg]}
              onPress={() => handleEggClick(index)}
            >
              <Image source={egg} />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ImageBackground>

      {/* Offer Popup */}
      <Modal visible={showOfferPopup} transparent={true} animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Congratulations!</Text>
            <Text style={styles.popupText}>You've earned a cashback of {selectedOffer}!</Text>
            <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
              <Text style={styles.popupButtonText}>Claim Cashback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Video Popup */}
      <Modal visible={showVideoPopup} transparent={true} animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>No Offer Available!</Text>
            <Text style={styles.popupText}>Stay tuned for more offers!</Text>
            <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
              <Text style={styles.popupButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offerBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  tree: {
    position: "absolute",
    left: 110,
    top: 200,
  },
  nest1: {
    position: "absolute",
    bottom: 160,
    left: 170,
  },
  egg1: {
    position: "absolute",
    bottom: 267,
    right: 100,
  },
  nest2: {
    position: "absolute",
    bottom: 250,
    left: 30,
  },
  egg2: {
    position: "absolute",
    bottom: 357,
    left: 110,
  },
  nest3: {
    position: "absolute",
    bottom: 340,
    left: 170,
  },
  egg3: {
    position: "absolute",
    bottom: 447,
    right: 100,
  },
  nest4: {
    position: "absolute",
    bottom: 430,
    left: 30,
  },
  egg4: {
    position: "absolute",
    bottom: 537,
    left: 110,
  },
  nest5: {
    position: "absolute",
    top: 105,
    left: 100,
  },
  egg5: {
    position: "absolute",
    top: 148,
    left: 180,
  },
  activeEgg: {
    opacity: 1,
  },
  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  popupText: {
    fontSize: 16,
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: "#4C0183",
    padding: 10,
    borderRadius: 5,
  },
  popupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
