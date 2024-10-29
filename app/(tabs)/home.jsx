import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import PetListCategory from '../../components/Home/PetListCategory';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';

export default function Home() {
  const renderHeader = () => (
    <View>
      <Header />
      <Slider />
      <PetListCategory />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[]} // Empty data as the main content is in the header and footer
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <Link href={'/add-new-pet'} style={styles.addNewPetContainer}>
            <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
            <Text style={styles.addNewPetText}>Add New Pet</Text>
          </Link>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 10,
    marginTop: 0,
  },
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
    justifyContent: 'center',
  },
  addNewPetText: {
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
    fontSize: 18,
  },
});
