import { StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomButton from './CustomButton'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'
import { setIsOfficer } from '../app/redux/features/workerSlice'

const FormFieldOfficer = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        userid: '',
        password: '',
    })

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('officer/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: form.userid,
                    password: form.password,
                }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            console.log(data)
            
        } catch (error) {
            console.error(error)
            Alert.alert('Login Failed', 'An error occurred while trying to log in.')
        } finally {
            dispatch(setIsOfficer(true))
            router.replace('/home-officer')
            setIsLoading(false)
        }
    }

    return (
        <View className="space-y-4">
            <Text className="text-white font-pmedium">
                Enter UserId
            </Text>
            <View className="border-2 border-black-200 w-full h-16 px-4 rounded-2xl bg-black-100 focus:border-white" >
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
                    keyboardType='visible-password'
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
        </View>
    )
}

export default FormFieldOfficer
