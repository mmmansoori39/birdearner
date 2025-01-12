import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const TermsAndConditionsScreen = ({ navigation }) => {
    const dummyTerms = [
        { title: 'General Terms', content: 'These are the general terms and conditions for using our platform.' },
        { title: 'User Responsibilities', content: 'You are responsible for keeping your account secure.' },
        { title: 'Prohibited Activities', content: 'Using the platform for illegal activities is strictly prohibited.' },
        { title: 'Termination of Services', content: 'We reserve the right to terminate your account under certain conditions.' },
        { title: 'Liability', content: 'We are not liable for damages resulting from misuse of the platform.' },
    ];

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.main}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Terms & Conditions</Text>
            </View>

            {/* Terms List */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {dummyTerms.map((term, index) => (
                    <View key={index} style={styles.termContainer}>
                        <Text style={styles.termTitle}>{term.title}</Text>
                        <Text style={styles.termContent}>{term.content}</Text>
                    </View>
                ))}
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
        marginBottom: 50,
        display: "flex",
        flexDirection: "row",
        gap: 60,
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        // marginBottom: 20,
        textAlign: "center",
    },
    scrollView: {
        padding: 16,
    },
    termContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    termTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    termContent: {
        fontSize: 14,
        color: '#666',
    },
});

export default TermsAndConditionsScreen;
