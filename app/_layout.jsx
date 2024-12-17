import React, { useState } from "react";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View, Text } from "react-native";
import { useFonts } from "expo-font";

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`[SecureStore] Token for ${key} retrieved.`);
      }
      return item;
    } catch (error) {
      console.error(`[SecureStore] Error retrieving token for ${key}:`, error);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`[SecureStore] Token for ${key} saved.`);
    } catch (error) {
      console.error(`[SecureStore] Error saving token for ${key}:`, error);
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const _layout = () => {
  const [fontsLoaded] = useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  const [clerkError, setClerkError] = useState(null);

  if (!fontsLoaded) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  if (!publishableKey) {
    console.error("Clerk publishable key is missing. Please configure it.");
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: "red" }}>Missing Clerk publishable key.</Text>
      </View>
    );
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={publishableKey}
      onError={(err) => {
        console.error("ClerkProvider Error:", err);
        setClerkError(err);
      }}
    >
      {clerkError ? (
        <View style={styles.centerContainer}>
          <Text style={{ color: "red" }}>
            An error occurred: {clerkError.message}
          </Text>
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
      )}
    </ClerkProvider>
  );
};

const styles = {
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default _layout;
