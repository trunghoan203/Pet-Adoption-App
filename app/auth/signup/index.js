import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../../config/FirebaseConfig';

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

    const OnCreateAccount = () => {
        if (!email || !password || !fullName) {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Please enter all details', ToastAndroid.LONG);
            } else {
                Alert.alert('Error', 'Please enter all details');
            }
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Update the profile with displayName
                return updateProfile(user, {
                    displayName: fullName,
                });
            })
            .then(() => {
                // Navigate to the home screen after successful account creation and profile update
                router.replace('/home');
            })
            .catch((error) => {
                const errorMessage = error.message;
                if (Platform.OS === 'android') {
                    ToastAndroid.show(errorMessage, ToastAndroid.LONG);
                } else {
                    Alert.alert('Account has already been created');
                }
            });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create New Account</Text>

            {/** User Full Name */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Full Name'
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>

            {/** Email */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Email'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
            </View>

            {/** Password */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            {/** Create Account Button */}
            <TouchableOpacity onPress={OnCreateAccount} style={styles.createButton}>
                <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>

            {/** Sign In Button */}
            <TouchableOpacity onPress={() => router.replace('auth/signin')} style={styles.signInButton}>
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
