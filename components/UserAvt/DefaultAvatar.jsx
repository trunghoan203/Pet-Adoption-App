import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Helper function to get initials from the user's name
const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part[0].toUpperCase());
    return initials.length > 1 ? `${initials[0]}${initials[1]}` : initials[0];
};

// Helper function to generate a color based on the name
const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`; // Generate a soft color
    return color;
};

const DefaultAvatar = ({ name, size = 80 }) => {
    const initials = getInitials(name);
    const backgroundColor = getColorFromName(name);

    return (
        <View style={[styles.avatar, { backgroundColor, width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default DefaultAvatar;
