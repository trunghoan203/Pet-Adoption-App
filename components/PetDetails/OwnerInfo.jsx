import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function OwnerInfo({ pet }) {
  return (
    <View style={styles.container}>
      <View style={styles.ownerInfoContainer}>
        <Image source={{ uri: pet?.userImage }} style={styles.ownerImage} />
        <View>
          <Text style={styles.ownerName}>{pet?.userName}</Text>
          <Text style={styles.ownerRole}>Pet Owner</Text>
        </View>
      </View>
      <Ionicons name="send-outline" size={24} color={Colors.PRIMARY} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.WHITE,
    justifyContent: 'space-between',
  },
  ownerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 99,
    marginRight: 20,
  },
  ownerName: {
    fontFamily: 'outfit-medium',
    fontSize: 17,
  },
  ownerRole: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
  },
});
