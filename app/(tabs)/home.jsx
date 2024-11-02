import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import PetListCategory from '../../components/Home/PetListCategory';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';
import { auth, db } from '../../config/FirebaseConfig';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    petsByCategory: [],
    totalUsers: 0,
    totalAdoptedPets: 0,
    categoryAvatars: {}
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "User", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.isAdmin === 1);
            if (userData.isAdmin === 1) {
              await fetchDashboardData();
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user role: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch category avatars from the Category collection
      const categorySnapshot = await getDocs(collection(db, 'Category'));
      const avatars = {};
      categorySnapshot.forEach(doc => {
        const data = doc.data();
        avatars[data.name] = data.imageUrl;
      });

      // Get total number of pets by category and adopted count
      const petsSnapshot = await getDocs(collection(db, 'Pets'));
      const categoryCounts = {};
      let adoptedCount = 0;

      petsSnapshot.forEach(doc => {
        const data = doc.data();
        const category = data.category;
        if (data.status === 'Adopted') {
          adoptedCount++;
        }
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      const petsByCategory = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
        avatar: avatars[category] || 'https://via.placeholder.com/50'
      }));

      // Query total number of users excluding admins
      const usersQuery = query(collection(db, 'User'), where('isUser', '==', 1));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      setDashboardData({
        petsByCategory,
        totalUsers,
        totalAdoptedPets: adoptedCount,
        categoryAvatars: avatars
      });

    } catch (error) {
      console.error("Error fetching dashboard data: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      <Header />
      <Slider />
      <PetListCategory />
    </View>
  );

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statText}>Total Users</Text>
          <Text style={styles.statNumber}>{dashboardData.totalUsers}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statText}>Total Adoptions</Text>
          <Text style={styles.statNumber}>{dashboardData.totalAdoptedPets}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Pets Available by Category:</Text>
      <View style={styles.categoryGrid}>
        {dashboardData.petsByCategory.map((item, index) => (
          <View key={index} style={styles.categoryBox}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.categoryAvatar}
            />
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.categoryCount}>{item.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={isAdmin ? renderDashboard : renderHeader}
        data={[]}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
      // ListFooterComponent={
      //   isAdmin ? null : (
      //     <Link href={'/add-new-pet'} style={styles.addNewPetContainer}>
      //       <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
      //       <Text style={styles.addNewPetText}>Add New Pet</Text>
      //     </Link>
      //   )
      // }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.GRAY,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginTop: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: Colors.GRAY,
    marginBottom: 10,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: '48%',
    backgroundColor: Colors.LIGHT_PRIMARY,
    marginBottom: 15,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  categoryAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.GRAY,
  },
  categoryCount: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
  },
  addNewPetContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addNewPetText: {
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
    fontSize: 18,
  },
});
