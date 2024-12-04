import React, { useState, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Colors from "../../constants/Colors";

export default function UpdatePet() {
  const router = useRouter();
  const pet = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: pet.name || "",
    category: pet.category || "Dogs",
    breed: pet.breed || "",
    age: pet.age ? pet.age.toString() : "",
    sex: pet.sex || "Male",
    Weight: pet.Weight ? pet.Weight.toString() : "",
    about: pet.about || "",
  });
  const [image, setImage] = useState(pet.imagePath);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    snapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const imagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const savedImageUri = await saveImageLocally(result.assets[0].uri);
        setImage(savedImageUri);
      }
    } catch (error) {
      console.error("Lỗi chọn ảnh:", error);
      ToastAndroid.show("Lỗi chọn ảnh", ToastAndroid.SHORT);
    }
  };

  const saveImageLocally = async (sourceUri) => {
    try {
      const filename = `${Date.now()}.jpg`;
      const destination = `${FileSystem.documentDirectory}pet_images/${filename}`;
      await FileSystem.copyAsync({ from: sourceUri, to: destination });
      return destination;
    } catch (error) {
      console.error("Lỗi lưu ảnh:", error);
      throw error;
    }
  };

  const onUpdate = async () => {
    try {
      setIsLoading(true);
      const petDocRef = doc(db, "Pets", pet.id);

      const updateData = {
        ...formData,
        ...(image && { imagePath: image }), // Only add imagePath if image is truthy
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(petDocRef, updateData);

      ToastAndroid.show("Cập nhật thành công!", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      ToastAndroid.show("Cập nhật thất bại", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const renderImage = () => {
    if (!image) {
      return (
        <Image
          source={require("./../../assets/images/dog-placeholder-images-5.png")}
          style={styles.image}
        />
      );
    }
    return <Image source={{ uri: image }} style={styles.image} />;
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
        <Text style={styles.headerTitle}>Cập Nhật Thú Cưng</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Pressable onPress={imagePicker}>{renderImage()}</Pressable>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên Thú Cưng *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Loại Thú Cưng *</Text>
          <Picker
            selectedValue={formData.category}
            style={styles.input}
            onValueChange={(itemValue) => {
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
            value={formData.breed}
            onChangeText={(value) => handleInputChange("breed", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tuổi *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(value) => {
              if (/^\d+$/.test(value) || value === "") {
                handleInputChange("age", value);
              }
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Giới Tính *</Text>
          <Picker
            selectedValue={formData.sex}
            style={styles.input}
            onValueChange={(itemValue) => {
              handleInputChange("sex", itemValue);
            }}
          >
            <Picker.Item label="Nam" value="Male" />
            <Picker.Item label="Nữ" value="Female" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cân Nặng *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.Weight}
            onChangeText={(value) => {
              if (/^\d+$/.test(value) || value === "") {
                handleInputChange("Weight", value);
              }
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Về Thú Cưng *</Text>
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={5}
            value={formData.about}
            onChangeText={(value) => handleInputChange("about", value)}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={onUpdate}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginLeft: 15,
  },
  scrollView: {
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    alignSelf: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 10,
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
    marginBottom: 50,
  },
  buttonText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    color: Colors.WHITE,
  },
});
