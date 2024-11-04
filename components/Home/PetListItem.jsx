import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import MarkFav from './../FavoritePet/MarkFav';

export default function PetListItem({ pet }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/pet-details',
        params: pet
      })}
      style={styles.container}>

      <View style={styles.favIconContainer}>
        <MarkFav pet={pet} color={'white'} />
      </View>

      <Image source={{ uri: pet?.imageUrl }} style={styles.image} />

      <Text style={styles.petName}>{pet?.name}</Text>

      <View style={styles.petInfoContainer}>
        <Text style={styles.breed}>{pet?.breed}</Text>
        <Text style={styles.age}>{pet.age} YRS</Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginRight: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    marginBottom: 10
  },
  favIconContainer: {
    position: 'absolute',
    zIndex: 10,
    right: 10,
    top: 10,
  },
  image: {
    width: 150,
    height: 135,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  petName: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
  },
  petInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breed: {
    color: Colors.GRAY,
    fontFamily: 'outfit',
  },
  age: {
    fontFamily: 'outfit',
    color: Colors.PRIMARY,
    paddingHorizontal: 7,
    borderRadius: 10,
    fontSize: 11,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
});
