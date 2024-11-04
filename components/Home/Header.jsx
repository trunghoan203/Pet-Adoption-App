import { Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import DefaultAvatar from '../../components/UserAvt/DefaultAvatar';
import { useRouter } from 'expo-router';

export default function Header() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('User');
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser);

        if (currentUser) {
            const fetchUserRole = async () => {
                try {
                    const userDoc = await getDoc(doc(db, 'User', currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setRole(userData.isAdmin === 1 ? 'Admin' : 'User');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            };

            fetchUserRole();
        }
    }, []);

    const navigateToProfile = () => {
        router.push('/profile');
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.welcomeText}>Welcome {role},</Text>
                <Text style={styles.userName}>{user?.displayName || "User"}</Text>
            </View>
            <TouchableOpacity onPress={navigateToProfile}>
                {user?.photoURL ? (
                    <Image
                        source={{ uri: user.photoURL }}
                        style={styles.avatar}
                    />
                ) : (
                    <DefaultAvatar name={user?.displayName || "User"} size={40} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    welcomeText: {
        fontFamily: 'outfit',
        fontSize: 18,
    },
    userName: {
        fontFamily: 'outfit-medium',
        fontSize: 25,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
};
