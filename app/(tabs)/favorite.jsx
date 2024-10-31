import { View, Text, FlatList, ActivityIndicator, Alert, ScrollView, TextInput, TouchableOpacity, Pressable, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { db, storage } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Colors from '../../constants/Colors';
import Shared from './../../Shared/Shared';
import PetListItem from '../../components/Home/PetListItem';

export default function Favorite() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [isAdmin, setIsAdmin] = useState(false);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ category: 'Bird', sex: 'Male' });
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "User", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin === 1) {
          setIsAdmin(true);
          GetCategories();
        } else {
          fetchFavoritePets();
        }
      }
    };
    fetchUserRole();
  }, [user]);

  // Fetch categories for "Add New Pet" functionality
  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, 'Category'));
    const categories = snapshot.docs.map(doc => doc.data());
    setCategoryList(categories);
  };

  // Fetch favorite pet list for non-admin users
  const fetchFavoritePets = async () => {
    setLoader(true);
    try {
      const result = await Shared.GetFavList(user);
      const favoriteIds = result?.favorites || [];
      if (favoriteIds.length > 0) {
        const petList = [];
        for (let i = 0; i < favoriteIds.length; i += 10) {
          const chunk = favoriteIds.slice(i, i + 10);
          const q = query(collection(db, 'Pets'), where('id', 'in', chunk));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => petList.push(doc.data()));
        }
        setFavPetList(petList);
      } else {
        setFavPetList([]);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load favorite pets. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  // Image picker function for "Add New Pet"
  const imagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle input changes for "Add New Pet"
  const handleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));
  };

  // Upload and save pet data
  const uploadAndSavePet = async () => {
    if (!image || !formData.name || !formData.category || !formData.breed || !formData.age || !formData.sex || !formData.weight || !formData.address || !formData.about) {
      Alert.alert('Missing Information', 'Please fill in all the required fields.');
      return;
    }

    setLoader(true);
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'PetAdopt/' + Date.now() + '.jpg');

    uploadBytes(storageRef, blob).then(() => {
      getDownloadURL(storageRef).then(async (downloadUrl) => {
        const docId = Date.now().toString();
        await setDoc(doc(db, 'Pets', docId), {
          ...formData,
          imageUrl: downloadUrl,
          username: user?.displayName,
          email: user?.email,
          userImage: user?.photoURL,
          id: docId
        });
        setLoader(false);
        Alert.alert('Success', 'Pet added successfully!');
      });
    }).catch(() => {
      setLoader(false);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    });
  };

  if (loader) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, marginTop: 20 }}>
      <Text style={{ fontFamily: 'outfit-medium', fontSize: 30 }}>{isAdmin ? 'Add New Pet' : 'Favorite'}</Text>

      {isAdmin ? (
        <ScrollView style={styles.scrollView}>
          <Pressable onPress={imagePicker}>
            {!image ? (
              <Image source={require('./../../assets/images/placeholder.png')} style={styles.placeholderImage} />
            ) : (
              <Image source={{ uri: image }} style={styles.image} />
            )}
          </Pressable>
          {/* Form fields for new pet data */}
          <TextInput style={styles.input} placeholder="Pet Name *" onChangeText={value => handleInputChange('name', value)} />
          <Picker selectedValue={formData.category} style={styles.input} onValueChange={itemValue => handleInputChange('category', itemValue)}>
            {categoryList.map((category, index) => (
              <Picker.Item key={index} label={category.name} value={category.name} />
            ))}
          </Picker>
          <TextInput style={styles.input} placeholder="Breed *" onChangeText={value => handleInputChange('breed', value)} />
          <TextInput style={styles.input} placeholder="Age *" keyboardType="numeric" onChangeText={value => handleInputChange('age', value)} />
          <Picker selectedValue={formData.sex} style={styles.input} onValueChange={itemValue => handleInputChange('sex', itemValue)}>
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
          <TextInput style={styles.input} placeholder="Weight *" keyboardType="numeric" onChangeText={value => handleInputChange('weight', value)} />
          <TextInput style={styles.input} placeholder="Address *" onChangeText={value => handleInputChange('address', value)} />
          <TextInput style={styles.input} placeholder="About *" multiline numberOfLines={4} onChangeText={value => handleInputChange('about', value)} />
          <TouchableOpacity style={styles.button} onPress={uploadAndSavePet}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={favPetList}
          numColumns={2}
          onRefresh={fetchFavoritePets}
          refreshing={loader}
          renderItem={({ item }) => <PetListItem pet={item} />}
          keyExtractor={(item, index) => item.id || index.toString()}
          ListEmptyComponent={<Text style={styles.noFavText}>No favorite pets found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    padding: 20,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  input: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    borderColor: Colors.GRAY,
    borderWidth: 1,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.WHITE,
    fontSize: 16,
  },
  noFavText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.GRAY,
  },
});
