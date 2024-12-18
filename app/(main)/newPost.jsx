import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import RichTextBox from "../../components/RichTextPost";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";

const NewPost = () => {
  const { user } = useUser();
  const bodyRef = useRef("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const resetForm = () => {
    bodyRef.current = "";
    setFile(null);
  };

  const onPick = async (isImage) => {
    const mediaConfig = {
      mediaTypes: isImage
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    };
    const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert(
        "Bài đăng",
        "Vui lòng thêm nội dung hoặc tải lên một tập tin"
      );
      return;
    }

    const postData = {
      avatar: user?.imageUrl,
      name: user?.lastName,
      body: bodyRef.current,
      date: new Date().toLocaleString(),
      fileUri: file?.uri,
    };

    try {
      const existingPosts = await AsyncStorage.getItem("posts");
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      posts.push(postData);
      await AsyncStorage.setItem("posts", JSON.stringify(posts));

      Alert.alert("Thành công", "Bài đăng của bạn đã được lưu thành công!", [
        { text: "OK", onPress: resetForm },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu bài đăng của bạn");
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (file) =>
    file?.type || (file?.uri.includes("postImage") ? "hình ảnh" : "video");

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tạo Bài Viết</Text>

        {/* Thông tin người dùng */}
        <View style={styles.userInfo}>
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          <Text style={styles.userName}>{user?.lastName}</Text>
        </View>

        {/* Trình soạn thảo văn bản phong phú */}
        <RichTextBox onChange={(body) => (bodyRef.current = body)} />

        {/* Xem trước phương tiện */}
        {file && (
          <View style={styles.filePreview}>
            {getFileType(file) === "video" ? (
              <Video
                source={{ uri: file.uri }}
                style={styles.media}
                useNativeControls
                resizeMode="cover"
              />
            ) : (
              <Image source={{ uri: file.uri }} style={styles.media} />
            )}
            <Pressable
              style={styles.deleteButton}
              onPress={() => setFile(null)}
            >
              <Ionicons name="trash-outline" size={24} color={Colors.WHITE} />
            </Pressable>
          </View>
        )}

        {/* Thêm Phương tiện */}
        <View style={styles.mediaOptions}>
          <Text style={styles.mediaText}>Thêm vào bài viết của bạn</Text>
          <View style={styles.mediaIcons}>
            <TouchableOpacity onPress={() => onPick(true)}>
              <Ionicons
                name="images-outline"
                size={28}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPick(false)}>
              <Ionicons
                name="videocam-outline"
                size={28}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Nút Gửi */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.WHITE} />
        ) : (
          <Text style={styles.submitText}>Đăng</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    marginTop: 50,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.GRAY,
  },
  filePreview: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    height: 200,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.RED,
    padding: 5,
    borderRadius: 20,
  },
  mediaOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  mediaText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.GRAY,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
});
