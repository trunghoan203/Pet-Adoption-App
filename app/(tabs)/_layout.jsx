import { View, Text } from 'react-native'
import React from 'react';
import {Tabs} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from './../../constants/Colors'
export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY
    }}
    >
        <Tabs.Screen name='home'
            options={{
                title: 'Home',
                headerShow: false,
                tabBarIcon:({color})=><Ionicons name="home" size={24} color={color} />
            }}
        />
        <Tabs.Screen name='favorite'
            options={{
                title: 'Favorite',
                headerShow: false,
                tabBarIcon:({color})=><Ionicons name="heart-circle" size={24} color={color} />
            }}
        />
        <Tabs.Screen name='inbox'
            options={{
                title: 'Inbox',
                headerShow: false,
                tabBarIcon:({color})=><Ionicons name="chatbubble-ellipses" size={24} color={color} />
            }}
        />
        <Tabs.Screen name='profile'
            options={{
                title: 'Profile',
                headerShow: false,
                tabBarIcon:({color})=><Ionicons name="person" size={24} color={color} />
            }}
        />
    </Tabs>
  )
}