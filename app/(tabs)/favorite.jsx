import { View, Text, FlatList, ActivityIndicator } from 'react-native';
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
    user && GetFavPetIds();
  }, [user]);

  // Fetch favorite pet IDs
  const GetFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.GetFavList(user);
    const favoriteIds = result?.favorites || [];
    setFavIds(favoriteIds);
    if (favoriteIds.length > 0) {
      await GetFavPetList(favoriteIds);
    } else {
      setFavPetList([]); // Clear the list if no favorites
    }
    setLoader(false);
  };

  // Fetch pet details for favorite IDs
  const GetFavPetList = async (favId_) => {
    if (favId_.length === 0) return;

    setLoader(true);
    setFavPetList([]);

    // If favId_ length exceeds 10, split into chunks (Firestore limitation)
    const chunks = [];
    for (let i = 0; i < favId_.length; i += 10) {
      chunks.push(favId_.slice(i, i + 10));
    }

    const petList = [];
    for (const chunk of chunks) {
      const q = query(collection(db, 'Pets'), where('id', 'in', chunk));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        petList.push(doc.data());
      });
    }

    setFavPetList(petList);
    setLoader(false);
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
          renderItem={({ item, index }) => (
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
