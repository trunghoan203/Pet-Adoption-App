import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from './../../Shared/Shared';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import PetListItem from '../../components/Home/PetListItem';
import { getAuth } from "firebase/auth";

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

  // Fetch favorite pet IDs
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

  // Fetch pet details for favorite IDs
  const GetFavPetList = async (favId_) => {
    if (favId_.length === 0) return;

    try {
      const petList = [];
      const chunks = [];

      // Split favId_ into chunks of 10
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
    <View style={{ flex: 1, padding: 10, marginTop: 20 }}>
      <Text style={{ fontFamily: 'outfit-medium', fontSize: 30 }}>Favorite</Text>

      {loader ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={favPetList}
          numColumns={2}
          onRefresh={GetFavPetIds}
          refreshing={loader}
          renderItem={({ item }) => (
            <View>
              <PetListItem pet={item} />
            </View>
          )}
          keyExtractor={(item, index) => item.id || index.toString()}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
              <Text style={{
                fontFamily: 'outfit',
                fontSize: 20,
                textAlign: 'center',
              }}>
                No favorite pets found.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
