import { Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomButton from './CustomButton';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth,db } from '../app/firebaseConfig';

const FormFieldOfficer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        userid: '',
        password: '',
    });
    const [officeIds, setOfficeIds] = useState([]); 

    const handleLogin = async () => {
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, form.userid, form.password);
            const user = userCredential.user;

            console.log('User UID:', user.uid);

            const docRef = doc(db, 'officers', user.uid); 
            console.log('Document Reference:', docRef.path);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                await AsyncStorage.setItem('userId', user.uid);
                await AsyncStorage.setItem('isOfficer', JSON.stringify(true));
                console.log('Login successful', userData);

                const officesRef = collection(db, `officers/${user.uid}/offices`);
                const snapshot = await getDocs(officesRef);
                const officeList = snapshot.docs.map(doc => doc.id);
                setOfficeIds(officeList);
                await AsyncStorage.setItem('officeIds', JSON.stringify(officeList)).then(() => console.log(officeList));

                router.replace('/home-officer');
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
            <Text className="text-white font-pmedium">Enter Email</Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100 focus:border-white">
                <TextInput
                    className="flex-1 justify-end text-white font-pmedium"
                    value={form.userid}
                    keyboardType='email-address'
                    onChangeText={(e) => setForm({...form, userid: e})}
                />
            </View>
            <Text className="text-white font-pmedium">Enter Password</Text>
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
            <Link href={'/sign-up-officer'}>
                <Text className="font-psemibold text-white mt-5">Not A Registered User yet? Sign Up</Text>
            </Link>
        </View>
    );
};

export default FormFieldOfficer;
