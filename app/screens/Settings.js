import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

const settingsData = [
  {
    title: 'Account Settings',
    options: [
      {
        name: "Availability",
        stack_name: "Availability"
      },
      {
        name: "My profile",
        stack_name: "MyProfile"
      },
      {
        name: "Password update",
        stack_name: "Password update"
      },
      {
        name: "Change your email",
        stack_name: "Email update"
      },
    ]
  },
  {
    title: 'Payment Settings',
    options: [
      {
        name: "Withdrawal Earning",
        stack_name: "Withdrawal Earning"
      },
      {
        name: "Link your wallet/Bank account",
        stack_name: "Bank Account details"
      },
      {
        name: "Your Wallet & History",
        stack_name: "Wallet"
      },
    ]
  },
  {
    title: 'Preferences',
    options: [
      {
        name: "Notifications",
        stack_name: "Notifications Setting"
      },
      {
        name: "Appearance",
        stack_name: "Appearance"
      },
      {
        name: "Security",
        stack_name: "Availability"
      },
    ]
  },
  {
    title: 'About',
    options: [
      {
        name: "Terms & Conditions",
        stack_name: "Availability"
      },
      {
        name: "Feedback",
        stack_name: "MyReview"
      },
      {
        name: "Privacy Policy",
        stack_name: "Availability"
      },
      {
        name: "Blogs & Forum",
        stack_name: "Availability"
      },
    ]
  },
];

const SettingsScreen = ({navigation}) => {
 
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsData.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.options.map((option, idx) => (
              <TouchableOpacity key={idx} style={styles.optionContainer} onPress={() => {
              navigation.navigate(option.stack_name);
            }} >
              <Text style={styles.optionText} >{option.name}</Text>
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
    // marginTop: 20
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
