import { View, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import { StyleSheet, Image } from 'react-native';

export default function Slider() {

  const [sliderList, setSliderList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null); // Tạo tham chiếu đến FlatList

  useEffect(() => {
    GetSliders();
  }, []);

  useEffect(() => {
    // Chỉ đặt interval nếu sliderList đã có dữ liệu
    if (sliderList.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % sliderList.length);
      }, 3000); // Thời gian chuyển ảnh (3 giây)

      return () => clearInterval(interval); // Xóa interval khi component unmount
    }
  }, [sliderList]);

  useEffect(() => {
    // Chỉ cuộn đến ảnh hiện tại nếu sliderList có dữ liệu
    if (flatListRef.current && sliderList.length > 0) {
      flatListRef.current.scrollToIndex({ animated: true, index: currentIndex });
    }
  }, [currentIndex, sliderList]);

  const GetSliders = async () => {
    const snapshot = await getDocs(collection(db, 'Sliders'));
    const sliders = snapshot.docs.map(doc => doc.data());
    setSliderList(sliders);
  };

  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item?.imageUrl }}
              style={styles.sliderImage}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get('screen').width * 0.9,
    height: 180,
    borderRadius: 15,
    marginRight: 15,
  },
});
