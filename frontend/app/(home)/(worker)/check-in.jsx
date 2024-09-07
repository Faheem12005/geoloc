import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapWorker from '../../../components/MapWorker'

const CheckIn = () => {
  return (
    <SafeAreaView className="h-full w-full bg-primary flex-1 justify-center items-center px-4">
      <MapWorker/>
    </SafeAreaView>
  )
}

export default CheckIn

