import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import UserItem from '../../components/Inbox/UserItem';
import { getAuth } from "firebase/auth";

export default function Inbox() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [otherUserList, setOtherUserList] = useState([]);

  useEffect(() => {
    if (user) {
      GetUserList();
    }
  }, [user]);

  // Get User List Depends on Current User Email
  const GetUserList = async () => {
    setLoader(true);
    setUserList([]);
    try {
      const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', user.email));
      const querySnapshot = await getDocs(q);
      const fetchedUsers = [];
      querySnapshot.forEach(doc => {
        fetchedUsers.push(doc.data());
      });
      setUserList(fetchedUsers);
      MapOtherUserList(fetchedUsers); // Process other user list here
    } catch (error) {
      console.error("Error fetching user list: ", error);
    }
    setLoader(false);
  };

  // Map the list to show the other user in the conversation
  const MapOtherUserList = (userList) => {
    const list = userList.map(record => {
      const otherUser = record.users?.find(u => u.email !== user.email);
      return {
        docId: record.id,
        ...otherUser,
      };
    });
    setOtherUserList(list);
  };

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text style={{ fontFamily: 'outfit-medium', fontSize: 30 }}>Inbox</Text>

      {loader ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={otherUserList}
          keyExtractor={(item) => item.docId}
          refreshing={loader}
          onRefresh={GetUserList}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => <UserItem userInfo={item} />}
          ListEmptyComponent={
            <Text style={{ fontFamily: 'outfit', fontSize: 20, textAlign: 'center' }}>
              No conversations found.
            </Text>
          }
        />
      )}
    </View>
  );
}
