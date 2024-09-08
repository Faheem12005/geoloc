import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDocs, setDoc, updateDoc, collection, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';


const YOUR_TASK_NAME = 'bg-loc-check';

const HomeWorker = () => {
    const [officeCoordinates, setOfficeCoordinates] = useState(null);
    const [isGeofencingActive, setIsGeofencingActive] = useState(false);

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (deg) => deg * (Math.PI / 180);
        const R = 6371e3;

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; 
    };

    const CheckIn = async () => {
        const officeId = await AsyncStorage.getItem('officeId');
        const workerId = await AsyncStorage.getItem('workerId');
        const officerId = await AsyncStorage.getItem('officerId');
        const date = new Date().toISOString().split('T')[0]; 
        const currentTime = new Date().toISOString(); 
    
        try {
            const checkInsRef = collection(db, `officers/${officerId}/offices/${officeId}/workers/${workerId}/checkins`);
            
            const q = query(checkInsRef, where('date', '==', date));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                const docRef = doc(db, docSnap.ref.path);
    
                const data = docSnap.data();
                if (!data.checkInTime) {
                    await updateDoc(docRef, { checkInTime: currentTime });
                    console.log('Check-in time recorded.');
                } 
            } else {
                const newDocRef = doc(checkInsRef, date);
                await setDoc(newDocRef, {
                    date: date,
                    checkInTime: currentTime,
                    checkOutTime: null,
                });
                console.log('New check-in record created.');
            }
        } catch (error) {
            console.error('Error checking in:', error);
        }
    };

    useEffect(() => {
        const checkProximity = async () => {
            try {
                const officeData = await AsyncStorage.getItem('officeData');
                if (officeData) {
                    const parsedOfficeData = JSON.parse(officeData);
                    setOfficeCoordinates({
                        latitude: parsedOfficeData.latitude,
                        longitude: parsedOfficeData.longitude,
                    });
                    console.log('Office Coordinates:', parsedOfficeData);

                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        console.error('Permission to access location was denied');
                        return;
                    }

                    const location = await Location.getCurrentPositionAsync({});

                    const distance = getDistance(
                        location.coords.latitude,
                        location.coords.longitude,
                        parsedOfficeData.latitude,
                        parsedOfficeData.longitude
                    );

                    console.log(`Distance to office: ${distance} meters`);

                    if (distance <= 200) {
                        await CheckIn(); 
                    } else {
                        console.log('You are not within 200 meters of the office.');
                    }
                } else {
                    console.error('Office data not found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        checkProximity();
    }, []);

    useEffect(() => {
        if (!officeCoordinates) return;
    
        const setupGeofencing = async () => {
            const { status } = await Location.requestBackgroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access background location was denied');
                return;
            }
    
            // Start geofencing if it's not already active
            if (!isGeofencingActive) {
                try {
                    await Location.startGeofencingAsync(YOUR_TASK_NAME, [{
                        latitude: parseFloat(officeCoordinates.latitude),
                        longitude: parseFloat(officeCoordinates.longitude),
                        radius: 200
                    }]).then(()=> {console.log("geofencing...")}).catch((error) => {
                        console.error('Error starting geofencing', error);
                        setIsGeofencingActive(true);
                    });
                } catch (error) {
                    console.error('Error starting geofencing', error);
                }
            }
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
    }, [officeCoordinates]); 
    

    return (
        <SafeAreaView className="h-full bg-primary px-8 flex justify-center items-center">
            <CustomButton
                title={'Check Office Locations'}
                handlePress={() => router.push('/locations')}
                image={require('../../assets/icons/map.png')}
            />
            <CustomButton
                title={'Mark Attendance Offsite'}
                handlePress={() => router.push('/check-in')}
                image={require('../../assets/icons/plus.png')}
            />
        </SafeAreaView>
    );
};

export default HomeWorker;
