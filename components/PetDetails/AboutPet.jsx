import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constants/Colors';

export default function AboutPet({ pet }) {
  const [readMore, setReadMore] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>About {pet?.name}</Text>
      <Text numberOfLines={readMore ? 20 : 3} style={styles.aboutText}>
        {pet.about}
      </Text>
      {!readMore && (
        <Pressable onPress={() => setReadMore(true)}>
          <Text style={styles.readMoreText}> Read More </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
  },
  aboutText: {
    fontFamily: 'outfit',
    fontSize: 14,
    marginVertical: 10,
  },
  readMoreText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.SECONDARY,
    marginTop: 5,
  },
});
