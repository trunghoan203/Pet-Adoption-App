import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { getAuth } from "firebase/auth";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [hasOwner, setHasOwner] = useState(false);

  const handleAdoptMe = () => {
    router.push({
      pathname: 'pet-details/request',
      params: { petId: pet.id },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
    });

    // Check if pet already has an owner
    if (pet?.userEmail) {
      setHasOwner(true);
    }
  }, [pet]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* Pet Info */}
        <PetInfo pet={pet} />
        {/* Pet Properties */}
        <PetSubInfo pet={pet} />
        {/* About Pet */}
        <AboutPet pet={pet} />
        {/* Owner Details */}
        <OwnerInfo pet={pet} />
        <View style={{ height: 70 }} />
      </ScrollView>

      {/* Adopt me button - show only if pet has no owner */}
      {!hasOwner && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleAdoptMe} style={styles.adoptBtn}>
            <Text style={styles.adoptBtnText}>Adopt Me</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  adoptBtnText: {
    textAlign: 'center',
    fontFamily: 'outfit-medium',
    fontSize: 20,
    color: Colors.WHITE,
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingBottom: 20,
    backgroundColor: Colors.WHITE,
  }
});
