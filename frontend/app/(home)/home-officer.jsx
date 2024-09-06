import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const HomeOfficer = () => {
    const handleCheck = () => {
        router.push('check-attendance')
    }
  return (
    <SafeAreaView className="h-full bg-primary px-8 flex justify-center items-center">
        <CustomButton
            title={'Check Attendance'}
            handlePress={handleCheck}
            image={require('../../assets/icons/attendance.png')}
        />
    </SafeAreaView>
  )
}

export default HomeOfficer
