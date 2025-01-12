import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const SecurityScreen = ({ navigation }) => {
    const dummyData = [
        { title: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account.' },
        { title: 'Change Security Questions', description: 'Update your security questions for account recovery.' },
        { title: 'Manage Trusted Devices', description: 'View and remove devices you trust.' },
        { title: 'Account Activity', description: 'Review recent account activity for unusual behavior.' },
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
                <Text style={styles.header}>Security</Text>
            </View>

            {/* Security Options */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {dummyData.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.optionContainer}>
                        <View>
                            <Text style={styles.optionTitle}>{item.title}</Text>
                            <Text style={styles.optionDescription}>{item.description}</Text>
                        </View>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
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
        gap: 100,
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

    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    arrowIcon: {
        fontSize: 18,
        color: '#888',
    },
});

export default SecurityScreen;
