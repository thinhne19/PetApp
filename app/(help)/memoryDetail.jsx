import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";

export default function MemoryDetail() {
  const route = useRoute();
  const navigation = useNavigation();

  // Lấy dữ liệu bài viết từ route params
  const { postId } = route.params || {};
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        const storedPosts = await AsyncStorage.getItem("posts");
        const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];

        // Tìm bài viết dựa trên postId
        const foundPost = parsedPosts.find((post) => post.id === postId);
        if (foundPost) {
          setPost(foundPost);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy bài viết");
        }
      } catch (error) {
        console.error("Error loading post details", error);
        Alert.alert("Lỗi", "Không thể tải bài viết");
      }
    };

    loadPostDetails();
  }, [postId]);

  if (!post) {
    return (
      <View style={styles.mainContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết Kỷ niệm</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.avatar }} style={styles.avatar} />
            <View style={styles.postHeaderText}>
              <Text style={styles.name}>{post.name}</Text>
              <Text style={styles.date}>{post.date}</Text>
            </View>
          </View>

          {post.fileUri && (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: post.fileUri }} style={styles.image} />
            </View>
          )}

          <Text style={styles.postBody}>{post.body}</Text>

          <TouchableOpacity style={styles.likeButton}>
            <Icon name="favorite-border" size={24} color={Colors.LIGHT_PINK} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 4,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginLeft: 20,
  },
  backButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  post: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.LIGHT_PRIMARY,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderWidth: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  date: {
    fontSize: 12,
    color: Colors.GRAY,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  postBody: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
    marginTop: 8,
  },
  likeButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    padding: 4,
  },
});
