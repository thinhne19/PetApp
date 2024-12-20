import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "./../../config/firebaseConfig";
import Colors from "./../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";

export default function PetUpdateScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { petId } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    id: petId, // Keep the original ID
    name: "",
    category: "Dogs",
    breed: "",
    age: "",
    sex: "Male",
    about: "",
    imagePath: null,
  });

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Dogs");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firestoreDocumentId, setFirestoreDocumentId] = useState(null);

  useEffect(() => {
    console.log("Received petId:", petId); // Thêm dòng này
    if (!petId) {
      ToastAndroid.show("Không tìm thấy ID thú cưng", ToastAndroid.SHORT);
      router.back();
      return;
    }

    fetchCategories();
    fetchPetDetails();
  }, [petId]);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Category"));
      const categories = snapshot.docs.map((doc) => doc.data());
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      ToastAndroid.show("Không thể tải danh mục", ToastAndroid.SHORT);
    }
  };

  const fetchPetDetails = async () => {
    try {
      // Query to find pet by its 'id' field
      const q = query(collection(db, "Pets"), where("id", "==", petId));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const petDoc = querySnapshot.docs[0];
        const petData = petDoc.data();

        // Kiểm tra quyền truy cập
        if (!user || user.emailAddresses[0].emailAddress !== petData.ownerId) {
          ToastAndroid.show(
            "Bạn không có quyền xem thông tin thú cưng này",
            ToastAndroid.SHORT
          );
          router.back();
          return;
        }

        // Save the Firestore document ID
        setFirestoreDocumentId(petDoc.id);

        // Update form data
        setFormData({
          ...petData,
          id: petId, // Ensure original ID is preserved
        });

        setSelectedCategory(petData.category);
        setImage(petData.imagePath);
      } else {
        ToastAndroid.show("Không tìm thấy thú cưng", ToastAndroid.SHORT);
        router.back();
      }
    } catch (error) {
      console.error("Error fetching pet details:", error);
      ToastAndroid.show("Lỗi tải thông tin", ToastAndroid.SHORT);
      router.back();
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      ToastAndroid.show("Cần quyền truy cập thư viện", ToastAndroid.SHORT);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const savedImageUri = await saveImageLocally(imageUri);
      setImage(savedImageUri);
      handleInputChange("imagePath", savedImageUri);
    }
  };

  const saveImageLocally = async (sourceUri) => {
    const filename = `${Date.now()}.jpg`;
    const destination = `${FileSystem.documentDirectory}pet_images/${filename}`;

    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "pet_images",
      { intermediates: true }
    );

    await FileSystem.copyAsync({ from: sourceUri, to: destination });
    return destination;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ["name", "category", "breed", "age", "sex", "about"];

    for (let field of requiredFields) {
      if (!formData[field]) {
        ToastAndroid.show(`Vui lòng điền ${field}`, ToastAndroid.SHORT);
        return false;
      }
    }
    return true;
  };
  useEffect(() => {
    if (formData.healthRecords?.weightRecords?.length > 0) {
      const latestWeight =
        formData.healthRecords.weightRecords[
          formData.healthRecords.weightRecords.length - 1
        ].weight;
      handleInputChange("Weight", latestWeight.toString());
    }
  }, [formData.healthRecords]);

  const updatePet = async () => {
    if (!user || user.emailAddresses[0].emailAddress !== formData.ownerId) {
      ToastAndroid.show(
        "Bạn không có quyền chỉnh sửa thú cưng này",
        ToastAndroid.SHORT
      );
      return;
    }

    if (!validateForm()) return;

    if (!firestoreDocumentId) {
      ToastAndroid.show("Lỗi: Không tìm thấy tài liệu", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);
    try {
      const petRef = doc(db, "Pets", firestoreDocumentId);

      // Lấy danh sách cân nặng hiện tại
      const existingWeightRecords = formData.healthRecords?.weightRecords || [];

      // Thêm cân nặng mới vào danh sách
      const updatedWeightRecords = [
        ...existingWeightRecords,
        {
          weight: parseFloat(formData.Weight), // Lấy cân nặng mới
          date: new Date().toLocaleDateString(), // Ngày hiện tại
          notes: "Cập nhật cân nặng", // Ghi chú
        },
      ];

      // Cập nhật thông tin thú cưng
      const updateData = {
        ...formData,
        imagePath: image,
        updatedAt: new Date().toISOString(),
        healthRecords: {
          ...formData.healthRecords,
          weightRecords: updatedWeightRecords, // Cập nhật danh sách cân nặng
        },
      };
      delete updateData.Weight; // Xóa trường Weight sau khi xử lý

      await updateDoc(petRef, updateData);

      ToastAndroid.show("Cập nhật thành công!", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      ToastAndroid.show("Cập nhật thất bại", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Thêm Thú Cưng</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <TouchableOpacity onPress={handleImagePicker}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.petImage} />
            ) : (
              <Image
                source={require("./../../assets/images/dog-placeholder-images-5.png")}
                style={styles.petImage}
              />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên Thú Cưng *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="Nhập tên thú cưng"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Danh Mục *</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => {
              setSelectedCategory(itemValue);
              handleInputChange("category", itemValue);
            }}
            style={styles.picker}
          >
            {categoryList.map((category, index) => (
              <Picker.Item
                key={index}
                label={category.name}
                value={category.name}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giống Loài *</Text>
          <TextInput
            style={styles.input}
            value={formData.breed}
            onChangeText={(value) => handleInputChange("breed", value)}
            placeholder="Nhập giống loài"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tuổi *</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(value) => handleInputChange("age", value)}
            placeholder="Nhập tuổi"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giới Tính *</Text>
          <Picker
            selectedValue={formData.sex}
            onValueChange={(itemValue) => handleInputChange("sex", itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Đực" value="Male" />
            <Picker.Item label="Cái" value="Female" />
          </Picker>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cân Nặng (kg) *</Text>
          <TextInput
            style={styles.input}
            value={formData.Weight}
            onChangeText={(value) => handleInputChange("Weight", value)}
            placeholder="Nhập cân nặng"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mô Tả *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.about}
            onChangeText={(value) => handleInputChange("about", value)}
            placeholder="Thêm mô tả về thú cưng"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.updateButton, isLoading && styles.disabledButton]}
          onPress={updatePet}
          disabled={isLoading}
        >
          <Text style={styles.updateButtonText}>
            {isLoading ? "Đang Cập Nhật..." : "Cập Nhật"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.GRAY,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: Colors.GRAY,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  updateButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
});
