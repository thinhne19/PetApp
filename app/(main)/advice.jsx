import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";

export default function AdviceScreen() {
  const [categoryNews, setCategoryNews] = useState([]);
  const [categoryDict, setCategoryDict] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const newsSnapshot = await getDocs(collection(db, "CategoryNews"));
        const newsData = newsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
        }));
        setCategoryNews(newsData);

        const dictSnapshot = await getDocs(collection(db, "Category"));
        const dictData = dictSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          imageDict: doc.data().imageDict,
          apiEndpoint: doc.data().apiEndpoint, // URL của API tương ứng
          apiKey: doc.data().apiKey,
        }));
        setCategoryDict(dictData);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khám phá</Text>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        {/* Hình ảnh banner */}
        <Image
          source={require("../../assets/images/banner.jpg")}
          style={styles.bannerImage}
        />

        {/* Nội dung tách biệt bên dưới */}
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Pety Adoption</Text>
          <Text style={styles.bannerSubtitle}>Thú cưng có thể nhận nuôi</Text>
          <TouchableOpacity style={styles.buttonAdopt}>
            <Text style={styles.buttonText}>Nhận nuôi</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sections */}
      <Section
        title="Kiến thức bổ ích"
        data={categoryNews}
        onPressAll={() => router.push("/newsAll")}
        onPressItem={(item) =>
          router.push({
            pathname: "/newsCategory",
            params: { categoryName: item.name },
          })
        }
      />
      <Section
        title="Từ điển thú cưng"
        data={categoryDict}
        onPressItem={(item) => {
          // Gọi API và điều hướng đến màn hình chi tiết
          router.push({
            pathname: "/dictDetails", // Điều hướng đến màn hình chi tiết
            params: {
              apiEndpoint: item.apiEndpoint,
              categoryName: item.name,
              apiKey: item.apiKey,
            },
          });
        }}
      />
    </ScrollView>
  );
}

const Section = ({ title, data, onPressItem }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => onPressItem(item)}
        >
          <Image
            source={{ uri: item.imageUrl || item.imageDict }}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFDFD" },
  header: {
    marginTop: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  banner: {
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 10, // Khoảng cách giữa banner và các phần khác
  },
  bannerImage: {
    width: "100%",
    height: 200, // Chiều cao của ảnh
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  bannerContent: {
    alignItems: "center", // Căn giữa nội dung
    paddingVertical: 15, // Khoảng cách trên dưới
    backgroundColor: "#FFFFFF", // Nền trắng cho phần nội dung
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 3,
  },
  bannerTitle: {
    fontSize: 26,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
    fontFamily: "outfit-medium",
  },
  buttonAdopt: {
    backgroundColor: "#FF6F61",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "outfit-bold",
  },

  sectionContainer: { marginTop: 20, paddingHorizontal: 15 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontFamily: "outfit-bold", color: "#333" },
  viewAll: { fontSize: 14, color: "#FF6F61", fontWeight: "600" },
  card: {
    width: 130,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 120, borderTopLeftRadius: 12 },
  cardText: {
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    fontFamily: "outfit-bold",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#888", marginTop: 10 },
});
