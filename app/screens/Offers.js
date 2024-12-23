import { ImageBackground, StyleSheet, SafeAreaView, Image, View } from "react-native";
import React from "react";
import offerBackground from "../assets/offerBackground.png";
import egg from "../assets/egg.png"
import nest from "../assets/nest.png"
import tree from "../assets/tree.png"

const OffersScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={offerBackground}
                style={styles.offerBackground}
                resizeMode="cover"
            >
                <Image source={tree} style={styles.tree} />

                <Image source={nest} style={styles.nest1} />
                <Image source={egg} style={styles.egg1} />

                <Image source={nest} style={styles.nest2} />
                <Image source={egg} style={styles.egg2} />

                <Image source={nest} style={styles.nest3} />
                <Image source={egg} style={styles.egg3} />

                <Image source={nest} style={styles.nest4} />
                <Image source={egg} style={styles.egg4} />

                <Image source={nest} style={styles.nest5} />
                <Image source={egg} style={styles.egg5} />

            </ImageBackground>
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
        // justifyContent: "center",
        // alignItems: "center",
        // alignContent: "center"
    },
    tree: {
        position: "absolute",
        left: 110,
        top: 200
    },
    nest1: {
        position: "absolute",
        bottom: 160,
        left: 170
    },
    egg1: {
        position: "absolute",
        bottom: 270,
        right: 100
    },
    nest2: {
        position: "absolute",
        bottom: 250,
        left: 30
    },
    egg2: {
        position: "absolute",
        bottom: 360,
        left: 110
    },
    nest3: {
        position: "absolute",
        bottom: 340,
        left: 170
    },
    egg3: {
        position: "absolute",
        bottom: 450,
        right: 100
    },
    nest4: {
        position: "absolute",
        bottom: 430,
        left: 30
    },
    egg4: {
        position: "absolute",
        bottom: 540,
        left: 110
    },
    nest5: {
        position: "absolute",
        top: 105,
        left: 100
    },
    egg5: {
        position: "absolute",
        top: 148,
        left: 180
    },
});

