import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import UserPet from "./../../Shared/UserPet"; // Import UserPet service
import { useUser } from "@clerk/clerk-expo";
export default function AddNewPet() {
  const { user } = useUser(); // Lấy thông tin user từ Clerk
  const [petList, setPetList] = useState();

  useEffect(() => {
    user && GetUser();
  }, [user]);
  const GetUser = async () => {
    const result = await UserPet.GetPetList(user);
    console.log(result);
    setPetList(result?.petId ? result?.petId : []);
  };
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "Dogs",
    sex: "Male",
  });
  const [gender, setGender] = useState("Male");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetCategories();
    setupImageDirectory();
  }, []);

  // Tạo thư mục để lưu ảnh nếu chưa tồn tại
  const setupImageDirectory = async () => {
    const dirInfo = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "pet_images"
    );
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "pet_images"
      );
    }
  };

  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    snapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const imagePicker = async () => {
    try {
      // Yêu cầu quyền truy cập
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show(
          "Cần có quyền truy cập vào thư viện",
          ToastAndroid.SHORT
        );
        return;
      }

      // Chọn ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        try {
          // Lưu ảnh vào local storage
          const savedImageUri = await saveImageLocally(result.assets[0].uri);
          setImage(savedImageUri);
          handleInputChange("imagePath", savedImageUri);

          ToastAndroid.show("Lưu ảnh thành công", ToastAndroid.SHORT);
        } catch (error) {
          console.error("Error saving image:", error);
          ToastAndroid.show("Lưu ảnh thất bại", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      ToastAndroid.show("Lỗi chọn ảnh", ToastAndroid.SHORT);
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const saveImageLocally = async (sourceUri) => {
    try {
      // Tạo tên file duy nhất
      const filename = `${Date.now()}.jpg`;
      const destination = `${FileSystem.documentDirectory}pet_images/${filename}`;

      // Copy file ảnh vào thư mục local
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destination,
      });

      return destination;
    } catch (error) {
      console.error("Error saving image locally: ", error);
      throw error;
    }
  };

  const onSubmit = async () => {
    // Kiểm tra xem đã điền đủ thông tin chưa
    const requiredFields = ["name", "category", "breed", "age", "sex", "about"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      ToastAndroid.show("Vui lòng điền đầy đủ thông tin", ToastAndroid.SHORT);
      return;
    }

    if (!formData.weight) {
      ToastAndroid.show("Vui lòng nhập cân nặng", ToastAndroid.SHORT);
      return;
    }

    try {
      setIsLoading(true);

      // Lưu ảnh vào bộ nhớ local và lấy đường dẫn
      let localImagePath = null;
      if (image) {
        localImagePath = await saveImageLocally(image);
      }

      // Tạo ID duy nhất
      const petId = `pet_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Tạo object data để lưu vào Firestore
      const petData = {
        ...formData,
        id: petId,
        imagePath: localImagePath,
        createdAt: new Date().toISOString(),
        ownerId: user?.primaryEmailAddress?.emailAddress,
        healthRecords: {
          weightRecords: [
            {
              weight: parseFloat(formData.weight), // Lấy cân nặng từ form
              date: new Date().toLocaleDateString(),
              notes: "Cân nặng ban đầu",
            },
          ],
          vaccineRecords: [],
          dewormRecords: [],
        },
      };

      // Thêm dữ liệu vào collection "Pets"
      await addDoc(collection(db, "Pets"), petData);

      // Cập nhật danh sách pet cho user
      await UserPet.UpdatePet(user, petId);

      ToastAndroid.show("Thêm thú cưng thành công!", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      console.error("Lỗi khi thêm thú cưng: ", error);
      ToastAndroid.show(
        "Lỗi khi thêm thú cưng. Vui lòng thử lại.",
        ToastAndroid.SHORT
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm để hiển thị ảnh từ đường dẫn local
  const renderImage = (imagePath) => {
    if (!imagePath) {
      return (
        <Image
          source={require("./../../assets/images/dog-placeholder-images-5.png")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: Colors.GRAY,
          }}
        />
      );
    }
    return (
      <Image
        source={{ uri: imagePath }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15,
        }}
      />
    );
  };

  return (
    <View>
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
        <Text style={styles.headerTitle}>Thêm Vật Nuôi</Text>
      </View>
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.imageContainer}>
          <Pressable onPress={imagePicker}>{renderImage(image)}</Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên vật nuôi *</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              handleInputChange("name", value);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Loài *</Text>
          <Picker
            selectedValue={selectedCategory}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedCategory(itemValue);
              handleInputChange("category", itemValue);
            }}
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Giống *</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              handleInputChange("breed", value);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tuổi *</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              handleInputChange("age", value);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Giới tính *</Text>
          <Picker
            selectedValue={gender}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) => {
              setGender(itemValue);
              handleInputChange("sex", itemValue);
            }}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cân nặng *</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              handleInputChange("weight", value); // Chỉ lưu giá trị cân nặng tạm thời để xử lý
            }}
            keyboardType="numeric" // Đảm bảo nhập số
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Về vật nuôi *</Text>
          <TextInput
            style={styles.input}
            numberOfLines={5}
            multiline={true}
            onChangeText={(value) => {
              handleInputChange("about", value);
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={onSubmit}
          disabled={isLoading}
        >
          <Text
            style={{
              fontFamily: "outfit-medium",
              textAlign: "center",
              color: Colors.WHITE,
              fontSize: 18,
            }}
          >
            {isLoading ? "Đang thêm..." : "Thêm vật nuôi"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: Colors.GRAY,
    marginBottom: 8,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 150,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
});
