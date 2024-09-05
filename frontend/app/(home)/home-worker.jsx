import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const HomeWorker = () => {
    const handleCheck = () => {
        console.log('checking');
        router.push('check-in')
    }
  return (
    <SafeAreaView className="h-full bg-primary px-8 flex justify-center items-center">
        <CustomButton
            title={'Mark Attendance'}
            handlePress={handleCheck}
            image={require('../../assets/icons/map.png')}
        />
    </SafeAreaView>
  )
}

export default HomeWorker

const styles = StyleSheet.create({})