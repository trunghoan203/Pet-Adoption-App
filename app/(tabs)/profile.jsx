import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors'

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const onPressMenu = (menu) => {
    if (menu == 'logout') {
      return;
    }
    router.push(menu.path);
  }
  // const handleMenuItemPress = (path) => {
  //   if (path) {
  //     router.push(path);
  //   }
  // };

  const Menu = [
    {
      id: 1,
      name: 'Add New Pet',
      icon: 'add-circle',
      path: '/add-new-pet',
    },
    {
      id: 5,
      name: 'My Post',
      icon: 'bookmark',
      path: '/../user-post',
    },
    {
      id: 2,
      name: 'Favorites',
      icon: 'heart',
      path: '/(tabs)/favorite',
    },

    {
      id: 3,
      name: 'Inbox',
      icon: 'chatbubble-ellipses',
      path: '/(tabs)/inbox',
    },
    {
      id: 4,
      name: 'Logout',
      icon: 'exit',
      path: '/logout',
    },
  ];

  return (
    <View style={{
      padding: 10,
      marginTop: 10,
    }}>
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 30,
      }}>Profile</Text>
      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginVertical: 15,
      }}>
        <Image source={{ uri: user?.imageUrl }} style={{
          width: 80,
          height: 80,
          borderRadius: 99
        }} />
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 20
        }}>{user?.fullName}</Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 15,
          color: Colors.GRAY
        }}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      <FlatList
        data={Menu}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            key={item.id}
            style={{
              marginVertical: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 10,
            }}>
            <Ionicons name={item.icon} size={30}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: Colors.LIGHT_PRIMARY,
                borderRadius: 8,
              }}
            />
            <Text style={{
              fontFamily: 'outfit',
              fontSize: 20,
            }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}