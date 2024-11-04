import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Colors from './../../constants/Colors';

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Category'));
                const categories = snapshot.docs.map(doc => doc.data());
                setCategoryList(categories);

                // Set the initial selected category based on the first category if available
                if (categories.length > 0) {
                    setSelectedCategory(categories[0].name);
                    category(categories[0].name); // Callback to parent with initial category
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <View style={styles.categoryContainer}>
            <Text style={styles.title}>Category</Text>

            <FlatList
                data={categoryList}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item.name);
                            category(item.name);
                        }}
                        style={styles.categoryTouchable}
                    >
                        <View style={[
                            styles.categoryBox,
                            selectedCategory === item.name && styles.selectedCategoryBox
                        ]}>
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.categoryImage}
                            />
                        </View>
                        <Text style={styles.categoryText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    categoryContainer: {
        marginTop: 20,
    },
    title: {
        fontFamily: 'outfit-medium',
        fontSize: 20,
    },
    categoryTouchable: {
        flex: 1,
        alignItems: 'center',
        margin: 5,
    },
    categoryBox: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.PRIMARY,
    },
    selectedCategoryBox: {
        backgroundColor: Colors.SECONDARY,
        borderColor: Colors.SECONDARY,
    },
    categoryImage: {
        width: 40,
        height: 40,
    },
    categoryText: {
        textAlign: 'center',
        fontFamily: 'outfit',
    },
});
