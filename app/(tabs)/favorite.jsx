import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from './../../Shared/Shared';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import PetListItem from '../../components/Home/PetListItem';
import { getAuth } from "firebase/auth";
import Colors from '../../constants/Colors';

export default function Favorite() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetFavPetIds();
    }
  }, [user]);

  const GetFavPetIds = async () => {
    try {
      setLoader(true);
      const result = await Shared.GetFavList(user);
      const favoriteIds = result?.favorites || [];
      setFavIds(favoriteIds);

      if (favoriteIds.length > 0) {
        await GetFavPetList(favoriteIds);
      } else {
        setFavPetList([]);
      }
    } catch (error) {
      console.error("Error fetching favorite pet IDs:", error);
      Alert.alert("Error", "Could not load favorite pets. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const GetFavPetList = async (favId_) => {
    if (favId_.length === 0) return;

    try {
      const petList = [];
      const chunks = [];

      for (let i = 0; i < favId_.length; i += 10) {
        chunks.push(favId_.slice(i, i + 10));
      }

      for (const chunk of chunks) {
        const q = query(collection(db, 'Pets'), where('id', 'in', chunk));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          petList.push(doc.data());
        });
      }

      setFavPetList(petList);
    } catch (error) {
      console.error("Error fetching favorite pet details:", error);
      Alert.alert("Error", "Could not load pet details. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Pets</Text>

      {loader ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <FlatList
          data={favPetList}
          numColumns={2}
          onRefresh={GetFavPetIds}
          refreshing={loader}
          renderItem={({ item }) => (
            <View style={styles.petItem}>
              <PetListItem pet={item} />
            </View>
          )}
          keyExtractor={(item, index) => item.id || index.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No favorite pets found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  petItem: {
    marginBottom: 15
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontFamily: 'outfit',
    fontSize: 20,
    textAlign: 'center',
  },
});
