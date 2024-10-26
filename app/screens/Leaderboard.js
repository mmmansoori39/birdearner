import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const leaderboardData = [
  { name: 'Suraj Kumar', xp: 1356, orders: 48, rank: 1 },
  { name: 'Alex Matthew', xp: 1301, orders: 35, rank: 2 },
  { name: 'Irshad Khan', xp: 1258, orders: 35, rank: 3 },
  { name: 'Akash Singh', xp: 1208, orders: 33, rank: 4 },
  { name: 'Rohit Kumar', xp: 1105, orders: 28, rank: 5 },
  { name: 'You', xp: 8, orders: 19, rank: '1.5K+' },
];

const LeaderboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Lead Board</Text>
      <Text style={styles.subtitle}>(Global)</Text>

      {/* Leaderboard Table */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Xp</Text>
          <Text style={styles.headerText}>Orders</Text>
          <Text style={styles.headerText}>Rank</Text>
        </View>

        {leaderboardData.map((user, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              user.name === 'You' ? styles.currentUserRow : styles.otherUserRow,
            ]}
          >
            <Text style={styles.tableText}>{user.name}</Text>
            <Text style={styles.tableText}>{user.xp}</Text>
            <Text style={styles.tableText}>{user.orders}</Text>
            <Text style={styles.tableText}>{user.rank}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        Feature on the top 5 on lead board and win coupons, gifts and less deduction on your bids!
      </Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.tabShadow]}>
          <Text style={styles.tabText}>Local</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabShadow]}>
          <Text style={styles.tabText}>State</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab, styles.tabShadow]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Global</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  tableContainer: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    marginVertical: 4,
    borderRadius: 10,
  },
  otherUserRow: {
    backgroundColor: '#D6F382',  // light green for other users
  },
  currentUserRow: {
    backgroundColor: '#F44336',  // red for the current user
    color: '#fff',
  },
  tableText: {
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginVertical: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 35,
    paddingVertical: 13,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  activeTab: {
    backgroundColor: '#6A1B9A', // Purple
  },
  tabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeTabText: {
    color: '#fff',
  },
  tabShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
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

export default LeaderboardScreen;
