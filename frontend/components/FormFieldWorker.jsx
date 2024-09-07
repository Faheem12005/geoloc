import { StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomButton from './CustomButton';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setIsOfficer } from '../app/redux/features/workerSlice';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getFirestore();
const auth = getAuth();


const FormFieldWorker = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        workerid: '',
        officeid: '',
    });

    const handleLogin = async () => {
        console.log(form.workerid);
        console.log(form.officeid);
        if (!form.workerid) {
            Alert.alert('Validation Error', 'Worker ID is required.');
            return;
        }
    
        setIsLoading(true);
        try {
            const workersRef = collection(db, 'worker');
    
            const q = query(workersRef, where('workerid', '==', form.workerid));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const workerDoc = querySnapshot.docs[0].data();
    
                // Check if the officeid matches
                if (workerDoc.officeid === form.officeid) {
                    // Login successful, store user data
                    await AsyncStorage.setItem('userId', form.workerid);
                    await AsyncStorage.setItem('isOfficer', JSON.stringify(false));
                    
                    console.log('Login successful', workerDoc);
                    router.replace('/home-worker');
                } else {
                    throw new Error('Invalid office ID');
                }
            } else {
                throw new Error('No such worker found');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Login Failed', 'Invalid User ID or Office ID.');
        } finally {
            setIsLoading(false);
            dispatch(setIsOfficer(false));
        }
    };
    
    return (
        <View className="space-y-4">
            <Text className="text-white font-pmedium">
                Enter WorkerId
            </Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100">
                <TextInput
                    className="flex-1 justify-end text-white font-pmedium"
                    value={form.workerid}
                    keyboardType='default'
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
            
        </View>
    );
};

export default FormFieldWorker;

