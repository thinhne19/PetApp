import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Colors from "./../../constants/Colors";
import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { theme } from "../../constants/theme";
import themeContext from "../../contexts/themeContext";
export default function MainLayout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
    });

    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []);

  const navigationTheme = {
    dark: darkMode,
    colors: {
      primary: Colors.PRIMARY,
      background: darkMode ? theme.dark.background : theme.light.background,
      card: darkMode ? theme.dark.background : theme.light.background,
      text: darkMode ? "#E8B20E" : theme.light.color,
      border: darkMode ? theme.dark.background : theme.light.background,
      notification: Colors.SECONDARY,
    },
  };

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <ThemeProvider value={navigationTheme}>
        <Tabs screenOptions={{ tabBarActiveTintColor: Colors.PRIMARY }}>
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="favorites"
            options={{
              title: "Pet",
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="pets" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="newPost"
            options={{
              title: "Post",
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Ionicons name="add-circle" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="statistics"
            options={{
              title: "Statistics",
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="newspaper-variant"
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Ionicons name="person" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </ThemeProvider>
    </themeContext.Provider>
  );
}
