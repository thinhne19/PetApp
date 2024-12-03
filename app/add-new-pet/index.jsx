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
import { collection, doc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function AddNewPet() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "Dogs",
    sex: "Male",
  });
  const [gender, setGender] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedcategory, setSelectedCategory] = useState();
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
          "Need permissions to access the gallery",
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

          ToastAndroid.show("Image saved successfully", ToastAndroid.SHORT);
        } catch (error) {
          console.error("Error saving image:", error);
          ToastAndroid.show("Failed to save image", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      ToastAndroid.show("Error selecting image", ToastAndroid.SHORT);
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
    // if (Object.keys(formData).length !== 4) {
    //   ToastAndroid.show("Enter All Details", ToastAndroid.SHORT);
    //   return;
    // }

    try {
      setIsLoading(true);

      // Lưu ảnh vào bộ nhớ local và lấy đường dẫn
      let localImagePath = null;
      if (image) {
        localImagePath = await saveImageLocally(image);
      }

      // Tạo object data để lưu vào Firestore
      const petData = {
        ...formData,
        imagePath: localImagePath, // Lưu đường dẫn local của ảnh
        createdAt: new Date().toISOString(),
      };

      // Thêm dữ liệu vào collection "Pets"
      const docRef = await addDoc(collection(db, "Pets"), petData);

      ToastAndroid.show("Pet added successfully!", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      console.error("Error adding pet: ", error);
      ToastAndroid.show(
        "Error adding pet. Please try again.",
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
            width: 100,
            height: 100,
            borderRadius: 15,
            borderWidth: 1,
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
        <Text style={styles.headerTitle}>Thêm Thú Cưng</Text>
      </View>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>
          Add New Pet
        </Text>
        <Pressable onPress={imagePicker}>{renderImage(image)}</Pressable>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pet Name *</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              handleInputChange("name", value);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pet Category *</Text>
          <Picker
            selectedValue={selectedcategory}
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
          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              handleInputChange("breed", value);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => {
              if (/^\d+$/.test(value) || value === "") {
                handleInputChange("age", value);
              }
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender *</Text>
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
          <Text style={styles.label}>Weight *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => {
              if (/^\d+$/.test(value) || value === "") {
                handleInputChange("Weight", value);
              }
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>About *</Text>
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
            }}
          >
            {isLoading ? "Adding Pet..." : "Submit"}
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
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginLeft: 15,
  },
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 150,
  },
});
