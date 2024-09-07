import { Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomButton from './CustomButton';
import { router,Link } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setIsOfficer } from '../app/redux/features/workerSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc,getFirestore } from 'firebase/firestore';
import { db } from '../app/firebaseConfig'; // Adjust the import according to your setup

const FormFieldOfficer = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        userid: '',
        password: '',
    });

    const handleLogin = async () => {
        setIsLoading(true);
        const auth = getAuth();
        const db = getFirestore();
    
        try {
            // Sign in with email and password using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, form.userid, form.password);
            const user = userCredential.user;
    
            console.log('User UID:', user.uid);
    
            // Retrieve user data from Firestore
            const docRef = doc(db, 'officers', user.uid); // Assumes Firestore collection is named 'officers'
            console.log('Document Reference:', docRef.path);
    
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                // Store user data in AsyncStorage
                await AsyncStorage.setItem('userId', user.uid);
                await AsyncStorage.setItem('isOfficer', JSON.stringify(true));
                
                console.log('Login successful', userData);
    
                // Navigate to the home page for officers
                router.replace('/home-officer');
                dispatch(setIsOfficer(true));
            } else {
                console.log('No such document!');
                throw new Error('No such user found');
            }
        } catch (error) {
            console.error('Login Failed:', error.message);
            Alert.alert('Login Failed', 'Invalid email, password, or user does not exist.');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <View className="space-y-4">
            <Text className="text-white font-pmedium">
                Enter Email
            </Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100 focus:border-white">
                <TextInput
                    className="flex-1 justify-end text-white font-pmedium"
                    value={form.userid}
                    keyboardType='email-address'
                    onChangeText={(e) => setForm({...form, userid: e})}
                />
            </View>
            <Text className="text-white font-pmedium">
                Enter Password
            </Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100 focus:border-white">
                <TextInput
                    className="flex-1 justify-end text-white font-pmedium"
                    value={form.password}
                    keyboardType='default'
                    secureTextEntry={true}
                    onChangeText={(e) => setForm({...form, password: e})}
                />
            </View>
            <CustomButton
                title={isLoading ? 'Logging In...' : 'Log In'}
                handlePress={handleLogin}
                disabled={isLoading}
            />
            {isLoading && <ActivityIndicator size="large" color="#fff" />}
            <Link href={'/sign-up-officer'}><Text className="font-psemibold text-white mt-5">Not A Registered User yet? Sign In</Text></Link>
        </View>
    );
};

export default FormFieldOfficer;
