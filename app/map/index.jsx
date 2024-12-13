import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

const HCMC_CENTER = {
  latitude: 10.7769,
  longitude: 106.7009,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const isValidCoordinate = (lat, lon) => {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

const MapScreen = () => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState(HCMC_CENTER);
  const [displayedLocations, setDisplayedLocations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState({
    pet_store: true,
    veterinary: true,
    pet_cafe: true,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    fetchOverpassData();
  }, [selectedTypes, currentLocation]);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Thông báo",
          "Ứng dụng cần quyền truy cập vị trí để hiển thị các địa điểm."
        );
        setInitialLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
      setInitialLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy vị trí hiện tại:", error);
      Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại.");
      setInitialLoading(false);
    }
  };

  const fetchOverpassData = async () => {
    try {
      setSearchLoading(true);
      const { latitude, longitude } = currentLocation;

      let query = "[out:json][timeout:25];(";

      if (selectedTypes.pet_store) {
        query += `node["shop"="pet"](around:10000,${latitude},${longitude});`;
      }

      if (selectedTypes.veterinary) {
        query += `node["amenity"="veterinary"](around:10000,${latitude},${longitude});`;
      }

      if (selectedTypes.pet_cafe) {
        query += `node["amenity"="cafe"]["dogs"="yes"]["cats"="yes"](around:10000,${latitude},${longitude});`;
      }

      query += ");out center;";

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      const data = await response.json();

      const locations = data.elements
        .filter((element) => isValidCoordinate(element.lat, element.lon))
        .map((element) => ({
          id: element.id.toString(),
          name: element.tags.name || "Không có tên",
          latitude: element.lat,
          longitude: element.lon,
          type: element.tags.shop === "pet" ? "pet_store" : "veterinary",
          address: element.tags["addr:full"] || "Không có địa chỉ",
        }));

      setDisplayedLocations(locations);
      setSearchLoading(false);
    } catch (error) {
      console.error("Lỗi tìm kiếm địa điểm:", error);
      Alert.alert("Lỗi", "Không thể tìm kiếm địa điểm");
      setSearchLoading(false);
    }
  };

  const toggleLocationType = (type) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case "pet_store":
        return "blue";
      case "veterinary":
        return "red";
      case "pet_cafe":
        return "green";
      default:
        return "gray";
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải vị trí...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Pet Services</Text>
      </View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {displayedLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.address}
            pinColor={getMarkerColor(location.type)}
          />
        ))}
      </MapView>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedTypes.pet_store && styles.filterButtonActive,
          ]}
          onPress={() => toggleLocationType("pet_store")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedTypes.pet_store && styles.filterButtonTextActive,
            ]}
          >
            Cửa hàng thú cưng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedTypes.veterinary && styles.filterButtonActive,
          ]}
          onPress={() => toggleLocationType("veterinary")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedTypes.veterinary && styles.filterButtonTextActive,
            ]}
          >
            Phòng khám
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedTypes.pet_cafe && styles.filterButtonActive,
          ]}
          onPress={() => toggleLocationType("pet_cafe")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedTypes.pet_cafe && styles.filterButtonTextActive,
            ]}
          >
            Quán cafe thú cưng
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default MapScreen;
