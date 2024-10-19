import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';

const MarketplaceScreen = () => {
  const [distance, setDistance] = useState(60);

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < 70; i++) {
      lines.push(<View key={i} style={styles.line}></View>);
    }
    return lines;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Marketplace</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.distanceText}>{distance} km</Text>

          <View style={styles.customSliderWrapper}>
            <TouchableOpacity
              onPress={() => setDistance(Math.max(0, distance - 1))}
              style={styles.iconButton}
            >
              <Entypo name="circle-with-minus" size={24} color="black" />
            </TouchableOpacity>

            <LinearGradient
              colors={['#898686', '#232222']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sliderBackground}
            >
             
              <View style={styles.linesContainer}>{renderLines()}</View>

              <View style={[styles.sliderIndicator, { left: `${(distance / 100) * 100}%` }]}>
                <Text style={styles.sliderIndicatorText}>▼</Text>
              </View>
            </LinearGradient>

            <TouchableOpacity
              onPress={() => setDistance(Math.min(100, distance + 1))}
              style={styles.iconButton}
            >
              <Entypo name="circle-with-plus" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sliderLabel}>Scroll the wheel to adjust job area</Text>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 1.0,
            longitudeDelta: 1.0,
          }}
        >
          <Marker
            coordinate={{
              latitude: 37.7749,
              longitude: -122.4194,
            }}
            title="Job Location"
            description="This is a sample job location"
          />
        </MapView>

        <Text style={styles.jobsAround}>Jobs around...</Text>

        <View style={styles.priorityContainer}>
          <LinearGradient
            colors={['#990303', '#FF3131']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.priorityButton}
          >
            <Text style={styles.priorityText}>Immediate Attention</Text>
            <Text style={styles.prioritySubText}>175+ Jobs</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#896D08', '#EFBE0E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.priorityButton}
          >
            <Text style={styles.priorityText}>High Priority</Text>
            <Text style={styles.prioritySubText}>1,005+ Jobs</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#34660C', '#77CB35']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.priorityButton}
          >
            <Text style={styles.priorityText}>Standard Priority</Text>
            <Text style={styles.prioritySubText}>4,125+ Jobs</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      <LinearGradient
        colors={['#762BAD', '#300E49']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.allJobsContainer}
      >
        <TouchableOpacity style={styles.allJobsButton}>
          <Text style={styles.allJobsText}>All Jobs</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  customSliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 370,
    height: 24,
    backgroundColor: 'transparent',
  },
  iconButton: {

  },
  sliderBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 307,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#232222',
    position: 'relative',
  },
  linesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: '#898686',
  },
  sliderIndicator: {
    position: 'absolute',
    top: -10,
    alignItems: 'center',
  },
  sliderIndicatorText: {
    fontSize: 12,
    color: '#000',
  },
  sliderLabel: {
    color: '#6f28d4',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  map: {
    width: '100%',
    height: 220,
    marginVertical: 20,
  },
  jobsAround: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  priorityContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priorityButton: {
    width: '95%',
    padding: 10,
    borderRadius: 34,
    marginBottom: 10,
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 7,
  },
  priorityText: {
    color: '#fff',
    fontWeight: 'semibold',
    fontSize: 24,
  },
  prioritySubText: {
    color: '#fff',
    fontSize: 14,
  },
  allJobsContainer: {
    alignItems: 'center',
    width: 450,
    height: 450,
    borderRadius: 300,
    position: 'absolute',
    bottom: -380,
    right: -30,
    padding: 10,
  },
  allJobsButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  allJobsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'semibold',
  },
});

export default MarketplaceScreen;
