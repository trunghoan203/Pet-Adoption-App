import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function SignIn() {
    const navigation = useNavigation();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const onSignIn = () => {
        if (!email || !password) {
            const message = 'Please enter all details';
            Platform.OS === 'android' ? ToastAndroid.show(message, ToastAndroid.LONG) : Alert.alert('Error', message);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                // Check if the user is an admin
                const userDoc = await getDoc(doc(db, 'User', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.isAdmin === 1) {
                        router.replace('/home'); // Redirect to Dashboard for Admin
                    } else {
                        router.replace('/home'); // Redirect to Home for regular users
                    }
                }
            })
            .catch((error) => {
                let errorMessage;
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'Wrong email!!!';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Wrong Password!!!';
                } else {
                    errorMessage = error.message;
                }

                if (Platform.OS === 'android') {
                    ToastAndroid.show(errorMessage, ToastAndroid.LONG);
                } else {
                    Alert.alert('Sign-In Error', errorMessage);
                }
            });
    };

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack(); // Only go back if there's a previous screen
        } else {
            router.replace('/'); // Redirect to a default route if there’s no back history
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleGoBack}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Let's Sign You In</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Email'
                    placeholderTextColor={Colors.GRAY}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    secureTextEntry
                    style={styles.input}
                    placeholder='Enter Password'
                    placeholderTextColor={Colors.GRAY}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity onPress={onSignIn} style={styles.signInButton}>
                <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('auth/signup')} style={styles.createAccountButton}>
                <Text style={styles.createAccountButtonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        marginTop: 40,
        backgroundColor: Colors.WHITE,
        height: '100%',
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 30,
        marginTop: 30,
    },
    subtitle: {
        fontFamily: 'outfit',
        fontSize: 30,
        color: Colors.GRAY,
        marginTop: 10,
        marginBottom: 30,
    },
    inputContainer: {
        marginTop: 20,
    },
    label: {
        fontFamily: 'outfit',
        marginLeft: 5,
        marginBottom: 5,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.GRAY,
    },
    signInButton: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginTop: 50,
    },
    signInButtonText: {
        color: Colors.WHITE,
        textAlign: 'center',
    },
    createAccountButton: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginTop: 20,
        borderWidth: 1,
    },
    createAccountButtonText: {
        color: Colors.BLACK,
        textAlign: 'center',
    },
});
