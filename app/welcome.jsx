import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import Button from "../components/Button";
import { wp, hp } from "../helpers/common";
import { theme } from "../constants/theme";
import MainSlider from "../components/MainSlider";
import Colors from "../constants/Colors";

const Welcome = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (authLoaded) {
      if (isSignedIn) {
        router.replace("/(main)/home");
      }
    }
  }, [authLoaded, isSignedIn, router]);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await startOAuthFlow();
      if (result?.createdSessionId) {
        Alert.alert("Đăng nhập thành công", "Chào mừng bạn.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Unable to sign in. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Màn hình chờ
  if (!authLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Slider */}
        <View style={styles.sliderContainer}>
          <MainSlider />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Button
            title={isLoading ? "Connecting..." : "Get Started"}
            buttonStyle={styles.buttonStyle}
            onPress={handleLogin}
            disabled={isLoading}
          />
          <Text style={styles.termsText}>
            Tôi đã đọc và hiểu ứng dụng của PetApp
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.PRIMARY,
  },
  sliderContainer: {
    flex: 2.3, // Chiếm 2/3 màn hình
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    flex: 0.7, // Chiếm 1/3 màn hình
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: hp(2),
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonStyle: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    width: wp(60),
    paddingVertical: hp(1.5),
    alignItems: "center",
    elevation: 3,
  },
  termsText: {
    marginTop: 15,
    fontSize: hp(1.8),
    color: "#6B7280",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: hp(2),
    color: theme.colors.text,
  },
});
