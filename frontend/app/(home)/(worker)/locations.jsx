import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapWorker = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storedValue, setStoredValue] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const officeData = await AsyncStorage.getItem('officeData');
        const storedValue = JSON.parse(officeData);
        if (storedValue !== null) {
          setStoredValue(storedValue);
        } else {
          Alert.alert('No data found for key: officeData');
        }
      } catch (error) {
        console.error('Error retrieving data', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const watchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, 
          distanceInterval: 1, 
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );

  
      return () => {
        locationSubscription.remove();
      };
    };

    watchLocation().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary h-full">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full w-full bg-primary flex-1 justify-center items-center px-4">
      <MapView
        className="w-full h-4/6"
        initialRegion={location}
        region={location} 
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {storedValue && (
          <>
            <Marker
              coordinate={{
                latitude: parseFloat(storedValue.latitude),
                longitude: parseFloat(storedValue.longitude),
              }}
              title="Office"
              description="This is your Office Location"
            />
            <Circle
              center={{
                latitude: parseFloat(storedValue.latitude),
                longitude: parseFloat(storedValue.longitude),
              }}
              radius={200}
              className="border-2 border-red-300"
              strokeColor="#1a66ff"
              fillColor="rgba(230,238,255,0.5)"
            />
          </>
        )}
      </MapView>
    </SafeAreaView>
  );
};

export default MapWorker;
