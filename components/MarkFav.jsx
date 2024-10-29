import { View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Shared from './../Shared/Shared';
import { getAuth } from "firebase/auth";

export default function MarkFav({ pet, color = 'black' }) {
    const auth = getAuth();
    const user = auth.currentUser;

    const [favList, setFavList] = useState([]); // Initialize as empty array

    useEffect(() => {
        if (user) GetFav();
    }, [user]);

    const GetFav = async () => {
        const result = await Shared.GetFavList(user);
        setFavList(result?.favorites ? result.favorites : []);
    };

    const AddToFav = async () => {
        const favResult = [...favList, pet?.id]; // Create a new array with the pet ID
        await Shared.UpdateFav(user, favResult);
        GetFav(); // Refresh favorite list after adding
    };

    const removeFromFav = async () => {
        const favResult = favList.filter(item => item !== pet.id); // Filter out the pet ID
        await Shared.UpdateFav(user, favResult);
        GetFav(); // Refresh favorite list after removing
    };

    return (
        <View>
            {favList?.includes(pet.id) ? (
                <Pressable onPress={removeFromFav}>
                    <Ionicons name="heart" size={30} color="red" />
                </Pressable>
            ) : (
                <Pressable onPress={AddToFav}>
                    <Ionicons name="heart-outline" size={30} color={color} />
                </Pressable>
            )}
        </View>
    );
}
