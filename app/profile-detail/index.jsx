import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useNavigation } from 'expo-router';

export default function ProfileDetail() {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation = useNavigation();


    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    // Fetch user data from Firestore
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userDoc = await getDoc(doc(db, 'User', user.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                Alert.alert('Error', 'User data not found');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Handle updating user profile in Firestore
    const handleUpdateProfile = async () => {
        try {
            setUpdating(true);
            await updateDoc(doc(db, 'User', user.uid), userData);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile Details</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
                style={styles.input}
                value={userData.fullName}
                onChangeText={(text) => setUserData({ ...userData, fullName: text })}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={userData.userEmail}
                editable={false} // Email is typically non-editable
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={userData.address}
                onChangeText={(text) => setUserData({ ...userData, address: text })}
            />

            <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateProfile}
                disabled={updating}
            >
                {updating ? (
                    <ActivityIndicator size="small" color={Colors.WHITE} />
                ) : (
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.WHITE,
        marginTop: 30
    },
    header: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: Colors.GRAY,
        marginTop: 10,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 5,
        marginTop: 5,
        fontFamily: 'outfit',
    },
    updateButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    updateButtonText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
