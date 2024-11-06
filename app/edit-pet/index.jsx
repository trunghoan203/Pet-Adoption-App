import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function EditPet() {
    const navigation = useNavigation();
    const { id: petId } = useLocalSearchParams(); // Assuming petId is passed as a param
    const [formData, setFormData] = useState({ category: 'Bird', sex: 'Male' });
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image, setImage] = useState(null);
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Edit Pet'
        });
        fetchCategories();
        fetchPetData();
    }, [petId]);

    // Fetch available categories
    const fetchCategories = async () => {
        const snapshot = await getDocs(collection(db, 'Category'));
        setCategoryList(snapshot.docs.map(doc => doc.data()));
    };

    // Fetch pet data for editing
    const fetchPetData = async () => {
        if (!petId) return;
        try {
            const petDoc = await getDoc(doc(db, 'Pets', petId));
            if (petDoc.exists()) {
                const petData = petDoc.data();
                setFormData(petData);
                setImage(petData.imageUrl); // Load existing image URL
                setSelectedCategory(petData.category);
            } else {
                Alert.alert("Error", "Pet data not found.");
                router.back();
            }
        } catch (error) {
            console.error("Error loading pet data: ", error);
            Alert.alert("Error", "Failed to load pet data.");
        }
    };

    // Image picker for selecting new image
    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const onUpdate = () => {
        if (!formData.name || !formData.category || !formData.breed || !formData.age || !formData.sex || !formData.weight || !formData.address || !formData.about) {
            Alert.alert('Missing Information', 'Please fill in all the required fields.');
            return;
        }
        if (image && image !== formData.imageUrl) {
            uploadImageAndSave();
        } else {
            saveUpdatedData(formData.imageUrl);
        }
    };

    const uploadImageAndSave = async () => {
        setLoader(true);
        const resp = await fetch(image);
        const blobImage = await resp.blob();
        const storageRef = ref(storage, '/PetAdopt' + Date.now() + '.jpg');

        uploadBytes(storageRef, blobImage).then(() => {
            getDownloadURL(storageRef).then(async (downloadUrl) => {
                saveUpdatedData(downloadUrl);
            });
        }).catch(() => {
            setLoader(false);
            Alert.alert('Error', 'Failed to upload image. Please try again.');
        });
    };

    const saveUpdatedData = async (imageUrl) => {
        try {
            setLoader(true);
            await updateDoc(doc(db, 'Pets', petId), {
                ...formData,
                imageUrl: imageUrl,
            });
            setLoader(false);
            Alert.alert('Success', 'Pet updated successfully!');
            router.replace('/(tabs)/managepet');
        } catch (error) {
            console.error("Error updating pet data: ", error);
            Alert.alert("Error", "Failed to update pet data.");
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 20 }}>Edit Pet Information</Text>

            <Pressable onPress={imagePicker}>
                {!image ? (
                    <Image source={require('./../../assets/images/placeholder.png')} style={styles.placeholderImage} />
                ) : (
                    <Image source={{ uri: image }} style={styles.image} />
                )}
            </Pressable>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Category *</Text>
                <Picker
                    selectedValue={selectedCategory}
                    style={styles.input}
                    onValueChange={(itemValue) => {
                        setSelectedCategory(itemValue);
                        handleInputChange('category', itemValue);
                    }}
                >
                    {categoryList.map((category, index) => (
                        <Picker.Item key={index} label={category.name} value={category.name} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Breed *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.breed}
                    onChangeText={(value) => handleInputChange('breed', value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric-pad'
                    value={formData.age?.toString()}
                    onChangeText={(value) => handleInputChange('age', value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender *</Text>
                <Picker
                    selectedValue={formData.sex}
                    style={styles.input}
                    onValueChange={(itemValue) => handleInputChange('sex', itemValue)}
                >
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight *</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric-pad'
                    value={formData.weight?.toString()}
                    onChangeText={(value) => handleInputChange('weight', value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>About *</Text>
                <TextInput
                    style={styles.input}
                    numberOfLines={5}
                    multiline={true}
                    value={formData.about}
                    onChangeText={(value) => handleInputChange('about', value)}
                />
            </View>

            <TouchableOpacity style={styles.button} disabled={loader} onPress={onUpdate}>
                {loader ? <ActivityIndicator size={'large'} /> :
                    <Text style={styles.buttonText}>Update</Text>
                }
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 5,
    },
    input: {
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit',
    },
    label: {
        marginVertical: 5,
        fontFamily: 'outfit',
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 7,
        marginVertical: 10,
        marginBottom: 50,
    },
    buttonText: {
        fontFamily: 'outfit-medium',
        textAlign: 'center',
    },
    placeholderImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 15,
    }
});
