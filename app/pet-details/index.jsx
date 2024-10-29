import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { collection, doc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { getAuth } from "firebase/auth";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
    });
  }, []);

  // Used to initiate the chat between two users
  const InitiateChat = async () => {
    const userEmail = user?.email;
    const petOwnerEmail = pet?.email;

    if (!userEmail || !petOwnerEmail) return;

    const docId1 = `${userEmail}_${petOwnerEmail}`;
    const docId2 = `${petOwnerEmail}_${userEmail}`;

    const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      // Navigate to the existing chat document
      const existingChatDoc = querySnapshot.docs[0];
      router.push({
        pathname: '/chat',
        params: { id: existingChatDoc.id }
      });
    } else {
      // Create a new chat document if none exists
      await setDoc(doc(db, 'Chat', docId1), {
        id: docId1,
        users: [
          {
            email: userEmail,
            imageUrl: user?.photoURL,
            name: user?.displayName
          },
          {
            email: petOwnerEmail,
            imageUrl: pet?.userImage,
            name: pet?.username
          }
        ],
        userIds: [userEmail, petOwnerEmail]
      });
      // Navigate to the newly created chat document
      router.push({
        pathname: '/chat',
        params: { id: docId1 }
      });
    }
  };

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

      {/* Adopt me button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
          <Text style={styles.adoptBtnText}>Adopt Me</Text>
        </TouchableOpacity>
      </View>
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
