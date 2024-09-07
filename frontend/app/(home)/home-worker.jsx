import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useEffect } from 'react'
import * as Location from 'expo-location';

const YOUR_TASK_NAME = 'bg-loc-check';

const regions = [
  {
    identifier: 'WorksiteRegion',
    latitude: 12.899192509493218,
    longitude: 80.22589542460639, 
    radius: 200,
    notifyOnEnter: true,
    notifyOnExit: true,
  },
];

const HomeWorker = () => {
    const handleCheck = () => {
        router.push('/check-in')
    }
    const handleLocs = () => {
        router.push('/locations');
    }

    useEffect(() => {
      const setupGeofencing = async () => {
          const { status } = await Location.requestBackgroundPermissionsAsync();
          if (status !== 'granted') {
              console.log('Permission to access location was denied');
              return;
          }

          await Location.startGeofencingAsync(YOUR_TASK_NAME, regions).then(()=> {console.log("geofencing...")}).catch((error) => {
              console.error('Error starting geofencing', error);
          });
      };

      const stopGeofencing = async () => {
          await Location.stopGeofencingAsync(YOUR_TASK_NAME).then(()=> {console.log("stopped geofencing")}).catch((error) => {
              console.error('Error stopping geofencing', error);
          });
      };

      setupGeofencing();

      return () => {
          stopGeofencing(); 
      };
  }, []);

  return (
    <SafeAreaView className="h-full bg-primary px-8 flex justify-center items-center">
        <CustomButton
            title={'Check Office Locations'}
            handlePress={handleLocs}
        />
        <CustomButton
            title={'Mark Attendance Offsite'}
            handlePress={handleCheck}
            image={require('../../assets/icons/map.png')}
        />
    </SafeAreaView>
  )
}

export default HomeWorker
