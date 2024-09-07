import { StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomButton from './CustomButton';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setIsOfficer } from '../app/redux/features/workerSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const FormFieldWorker = () => {
    const db = getFirestore();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        workerid: '',
        officeid: '',
    });

    const handleLogin = async () => {
        setIsLoading(true);
        const { workerid, officeid } = form;
        console.log('Form Data:', { workerid, officeid });

        try {
            // Query to find all officer documents
            const officerSnapshot = await getDocs(collection(db, 'officers'));
            console.log('Officers Snapshot:', officerSnapshot.empty ? 'No officers found' : 'Officers found');

            let validWorkerFound = false;

            // Iterate through the officers to check if the office and workerId match
            for (const officerDoc of officerSnapshot.docs) {
                console.log('Officer ID:', officerDoc.id);

                // Reference to the `offices` collection for the current officer
                const officeDocRef = doc(db, 'officers', officerDoc.id, 'offices', officeid);
                const officeDocSnap = await getDoc(officeDocRef);
                console.log('Office Document Snapshot:', officeDocSnap.exists() ? 'Office found' : 'Office not found');

                if (officeDocSnap.exists()) {
                    const officeData = officeDocSnap.data();
                    console.log('Office Data:', officeData);

                    // Reference to the `workers` collection within the `offices`
                    const workerDocRef = doc(db, 'officers', officerDoc.id, 'offices', officeid, 'workers', workerid);
                    const workerDocSnap = await getDoc(workerDocRef);
                    console.log('Worker Document Snapshot:', workerDocSnap.exists() ? 'Worker found' : 'Worker not found');

                    if (workerDocSnap.exists()) {
                        const workerData = workerDocSnap.data();
                        console.log('Worker Data:', workerData);

                        // Store worker data in AsyncStorage
                        await AsyncStorage.setItem('officerId',officerDoc.id);
                        await AsyncStorage.setItem('workerId', workerid);
                        await AsyncStorage.setItem('officeId', officeid);
                        await AsyncStorage.setItem('officeData', JSON.stringify(officeData));
                        await AsyncStorage.setItem('workerData', JSON.stringify(workerData));
                        await AsyncStorage.setItem('isOfficer', JSON.stringify(false));

                        console.log('Login successful');

                        // Navigate to worker's home page
                        router.replace('/home-worker');
                        dispatch(setIsOfficer(false));
                        validWorkerFound = true;
                        break;
                    }
                }
            }

            if (!validWorkerFound) {
                throw new Error('No valid office-worker association found');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Login Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="space-y-4">
            <Text className="text-white font-pmedium">
                Enter UserId
            </Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100">
                <TextInput
                    className="flex-1 justify-end text-white font-pmedium"
                    value={form.workerid}
                    keyboardType='email-address'
                    onChangeText={(e) => setForm({ ...form, workerid: e })}
                />
            </View>
            <Text className="text-white font-pmedium">
                Enter OfficeId
            </Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100">
                <TextInput
                    className="flex-1 justify-end text-white font-pmedium"
                    value={form.officeid}
                    keyboardType='default'
                    onChangeText={(e) => setForm({ ...form, officeid: e })}
                />
            </View>
            <CustomButton
                title={isLoading ? 'Logging In...' : 'Log In'}
                handlePress={handleLogin}
                disabled={isLoading}
            />
            {isLoading && <ActivityIndicator size="large" color="#fff" />}
            <Text>Not A Registered User yet? Sign In</Text>
        </View>
    );
};

export default FormFieldWorker;
