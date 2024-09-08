import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='sign-in-officer'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='sign-in-worker'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='sign-up-officer'
        options={{
          headerShown: false
        }}
      />
    </Stack>
  )
}

export default AuthLayout
