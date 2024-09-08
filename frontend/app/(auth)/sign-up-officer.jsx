import { Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth,db } from '../firebaseConfig';
const SignUpOfficer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        userid: '',
        password: '',
        officeid: '',
    });

    const handleSignUp = async () => {
        setIsLoading(true);

        try {
            // Create user with email and password using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, form.userid, form.password);
            const user = userCredential.user;

            // Store additional user information in Firestore
            const userRef = doc(db, 'officers', user.uid); // Correctly reference the collection and document
            await setDoc(userRef, {
                email: form.userid,
                officeid: form.officeid,
            });

            // Store user data in AsyncStorage
            await AsyncStorage.setItem('userId', user.uid);
            await AsyncStorage.setItem('isOfficer', JSON.stringify(true));
            console.log('Sign Up successful', { email: form.userid, officeid: form.officeid });

            // Redirect to sign-on-officer screen
            router.replace('/sign-in-officer');
        } catch (error) {
            console.error('Sign Up Failed:', error.message);
            Alert.alert('Sign Up Failed', 'An error occurred while trying to sign up.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <View className="space-y-4 mt-20 px-4 flex justify-center">
                <Text className="text-white font-pmedium">
                    Enter Email
                </Text>
                <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100">
                    <TextInput
                        className="flex-1 justify-end text-white font-pmedium"
                        value={form.userid}
                        keyboardType='email-address'
                        onChangeText={(e) => setForm({ ...form, userid: e })}
                    />
                </View>
                <Text className="text-white font-pmedium">
                    Enter Password
                </Text>
                <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100">
                    <TextInput
                        className="flex-1 justify-end text-white font-pmedium"
                        value={form.password}
                        keyboardType='visible-password'
                        secureTextEntry={true}
                        onChangeText={(e) => setForm({ ...form, password: e })}
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
                    title={isLoading ? 'Signing Up...' : 'Sign Up'}
                    handlePress={handleSignUp}
                    disabled={isLoading}
                />
                {isLoading && <ActivityIndicator size="large" color="#fff" />}
                <Text>Already have an account? Sign In</Text>
            </View>
        </SafeAreaView>
    );
};

export default SignUpOfficer;
