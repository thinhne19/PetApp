import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const Index = () => {
  const { user, isLoaded } = useUser();

  // Show loading spinner if user data is not loaded
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Redirect based on user authentication status
  return user ? <Redirect href="/(main)/home" /> : <Redirect href="/welcome" />;
};

export default Index;
