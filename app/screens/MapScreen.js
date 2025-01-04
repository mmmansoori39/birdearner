import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Constants from "expo-constants";

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const olaApiKey =
        Constants.manifest?.android?.config?.olaMaps?.apiKey ||
        Constants.expoConfig?.android?.config?.olaMaps?.apiKey;

    if (!olaApiKey) {
        console.error("OLA API key is missing in app configuration.");
    }

    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied.");
                Alert.alert(
                    "Permission Denied",
                    "Please enable location permissions in your device settings."
                );
                return;
            }

            const userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);
        };

        getLocation();
    }, []);

    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#762BAD" />
            </View>
        );
    }

    return (
        <MapView
            style={styles.map}
            region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
        >
            <Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}
                title="You are here"
                description="Your current location"
            />
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default MapScreen;
