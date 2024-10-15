import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import PetListCategory from '../../components/Home/PetListCategory'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors'
import { Link } from 'expo-router'

export default function Home() {
  return (
    <View style={{
      display: 'flex',
      padding: 10, marginTop: 0
    }}>
      <ScrollView>
        {/* Header */}
        <Header />
        {/* Slider */}
        <Slider />
        {/* PetListCategory */}
        <PetListCategory />
        {/* List Ot Pets */}

        {/* Add New Pet Option */}
        <Link href={'/add-new-pet'}
          style={styles.addNewPetContainer}>
          <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
          <Text style={{
            fontFamily: 'outfit-medium',
            color: Colors.SECONDARY,
            fontSize: 18
          }}>Add New Pet</Text>
        </Link>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  addNewPetContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: 'dashed',
    justifyContent: 'center'
  }
})