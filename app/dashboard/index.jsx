import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Colors from '../../constants/Colors';

export default function Dashboard() {
    const [petsByCategory, setPetsByCategory] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAdoptedPets, setTotalAdoptedPets] = useState(0);
    const [loading, setLoading] = useState(true);
    const [categoryAvatars, setCategoryAvatars] = useState({});

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);

                // Fetch category avatars from the Category collection
                const categorySnapshot = await getDocs(collection(db, 'Category'));
                const avatars = {};
                categorySnapshot.forEach(doc => {
                    const data = doc.data();
                    avatars[data.name] = data.imageUrl;
                });
                setCategoryAvatars(avatars);

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

                setPetsByCategory(Object.entries(categoryCounts).map(([category, count]) => ({ category, count })));
                setTotalAdoptedPets(adoptedCount);

                // Query total number of users excluding admins
                const usersQuery = query(collection(db, 'User'), where('isUser', '==', 1));
                const usersSnapshot = await getDocs(usersQuery);
                setTotalUsers(usersSnapshot.size);

            } catch (error) {
                console.error("Error fetching statistics: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Admin Dashboard</Text>
            <View style={styles.statRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statText}>Total Users</Text>
                    <Text style={styles.statNumber}>{totalUsers}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statText}>Total Adopted Pets</Text>
                    <Text style={styles.statNumber}>{totalAdoptedPets}</Text>
                </View>
            </View>

            <Text style={styles.sectionHeader}>Pets Available by Category:</Text>
            <View style={styles.categoryGrid}>
                {petsByCategory.map((item, index) => (
                    <View key={index} style={styles.categoryBox}>
                        <Image
                            source={{ uri: categoryAvatars[item.category] || 'https://via.placeholder.com/50' }}
                            style={styles.categoryAvatar}
                        />
                        <Text style={styles.categoryText}>{item.category}</Text>
                        <Text style={styles.categoryCount}>{item.count}</Text>
                    </View>
                ))}
            </View>
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
        color: Colors.PRIMARY,
        marginBottom: 20,
        textAlign: 'center',
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
});
