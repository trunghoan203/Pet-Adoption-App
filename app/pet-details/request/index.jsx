import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, Platform, Alert, Image, Pressable, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../../constants/Colors';
import { db, storage } from '../../../config/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from "firebase/auth";

export default function RequestAdopt() {
    const { petId } = useLocalSearchParams();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userImage, setUserImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const navigation = useNavigation();
    const user = getAuth().currentUser;

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const imagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUserImage(result.assets[0].uri);
        }
    };

    const uploadUserImage = async () => {
        if (!userImage) return;
        setLoader(true);
        const response = await fetch(userImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `UserImages/${Date.now()}.jpg`);

        try {
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            setImageUrl(downloadURL);
            saveFormData(downloadURL); // Proceed to save form data
        } catch (error) {
            console.error("Image upload failed: ", error);
            Alert.alert("Error", "There was an error uploading the image. Please try again.");
        } finally {
            setLoader(false);
        }
    };

    const handleSubmit = () => {
        if (!petId) {
            Alert.alert('Error', 'Pet ID is missing. Please try again.');
            return;
        }

        if (!fullName || !phone || !email || !userImage) {
            const errorMsg = 'Please fill in all required fields';
            Platform.OS === 'android' ? ToastAndroid.show(errorMsg, ToastAndroid.LONG) : Alert.alert('Error', errorMsg);
            return;
        }

        uploadUserImage();
    };

    const saveFormData = async (downloadURL) => {
        try {
            await setDoc(doc(db, 'AdoptionRequests', `${petId}_${user.uid}`), {
                petId,
                userId: user.uid,
                fullName,
                phone,
                email,
                userImage: downloadURL, // Use the uploaded image URL
                status: 'Pending',
                requestDate: new Date(),
            });

            Alert.alert('Request Sent', 'Your adoption request has been sent to the admin.');
            router.replace('/order');
        } catch (error) {
            console.error('Error submitting adoption request: ', error);
            Alert.alert('Error', 'There was an error sending your request. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Adoption Request</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.GRAY}
                value={fullName}
                onChangeText={setFullName}
            />

            <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor={Colors.GRAY}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.GRAY}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <Pressable onPress={imagePicker} style={styles.imagePicker}>
                {!userImage ? (
                    <Image source={require('../../../assets/images/placeholder-user.jpg')} style={styles.placeholderImage} />
                ) : (
                    <Image source={{ uri: userImage }} style={styles.image} />
                )}
            </Pressable>

            <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Why do you want to adopt this pet?"
                placeholderTextColor={Colors.GRAY}
                value={message}
                onChangeText={setMessage}
                multiline
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loader}>
                {loader ? <ActivityIndicator size="large" color={Colors.WHITE} /> : <Text style={styles.submitButtonText}>Submit Request</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: Colors.WHITE,
        marginTop: 30
    },
    headerText: {
        fontSize: 30,
        fontFamily: 'outfit-bold',
        marginBottom: 20,
        color: Colors.PRIMARY,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 10,
        marginBottom: 15,
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    imagePicker: {
        alignItems: 'center',
        marginVertical: 15,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    submitButtonText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'outfit-medium',
    },
});