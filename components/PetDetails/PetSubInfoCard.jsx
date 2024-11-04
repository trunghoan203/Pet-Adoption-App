import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';

export default function PetSubInfoCard({ icon, title, value }) {
    return (
        <View style={styles.container}>
            <Image source={icon} style={styles.icon} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        padding: 10,
        margin: 5,
        borderRadius: 8,
        flex: 1,
    },
    icon: {
        width: 40,
        height: 40,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontFamily: 'outfit',
        fontSize: 16,
        color: Colors.GRAY,
    },
    value: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
});
