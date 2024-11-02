import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/FirebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import Colors from '../../constants/Colors';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = auth.currentUser;

  const fetchUserRole = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'User', user.uid));
      setIsAdmin(userDoc.exists && userDoc.data().isAdmin === 1);
    } catch (error) {
      console.error("Error checking user role: ", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const q = isAdmin
        ? collection(db, 'AdoptionRequests') // Fetch all requests if Admin
        : query(collection(db, 'AdoptionRequests'), where('userId', '==', user.uid));

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchOrders();
  }, [user.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleConfirm = async (requestId, petId, adoptionData) => {
    if (!petId) {
      Alert.alert('Error', 'Pet ID is missing for this request.');
      return;
    }

    try {
      await updateDoc(doc(db, 'AdoptionRequests', requestId), {
        status: 'Done'
      });

      await updateDoc(doc(db, 'Pets', petId), {
        userName: adoptionData.fullName,
        userEmail: adoptionData.email,
        userImage: adoptionData.userImage
      });

      Alert.alert('Success', 'Request confirmed and pet updated.');
      fetchOrders();
    } catch (error) {
      console.error("Error confirming request: ", error);
      Alert.alert('Error', 'Failed to confirm request.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await updateDoc(doc(db, 'AdoptionRequests', requestId), {
        status: 'Reject'
      });

      Alert.alert('Rejected', 'Request has been rejected.');
      fetchOrders();
    } catch (error) {
      console.error("Error rejecting request: ", error);
      Alert.alert('Error', 'Failed to reject request.');
    }
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

      {isAdmin && item.status !== 'Done' && item.status !== 'Reject' && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirm(item.id, item.petId, item)}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(item.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
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
  adminActions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  rejectButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
  },
});
