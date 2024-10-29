import { View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { getAuth, signOut } from "firebase/auth";
import DefaultAvatar from '../../components/UserAvt/DefaultAvatar'; // Adjust path as necessary

export default function Profile() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const onPressMenu = (menu) => {
    if (menu.id === 4) {
      handleLogout();
    } else {
      router.push(menu.path);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          signOut(auth)
            .then(() => {
              router.replace('/');
            })
            .catch(error => {
              console.error("Logout failed: ", error);
            });
        }
      }
    ]);
  };

  const Menu = [
    { id: 1, name: 'Add New Pet', icon: 'add-circle', path: '/add-new-pet' },
    { id: 5, name: 'My Post', icon: 'bookmark', path: '/../user-post' },
    { id: 2, name: 'Favorites', icon: 'heart', path: '/(tabs)/favorite' },
    { id: 3, name: 'Inbox', icon: 'chatbubble-ellipses', path: '/(tabs)/inbox' },
    { id: 4, name: 'Logout', icon: 'exit' },
  ];

  return (
    <View style={{ padding: 10, marginTop: 10 }}>
      <Text style={{ fontFamily: 'outfit-medium', fontSize: 30 }}>Profile</Text>
      <View style={{ display: 'flex', alignItems: 'center', marginVertical: 15 }}>
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 99
            }}
          />
        ) : (
          <DefaultAvatar name={user?.displayName || "User"} size={70} />
        )}
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>{user?.displayName || "User"}</Text>
        <Text style={{ fontFamily: 'outfit', fontSize: 15, color: Colors.GRAY }}>{user?.email}</Text>
      </View>

      <FlatList
        data={Menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            style={{
              marginVertical: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Ionicons
              name={item.icon}
              size={30}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: Colors.LIGHT_PRIMARY,
                borderRadius: 8,
              }}
            />
            <Text style={{ fontFamily: 'outfit', fontSize: 20 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
