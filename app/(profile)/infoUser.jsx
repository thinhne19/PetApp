import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InfoUser() {
  const router = useRouter();

  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [edit, setEdit] = useState(false);

  const onSaveUser = async () => {
    try {
      if (!firstName || !lastName) {
        Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
        return;
      }
      await user?.update({ firstName, lastName });
      setEdit(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    }
  };

  const onCaptureImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        const base64 = `data:image/png;base64,${result.assets[0].base64}`;
        await user?.setProfileImage({ file: base64 });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể tải ảnh lên");
    }
  };

  if (!isLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Thông tin của bạn</Text>
        <Text style={styles.subHeaderText}>
          Thông tin của bạn được hiển thị ở trang này!
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={onCaptureImage}
          style={styles.avatarContainer}
        >
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          <View style={styles.editAvatarIcon}>
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.nameSection}>
          {edit ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={styles.nameInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Tên"
              />
              <TextInput
                style={styles.nameInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Họ"
              />
              <TouchableOpacity onPress={onSaveUser} style={styles.saveButton}>
                <Ionicons name="checkmark" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameDisplayRow}>
              <Text style={styles.fullName}>
                {firstName} {lastName}
              </Text>
              <TouchableOpacity
                onPress={() => setEdit(true)}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoText}>
              {user?.emailAddresses[0].emailAddress}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.PRIMARY}
            />
            <Text style={styles.infoText}>
              Thành viên từ {user?.createdAt?.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="id-card-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoText}>ID: {user?.id}</Text>
          </View>
        </View>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/welcome.png")} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.slogan}>Chăm sóc thú nuôi bằng cả trái tim ❤️</Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={Colors.WHITE}
          />
          <Text style={styles.textBack}>Quay Về</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 16,
    color: Colors.WHITE,
    textAlign: "center",
    marginTop: 5,
  },
  contentContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.PRIMARY,
  },
  editAvatarIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  nameSection: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  editNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },
  nameInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
    textAlign: "center",
  },
  nameDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  editButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 20,
    padding: 6,
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 20,
    padding: 6,
  },
  infoSection: {
    width: "100%",
    marginTop: 10,
    gap: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 60,
  },
  slogan: {
    fontSize: 16,
    color: "#FF8533",
    marginTop: 10,
    fontWeight: "500",
    fontFamily: "outfit-medium",
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 20,
    alignItems: "center",
  },
  backBtn: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 50,
    elevation: 5,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  textBack: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: Colors.WHITE,
    textAlign: "center",
  },
});
