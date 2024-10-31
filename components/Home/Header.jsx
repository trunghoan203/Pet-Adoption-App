import { Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import DefaultAvatar from '../../components/UserAvt/DefaultAvatar'; // Adjust path as necessary

export default function Header() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(''); // Default to 'User'

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser);

        if (currentUser) {
            // Fetch the user's role from Firestore
            const fetchUserRole = async () => {
                try {
                    const userDoc = await getDoc(doc(db, 'User', currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData.isAdmin === 1) {
                            setRole('Admin');
                        } else if (userData.isUser === 1) {
                            setRole('User');
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            };

            fetchUserRole();
        }
    }, []);

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20
        }}>
            <View>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 18,
                }}>Welcome {role},</Text>
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 25,
                }}>{user?.displayName || "User"}</Text>
            </View>
            {user?.photoURL ? (
                <Image
                    source={{ uri: user.photoURL }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 99,
                    }}
                />
            ) : (
                <DefaultAvatar name={user?.displayName || "User"} size={40} />
            )}
        </View>
    );
}
