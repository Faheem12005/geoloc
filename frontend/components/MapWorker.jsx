import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './CustomButton';
import { PROVIDER_GOOGLE } from 'react-native-maps';

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; 
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const officeLoc = {
  latitude: 12.900075725154512,
  longitude: 80.22701231949773,
};

const MapWorker = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [distance, setDistance] = useState(null);

  const handlePressCheckIn = async () => {
    setCheckedIn(true);
  };

  const handlePressCheckOut = async () => {
    setCheckedIn(false);
  };

  useEffect(() => {
    let locationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // Start watching user's location
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10, 
        },
        (locationData) => {
          const { latitude, longitude } = locationData.coords;
          setLocation({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          const dist = getDistance(
            latitude,
            longitude,
            officeLoc.latitude,
            officeLoc.longitude
          );
          setDistance(dist);

          if (dist < 500) {
            setCanCheckIn(true);
          } else {
            setCanCheckIn(false);
          }
        }
      );

      setLoading(false);
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
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
        provider={PROVIDER_GOOGLE}
        className="w-full h-4/6"
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {location && <Marker coordinate={location} />}
        <Marker
          coordinate={{
            latitude: officeLoc.latitude,
            longitude: officeLoc.longitude,
          }}
          title="Office"
          description="This is your office location"
        />
        <Circle
          center={{
            latitude: officeLoc.latitude,
            longitude: officeLoc.longitude,
          }}
          radius={1000}
          className="border-2 border-red-300"
          strokeColor="#1a66ff"
          fillColor="rgba(230,238,255,0.5)"
        />
      </MapView>
      <Text className="text-white font-psemibold mt-10">Distance From Office: {distance ? `${distance.toFixed(2)} meters` : 'Calculating...'}</Text>
      <CustomButton
        title={checkedIn ? 'Check Out' : 'Check in'}
        disabled={!canCheckIn}
        style={checkedIn ? "bg-green-300" : null}
        handlePress={checkedIn ? handlePressCheckOut : handlePressCheckIn}
      />
      {canCheckIn ? null : <Text className="text-red-600 mt-4 font-semibold">Cannot Check In</Text>}
    </SafeAreaView>
  );
};

export default MapWorker;
