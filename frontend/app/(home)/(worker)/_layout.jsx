import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const WorkerLayout = () => {
  return (
    <Stack>
    <Stack.Screen
        name='check-in' options={{headerShown: false}}
    />
    <Stack.Screen
        name='locations' options={{headerShown: false}}
    />
</Stack>
  )
}

export default WorkerLayout

