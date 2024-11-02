import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../../../config/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
    const navigation = useNavigation();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const OnCreateAccount = async () => {
        if (!email || !password || !fullName) {
            const message = 'Please enter all details';
            Platform.OS === 'android' ? ToastAndroid.show(message, ToastAndroid.LONG) : Alert.alert('Error', message);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: fullName });

            // Add user data to Firestore
            await setDoc(doc(db, "User", user.uid), {
                fullName: fullName,
                userEmail: email,
                isUser: 1,
            });

            router.replace('/auth/signin');
        } catch (error) {
            const errorMessage = error.message;
            Platform.OS === 'android' ? ToastAndroid.show(errorMessage, ToastAndroid.LONG) : Alert.alert('Sign-Up Error', errorMessage);
        }
    };

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.replace('/auth/signin'); // Redirect to Sign In screen if no previous screen
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleGoBack}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create New Account</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Full Name'
                    placeholderTextColor={Colors.GRAY}
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Email'
                    placeholderTextColor={Colors.GRAY}
                    keyboardType='email-address'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Password'
                    placeholderTextColor={Colors.GRAY}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity onPress={OnCreateAccount} style={styles.createButton}>
                <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('auth/signin')} style={styles.signInButton}>
                <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        paddingTop: 50,
        backgroundColor: Colors.WHITE,
        height: "100%",
    },
    headerText: {
        fontFamily: 'outfit-bold',
        fontSize: 30,
        marginTop: 30,
    },
    inputContainer: {
        marginTop: 20,
    },
    label: {
        fontFamily: 'outfit',
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.GRAY,
    },
    createButton: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginTop: 50,
    },
    createButtonText: {
        color: Colors.WHITE,
        textAlign: "center",
    },
    signInButton: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginTop: 20,
        borderWidth: 1,
    },
    signInButtonText: {
        color: Colors.BLACK,
        textAlign: "center",
    },
});
