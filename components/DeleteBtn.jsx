import {
  doc,
  deleteDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./../config/firebaseConfig";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { arrayRemove } from "firebase/firestore";

const deletePetById = async (petIdToDelete, imagePath, user) => {
  try {
    // Log thông tin đầu vào
    console.log("Deleting Pet - Input Params:", {
      petIdToDelete,
      imagePath,
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });

    // Kiểm tra và xóa file ảnh nếu tồn tại
    if (imagePath) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(imagePath);
        console.log("Image File Info:", fileInfo);

        if (fileInfo.exists) {
          await FileSystem.deleteAsync(imagePath);
          console.log("Image file deleted successfully");
        } else {
          console.log("Image file does not exist");
        }
      } catch (fileError) {
        console.error("Error checking/deleting image file:", fileError);
      }
    }

    // Lấy email của user để query
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // 1. Truy vấn tài liệu trong collection Pets dựa trên petId
    const petQuery = query(
      collection(db, "Pets"),
      where("id", "==", petIdToDelete) // Sử dụng petId trong field
    );
    const petSnapshot = await getDocs(petQuery);

    if (petSnapshot.empty) {
      console.log("No pet found with petId:", petIdToDelete);
      return false; // Không có tài liệu nào được tìm thấy
    }

    // Lặp qua các tài liệu tìm thấy và xóa
    for (const petDoc of petSnapshot.docs) {
      await deleteDoc(petDoc.ref);
      console.log("Pet document deleted from Firestore");
    }

    // 2. Xóa petId khỏi UserFavPet
    try {
      const userFavPetQuery = query(
        collection(db, "UserFavPet"),
        where("email", "==", userEmail)
      );
      const userFavPetSnapshot = await getDocs(userFavPetQuery);

      if (!userFavPetSnapshot.empty) {
        const userFavPetDoc = userFavPetSnapshot.docs[0];
        await updateDoc(userFavPetDoc.ref, {
          favorites: arrayRemove(petIdToDelete),
        });
        console.log("Pet removed from UserFavPet");
      } else {
        console.log("No UserFavPet document found");
      }
    } catch (favError) {
      console.error("Error updating UserFavPet:", favError);
    }

    // 3. Xóa petId khỏi UserPet
    try {
      const userPetQuery = query(
        collection(db, "UserPets"),
        where("email", "==", userEmail)
      );
      const userPetSnapshot = await getDocs(userPetQuery);

      if (!userPetSnapshot.empty) {
        const userPetDoc = userPetSnapshot.docs[0];
        await updateDoc(userPetDoc.ref, {
          petId: arrayRemove(petIdToDelete),
        });
        console.log("Pet removed from UserPet");
      } else {
        console.log("No UserPet document found");
      }
    } catch (petError) {
      console.error("Error updating UserPet:", petError);
    }

    ToastAndroid.show("Xóa thú cưng thành công!", ToastAndroid.SHORT);
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa thú cưng: ", error);
    ToastAndroid.show("Lỗi khi xóa thú cưng", ToastAndroid.SHORT);
    throw error;
  }
};

export default deletePetById;
