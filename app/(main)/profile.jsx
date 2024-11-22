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

const Profile = () => {
  const router = useRouter();
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
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
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>
          {user.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {/* Account Settings */}
        <Text style={styles.sectionTitle}>🐣 Tài khoản của bạn</Text>

        <TouchableOpacity style={styles.menuItem}>
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

        {/* App Settings */}
        <Text style={styles.sectionTitle}>🐰 Cài đặt ứng dụng</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="palette" size={24} color="#FF9999" />
            <Text style={styles.menuItemText}>Giao diện dễ thương</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#FFB366"
          />
        </TouchableOpacity>

        {/* Support */}
        <Text style={styles.sectionTitle}>🐼 Hỗ trợ & Thông tin</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/help")}
        >
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons
              name="help-circle"
              size={24}
              color={Colors.LIGHT_PINK}
            />
            <Text style={styles.menuItemText}>Trợ giúp bạn nhé</Text>
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
          <Text style={styles.signOutText}>Tạm biệt</Text>
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
