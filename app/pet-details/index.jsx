import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import deletePet from "../../components/DeleteBtn";
import * as FileSystem from "expo-file-system";
import PetHealthRecord from "../../components/PetDetails/PetHealthRecord ";

export default function PetDetails() {
  const { user } = useUser();
  const router = useRouter();
  const pet = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Pet Data in Details:", pet);
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  useEffect(() => {
    if (typeof pet.healthRecords === "string") {
      try {
        pet.healthRecords = JSON.parse(pet.healthRecords); // Chuyển chuỗi JSON thành object
      } catch (error) {
        console.error("Lỗi khi parse healthRecords:", error);
        pet.healthRecords = {
          weightRecords: [],
          vaccineRecords: [],
          dewormRecords: [],
        }; // Gán giá trị mặc định
      }
    } else if (
      typeof pet.healthRecords !== "object" ||
      pet.healthRecords === null
    ) {
      // Trường hợp không phải là object hoặc null
      pet.healthRecords = {
        weightRecords: [],
        vaccineRecords: [],
        dewormRecords: [],
      };
    }
  }, [pet]);

  const handleDeletePet = () => {
    // Hiển thị hộp thoại xác nhận
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa thú cưng này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => confirmDeletePet(),
      },
    ]);
  };

  const confirmDeletePet = async () => {
    try {
      // Kiểm tra và xóa file ảnh nếu tồn tại
      if (pet.imagePath) {
        try {
          // Kiểm tra file có tồn tại không
          const fileInfo = await FileSystem.getInfoAsync(pet.imagePath);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(pet.imagePath);
          }
        } catch (fileError) {
          console.log("Lỗi khi kiểm tra hoặc xóa file:", fileError);
          // Không throw error để tiếp tục quá trình xóa pet
        }
      }

      // Gọi hàm xóa pet
      const result = await deletePet(
        pet.id, // ID của pet từ Firestore
        pet.imagePath, // Đường dẫn ảnh local (nếu có)
        user // Thông tin user từ Clerk
      );

      if (result) {
        // Chắc chắn rằng xóa thành công
        alert("Thú cưng đã được xóa thành công!");
        router.back();
      }
    } catch (error) {
      console.error("Lỗi khi xóa pet:", error);
      // Có thể hiển thị thông báo lỗi chi tiết hơn
      Alert.alert("Lỗi", "Không thể xóa thú cưng. Vui lòng thử lại.", [
        { text: "OK" },
      ]);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
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
        <Text style={styles.headerTitle}>Vật nuôi của tôi</Text>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePet}
          >
            <MaterialCommunityIcons
              name="delete"
              size={36}
              color={Colors.PRIMARY} // Giả sử bạn có màu RED trong Colors
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pet info */}
        <PetInfo pet={pet} />
        {/* Pet sub info */}
        <PetSubInfo pet={pet} />
        {/* About */}
        <AboutPet pet={pet} />
        <View style={{ height: 20 }}></View>
        <PetHealthRecord petId={pet.id || pet._id} />
        <View style={{ height: 50 }}></View>
      </ScrollView>

      {/* Edit pet */}
      <View style={styles.bottomContainer}>
        <Link
          href={{
            pathname: "/pet-update",
            params: { petId: pet.id || pet._id }, // Pass the specific pet's ID
          }}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>Chỉnh sửa</Text>
        </Link>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  editBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    textAlign: "center",
  },
  editText: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    color: Colors.WHITE,
  },
});
