import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../constants/theme";

const RichTextBox = ({ onChange, editorRef }) => {
  const [postContent, setPostContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleContentChange = (text) => {
    setPostContent(text);
    // Gọi hàm onChange được truyền từ component cha để cập nhật nội dung
    onChange(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Header với emoji */}
        <Text style={styles.header}>✨ Chia sẽ kỷ niệm của bạn ✨</Text>
        <TextInput
          ref={editorRef}
          style={[styles.input, isFocused && styles.inputFocused]}
          value={postContent}
          onChangeText={handleContentChange}
          placeholder="Cùng thưởng thức nào! 🌟"
          placeholderTextColor="#9CA3AF"
          multiline={true}
          numberOfLines={4}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

export default RichTextBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    minHeight: 150,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#1F2937",
  },
  inputFocused: {
    borderColor: "#60A5FA",
    borderWidth: 2,
    shadowColor: "#60A5FA",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
