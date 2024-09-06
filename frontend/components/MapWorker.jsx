import React, { useEffect, useState } from 'react';
import {ActivityIndicator,Text } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './CustomButton';


const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the Earth in meters
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


const MapWorker = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canCheckIn,setCanCheckIn] = useState(false);
  const [checkedIn,setCheckedIn] = useState(false);

  const handlePress = async () => {
    
    setCheckedIn(true)
  }

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
      const distance = getDistance(coords.latitude,coords.longitude,12.841645918904097, 80.15425983392053)
      if(distance<500){
        setCanCheckIn(true);
      }
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
                    latitude: 12.822946312996516, 
                    longitude: 80.17351326862706,
                    }
                }
                title='Office'
                description='this is your Office Location'
            />
            <Circle
              center={{
                latitude:12.841943225580854,
                longitude: 80.1541935613669,
              }}
              radius={1000}
              className="border-2 border-red-300"
              strokeColor='#1a66ff'
              fillColor="rgba(230,238,255,0.5)"
            />
        </MapView>
        <CustomButton
        title={checkedIn ? 'Checked In' : 'Check in'}
        disabled={!canCheckIn}
        style={checkedIn ? "bg-green-300" : null}
        handlePress={handlePress}
        />
        {canCheckIn ? null : <Text className="text-red-600 mt-4 font-psemibold">Cant Check In</Text>}
      </SafeAreaView>
  );
};

export default MapWorker;
