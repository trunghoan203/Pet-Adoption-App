import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'; // Import useState
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { query, collection, where, getDocs, deleteDoc } from 'firebase/firestore';
import PetListItem from '../../components/Home/PetListItem';
import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [loader, setLoader] = useState(false);
  const [userPostList, setUserPostList] = useState([]);

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'User Post' });

    user && GetUserPost();
  }, [user]);

  const GetUserPost = async () => {
    setLoader(true);
    setUserPostList([]);
    const q = query(
      collection(db, 'Pets'),
      where('email', '==', user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // Xử lý dữ liệu từ Firestore ở đây
      console.log(doc.id, ' => ', doc.data());
      setUserPostList((prev) => [...prev, doc.data()]);
    });
    setLoader(false);
  };
  const OnDeletePost =(docId) =>{
    Alert.alert('Do You want to delete this post?', 'Do you really want to delete this post', [
        {
            text:'Cancel',
            onPress:()=>console.log("Cancel Click"),
            style:'cancel'
        },
        {
            text:'Delete',
            onPress:()=>console.log("Delete"),
        }
    ])
        
  }
  const deletePost = async (docId) => {
        await deleteDoc(doc(db, 'Pets', docId));
        GetUserPost();
  }
return (
    <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontFamily: 'outfit-medium', fontSize: 30 }}>
            UserPost
        </Text>
        <FlatList
            data={userPostList}
            numColumns={2}
            refreshing={loader}
            onRefresh={GetUserPost}
            renderItem={({ item, index }) => (
                    <View>
                            <PetListItem pet={item} key={index} />
                            <Pressable onPress={()=>OnDeletePost(item?.id)} style={styles.deleteButton}>
                                    <Text style={{
                                            fontFamily: 'outfit',
                                            textAlign: 'center',
                                    }}
                                    >Delete</Text>
                            </Pressable>
                    </View>          
            )}
        />
        {userPostList?.length == 0 && (
            <View style={{ flex: 500, justifyContent: 'center', alignItems: 'center' }}>
                <Text  style={{ fontSize: 20 }}>No Post Found</Text>
            </View>
        )}
    </View>
);
}
const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 5,
        borderRadius: 7,
        marginTop: 5,
        marginRight: 10,
    },
    });