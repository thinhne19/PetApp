import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import * as SecureStore from "expo-secure-store";
const Profile = () => {
  const router = useRouter();
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    try {
      console.log("[SignOut] Đang thực hiện đăng xuất...");
      await signOut(); // Đăng xuất khỏi Clerk
      console.log("[SignOut] Đăng xuất thành công!");

      // Xóa token khỏi SecureStore
      console.log("[SignOut] Xóa token khỏi SecureStore...");
      await SecureStore.deleteItemAsync("__clerk_client_jwt");
      console.log("[SignOut] Token đã được xóa khỏi SecureStore.");

      // Kiểm tra lại SecureStore
      await verifySecureStore();

      // Điều hướng về màn hình Welcome
      router.push("/"); // Điều hướng
    } catch (error) {
      console.error("[SignOut] Lỗi khi đăng xuất:", error);
    }
  };

  const verifySecureStore = async () => {
    try {
      const token = await SecureStore.getItemAsync("__clerk_client_jwt");
      if (token) {
        console.log("[SecureStore] Token sau đăng xuất:", token);
      } else {
        console.log("[SecureStore] Không có token nào sau đăng xuất.");
      }
    } catch (error) {
      console.error("[SecureStore] Lỗi khi kiểm tra SecureStore:", error);
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile với background hình sóng */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          <View style={styles.avatarBorder} />
        </View>
        <Text style={styles.name}>{user.lastName}</Text>
        <Text style={styles.email}>
          {user.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {/* Account Settings */}
        <Text style={styles.sectionTitle}>🐣 Tài khoản của bạn</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/infoUser")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="account-heart"
              size={24}
              color={Colors.LIGHT_PINK}
            />
            <Text style={styles.menuItemText}>Thông tin chủ nuôi</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/memories")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="weather-cloudy-clock"
              size={24}
              color={Colors.LIGHT_PINK}
            />
            <Text style={styles.menuItemText}>Kỷ niệm của bạn</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>
        {/* Scheduler */}
        <Text style={styles.sectionTitle}>🐰 Quản lý thú cưng</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/petScheduler")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="calendar" size={24} color="#FF9999" />
            <Text style={styles.menuItemText}>Lịch trình</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          // onPress={() => router.push("/advice")}
          onPress={() => router.push("/statistics")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="calendar" size={24} color="#FF9999" />
            <Text style={styles.menuItemText}>Thống kê</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>

        {/* App Settings */}
        <Text style={styles.sectionTitle}>🐰 Chỉnh sửa ứng dụng</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/theme")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="palette" size={24} color="#FF9999" />
            <Text style={styles.menuItemText}>Giao diện người dùng</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>

        {/* Support */}
        <Text style={styles.sectionTitle}>🐼 Thông tin và Hổ trợ</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/aboutPets")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="help-circle"
              size={24}
              color={Colors.LIGHT_PINK}
            />
            <Text style={styles.menuItemText}>Hổ trợ</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/support")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={Colors.LIGHT_PINK}
            />
            <Text style={styles.menuItemText}>Về chúng mình</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <MaterialCommunityIcons name="exit-to-app" size={24} color="#FFF" />
          <Text style={styles.signOutText}>Đi ròi sao</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.WHITE,
  },
  avatarBorder: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderStyle: "dashed",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: Colors.PRIMARY,
    marginTop: 5,
  },
  menuContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PRIMARY,
    marginTop: 20,
    marginBottom: 10,
    // Thêm emoji vào title
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: Colors.LIGHT_PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: Colors.PRIMARY,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: Colors.LIGHT_PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});
