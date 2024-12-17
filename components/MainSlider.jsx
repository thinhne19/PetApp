import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function MainSlider() {
  const [sliderList, setSliderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "MainSliders"));
        const sliders = snapshot.docs.map((doc) => doc.data());
        setSliderList(sliders);
      } catch (error) {
        console.error("Error fetching sliders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Slider chiếm tỷ lệ lớn */}
      <View style={styles.sliderContainer}>
        <Carousel
          loop
          width={screenWidth}
          height={screenHeight * 0.6} // Chiếm 50% màn hình
          autoPlay
          data={sliderList}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View style={styles.sliderItem}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.sliderImage}
                resizeMode="contain" // Hình ảnh vừa khít giữ đúng tỷ lệ
              />
            </View>
          )}
        />
      </View>

      {/* Phần nội dung bên dưới */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Chăm sóc thú cưng của bạn</Text>
        <Text style={styles.subtitle}>Yêu em yêu từng miếng ăn giấc ngủ</Text>

        {/* Chỉ số hiện tại của slider */}
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    height: screenHeight * 0.5, // Chiếm 50% chiều cao màn hình
    justifyContent: "center",
    alignItems: "center",
  },
  sliderItem: {
    width: screenWidth,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderImage: {
    width: "90%",
    height: "90%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 85, // Dời phần nội dung xuống
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    fontFamily: "outfit",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#4A90E2",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 14,
    color: "#888",
  },
  linkText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
});
