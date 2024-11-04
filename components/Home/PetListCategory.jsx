import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Category from './Category';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import PetListItem from './PetListItem';

export default function PetListCategory() {

  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetPetList('Bird');
  }, []);

  /** Used to get Pet List on Category Selection */
  const GetPetList = async (category) => {
    setLoader(true);
    setPetList([]); // Clear the list before fetching new data
    try {
      const q = category
        ? query(collection(db, 'Pets'), where('category', '==', category))
        : collection(db, 'Pets'); // If category is empty, fetch all pets

      const querySnapshot = await getDocs(q);

      const pets = querySnapshot.docs.map(doc => doc.data()); // Collect all data in one go
      setPetList(pets); // Update the state once with the complete list
    } catch (error) {
      console.error("Error fetching pet list: ", error);
    }
    setLoader(false);
  };

  return (
    <View>
      <Category category={(value) => GetPetList(value)} />
      <FlatList
        data={petList}
        numColumns={2}
        style={{ marginTop: 10 }}
        refreshing={loader}
        onRefresh={() => GetPetList('Bird')} // Use 'Bird' for consistency with the initial load
        renderItem={({ item }) => (
          <PetListItem pet={item} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
