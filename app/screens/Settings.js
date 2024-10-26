import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

const settingsData = [
  {
    title: 'Account Settings',
    options: ['Availability', 'My profile', 'Password update', 'Change your email'],
  },
  {
    title: 'Payment Settings',
    options: ['Withdrawal Earning', 'Link your wallet/Bank account', 'Your Wallet & History'],
  },
  {
    title: 'Preferences',
    options: ['Notifications', 'In-app Currency', 'Appearance', 'Security'],
  },
  {
    title: 'About',
    options: ['Terms & Conditions', 'Feedback', 'Privacy Policy', 'Blogs & Forum'],
  },
];

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Settings</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {/* Settings List */}
      <ScrollView style={styles.scrollView}>
        {settingsData.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.options.map((option, idx) => (
              <TouchableOpacity key={idx} style={styles.optionContainer}>
                <Text style={styles.optionText}>{option}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#888',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  icon: {
    fontSize: 24,
  },
});

export default SettingsScreen;
