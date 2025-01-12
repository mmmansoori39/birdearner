import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import offerBackground from "../assets/offerBackground.png";
import egg from "../assets/egg.png";
import nest from "../assets/nest.png";
import tree from "../assets/tree.png";
import brEgg from "../assets/brEgg.png";

const offers = ["10rs", "50rs", "0", "25rs", "15rs"];

const OffersScreen = ({ navigation }) => {
  const [eggStatus, setEggStatus] = useState([false, false, false, false, false]);
  const [brokenEggs, setBrokenEggs] = useState([false, false, false, false, false]);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Create refs for the shake animations
  const shakeAnimations = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Start shaking animations for all unbroken eggs
    eggStatus.forEach((_, index) => {
      if (!brokenEggs[index]) {
        startShakeAnimation(index);
      }
    });
  }, [brokenEggs]);

  const startShakeAnimation = (index) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimations[index], {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimations[index], {
          toValue: -1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimations[index], {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopShakeAnimation = (index) => {
    shakeAnimations[index].stopAnimation();
  };

  const handleEggClick = (index) => {
    if (eggStatus[index]) {
      const randomOffer = offers[Math.floor(Math.random() * offers.length)];
      setSelectedOffer(randomOffer);
      setShowOfferPopup(true);

      const updatedBrokenEggs = [...brokenEggs];
      updatedBrokenEggs[index] = true;
      setBrokenEggs(updatedBrokenEggs);

      // Stop shaking animation for the broken egg
      stopShakeAnimation(index);
    } else {
      setShowVideoPopup(true);
    }
  };

  const closePopup = () => {
    setShowOfferPopup(false);
    setShowVideoPopup(false);
  };

  const unlockEgg = (index) => {
    const updatedEggStatus = [...eggStatus];
    updatedEggStatus[index] = true;
    setEggStatus(updatedEggStatus);
  };

  const unlockAllEggs = () => {
    setEggStatus([true, true, true, true, true]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={offerBackground} style={styles.offerBackground} resizeMode="cover">
        <TouchableOpacity style={styles.unlockAllButton} onPress={unlockAllEggs}>
          <Text style={styles.unlockAllButtonText}>Unlock All Eggs</Text>
        </TouchableOpacity>
        <Image source={tree} style={styles.tree} />
        {eggStatus.map((status, index) => (
          <React.Fragment key={index}>
            <Image source={nest} style={styles[`nest${index + 1}`]} />
            <Animated.View
              style={[
                styles[`egg${index + 1}`], brokenEggs[index] && styles[`brokenEgg${index + 1}`], 
                {
                  transform: [
                    {
                      translateX: brokenEggs[index]
                        ? 0
                        : shakeAnimations[index].interpolate({
                            inputRange: [-1, 1],
                            outputRange: [-5, 5],
                          }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleEggClick(index)}
                disabled={brokenEggs[index]}
              >
                <Image
                  source={brokenEggs[index] ? brEgg : egg}
                  style={brokenEggs[index] ? styles.sizeB : styles.size}
                />
              </TouchableOpacity>
            </Animated.View>
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

  unlockAllButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#4C0183",
    padding: 15,
    borderRadius: 10,
  },
  unlockAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  size: {
    width: 50,
    resizeMode: "contain",
  },
  sizeB: {
    width: 70,
    resizeMode: "contain",
  },
  nest1: {
    position: "absolute",
    bottom: 160,
    left: 170,
  },
  egg1: {
    position: "absolute",
    bottom: 221,
    right: 98,
  },
  nest2: {
    position: "absolute",
    bottom: 250,
    left: 30,
  },
  egg2: {
    position: "absolute",
    bottom: 311,
    left: 105,
  },
  nest3: {
    position: "absolute",
    bottom: 340,
    left: 170,
  },
  egg3: {
    position: "absolute",
    bottom: 401,
    right: 98,
  },
  nest4: {
    position: "absolute",
    bottom: 430,
    left: 30,
  },
  egg4: {
    position: "absolute",
    bottom: 491,
    left: 106,
  },
  nest5: {
    position: "absolute",
    top: 105,
    left: 100,
  },
  egg5: {
    position: "absolute",
    top: 126,
    left: 175,
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

  brokenEgg1: {
    position: "absolute",
    bottom: 170,
    right: 89,
  },
  brokenEgg2: {
    position: "absolute",
    bottom: 260,
    left: 94,
  },
  brokenEgg3: {
    position: "absolute",
    bottom: 350,
    right: 89,
  },
  brokenEgg4: {
    position: "absolute",
    bottom: 440,
    left: 94,
  },
  brokenEgg5: {
    position: "absolute",
    top: 90,
    left: 164,
  },
});