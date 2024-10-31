import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Colors from '../../constants/Colors';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState([]);
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

                // Prepare data for display
                const categoriesData = Object.entries(categoryCounts).map(([category, count]) => ({
                    type: 'category',
                    category,
                    count,
                    avatar: avatars[category] || 'https://via.placeholder.com/50',
                }));
                const userData = [];

                // Query total number of users excluding admins
                const usersQuery = query(collection(db, 'User'), where('isUser', '==', 1));
                const usersSnapshot = await getDocs(usersQuery);
                userData.push({ type: 'stat', title: 'Total Users', value: usersSnapshot.size });
                userData.push({ type: 'stat', title: 'Total Adopted Pets', value: adoptedCount });

                setDashboardData([...userData, ...categoriesData]);

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

    const renderItem = ({ item }) => {
        if (item.type === 'stat') {
            return (
                <View style={styles.statBox}>
                    <Text style={styles.statText}>{item.title}</Text>
                    <Text style={styles.statNumber}>{item.value}</Text>
                </View>
            );
        } else if (item.type === 'category') {
            return (
                <View style={styles.categoryBox}>
                    <Image
                        source={{ uri: item.avatar }}
                        style={styles.categoryAvatar}
                    />
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <Text style={styles.categoryCount}>{item.count}</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Admin Dashboard</Text>
            <FlatList
                data={dashboardData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.contentContainer}
            />
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
    contentContainer: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
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
    categoryBox: {
        width: '48%',
        backgroundColor: Colors.LIGHT_PRIMARY,
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
