import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const IMAGE_DIR = "assets/local_storage/";

export const setupImageDirectory = async () => {
  try {
    // Tạo thư mục nếu chưa tồn tại
    const dirUri = `${FileSystem.documentDirectory}${IMAGE_DIR}`;
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      console.log("Created image directory");
    }
    return dirUri;
  } catch (error) {
    console.error("Error setting up image directory:", error);
    throw error;
  }
};

export const saveImage = async (imageUri) => {
  try {
    // Đảm bảo thư mục tồn tại
    const dirUri = await setupImageDirectory();

    // Tạo tên file unique
    const filename = `pet_${Date.now()}.jpg`;
    const destUri = `${dirUri}${filename}`;

    // Copy file ảnh vào thư mục đích
    await FileSystem.copyAsync({
      from: imageUri,
      to: destUri,
    });

    console.log("Image saved successfully to:", destUri);
    return destUri;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
};

export const deleteImage = async (imageUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(imageUri);
      console.log("Image deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export const getImagePath = (filename) => {
  return `${FileSystem.documentDirectory}${IMAGE_DIR}${filename}`;
};
