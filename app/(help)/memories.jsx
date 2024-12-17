import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";
import * as Notifications from "expo-notifications";

export default function Memories() {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Xử lý khi nhấn vào thông báo
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const postId = response.notification.request.content.data.postId;
        // Chuyển đến chi tiết bài viết nếu cần
        navigation.navigate("MemoryDetail", { postId });
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Đăng ký quyền thông báo
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Thông báo", "Bạn cần cấp quyền để nhận thông báo");
      }
    };

    // Đặt cấu hình thông báo
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    requestNotificationPermission();
  }, []);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem("posts");
      console.log("Stored posts:", storedPosts);

      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        console.log("Parsed posts:", parsedPosts);

        setPosts(parsedPosts);

        parsedPosts.forEach((post) => {
          console.log("Processing post:", post);
          scheduleMemoryNotification(post);
        });
      }
    } catch (error) {
      console.error("Error loading posts from AsyncStorage", error);
    }
  };

  const scheduleMemoryNotification = async (post) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Kỉ niệm của bạn",
        body: `Hãy nhìn lại kỉ niệm "${post.body.slice(0, 30)}..." từ ${
          post.date
        }`,
        data: { postId: post.id },
      },
      trigger: {
        seconds: 60, // 1 phút
      },
    });
  };

  const deletePost = async (index) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa bài viết này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            const updatedPosts = posts.filter((_, idx) => idx !== index);
            await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
            setPosts(updatedPosts);
          } catch (error) {
            console.error("Error deleting post", error);
            Alert.alert("Lỗi", "Không thể xóa bài viết. Vui lòng thử lại sau.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kỷ niệm của tôi và bạn</Text>
      </View>

      <ScrollView style={styles.container}>
        {posts.map((post, index) => (
          <View key={index} style={styles.post}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View style={styles.postHeaderText}>
                <Text style={styles.name}>{post.name}</Text>
                <Text style={styles.date}>{post.date}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePost(index)}
              >
                <Icon name="delete-outline" size={24} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>

            {post.fileUri && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: post.fileUri }} style={styles.image} />
              </View>
            )}

            <Text style={styles.postBody}>{post.body}</Text>

            <TouchableOpacity style={styles.likeButton}>
              <Icon
                name="favorite-border"
                size={24}
                color={Colors.LIGHT_PINK}
              />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.bottomPadding} />
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
    backgroundColor: Colors.WHITE,
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
  deleteButton: {
    padding: 8,
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
    marginTop: 2,
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
  bottomPadding: {
    height: 20,
  },
});
