import { View, Text, FlatList, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
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
    { id: 1, name: 'Change Password', icon: 'bookmark', path: '/../changepassword' },
    { id: 2, name: 'Dashboard', icon: 'bar-chart', path: '/(tabs)/home' },
    { id: 3, name: 'Order', icon: 'chatbubble-ellipses', path: '/(tabs)/order' },
    { id: 4, name: 'Logout', icon: 'exit' },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Profile</Text>
      <View style={styles.profileInfo}>
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.avatar}
          />
        ) : (
          <DefaultAvatar name={user?.displayName || "User"} size={70} />
        )}
        <Text style={styles.displayName}>{user?.displayName || "User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onPressMenu(item)}
      style={styles.menuItem}
    >
      <Ionicons
        name={item.icon}
        size={30}
        color={Colors.PRIMARY}
        style={styles.icon}
      />
      <Text style={styles.menuText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={Menu}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
  headerText: {
    fontFamily: 'outfit-medium',
    fontSize: 30,
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 99,
  },
  displayName: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
  },
  email: {
    fontFamily: 'outfit',
    fontSize: 15,
    color: Colors.GRAY,
  },
  menuItem: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },
  icon: {
    padding: 10,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 8,
    marginRight: 10,
  },
  menuText: {
    fontFamily: 'outfit',
    fontSize: 20,
  },
});
