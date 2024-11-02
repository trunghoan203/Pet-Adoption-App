import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from './../../constants/Colors';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function TabLayout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const fetchUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'User', user.uid));
                if (userDoc.exists() && userDoc.data().isAdmin === 1) {
                    setIsAdmin(true);
                }
            }
        };
        fetchUserRole();
    }, []);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.PRIMARY,
        }}>

            <Tabs.Screen
                name={isAdmin ? 'home' : 'home'}
                options={{
                    title: isAdmin ? 'Dashboard' : 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) =>
                        <Ionicons name={isAdmin ? "bar-chart" : "home"} size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name='favorite'
                options={{
                    title: 'Favorite',
                    headerShown: false,
                    tabBarIcon: ({ color }) =>
                        <Ionicons name="heart-circle" size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="order"
                options={{
                    title: 'Order',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="archive-sharp" size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="managepet"
                options={{
                    title: 'Manage Pet',
                    headerShown: false,
                    tabBarIcon: ({ color }) =>
                        <Ionicons name="cog-sharp" size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />

        </Tabs>
    );
}
