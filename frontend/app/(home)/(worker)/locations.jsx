import React, { useEffect, useState } from 'react';
import {ActivityIndicator,Text } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MapWorker = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storedValue, setStoredstoredValue] = useState(null);
  useEffect(() => {
    const getData = async () => {
        try {
            const officeData = await AsyncStorage.getItem('officeData');
            const storedValue = JSON.parse(officeData);
            if (storedValue !== null) {
                setStoredstoredValue(storedValue);
            } else {
                Alert.alert('No data found for key: myKey');
            }
        } catch (error) {
            console.error('Error retrieving data', error);
        }
    };
      getData();
  }, []);



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    })();
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
            showsUserLocation={true}
            showsMyLocationButton={true}>
            {location && <Marker coordinate={location} />}
            <Marker
                coordinate={{
                    latitude: parseFloat(storedValue.latitude), 
                    longitude: parseFloat(storedValue.longitude),
                    }
                }
                title='Office'
                description='this is your Office Location'
            />
            <Circle
              center={{
                latitude:parseFloat(storedValue.latitude),
                longitude:parseFloat(storedValue.longitude),
              }}
              radius={1000}
              className="border-2 border-red-300"
              strokeColor='#1a66ff'
              fillColor="rgba(230,238,255,0.5)"
            />
        </MapView>
      </SafeAreaView>
  );
};

export default MapWorker;
