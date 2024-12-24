import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DictDetailsScreen() {
  const { apiEndpoint, categoryName, apiKey } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null); // State để lưu lỗi

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!apiEndpoint) {
          throw new Error("Cannot load an empty URL");
        }

        const response = await fetch(apiEndpoint, {
          headers: {
            "x-api-key": apiKey || "",
          },
        });

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setError(error.message); // Lưu lỗi vào state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Tính năng đang được phát triển. Xin thông cảm!
        </Text>
      </View>
    );
  }

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm lấy ảnh tùy thuộc vào categoryName
  const getImageUrl = (item) => {
    if (categoryName === "Dogs") {
      return item.reference_image_id
        ? `https://cdn2.thedogapi.com/images/${item.reference_image_id}.jpg`
        : null;
    } else if (categoryName === "Cats") {
      return item.reference_image_id
        ? `https://cdn2.thecatapi.com/images/${item.reference_image_id}.jpg`
        : null;
    } else if (categoryName === "Birds") {
      return item.image || null; // API cho chim giả định trả về trường `image`
    } else if (categoryName === "Fish") {
      return item.picture || null; // API cho cá giả định trả về trường `picture`
    }
    return null; // Nếu không xác định được, trả về null
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.headerTitle}>{categoryName}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm..."
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {getImageUrl(item) ? (
              <Image
                source={{
                  uri: getImageUrl(item),
                }}
                style={styles.image}
              />
            ) : (
              <Text>Không có ảnh</Text>
            )}
            <View style={styles.details}>
              <Text style={styles.name}>{item.name || "Không có tên"}</Text>
              {item.breed_group && (
                <Text style={styles.detailText}>
                  Nhóm giống: {item.breed_group}
                </Text>
              )}
              {item.weight?.metric && (
                <Text style={styles.detailText}>
                  Cân nặng: {item.weight.metric} kg
                </Text>
              )}
              {item.life_span && (
                <Text style={styles.detailText}>
                  Tuổi thọ: {item.life_span}
                </Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.BLACK,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: Colors.GRAY,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: Colors.GRAY, marginTop: 10 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: Colors.GRAY, textAlign: "center" },
});
