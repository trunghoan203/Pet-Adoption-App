import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Colors from '../../constants/Colors';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
  const user = auth.currentUser;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'AdoptionRequests'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders: ', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // End refreshing
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(); // Reload data
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image
        source={item.userImage ? { uri: item.userImage } : require('./../../assets/images/placeholder.png')}
        style={styles.userImage}
      />
      <View style={styles.orderTextContainer}>
        <Text style={styles.orderText}>Full Name: {item.fullName}</Text>
        <Text style={styles.orderText}>Phone: {item.phone}</Text>
        <Text style={styles.orderText}>Email: {item.email}</Text>
        <Text style={styles.orderText}>Status: {item.status}</Text>
        <Text style={styles.orderText}>Request Date: {item.requestDate.toDate().toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Adoption Requests</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      ) : orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No adoption requests found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginTop: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.BLACK,
  },
  noOrdersText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.GRAY,
    marginTop: 20,
  },
});
