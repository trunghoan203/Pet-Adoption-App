import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import MarkFav from './../FavoritePet/MarkFav';

export default function PetInfo({ pet }) {
  return (
    <View>
      <Image source={{ uri: pet.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.petName}>{pet?.name}</Text>
          <Text style={styles.address}>{pet?.address}</Text>
        </View>
        <MarkFav pet={pet} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    marginTop: 10,
  },
  infoContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontFamily: 'outfit-bold',
    fontSize: 27,
  },
  address: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.GRAY,
  },
});
