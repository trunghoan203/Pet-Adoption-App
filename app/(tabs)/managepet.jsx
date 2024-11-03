import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAuth } from "firebase/auth";

export default function ManagePet() {
    const [petList, setPetList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // State to track admin access
    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const userDoc = await getDoc(doc(db, "User", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.isAdmin === 1); // Set isAdmin based on user role
                    if (userData.isAdmin === 1) {
                        fetchAllPets();
                    } else {
                        Alert.alert("Access Denied", "Only Admins can access this page.");
                    }
                }
            } catch (error) {
                console.error("Error checking Admin access: ", error);
            }
        };

        checkAdminAccess();
    }, []);

    const fetchAllPets = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'Pets'));
            const pets = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setPetList(pets);
        } catch (error) {
            Alert.alert("Error", "Failed to load pets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (petId) => {
        Alert.alert(
            "Delete Pet",
            "Are you sure you want to delete this pet?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deletePet(petId) }
            ]
        );
    };

    const deletePet = async (petId) => {
        try {
            await deleteDoc(doc(db, 'Pets', petId));
            Alert.alert("Success", "Pet deleted successfully.");
            fetchAllPets();
        } catch (error) {
            Alert.alert("Error", "Could not delete the pet. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Manage Pets</Text>
                {isAdmin && (
                    <TouchableOpacity onPress={() => router.push('/add-new-pet')} style={styles.addButton}>
                        <Ionicons name="add-circle" size={24} color={Colors.WHITE} />
                        <Text style={styles.addButtonText}>Add Pet</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.petListContainer}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading pets...</Text>
                ) : (
                    petList.map(pet => (
                        <TouchableOpacity
                            key={pet.id}
                            style={styles.petCard}
                            onPress={() => router.push({ pathname: '/pet-details', params: { id: pet.id } })}
                        >
                            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
                            <View style={styles.petDetails}>
                                <Text style={styles.petName}>{pet.name}</Text>
                                <Text style={styles.petCategory}>{pet.category}</Text>
                                <Text style={styles.petCategory}>{pet.userName}</Text>
                            </View>
                            {isAdmin && (
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity onPress={() => router.push({ pathname: '/edit-pet', params: { id: pet.id } })} style={styles.editButton}>
                                        <Ionicons name="pencil" size={20} color={Colors.WHITE} />
                                        <Text style={styles.editButtonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => confirmDelete(pet.id)} style={styles.deleteButton}>
                                        <Ionicons name="trash" size={20} color={Colors.WHITE} />
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.WHITE,
        marginTop: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: Colors.WHITE,
        marginLeft: 5,
        fontSize: 16,
    },
    petListContainer: {
        paddingBottom: 20,
    },
    petCard: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    petDetails: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontFamily: 'outfit-medium',
        color: Colors.PRIMARY,
    },
    petCategory: {
        fontSize: 14,
        color: Colors.GRAY,
        fontFamily: 'outfit',
    },
    actionButtons: {
        flexDirection: 'column',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    editButtonText: {
        color: Colors.WHITE,
        marginLeft: 5,
    },
    deleteButtonText: {
        color: Colors.WHITE,
        marginLeft: 5,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: Colors.GRAY,
        marginTop: 20,
    },
});
