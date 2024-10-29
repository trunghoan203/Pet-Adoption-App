import { Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import DefaultAvatar from '../../components/UserAvt/DefaultAvatar'; // Adjust path as necessary

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <View>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 18,
                }}>Welcome,</Text>
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
