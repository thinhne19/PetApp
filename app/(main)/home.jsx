import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Slider from "../../components/Home/Slider";
import Header from "../../components/Home/Header";
import FoodByCategory from "../../components/Home/FoodByCategory";
import Colors from "../../constants/Colors";

const Home = () => {
  const router = useRouter();
  const { user } = useUser();
  const [currentLocation, setCurrentLocation] = useState(null); // Lưu vị trí hiện tại
  const [loadingLocation, setLoadingLocation] = useState(true); // Trạng thái tải vị trí

  // Lấy vị trí hiện tại
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Yêu cầu quyền truy cập vị trí
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Thông báo",
            "Ứng dụng cần quyền truy cập vị trí để hiển thị bản đồ"
          );
          setLoadingLocation(false);
          return;
        }

        // Lấy tọa độ hiện tại
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoadingLocation(false);
      } catch (error) {
        console.error("Lỗi khi lấy vị trí:", error);
        Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại.");
        setLoadingLocation(false);
      }
    };

    getLocation();
  }, []);

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải vị trí...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Slider */}
      <Slider />

      {/* Map Preview Section */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Dịch vụ thú cưng lân cận</Text>
        <TouchableOpacity
          style={styles.mapPreview}
          onPress={() => router.push("/map")}
        >
          {currentLocation ? (
            <MapView style={styles.map} initialRegion={currentLocation}>
              <Marker
                coordinate={currentLocation}
                title="You are here"
                description="This is your current location"
              />
            </MapView>
          ) : (
            <Text style={styles.mapErrorText}>
              Không thể hiển thị bản đồ. Vui lòng thử lại sau.
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Pet's Food Section */}
      <FoodByCategory />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mapContainer: {
    marginTop: 180,
  },
  mapTitle: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    marginBottom: 10,
  },
  mapPreview: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3, // Bóng mờ
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapErrorText: {
    textAlign: "center",
    color: Colors.GRAY,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.GRAY,
  },
});
