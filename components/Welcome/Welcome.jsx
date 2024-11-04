import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function Login() {
    const router = useRouter();

    // Data array with a single item to enable FlatList functionality
    const data = [{ key: '1' }];

    const renderItem = () => (
        <View>
            <Image
                source={require('../../assets/images/login.png')}
                style={styles.image}
            />
            <View style={styles.container}>
                <Text style={styles.title}>
                    Ready to make a new friend?
                </Text>
                <Text style={styles.subtitle}>
                    Let's adopt the pet which you like and make their life happy again.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace('auth/signin')}
                >
                    <Text style={styles.buttonText}>
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.flatListContent}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 450,
    },
    container: {
        backgroundColor: Colors.WHITE,
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '100%',
        padding: 25,
        paddingBottom: 50,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 17,
        textAlign: 'center',
        color: Colors.GRAY,
        marginTop: 20,
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 99,
        marginTop: '20%',
    },
    buttonText: {
        color: Colors.WHITE,
        textAlign: "center",
        fontSize: 20,
    },
    flatListContent: {
        flexGrow: 1,
    },
});
