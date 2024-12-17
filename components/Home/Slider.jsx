import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("screen");

const Slider = () => {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    const GetSliders = async () => {
      try {
        setSliderList([]); // Reset slider list
        const Snapshot = await getDocs(collection(db, "Sliders"));
        const sliders = Snapshot.docs.map((doc) => doc.data());
        setSliderList(sliders);
      } catch (error) {
        console.error("Error fetching sliders:", error);
      }
    };

    GetSliders();
  }, []);

  return (
    <View style={{ marginTop: 20 }}>
      {sliderList.length > 0 ? (
        <Carousel
          loop
          autoPlay
          autoPlayInterval={3000} // Tự động chuyển slide mỗi 3 giây
          data={sliderList}
          width={screenWidth * 0.9} // Giữ nguyên kích thước FlatList
          height={180} // Chiều cao giống FlatList ban đầu
          mode="parallax" // Thêm hiệu ứng parallax nhẹ
          renderItem={({ item }) => (
            <View style={styles.sliderItem}>
              <Image
                source={{ uri: item?.imageUrl }}
                style={styles.sliderImage}
                resizeMode="cover"
              />
            </View>
          )}
        />
      ) : null}
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  sliderItem: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    overflow: "hidden", // Bo góc cho hình ảnh
  },
  sliderImage: {
    width: "100%",
    height: "100%",
  },
});
