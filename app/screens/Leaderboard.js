import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const dummyData = {
  local: [
    { name: 'Rahul Sharma', xp: 850, orders: 23, rank: 1 },
    { name: 'Priya Singh', xp: 800, orders: 21, rank: 2 },
    { name: 'Anjali Verma', xp: 750, orders: 20, rank: 3 },
    { name: 'Vikram Mehta', xp: 700, orders: 18, rank: 4 },
    { name: 'Rohit Desai', xp: 650, orders: 17, rank: 5 },
    { name: 'You', xp: 100, orders: 5, rank: '100+' },
  ],
  state: [
    { name: 'Pooja Gupta', xp: 1200, orders: 35, rank: 1 },
    { name: 'Amit Jain', xp: 1150, orders: 34, rank: 2 },
    { name: 'Kavita Yadav', xp: 1100, orders: 33, rank: 3 },
    { name: 'Sanjay Mishra', xp: 1050, orders: 32, rank: 4 },
    { name: 'Manish Roy', xp: 1000, orders: 30, rank: 5 },
    { name: 'You', xp: 8, orders: 19, rank: '500+' },
  ],
  india: [
    { name: 'Suraj Kumar', xp: 1356, orders: 48, rank: 1 },
    { name: 'Alex Matthew', xp: 1301, orders: 35, rank: 2 },
    { name: 'Irshad Khan', xp: 1258, orders: 35, rank: 3 },
    { name: 'Akash Singh', xp: 1208, orders: 33, rank: 4 },
    { name: 'Rohit Kumar', xp: 1105, orders: 28, rank: 5 },
    { name: 'You', xp: 8, orders: 19, rank: '1.5K+' },
  ],
};
const LeaderboardScreen = () => {
  const [selectedTab, setSelectedTab] = useState('india');
  const [leaderboardData, setLeaderboardData] = useState(dummyData.india);

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    setLeaderboardData(dummyData[tab]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Lead Board</Text>
      <Text style={styles.subtitle}>({selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)})</Text>

      {/* Leaderboard Table */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.nameColumn]}>Name</Text>
          <Text style={[styles.headerText, styles.xpColumn]}>Xp</Text>
          <Text style={[styles.headerText, styles.ordersColumn]}>Orders</Text>
          <Text style={[styles.headerText, styles.rankColumn]}>Rank</Text>
        </View>

        {leaderboardData.map((user, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              user.name === 'You'
                ? styles.currentUserRow
                : user.rank === 1 || user.rank === 2
                ? styles.topRankRow
                : styles.otherUserRow,
            ]}
          >
            <Text style={[styles.tableText, styles.nameColumn]} numberOfLines={1} ellipsizeMode="tail">
              {user.name}
            </Text>
            <View style={[styles.xpColumn, user.name === 'You' ? styles.currentredBackground : styles.blueBackground]}>
              <Text style={styles.blueText}>{user.xp}</Text>
            </View>
            <Text style={[styles.tableText, styles.ordersColumn]}>{user.orders}</Text>
            <View style={[styles.rankColumn, user.name === 'You' ? styles.currentredBackgroundd : styles.blueBackgroundd]}>
              <Text style={styles.blueText}>{user.rank}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        Feature on the top 5 on lead board and win coupons, gifts and less deduction on your bids!
      </Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, styles.tabShadow, selectedTab === 'local' && styles.activeTab]}
          onPress={() => handleTabPress('local')}
        >
          <Text style={[styles.tabText, selectedTab === 'local' && styles.activeTabText]}>Local</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, styles.tabShadow, selectedTab === 'state' && styles.activeTab]}
          onPress={() => handleTabPress('state')}
        >
          <Text style={[styles.tabText, selectedTab === 'state' && styles.activeTabText]}>State</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, styles.tabShadow, selectedTab === 'india' && styles.activeTab]}
          onPress={() => handleTabPress('india')}
        >
          <Text style={[styles.tabText, selectedTab === 'india' && styles.activeTabText]}>India</Text>
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
    paddingTop: 50,
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
    // backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#726B6B',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // padding: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  topRankRow: {
    backgroundColor: '#71C232',
  },
  otherUserRow: {
    backgroundColor: '#C9D63E',
  },
  currentUserRow: {
    backgroundColor: '#E8E8E8',
  },
  tableText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    padding: 12,
  },
  nameColumn: {
    flex: 2, // Increased width for Name column
    textAlign: 'center', // Align text to the left
  },
  xpColumn: {
    flex: 1, // Default width
    textAlign: 'center',
  },
  ordersColumn: {
    flex: 1, // Default width
    textAlign: 'center',
  },
  rankColumn: {
    flex: 1, // Default width
    textAlign: 'center',
  },
  blueBackground: {
    backgroundColor: '#762BAD',
    // borderRadius: 5,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  blueBackgroundd: {
    backgroundColor: '#762BAD',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  currentredBackground: {
    backgroundColor: '#DC3737',
    // borderRadius: 5,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  currentredBackgroundd: {
    backgroundColor: '#DC3737',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  blueText: {
    color: 'white',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginVertical: 20,
    paddingHorizontal: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  tab: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  activeTab: {
    backgroundColor: '#6A1B9A',
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
    elevation: 5,
  },
});

export default LeaderboardScreen;
