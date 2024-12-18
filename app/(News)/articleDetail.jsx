import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "Articles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle(docSnap.data());
        } else {
          console.error("Không tìm thấy bài viết!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>Đang tải bài viết...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bài viết không tồn tại!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {article.title}
        </Text>
      </View>

      <ScrollView>
        {/* Ảnh nền */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: article.imageUrl }} style={styles.image} />
        </View>

        {/* Nội dung chi tiết */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionHeader}>{article.title}</Text>
          <Text style={styles.content}>{article.content}</Text>
        </View>

        {/* Bộ sưu tập hình ảnh */}
        {article.gallery && article.gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <Text style={styles.sectionHeader}>Hình ảnh khác</Text>
            <FlatList
              data={article.gallery}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.galleryItem}>
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                  <ActivityIndicator
                    size="small"
                    color="#FF6F61"
                    style={styles.loadingImage}
                  />
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#FAFAFA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
    flex: 1,
  },
  imageContainer: {
    height: 250,
    backgroundColor: "#EEE",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "justify",
  },
  galleryContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  galleryItem: {
    marginRight: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  galleryImage: {
    width: 150,
    height: 100,
    resizeMode: "cover",
  },
  loadingImage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  errorText: {
    fontSize: 18,
    color: "#FF6F61",
    fontWeight: "bold",
  },
});
