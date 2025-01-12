import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const PrivacyPolicyScreen = ({ navigation }) => {
    const privacyPolicyText = `
    Welcome to our Privacy Policy.
    
    Your privacy is critically important to us. This document explains how we collect, use, and protect your personal information.
    
    1. **Information We Collect**:
       - Personal data such as name, email, and contact information.
       - Usage data including app interactions and preferences.

    2. **How We Use Your Information**:
       - To provide and improve our services.
       - To communicate updates, offers, and other relevant information.

    3. **Your Rights**:
       - Access, update, or delete your personal data.
       - Opt-out of marketing communications at any time.

    4. **Data Security**:
       - We use state-of-the-art encryption and security practices to protect your data.

    For more detailed information, please contact our support team.
  `;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Privacy Policy</Text>
            </View>

            {/* Privacy Policy Content */}
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.contentText}>{privacyPolicyText}</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    main: {
        marginTop: 45,
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        gap: 100,
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        // marginBottom: 20,
        textAlign: "center",
    },
    contentContainer: {
        padding: 16,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    contentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});

export default PrivacyPolicyScreen;
