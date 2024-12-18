import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // Thêm import FileSystem
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Cấu hình API key - Bạn nên thay thế bằng API key thực của mình
const HUGGING_FACE_API_KEY = "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";

// Nhóm các mô hình AI tiềm năng
const AI_MODELS = [
  "google/vit-base-patch16-224",
  "microsoft/resnet-50",
  "facebook/deit-base-distilled-patch16-224",
];

// Cơ sở dữ liệu chăm sóc thú cưng
const PET_CARE_DATABASE = {
  dog: {
    generalCare: [
      "Cung cấp đủ nước và thức ăn chất lượng",
      "Tập thể dục hàng ngày",
      "Huấn luyện và xã hội hóa",
    ],
    healthTips: [
      "Tiêm phòng định kỳ",
      "Khám sức khỏe thường niên",
      "Chăm sóc răng miệng",
    ],
  },
  cat: {
    generalCare: [
      "Chế độ ăn phù hợp với từng độ tuổi",
      "Vệ sinh hộp cát thường xuyên",
      "Chải lông để giảm rụng lông",
    ],
    healthTips: [
      "Tiêm phòng đầy đủ",
      "Khám định kỳ với bác sĩ thú y",
      "Kiểm soát ký sinh trùng",
    ],
  },
};

const PetRecognitionScreen = () => {
  const [image, setImage] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Quyền truy cập",
          "Ứng dụng cần quyền truy cập thư viện ảnh"
        );
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
        setErrorMessage(null); // Xóa thông báo lỗi cũ
        recognizePet(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Lỗi chọn ảnh:", error);
      setErrorMessage("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Chụp ảnh trực tiếp
  const takePhoto = async () => {
    try {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Quyền truy cập", "Ứng dụng cần quyền sử dụng camera");
        return;
      }

      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
        setErrorMessage(null); // Xóa thông báo lỗi cũ
        recognizePet(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Lỗi chụp ảnh:", error);
      setErrorMessage("Không thể chụp ảnh. Vui lòng thử lại.");
    }
  };

  // Nhận diện thú cưng bằng AI
  const recognizePet = async (imageUri) => {
    setIsLoading(true);
    setRecognitionResult(null);
    setErrorMessage(null);

    try {
      // Chuyển ảnh sang base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Thử các mô hình khác nhau
      for (let model of AI_MODELS) {
        try {
          const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            { inputs: base64 },
            {
              headers: {
                Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json",
              },
              timeout: 10000, // Giới hạn thời gian chờ 10 giây
            }
          );

          const predictions = response.data;
          const topPrediction = predictions[0];

          // Nếu có kết quả
          if (
            topPrediction &&
            topPrediction.label &&
            topPrediction.score > 0.5
          ) {
            const petInfo = processRecognitionResult(topPrediction);
            setRecognitionResult(petInfo);

            // Lưu kết quả vào AsyncStorage
            await AsyncStorage.setItem(
              "petRecognitionHistory",
              JSON.stringify(petInfo)
            );

            break;
          }
        } catch (modelError) {
          console.warn(`Lỗi với mô hình ${model}:`, modelError);
        }
      }
    } catch (error) {
      console.error("Lỗi nhận diện:", error);
      setErrorMessage("Không thể nhận diện thú cưng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý kết quả nhận diện
  const processRecognitionResult = (prediction) => {
    const speciesLower = prediction.label.toLowerCase();
    const species = speciesLower.includes("dog")
      ? "dog"
      : speciesLower.includes("cat")
      ? "cat"
      : speciesLower;

    return {
      species: species,
      confidence: (prediction.score * 100).toFixed(2),
      care: PET_CARE_DATABASE[species] || {
        generalCare: ["Không tìm thấy thông tin chăm sóc"],
        healthTips: ["Liên hệ chuyên gia"],
      },
    };
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.headerTitle}>Nhận diện vật nuôi</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Chưa chọn ảnh</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Chọn Ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Chụp Ảnh</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <Text style={styles.loadingText}>Đang nhận diện...</Text>}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {recognitionResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            Kết Quả: {recognitionResult.species}
          </Text>
          <Text style={styles.confidence}>
            Độ Chính Xác: {recognitionResult.confidence}%
          </Text>

          <Text style={styles.sectionTitle}>Chăm Sóc Tổng Quát:</Text>
          {recognitionResult.care.generalCare.map((tip, index) => (
            <Text key={index} style={styles.careTip}>
              • {tip}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Lời Khuyên Sức Khỏe:</Text>
          {recognitionResult.care.healthTips.map((tip, index) => (
            <Text key={index} style={styles.careTip}>
              • {tip}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFAF0", // Light pastel background
  },
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: "#FFCC33]]", // Tomato border for fun look
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 18,
    color: "#888",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFCC33", // Hot pink background
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3, // Adding shadow for depth
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFCC33",
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50", // Green text for positive result
    marginBottom: 10,
  },
  confidence: {
    color: "#666",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#FF6347", // Tomato color for section titles
  },
  careTip: {
    marginBottom: 5,
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    color: "#FF6347", // Tomato color for loading text
    fontSize: 18,
    marginVertical: 10,
  },
  errorText: {
    textAlign: "center",
    color: "#D9534F", // Red for error messages
    fontSize: 16,
    marginVertical: 10,
  },
});

export default PetRecognitionScreen;
