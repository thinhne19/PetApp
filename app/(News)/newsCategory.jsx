import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");

function removeDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function NewsCategory() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const { categoryName } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(
          collection(db, "Articles"),
          where("categoryId", "==", categoryName)
        );
        const snapshot = await getDocs(q);
        const articlesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryName]);

  const filteredArticles = articles.filter((article) =>
    removeDiacritics(article.title).includes(removeDiacritics(searchQuery))
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>Đang tải bài viết...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.greeting}> Danh mục: </Text>
        <Text style={styles.categoryName}>{categoryName}</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Tìm kiếm bài viết..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={screenWidth * 0.9}
          height={200}
          autoPlay
          autoPlayInterval={3000}
          data={articles.slice(0, 5)} // Hiển thị 5 bài viết nổi bật
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.carouselItem}
              onPress={() =>
                router.push({
                  pathname: "/articleDetail",
                  params: { id: item.id },
                })
              }
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.carouselImage}
              />
              <View style={styles.overlay}>
                <Text style={styles.carouselTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{ height: 200 }}></View>

      {/* Article List */}
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/articleDetail",
                params: { id: item.id },
              })
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 10,
  },
  greeting: { fontSize: 24, fontWeight: "600", color: "#555" },
  categoryName: { fontSize: 24, fontWeight: "bold", color: "#FF6F61" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    elevation: 3,
    marginBottom: 20,
  },
  searchInput: { height: 40, fontSize: 16, flex: 1, color: "#333" },
  icon: { marginRight: 8 },
  carouselContainer: { alignItems: "center", marginBottom: 20 },
  carouselItem: { borderRadius: 12, overflow: "hidden" },
  carouselImage: { height: 200, width: "100%", borderRadius: 12 },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  carouselTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 3,
  },
  cardImage: {
    height: 100,
    width: 100,
    borderTopLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardDescription: { fontSize: 14, color: "#777" },
  listContent: { paddingBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#888" },
});
