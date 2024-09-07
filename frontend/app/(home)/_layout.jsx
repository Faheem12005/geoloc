import React from 'react'
import { Stack } from 'expo-router'

const HomeLayout = () => {
  return (
    <Stack>
        <Stack.Screen
            name='home-officer' options={{headerShown: false}}
        />
        <Stack.Screen
            name='home-worker' options={{headerShown: false}}
        />
        <Stack.Screen
            name='check-attendance' options={{headerShown: false}}
        />
        <Stack.Screen
            name='(worker)' options={{headerShown: false}}
        />
    </Stack>
  )
}

export default HomeLayout
